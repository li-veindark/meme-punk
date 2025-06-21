const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const multer = require('multer');
const fs = require('fs');



// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// Multer setup for handling file uploads in memory
const upload = multer({ storage: multer.memoryStorage() });

// Helper function to convert a file buffer to a Gemini-compatible part
function fileToGenerativePart(buffer, mimeType) {
  return {
    inlineData: {
      data: buffer.toString('base64'),
      mimeType,
    },
  };
}

// POST /api/ai/generate
router.post('/generate', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Image is required for AI generation.' });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


    const { title, tags } = req.body;
    const imagePart = fileToGenerativePart(req.file.buffer, req.file.mimetype);

    const prompt = `
      Analyze this meme image.
      Meme Title: "${title}"
      Tags: "${tags || 'none'}"

      Based on the image, title, and tags, generate the following in JSON format:
      1. A short, witty, and viral "caption" for this meme.
      2. A single, descriptive "vibe" that captures the essence of the meme (e.g., "Chaotic Good," "Surreal Humor," "200 IQ Moment").

      Respond with ONLY a valid JSON object like this: {"caption": "...", "vibe": "..."}
    `;

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();

    // Clean the response to ensure it's valid JSON
    const jsonResponse = JSON.parse(text.replace(/```json/g, '').replace(/```/g, '').trim());

    res.json(jsonResponse);

  } catch (error) {
    console.error('Error with Google Generative AI:', error);
    res.status(500).json({ error: 'Failed to generate content from AI.' });
  }
});

module.exports = router; 