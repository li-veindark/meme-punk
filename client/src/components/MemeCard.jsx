import React from 'react';
import { FiTag, FiUser, FiArrowUpCircle, FiArrowDownCircle, FiMessageSquare } from 'react-icons/fi';

const MemeCard = ({ image, title, creator, caption, vibe, tags, upvotes, downvotes, comments, price, onUpvote, onDownvote, userVote, onPlaceBid }) => {
  const upvoteClasses = `
    flex items-center gap-1 transition-all duration-200 hover:scale-110 focus:outline-none p-2 rounded-lg
    ${userVote === 'up' ? 'bg-green-500 text-white shadow-lg' : 'text-green-400'}
  `;
  const downvoteClasses = `
    flex items-center gap-1 transition-all duration-200 hover:scale-110 focus:outline-none p-2 rounded-lg
    ${userVote === 'down' ? 'bg-pink-500 text-white shadow-lg' : 'text-pink-400'}
  `;

  return (
    <div className="flex flex-col bg-[#181824] border-2 border-cyan-400 rounded-2xl w-full mx-auto shadow-lg relative transition-all duration-300">
      {/* Fake window bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b-2 border-[#151a23] bg-[#0c0f16] rounded-t-xl">
        <div className="flex space-x-2">
          <span className="w-3 h-3 bg-red-500 rounded-full inline-block"></span>
          <span className="w-3 h-3 bg-yellow-400 rounded-full inline-block"></span>
          <span className="w-3 h-3 bg-green-500 rounded-full inline-block"></span>
        </div>
      </div>
      {/* Meme image */}
      <div className="bg-[#111727] flex items-center justify-center p-4" style={{ minHeight: 320 }}>
        <img src={image} alt="Meme" className="rounded-md max-h-72 object-cover" />
      </div>
      {/* Caption & Vibe */}
      <div className="bg-[#101014] px-6 py-4 border-t border-[#222]">
        <div className="text-white text-lg font-bold text-left mb-2">{caption}</div>
        {vibe && (
          <div className="mt-2">
            <span className="w-fit text-[#a259f7] bg-transparent border border-[#a259f7] rounded-lg px-5 py-2 text-lg inline-block">{vibe}</span>
          </div>
        )}
      </div>
      {/* Metadata */}
      <div className="border-t border-[#222] bg-[#101014] px-6 py-4">
        <div className="text-[#00ffea] font-bold mb-2">METADATA:</div>
        <div className="text-sm text-gray-300 mb-2 space-y-2">
          <div className="flex items-center gap-2 text-lg"><FiTag className="text-cyan-400" /> <span className="text-gray-400">Title:</span> <span className="text-white">{title}</span></div>
          <div className="flex items-center gap-2 text-lg"><FiUser className="text-cyan-400" /> <span className="text-gray-400">Creator:</span> <span className="text-white">{creator}</span></div>
          {Array.isArray(tags) && tags.length > 0 && (
            <div className="flex items-center flex-wrap gap-2 pt-2">{tags.map(tag => (
              <span key={tag} className="bg-[#23232b] text-[#ff6ec7] px-4 py-1 rounded-lg text-md font-medium">#{tag}</span>
            ))}</div>
          )}
        </div>
      </div>
       {/* Stats */}
      <div className="flex items-center justify-between bg-[#101014] rounded-b-2xl px-6 py-4 border-t border-[#222]">
         <div className="flex items-center gap-4 text-lg text-gray-300">
            <button onClick={onUpvote} className={upvoteClasses}>
              <FiArrowUpCircle/> {upvotes}
            </button>
            <button onClick={onDownvote} className={downvoteClasses}>
              <FiArrowDownCircle/> {downvotes}
            </button>
            
        </div>
        <div className="flex items-center gap-4">
            <div className="text-cyan-400 text-xl font-bold">{price} ETH</div>
            <button 
              onClick={onPlaceBid}
              className="px-4 py-2 rounded-lg font-bold text-lg bg-pink-500 text-white transition-transform duration-200 hover:scale-105"
            >
              Make a Bid
            </button>
        </div>
      </div>
    </div>
  );
};

export default MemeCard;



