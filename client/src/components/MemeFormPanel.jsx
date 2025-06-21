// client/src/components/MemeFormPanel.jsx
import React, { useState, useRef } from 'react';
import { FiUploadCloud, FiTag, FiType, FiX, FiZap } from 'react-icons/fi';
import { api } from '../utils/api'; // Make sure to import the api utility

export default function MemeFormPanel({ meme, setMeme, onFileChange, onSubmit, isSubmitting, previewUrl, imageFile }) {
  const [tagInput, setTagInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef(null);

  const handleGenerate = async () => {
    if (!imageFile) {
      alert('Please upload an image first to generate content.');
      return;
    }

    setIsGenerating(true);
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('title', meme.title);
    formData.append('tags', meme.tags.join(','));

    try {
      const { caption, vibe } = await api.generateAiContent(formData);
      setMeme(prevMeme => ({ ...prevMeme, caption, vibe }));
    } catch (error) {
      console.error('Failed to generate AI content:', error);
      alert('Failed to generate AI content. Please check the console for details.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleLocalFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFileChange(file);
    }
  };
  
  const handleTagInput = (e) => setTagInput(e.target.value);

  const handleTagKeyDown = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (!meme.tags.includes(newTag)) {
        setMeme({ ...meme, tags: [...meme.tags, newTag] });
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (removeTag) => {
    setMeme({ ...meme, tags: meme.tags.filter((tag) => tag !== removeTag) });
  };

  return (
    <div className="bg-[#181824] border border-[#a259f7] rounded-2xl p-8 w-full max-w-3xl">
      <h2 className="text-white text-3xl font-bold mb-6">{'>_ MEME PARAMETERS'}</h2>
      
      <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
        {/* File Upload */}
        <div>
          <label className="text-white mb-1 text-xl flex items-center gap-2">{'>'} <FiUploadCloud /> Upload Image</label>
          <div 
            className="mt-2 flex justify-center items-center w-full h-64 px-6 pt-5 pb-6 border-2 border-dashed border-gray-600 rounded-md cursor-pointer hover:border-cyan-400 transition-colors bg-black bg-opacity-20"
            onClick={() => fileInputRef.current.click()}
          >
            {previewUrl ? (
              <img src={previewUrl} alt="Meme Preview" className="h-full w-full object-contain rounded-md" />
            ) : (
              <div className="space-y-1 text-center">
                <FiUploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                <p className="text-sm text-gray-400">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleLocalFileChange}
            />
          </div>
        </div>

        {/* Title */}
        <div>
          <label htmlFor="title" className="text-white mb-1 text-xl flex items-center gap-2">{'>'} <FiType /> Title</label>
          <input
            id="title"
            className="w-full bg-transparent border border-[#00ffea] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#00ffea]"
            placeholder="Enter meme title..."
            value={meme.title}
            onChange={e => setMeme({ ...meme, title: e.target.value })}
          />
        </div>

        

        {/* Tags */}
        <div>
          <label htmlFor="tags" className="text-white mb-3 mt-2 text-xl flex items-center gap-2">{'>'} <FiTag/> Tags</label>
          <div className="flex flex-wrap gap-2 mb-2 min-h-[38px]">
            {meme.tags.map((tag) => (
              <span key={tag} className="flex items-center bg-[#a259f7] text-white text-lg px-3 py-1 rounded-full  font-medium transition-all duration-200 hover:bg-purple-700 hover:shadow-lg">
                {tag}
                <button
                  type="button"
                  className="ml-2 text-white rounded-full hover:bg-black/20 focus:outline-none"
                  onClick={() => handleRemoveTag(tag)}
                  aria-label={`Remove tag ${tag}`}
                >
                  <FiX size={16} />
                </button>
              </span>
            ))}
          </div>
          <input
            id="tags"
            className="w-full bg-transparent border border-[#00ffea] rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#00ffea]"
            placeholder="Add a tag and press Enter..."
            value={tagInput}
            onChange={handleTagInput}
            onKeyDown={handleTagKeyDown}
          />
        </div>

        {/* AI Generation Section */}
        <div className="space-y-4 pt-4 border-t border-gray-800">
            <button 
              type="button" 
              onClick={handleGenerate} 
              disabled={isGenerating || !previewUrl}
              className="w-full border-2 border-[#3fd947] rounded-lg text-xl text-[#3fd947] font-bold py-3 bg-transparent transition-all duration-300 enabled:hover:bg-[#3fd947] enabled:hover:text-[#101014] enabled:hover:shadow-[0_0_15px_#3fd947] flex items-center justify-center gap-2 disabled:border-gray-600 disabled:text-gray-600 disabled:cursor-not-allowed"
            >
                {isGenerating ? 'GENERATING...' : <><FiZap /> GENERATE AI CAPTION & VIBE</>}
            </button>
            
            <div className="bg-[#101014] border border-[#00ffea] rounded-lg p-4 min-h-[100px]">
                <div className="text-[#00ffea] font-bold mb-2 text-xl">AI GENERATED CONTENT:</div>
                <div className="text-[#7F8CAA] text-lg mb-1">CAPTION:</div>
                <p className="text-white text-lg mb-2 min-h-[28px]">{meme.caption || '...'}</p>
                <div className="text-[#7F8CAA] text-lg mb-1">VIBE:</div>
                {meme.vibe ? (
                    <div className="w-fit text-[#a259f7] bg-transparent border border-[#a259f7] rounded-lg px-5 py-2 text-lg">
                        {meme.vibe}
                    </div>
                ) : <p className="text-gray-500 text-lg">...</p>}
            </div>
        </div>

        {/* Submit Button */}
        <button 
          type="submit"
          className="w-full py-4 text-xl font-bold bg-pink-600 rounded-lg transition-all duration-300 transform enabled:hover:scale-105 enabled:hover:bg-pink-500 enabled:hover:shadow-[0_0_20px_#ff007f] disabled:bg-gray-700 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'UPLOADING...' : 'UPLOAD TO MEME GRID'}
        </button>
      </form>
    </div>
  );
}