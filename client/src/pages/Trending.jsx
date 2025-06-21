import React, { useState, useEffect } from 'react';
import MemeCard from '../components/MemeCard';
import { useUser } from '../context/UserContext';
import { api } from '../utils/api';
import { FaCrown } from 'react-icons/fa';
import { FiLoader, FiAlertTriangle } from 'react-icons/fi';

const RankIcon = ({ rank }) => {
  const rankStyles = {
    1: { iconColor: 'text-yellow-400', shadow: 'shadow-[0_0_15px_#facc15]' },
    2: { iconColor: 'text-gray-300', shadow: 'shadow-[0_0_15px_#d1d5db]' },
    3: { iconColor: 'text-orange-400', shadow: 'shadow-[0_0_15px_#fb923c]' },
  };

  const style = rankStyles[rank] || {};

  return (
    <div className={`absolute -top-5 -left-5 z-10 p-2 bg-gray-900 rounded-full text-white shadow-lg transform transition-transform duration-300 group-hover:scale-110 ${style.shadow}`}>
      <FaCrown size={32} className={style.iconColor} />
      <span className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-sm font-bold">{rank}</span>
    </div>
  );
};

export default function Trending() {
  const { selectedUser } = useUser();
  const [trendingMemes, setTrendingMemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTrendingMemes = async () => {
    try {
      // Keep loading true only on initial fetch
      // setLoading(true); 
      const data = await api.get('/memes/trending');
      setTrendingMemes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrendingMemes();
    const intervalId = setInterval(fetchTrendingMemes, 600000); // Poll every 10 minutes
    return () => clearInterval(intervalId);
  }, []);

  const handleVote = async (memeId, voteType) => {
    try {
      const updatedMeme = await api.vote(memeId, voteType);
      // Re-sort memes after a vote
      const newSortedMemes = [...trendingMemes]
        .map(meme => (meme.id === memeId ? updatedMeme : meme))
        .sort((a, b) => b.upvotes - a.upvotes);
      setTrendingMemes(newSortedMemes);
    } catch (err) {
      console.error("Failed to vote:", err);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center text-cyan-400 h-64">
          <FiLoader className="animate-spin text-6xl mb-4" />
          <p className="text-2xl">Fetching Top Memes...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center text-red-500 h-64">
          <FiAlertTriangle className="text-6xl mb-4" />
          <p className="text-2xl">Error: {error}</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 justify-items-center">
        {trendingMemes.map((meme, index) => (
          <div key={meme.id} className="relative group w-full max-w-md">
            <RankIcon rank={index + 1} />
            <MemeCard
              {...meme}
              image={meme.imageUrl.startsWith('/public') ? `http://localhost:5000${meme.imageUrl}` : meme.imageUrl}
              creator={meme.creator.username}
              tags={meme.tags.map(t => t.name)}
              onUpvote={(e) => { e.stopPropagation(); handleVote(meme.id, 'up'); }}
              onDownvote={(e) => { e.stopPropagation(); handleVote(meme.id, 'down'); }}
              userVote={meme.votes?.find(v => v.userId === selectedUser?.id)?.value === 1 ? 'up' : meme.votes?.find(v => v.userId === selectedUser?.id)?.value === -1 ? 'down' : null}
            />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="pt-32 pb-16 bg-[#101014] text-white min-h-screen">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-7xl font-extrabold text-[#00ffb3] animate-cyber-flicker trending-shadow">
            TOP 3 TRENDING MEMES
          </h1>
          <p className="text-cyan-400 text-xl mt-4">// THE DIGITAL ELITE - REFRESHES EVERY 10 MINUTES //</p>
        </div>
        
        {renderContent()}
      </div>
    </div>
  );
} 