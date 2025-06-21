import { useUser } from '../context/UserContext';
import { useState } from 'react';

export default function UserSelector() {
  const { selectedUser, login, logout, users, loading, error } = useUser();
  const [selectedUsername, setSelectedUsername] = useState('');

  if (loading) {
    return (
      <div className="p-4 bg-gray-800 rounded-lg shadow-lg">
        <p className="text-gray-300">Loading users...</p>
      </div>
    );
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!selectedUsername) return;
    
    try {
      await login(selectedUsername);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
      {!selectedUser ? (
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="user-select" className="block text-sm font-medium text-gray-300 mb-2">
              Select Your Username
            </label>
            <select
              id="user-select"
              value={selectedUsername}
              onChange={(e) => setSelectedUsername(e.target.value)}
              className="block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a user</option>
              {users.map((user) => (
                <option key={user.id} value={user.username}>
                  {user.username}
                </option>
              ))}
            </select>
          </div>
          
          <button
            type="submit"
            disabled={!selectedUsername}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Login
          </button>
          
          {error && (
            <p className="mt-2 text-sm text-red-400 text-center">
              {error}
            </p>
          )}
        </form>
      ) : (
        <div className="text-center">
          <p className="text-sm text-gray-400">
            Logged in as: <span className="text-blue-400">{selectedUser.username}</span>
          </p>
          <button
            onClick={logout}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
} 