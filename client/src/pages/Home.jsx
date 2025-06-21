import { useUser } from '../context/UserContext';
import { FiRefreshCw, FiUser, FiArrowUpCircle, FiArrowDownCircle, FiMessageSquare } from 'react-icons/fi';
import { FaChartLine } from 'react-icons/fa';
import React, { useState, useEffect } from 'react';
import MemeCard from '../components/MemeCard';
import { api } from '../utils/api';

export default function Home() {
  const { selectedUser } = useUser();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [memes, setMemes] = useState([]);
  const [visibleMemesCount, setVisibleMemesCount] = useState(6);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMemes = async () => {
      try {
        setLoading(true);
        const data = await api.getMemes();
        setMemes(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMemes();
  }, []);

  const handleLoadMore = () => {
    setVisibleMemesCount(prevCount => prevCount + 3);
  };

  const handleVote = async (memeId, voteType) => {
    if (!selectedUser) {
      alert('Please select a user to vote.');
      return;
    }

    try {
      const updatedMeme = await api.vote(memeId, voteType);
      setMemes(currentMemes =>
        currentMemes.map(meme =>
          meme.id === memeId ? updatedMeme : meme
        )
      );
    } catch (error) {
      console.error("Failed to save vote:", error);
    }
  };

  const handlePlaceBid = (memeId) => {
    // This is a placeholder. We will build the real bidding system next.
    alert(`Bidding on meme ${memeId} is not implemented yet.`);
    // Example of how you might call it:
    // const amount = prompt("Enter your bid amount:");
    // if (amount) {
    //   api.placeMemeBid(memeId, amount)
    //     .then(() => alert("Bid placed!"))
    //     .catch(err => alert(`Error: ${err.message}`));
    // }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formattedTime = currentTime
    .toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })
    .replace(',', '');

  return (
    <div className="pt-24 bg-[#181824] w-[100vw] ">
      <div className="w-full pt-12 pb-4 bg-[#181824]">
        <h1 className="text-7xl sm:text-6xl md:text-8xl font-extrabold text-center text-[#00ffb3] relative select-none animate-cyber-flicker trending-shadow">
          ALL MEMES
        </h1>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mt-4 text-gray-300 text-base font-mono  pt-2">
          <span className="flex items-center gap-1">
            <FiRefreshCw className="inline-block text-lg text-gray-400" />
            <span className="uppercase tracking-widest">Updated:</span>
            <span>{formattedTime}</span>
          </span>
          <span className="hidden sm:inline-block mx-2 text-[#00ffb3]">|</span>
          <span className="flex items-center gap-1">
            <FaChartLine className="inline-block text-pink-500 text-lg" />
            <span className="uppercase tracking-widest">Tracking</span>
            <span className="text-pink-400 font-bold">4,209</span>
            <span>Memes</span>
          </span>
        </div>
      </div>
      <div className="w-full px-4 sm:px-8 md:px-16 lg:px-24 py-16 grid grid-cols-2 md:grid-cols-3 gap-8 justify-center">
        {loading && <p className="text-white text-center col-span-full">Loading memes...</p>}
        {error && <p className="text-red-500 text-center col-span-full">{error}</p>}
        {!loading && !error && memes.slice(0, visibleMemesCount).map((meme) => {
          const userVote = meme.votes?.find(v => v.userId === selectedUser?.id)?.value;
          const userVoteType = userVote === 1 ? 'up' : userVote === -1 ? 'down' : null;
          
          return (
            <div key={meme.id} className="pb-8">
              <MemeCard 
                {...meme}
                image={meme.imageUrl.startsWith('/public') ? `http://localhost:5000${meme.imageUrl}` : meme.imageUrl}
                creator={meme.creator.username}
                tags={meme.tags.map(t => t.name)}
                onUpvote={(e) => { e.stopPropagation(); handleVote(meme.id, 'up'); }}
                onDownvote={(e) => { e.stopPropagation(); handleVote(meme.id, 'down'); }}
                userVote={userVoteType}
                onPlaceBid={(e) => { e.stopPropagation(); handlePlaceBid(meme.id); }}
              />
            </div>
          );
        })}
      </div>
      <div className="flex justify-center pb-8 ">
        <button
          className="border border-[#00ffea] text-[#00ffea] px-4 py-3 rounded-xl text-xl font-semibold bg-transparent hover:bg-[#00ffea] hover:text-[#181824] transition-colors duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleLoadMore}
          disabled={visibleMemesCount >= memes.length}
        >
          {visibleMemesCount >= memes.length ? "No More Memes" : "Load More Memes"}
        </button>
      </div>
    </div>
  );
}

