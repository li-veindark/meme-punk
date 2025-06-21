import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Load selected user from localStorage on initial load
    const savedUser = localStorage.getItem('selectedUser');
    if (savedUser) {
      setSelectedUser(JSON.parse(savedUser));
    }

    // Fetch users from backend
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/users');
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Failed to fetch users:', error);
        setError('Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const login = async (username) => {
    try {
      setError(null);
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      setSelectedUser(data.user);
      localStorage.setItem('selectedUser', JSON.stringify(data.user));
      navigate('/');
      return data;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const logout = () => {
    setSelectedUser(null);
    localStorage.removeItem('selectedUser');
    navigate('/login');
  };

  return (
    <UserContext.Provider value={{ 
      selectedUser, 
      setSelectedUser,
      users, 
      loading, 
      error,
      login,
      logout
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
} 