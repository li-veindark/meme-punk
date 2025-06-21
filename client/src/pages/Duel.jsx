import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { useUser } from '../context/UserContext';
import LeftDuelCard from '../components/LeftDuelCard';
import RightDuelCard from '../components/RightDuelCard';
import CountdownTimer from '../components/CountdownTimer';
import { FiLoader, FiAlertTriangle, FiPlusCircle } from 'react-icons/fi';

export default function Duel() {
  const [duel, setDuel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { selectedUser, setSelectedUser } = useUser();

  const fetchActiveDuel = async () => {
    try {
      setLoading(true);
      setError('');
      const activeDuel = await api.getActiveDuel();
      setDuel(activeDuel);
    } catch (err) {
      if (err?.response?.status === 404) {
        setDuel(null);
      } else {
        setError('Failed to fetch duel data. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  const startNewDuel = async () => {
    try {
      setLoading(true);
      setError('');
      const newDuel = await api.createDuel();
      setDuel(newDuel);
    } catch (err) {
      setError('Failed to start a new duel. There may not be enough memes.');
    } finally {
      setLoading(false);
    }
  };

  const handleBid = async (memeId, amount) => {
    if (!selectedUser) {
      alert('Please select a user to place a bid.');
      return;
    }
    try {
      const { user: updatedUser, duel: updatedDuel } = await api.placeDuelBid(duel.id, memeId, selectedUser.id, amount);
      
      setDuel(updatedDuel);

      // Update user context with new balance
      setSelectedUser(updatedUser);

    } catch (err) {
      alert(`Failed to place bid: ${err.message}`);
    }
  };

  useEffect(() => {
    fetchActiveDuel();
  }, []);

  const calculateTotalBids = (memeId) => {
    if (!duel || !duel.bids) return 0;
    return duel.bids
      .filter(bid => bid.memeId === memeId)
      .reduce((total, bid) => total + bid.amount, 0);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center text-cyan-400 h-64">
          <FiLoader className="animate-spin text-6xl mb-4" />
          <p className="text-2xl">Loading Duel...</p>
        </div>
      );
    }

    if (error) {
        return (
            <div className="text-center text-red-500">
                <FiAlertTriangle className="mx-auto text-5xl mb-4" />
                <p className="text-2xl">{error}</p>
            </div>
        );
    }

    if (!duel) {
      return (
        <div className="text-center">
          <h2 className="text-3xl text-gray-400 mb-6">No Active Duel</h2>
          <p className="text-lg text-gray-500 mb-8">Be the one to kick off the next legendary meme battle!</p>
        </div>
      );
    }

    // Active duel exists
    return (
      <div className="flex flex-col items-center">
        {duel.startTime ? (
          <CountdownTimer endTime={duel.endTime} />
        ) : (
          <div className="text-center my-4 p-4 bg-gray-800 rounded-lg">
            <h3 className="text-2xl font-bold text-yellow-400">Timer Not Started</h3>
            <p className="text-gray-300">Place the first bid to start the 10-minute countdown!</p>
          </div>
        )}
        <div className="flex justify-center items-start w-full gap-8 mt-8">
          <LeftDuelCard 
            meme={duel.memeA} 
            onBid={handleBid}
            totalBids={calculateTotalBids(duel.memeA.id)}
          />
          <div className="self-center text-5xl font-bold text-red-500 animate-pulse p-8">VS</div>
          <RightDuelCard 
            meme={duel.memeB}
            onBid={handleBid}
            totalBids={calculateTotalBids(duel.memeB.id)}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="pt-32 pb-16 bg-[#101014] text-white min-h-screen flex items-center justify-center">
      <div className="container mx-auto px-4">
        <div className="w-full flex justify-end mb-6">
          <button
            onClick={startNewDuel}
            disabled={loading}
            className="px-6 py-3 fixed text-lg font-bold bg-purple-600 text-white rounded-lg transition-all duration-300 transform hover:scale-105 hover:bg-purple-500 hover:shadow-[0_0_15px_#a855f7] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiPlusCircle className="inline-block mr-2" />
            {loading ? 'Starting...' : 'Start New Duel'}
          </button>
        </div>
        {renderContent()}
      </div>
    </div>
  );
} 