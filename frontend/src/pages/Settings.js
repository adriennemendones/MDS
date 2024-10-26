import React, { useState, useEffect, useRef } from 'react';
import { FaUserCircle, FaSearch, FaCog, FaBell, FaBars, FaChartBar, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';

const Settings = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [emailNotifications, setEmailNotifications] = useState(() => JSON.parse(localStorage.getItem('emailNotifications')) || false);
  const [pushNotifications, setPushNotifications] = useState(() => JSON.parse(localStorage.getItem('pushNotifications')) || false);
  const [twoFactorAuth, setTwoFactorAuth] = useState(() => JSON.parse(localStorage.getItem('twoFactorAuth')) || false);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showSavedModal, setShowSavedModal] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const settingsMenuRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    localStorage.setItem('emailNotifications', JSON.stringify(emailNotifications));
    localStorage.setItem('pushNotifications', JSON.stringify(pushNotifications));
    localStorage.setItem('twoFactorAuth', JSON.stringify(twoFactorAuth));
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);

    const handleClickOutside = (event) => {
      if (settingsMenuRef.current && !settingsMenuRef.current.contains(event.target)) {
        setShowSettingsMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [emailNotifications, pushNotifications, twoFactorAuth, theme]);

  const handleSaveChanges = (e) => {
    e.preventDefault();
    setShowSavedModal(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    navigate('/login');
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const getActiveClass = (path) => (location.pathname === path ? 'bg-gray-400' : '');

  return (
    <div className={`flex min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'} overflow-hidden`}>
      {/* Sidebar */}
      <aside
        className={`shadow-md w-64 fixed top-0 left-0 h-full z-10 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
        style={{
            background: theme === 'dark' ? '#2d2d2d' : '#4a0909',
        }}
      >
        <div className="p-4 text-center border-b border-gray-300">
          <img src="/images/BELL.png" alt="Logo" className="h-12 mx-auto" />
        </div>
        <nav className="mt-6">
          <ul className="space-y-1">
            <li>
              <a onClick={() => navigate('/dashboard')} className={`flex items-center px-4 py-2 text-white hover:bg-gray-400 transition-colors duration-300 rounded ${getActiveClass('/dashboard')}`}>
                <FaChartBar className="w-5 h-5 mr-2" />
                Dashboard
              </a>
            </li>
            <li>
              <a onClick={() => navigate('/profile')} className={`flex items-center px-4 py-2 text-white hover:bg-gray-400 transition-colors duration-300 rounded ${getActiveClass('/profile')}`}>
                <FaUserCircle className="w-5 h-5 mr-2" />
                Profile
              </a>
            </li>
            <li>
              <a onClick={() => navigate('/settings')} className={`flex items-center px-4 py-2 text-white hover:bg-gray-400 transition-colors duration-300 rounded ${getActiveClass('/settings')}`}>
                <FaCog className="w-5 h-5 mr-2" />
                Settings
              </a>
            </li>
            <li>
              <a onClick={() => setShowLogoutModal(true)} className="flex items-center px-4 py-2 text-white hover:bg-gray-400 transition-colors duration-300 rounded">
                <FaSignOutAlt className="w-5 h-5 mr-2" />
                Logout
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-4 md:ml-64 flex flex-col">
        <div className="flex-1 flex flex-col">
          {/* Search bar and user settings */}
          <div className={`flex justify-between items-center p-2 rounded-lg shadow mb-4 ${theme === 'dark' ? 'bg-gray-700' : 'bg-maroon'}`}>
            <div className="flex items-center">
              <FaSearch className="w-4 h-4 mr-1 text-white" />
              <input
                type="text"
                placeholder="Search"
                className="bg-gray-100 border-0 p-1 rounded-lg flex-grow focus:outline-none focus:ring focus:ring-gray-200 text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2 relative">
              <FaBell className="w-5 h-5 text-white hover:text-yellow-400 cursor-pointer" />
              <FaUserCircle className="w-5 h-5 text-white hover:text-yellow-400 cursor-pointer" onClick={() => navigate('/profile')} />
              <FaCog className="w-5 h-5 text-white hover:text-yellow-400 cursor-pointer" onClick={() => setShowSettingsMenu(!showSettingsMenu)} />
              {showSettingsMenu && (
                <div className="absolute right-0 mt-2 bg-white shadow-md rounded-lg z-10" style={{ top: '1rem' }} ref={settingsMenuRef}>
                  <ul className="py-2">
                    <li className={`px-4 py-2 ${theme === 'dark' ? 'text-black' : 'text-gray-800'} hover:bg-gray-200 cursor-pointer`} onClick={() => navigate('/settings')}>Settings</li>
                    <li className={`px-4 py-2 ${theme === 'dark' ? 'text-black' : 'text-gray-800'} hover:bg-gray-200 cursor-pointer`}>Help</li>
                    <li className={`px-4 py-2 ${theme === 'dark' ? 'text-black' : 'text-gray-800'} hover:bg-gray-200 cursor-pointer`} onClick={() => setShowLogoutModal(true)}>Logout</li>
                  </ul>
                </div>
              )}
              <FaBars className="w-5 h-5 text-white hover:text-yellow-400 cursor-pointer md:hidden" onClick={() => setIsOpen(!isOpen)} />
            </div>
          </div>

          {/* Settings Form */}
          <div className={`flex-grow p-6 rounded-lg shadow-md border ${theme === 'dark' ? 'bg-gray-800 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'}`}>
            <h1 className="text-2xl font-semibold mb-4">Settings</h1>
            <form onSubmit={handleSaveChanges} className="flex flex-col space-y-6">
              {/* Theme Toggle */}
              <div className="ml-4">
                <h2 className="text-xl font-bold mb-2">Theme</h2>
                <div className="flex items-center justify-between border-b border-gray-300 pb-2">
                  <span className="ml-4 text-black-700">Dark Mode</span>
                  <label className="inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only" checked={theme === 'dark'} onChange={toggleTheme} />
                    <div className="w-10 h-4 bg-gray-400 rounded-full shadow-inner"></div>
                    <div className={`dot absolute w-6 h-6 rounded-full transition ${theme === 'dark' ? 'bg-blue-500' : 'bg-white'} shadow`} style={{ transform: theme === 'dark' ? 'translateX(100%)' : 'translateX(0)' }}></div>
                  </label>
                </div>
              </div>

              {/* Privacy Category */}
              <div className="ml-4">
                <h2 className="text-xl font-bold mb-2">Privacy</h2>
                <div className="flex items-center justify-between border-b border-gray-300 pb-2">
                  <span className="ml-4 text-black-700">Enable Two-Factor Authentication</span>
                  <label className="inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only" checked={twoFactorAuth} onChange={() => setTwoFactorAuth(!twoFactorAuth)} />
                    <div className="w-10 h-4 bg-gray-400 rounded-full shadow-inner"></div>
                    <div className={`dot absolute w-6 h-6 rounded-full transition ${twoFactorAuth ? 'bg-blue-500' : 'bg-white'} shadow`} style={{ transform: twoFactorAuth ? 'translateX(100%)' : 'translateX(0)' }}></div>
                  </label>
                </div>
              </div>

              {/* Notifications Category */}
              <div className="ml-4">
                <h2 className="text-xl font-bold mb-2">Notifications</h2>
                <div className="flex items-center justify-between border-b border-gray-300 pb-2 mb-4">
                  <span className="ml-4 text-black-700">Email Notifications</span>
                  <label className="inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only" checked={emailNotifications} onChange={() => setEmailNotifications(!emailNotifications)} />
                    <div className="w-10 h-4 bg-gray-400 rounded-full shadow-inner"></div>
                    <div className={`dot absolute w-6 h-6 rounded-full transition ${emailNotifications ? 'bg-blue-500' : 'bg-white'} shadow`} style={{ transform: emailNotifications ? 'translateX(100%)' : 'translateX(0)' }}></div>
                  </label>
                </div>
                <div className="flex items-center justify-between border-b border-gray-300 pb-2">
                  <span className="ml-4 text-black-700">Push Notifications</span>
                  <label className="inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only" checked={pushNotifications} onChange={() => setPushNotifications(!pushNotifications)} />
                    <div className="w-10 h-4 bg-gray-400 rounded-full shadow-inner"></div>
                    <div className={`dot absolute w-6 h-6 rounded-full transition ${pushNotifications ? 'bg-blue-500' : 'bg-white'} shadow`} style={{ transform: pushNotifications ? 'translateX(100%)' : 'translateX(0)' }}></div>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-auto">
                <button type="submit" className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition duration-200">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-auto">
            <h2 className="text-lg font-semibold mb-4">Confirm Logout</h2>
            <p>Are you sure you want to log out?</p>
            <div className="flex justify-end mt-4">
              <button onClick={() => setShowLogoutModal(false)} className="mr-2 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400">Cancel</button>
              <button onClick={handleLogout} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Logout</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
