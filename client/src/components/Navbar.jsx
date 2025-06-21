import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import { FaUserAstronaut } from 'react-icons/fa';
import { useUser } from '../context/UserContext';
import { useState, useRef, useEffect } from 'react';

const navLinks = [
  { name: 'HOME', path: '/' },
  { name: 'TRENDING', path: '/trending' },
  { name: 'UPLOAD', path: '/upload' },
  { name: 'DUEL', path: '/duel' },
];

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedUser, logout } = useUser();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  const handleUserIconClick = () => {
    if (selectedUser) {
      setDropdownOpen((open) => !open);
    } else {
      navigate('/login');
    }
  };

  return (
    <nav className="bg-[#101014] shadow-lg border-b-2 border-[#00ffb3] w-full fixed top-0 left-0 z-50">
      <div className="px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between h-16 w-full">
          {/* Brand */}
          <div className="flex items-center space-x-2">
            <span className=" cursor-pointer logo text-[#00ffb3] text-2xl font-extrabold tracking-wider select-none">{'>'}_ Meme Punk</span>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex space-x-6 ml-10">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-gray-200 font-medium hover:text-[#00ffb3] transition relative ${
                  location.pathname === link.path
                    ? 'text-[#00ffb3] underline underline-offset-8 decoration-2'
                    : ''
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Search and User */}
          <div className="flex items-center space-x-4 relative">
            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="SEARCH//"
                className="bg-transparent border border-[#00ffb3] rounded px-4 py-1 text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#00ffb3] placeholder-[#00ffb3] w-40 md:w-56"
              />
              <FiSearch className="absolute right-2 top-1/2 -translate-y-1/2 text-[#00ffb3] text-lg" />
            </div>
            {/* User Icon */}
            <div className="relative" ref={dropdownRef}>
              <FaUserAstronaut
                className="text-2xl text-[#ff00ea] cursor-pointer"
                onClick={handleUserIconClick}
              />
              {selectedUser && dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#181824] border border-[#00ffb3] rounded shadow-lg z-50">
                  <div className="px-4 py-2 text-[#00ffb3] font-semibold border-b border-[#00ffb3]">
                    {selectedUser.username}
                  </div>
                  <button
                    onClick={() => { setDropdownOpen(false); logout(); }}
                    className="w-full text-left px-4 py-2 text-gray-200 hover:bg-[#00ffb3] hover:text-[#181824] transition rounded-b"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
} 