import { UserProvider } from './context/UserContext';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import UserSelector from './components/UserSelector';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Trending from './pages/Trending';
import { useUser } from './context/UserContext';
import Footer from './components/Footer';
import './App.css';
import CreateMeme from './pages/Upload';
import Duel from './pages/Duel';


// Protected Route Component
function ProtectedRoute({ children }) {
  const { selectedUser } = useUser();
  if (!selectedUser) {
    return <Navigate to="/" replace />;
  }
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}

// Login Page Component
function LoginPage() {
  const { selectedUser } = useUser();
  
  // If user is already logged in, redirect to home
  if (selectedUser) {
    return <Navigate to="/home" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="w-full max-w-md p-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">MemeHustle</h1>
          <p className="text-gray-400">Select your username to continue</p>
        </div>
        <UserSelector />
      </div>
    </div>
  );
}

// App Routes Component
function AppRoutes() {
  const { selectedUser } = useUser();
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/upload"
        element={
          <ProtectedRoute>
            <CreateMeme />
          </ProtectedRoute>
        }
      />
      <Route
        path="/duel"
        element={
          <ProtectedRoute>
            <Duel />
          </ProtectedRoute>
        }
      />
      <Route
        path="/trending"
        element={
          <ProtectedRoute>
            <Trending />
          </ProtectedRoute>
        }
      />
      {/* Redirect any unknown routes to / (login) */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    
  );
}

// Main App Component
function App() {
  return (
    <Router>
      <UserProvider>
        <AppRoutes />
      </UserProvider>
    </Router>
  );
}

export default App;
