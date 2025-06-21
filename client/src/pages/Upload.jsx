// client/src/pages/CreateMeme.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MemeFormPanel from '../components/MemeFormPanel';
import { useUser } from '../context/UserContext';
import { api } from '../utils/api';

export default function Upload() {
  const { selectedUser } = useUser();
  const navigate = useNavigate();

  // State for form data
  const [meme, setMeme] = useState({
    title: '',
    caption: '',
    tags: [],
    vibe: '',
  });

  // State for the image file and its preview URL
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (file) => {
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!selectedUser) {
      setError('You must select a user to upload.');
      return;
    }
    if (!imageFile || !meme.title) {
      setError('Please provide an image and a title.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('title', meme.title);
    formData.append('caption', meme.caption);
    formData.append('vibe', meme.vibe);
    formData.append('creatorId', selectedUser.id);
    formData.append('tags', meme.tags.join(','));

    try {
      await api.createMeme(formData);
      navigate('/'); // Redirect to home on success
    } catch (err) {
      console.error('Upload failed:', err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#181824] py-12 px-4 flex flex-col items-center justify-start">
      <h1 className="text-7xl font-extrabold text-center text-white mb-2 pt-24 trending-shadow">CREATE NEW MEME</h1>
      <div className="text-center text-[#00ffea] mb-10">// INJECT YOUR DIGITAL HUMOR INTO THE MATRIX //</div>
      
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <div className="w-full flex justify-center">
        <MemeFormPanel
          meme={meme}
          setMeme={setMeme}
          onFileChange={handleFileChange}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          previewUrl={previewUrl}
          imageFile={imageFile}
        />
      </div>
    </div>
  );
}