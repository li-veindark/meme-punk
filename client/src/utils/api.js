const API_BASE_URL = 'http://localhost:5000/api';

export async function apiRequest(endpoint, options = {}) {
  const selectedUser = JSON.parse(localStorage.getItem('selectedUser'));
  
  if (!selectedUser) {
    throw new Error('No user selected');
  }

  const headers = {
    'Content-Type': 'application/json',
    'X-User-ID': selectedUser.id,
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  return response.json();
}

// A version of apiRequest that works with FormData
async function apiRequestFormData(endpoint, options = {}) {
  const selectedUser = JSON.parse(localStorage.getItem('selectedUser'));
  
  if (!selectedUser) {
    throw new Error('No user selected');
  }

  // For FormData, we don't set Content-Type, browser does it.
  const headers = {
    'X-User-ID': selectedUser.id,
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`API request failed: ${response.statusText} - ${errorBody}`);
  }

  return response.json();
}

// Example API functions
export const api = {
  // Meme-related functions
  createMeme: (formData) => apiRequestFormData('/memes', {
    method: 'POST',
    body: formData, // FormData object
  }),
  
  generateAiContent: (formData) => apiRequestFormData('/ai/generate', {
    method: 'POST',
    body: formData,
  }),

  get: (endpoint) => apiRequest(endpoint),

  getMemes: () => apiRequest('/memes'),
  getTrendingMemes: () => apiRequest('/memes/trending'),

  // Vote-related functions
  vote: (memeId, voteType) => {
    const selectedUser = JSON.parse(localStorage.getItem('selectedUser'));
    if (!selectedUser) {
      return Promise.reject(new Error('No user selected'));
    }
    return apiRequest(`/memes/${memeId}/vote`, {
      method: 'POST',
      body: JSON.stringify({ voteType, userId: selectedUser.id }),
    });
  },
  
  // Bid-related functions
  placeMemeBid: (memeId, amount) => apiRequest(`/memes/${memeId}/bid`, {
    method: 'POST',
    body: JSON.stringify({ amount }),
  }),

  // Duel-related functions
  getActiveDuel: () => apiRequest('/duels/active'),
  createDuel: () => apiRequest('/duels', { method: 'POST' }),
  placeDuelBid: (duelId, memeId, userId, amount) => apiRequest(`/duels/${duelId}/memes/${memeId}/bid`, {
    method: 'POST',
    body: JSON.stringify({ userId, amount }),
  }),
}; 