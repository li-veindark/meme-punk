import React, { useState } from "react";
import { FiTag, FiUser, FiDollarSign } from 'react-icons/fi';
import { FaEthereum } from 'react-icons/fa';

// New BidForm component
const BidForm = ({ onSubmit }) => {
  const [amount, setAmount] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid bid amount.');
      return;
    }
    onSubmit(amount);
    setAmount('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <div className="relative">
        <input
          type="number"
          step="0.01"
          min="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          className="w-32 bg-[#0c0f16] border-2 border-pink-500 rounded-lg pl-8 pr-2 py-2 text-white focus:outline-none focus:ring-2 focus:ring-pink-400"
        />
        <FaEthereum className="absolute left-2 top-1/2 -translate-y-1/2 text-pink-500" />
      </div>
      <button type="submit" className="px-4 py-2 rounded-lg font-bold text-lg bg-pink-500 text-white transition-transform duration-200 hover:scale-105">
        Place Bid
      </button>
    </form>
  );
};

export default function RightDuelCard({ meme, onBid, totalBids }) {
  // Ensure meme object exists to prevent errors
  if (!meme) return null;

  return (
    <div className={`flex flex-col bg-[#181824] border-2 border-pink-500 rounded-2xl w-full max-w-lg mx-auto shadow-lg relative transition-all duration-300`}>
      {/* Fake window bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b-2 border-[#151a23] bg-[#0c0f16] rounded-t-xl">
        <div className="flex space-x-2">
          <span className="w-4 h-4 bg-red-500 rounded-full inline-block"></span>
          <span className="w-4 h-4 bg-yellow-400 rounded-full inline-block"></span>
          <span className="w-4 h-4 bg-green-500 rounded-full inline-block"></span>
        </div>
      </div>
      {/* Meme image */}
      <div className="bg-[#111727] flex items-center justify-center p-4" style={{ minHeight: 360 }}>
        <img src={meme.imageUrl.startsWith('/public') ? `http://localhost:5000${meme.imageUrl}` : meme.imageUrl} alt={meme.title} className="rounded-md max-h-80 object-contain border border-[#23232b]" />
      </div>
      {/* Caption & Vibe */}
      <div className="bg-[#101014] px-6 py-4 border-t border-[#222] min-h-[100px]">
        {meme.vibe && (
          <span className="w-fit text-[#a259f7] bg-transparent border border-[#a259f7] rounded-lg px-5 py-2 text-lg inline-block">{meme.vibe}</span>
        )}
        <div className="text-white text-lg pt-4 font-bold text-left">{meme.caption}</div>
      </div>
      {/* Metadata */}
      <div className="border-t border-[#222] bg-[#101014] px-6 py-4">
        <div className="text-sm text-gray-300 mb-2 space-y-2">
          <div className="flex items-center gap-2 text-lg"><FiTag className="text-pink-500" /> <span className="text-gray-400">Title:</span> <span className="text-white">{meme.title}</span></div>
          <div className="flex items-center gap-2 text-lg"><FiUser className="text-pink-500" /> <span className="text-gray-400">Creator:</span> <span className="text-white">{meme.creator.username}</span></div>
          {Array.isArray(meme.tags) && meme.tags.length > 0 && (
            <div className="flex items-center flex-wrap gap-2 pt-2">
              {meme.tags.map(tag => (
                <span key={tag.name} className="bg-[#23232b] text-[#ff6ec7] px-4 py-1 rounded-lg text-lg font-medium">#{tag.name}</span>
              ))}</div>
          )}
        </div>
      </div>
      {/* Bid and votes */}
      <div className="flex items-center justify-between bg-[#101014] rounded-b-2xl px-6 py-4 border-t border-[#222]">
        <BidForm onSubmit={(amount) => onBid(meme.id, amount)} />
        <div className="text-pink-500 text-2xl font-extrabold flex items-center gap-2">
            <FiDollarSign/> {totalBids.toFixed(2)}
            <span className="text-base font-normal text-gray-400">ETH</span>
        </div>
      </div>
    </div>
  );
}

