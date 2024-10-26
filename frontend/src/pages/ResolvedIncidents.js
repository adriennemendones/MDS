import React, { useState, useEffect, useRef } from 'react';
import { FaUserCircle, FaSearch, FaCog, FaBell, FaChartBar, FaSignOutAlt, FaBars } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';

export default function ResolvedIncidents() {
  const navigate = useNavigate();
  const location = useLocation();
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showMoveBackModal, setShowMoveBackModal] = useState(false);
  const [shake, setShake] = useState(false);
  const settingsMenuRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [resolvedIncidents, setResolvedIncidents] = useState(JSON.parse(localStorage.getItem('resolvedIncidents')) || []);
  const [showIncidentModal, setShowIncidentModal] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [incidentToMoveBack, setIncidentToMoveBack] = useState(null);
  const [showZoomedImage, setShowZoomedImage] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("recent");

  const today = new Date();
  const todayDate = today.getDate();

  useEffect(() => {
    const shakeInterval = setInterval(() => {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }, 10000);
    return () => clearInterval(shakeInterval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsMenuRef.current && !settingsMenuRef.current.contains(event.target)) {
        setShowSettingsMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleMonthChange = (increment) => {
    let newMonth = currentMonth + increment;
    let newYear = calendarYear;

    if (newMonth < 0) {
      newMonth = 11;
      newYear -= 1;
    } else if (newMonth > 11) {
      newMonth = 0;
      newYear += 1;
    }

    setCurrentMonth(newMonth);
    setCalendarYear(newYear);
  };

  const handleLogout = () => {
    setShowLogoutModal(false);
    navigate('/login');
  };

  const handleViewIncident = (incident) => {
    setSelectedIncident(incident);
    setShowIncidentModal(true);
  };

  const handleMoveBack = (incident) => {
    setIncidentToMoveBack(incident);
    setShowMoveBackModal(true);
  };

  const confirmMoveBack = () => {
    const updatedResolvedIncidents = resolvedIncidents.filter(item => item.reportNumber !== incidentToMoveBack.reportNumber);
    localStorage.setItem('resolvedIncidents', JSON.stringify(updatedResolvedIncidents));
    alert(`Incident Report ${incidentToMoveBack.reportNumber} has been moved back to Ongoing Incident Reports.`);
    setResolvedIncidents(updatedResolvedIncidents);
    setShowMoveBackModal(false);
  };

  const filteredIncidents = resolvedIncidents
    .filter((incident) =>
      incident.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === "recent") {
        return new Date(b.dateTime) - new Date(a.dateTime);
      } else {
        return new Date(a.dateTime) - new Date(b.dateTime);
      }
    });

  return (
    <div className={`flex min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100'} overflow-hidden`}>
      <aside
        className={`shadow-md w-64 fixed top-0 left-0 h-full z-10 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
        style={{
          background: theme === 'dark' ? '#2d2d2d' : '#4a0909',
        }}
      >
        <div className="p-4 text-center border-b border-gray-300">
          <img
            src="/images/BELL.png"
            alt="Logo"
            className={`h-12 mx-auto ${shake ? 'animate-shake' : ''}`}
          />
        </div>
        <nav className="mt-6">
          <ul className="space-y-1">
            <li>
              <a onClick={() => navigate('/dashboard')} className={`flex items-center px-4 py-2 text-white bg-gray-400 transition-colors duration-300 rounded`}>
                <FaChartBar className="w-5 h-5 mr-2" />
                Dashboard
              </a>
            </li>
            <li>
              <a onClick={() => navigate('/profile')} className={`flex items-center px-4 py-2 text-white ${location.pathname === '/profile' ? 'bg-gray-400' : 'hover:bg-gray-400'} transition-colors duration-300 rounded`}>
                <FaUserCircle className="w-5 h-5 mr-2" />
                Profile
              </a>
            </li>
            <li>
              <a onClick={() => navigate('/settings')} className={`flex items-center px-4 py-2 text-white ${location.pathname === '/settings' ? 'bg-gray-400' : 'hover:bg-gray-400'} transition-colors duration-300 rounded`}>
                <FaCog className="w-5 h-5 mr-2" />
                Settings
              </a>
            </li>
            <li>
              <a onClick={() => setShowLogoutModal(true)} className={`flex items-center px-4 py-2 text-white hover:bg-gray-400 transition-colors duration-300 rounded`}>
                <FaSignOutAlt className="w-5 h-5 mr-2" />
                Logout
              </a>
            </li>
          </ul>
        </nav>

        <div className="mt-24 mb-4 px-2">
          <div className={`p-4 rounded-lg shadow-md border ${theme === 'dark' ? 'bg-gray-800 text-white border-gray-500' : 'bg-white text-black border-maroon'} h-76`}>
            <h2 className={`text-xl font-semibold mb-2`}>{`${new Date(calendarYear, currentMonth).toLocaleString('default', { month: 'long' })} ${calendarYear}`}</h2>
            <div className="flex justify-between mb-1">
              <button onClick={() => handleMonthChange(-1)} className="text-gray-600 hover:text-gray-900 text-xs">◀</button>
              <span className="font-bold text-sm">{new Date(calendarYear, currentMonth).toLocaleString('default', { month: 'long' })}</span>
              <button onClick={() => handleMonthChange(1)} className="text-gray-600 hover:text-gray-900 text-xs">▶</button>
            </div>
            <div className="grid grid-cols-7 gap-0.5">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center font-bold text-sm">{day}</div>
              ))}
              {[...Array(new Date(calendarYear, currentMonth, 1).getDay())].map((_, index) => (
                <div key={index} className={`border p-0 text-center h-8 ${theme === 'dark' ? 'bg-gray-800 text-white' : ''}`}></div>
              ))}
              {[...Array(new Date(calendarYear, currentMonth + 1, 0).getDate())].map((_, index) => {
                const day = index + 1;
                const isToday = day === todayDate;
                return (
                  <div
                    key={index}
                    className={`border p-0 text-center cursor-pointer hover:bg-gray-200 h-8 ${isToday ? 'bg-yellow-300' : ''} ${theme === 'dark' ? 'bg-gray-800 text-white' : ''}`}
                  >
                    <span className="text-xs">{day}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </aside>

      <main className={`flex-1 p-4 md:ml-64 flex flex-col ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'} overflow-y-auto`}>
        <div className="flex-1 flex flex-col">
          <div className={`flex justify-between items-center ${theme === 'dark' ? 'bg-gray-700' : 'bg-maroon'} p-2 rounded-lg shadow mb-4`}>
            <div className="flex items-center">
              <FaSearch className="w-4 h-4 mr-1 text-white" />
              <input
                type="text"
                placeholder="Search Reports"
                className={`border-0 p-1 rounded-lg flex-grow focus:outline-none focus:ring focus:ring-gray-200 text-sm ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100'}`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2 relative">
              <FaBell className="w-5 h-5 text-white hover:text-yellow-400 cursor-pointer" />
              <FaUserCircle
                className="w-5 h-5 text-white hover:text-yellow-400 cursor-pointer"
                onClick={() => navigate('/profile')}
              />
              <FaCog
                className="w-5 h-5 text-white hover:text-yellow-400 cursor-pointer"
                onClick={() => setShowSettingsMenu(!showSettingsMenu)}
              />
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

          <div className={`flex-1 rounded-lg shadow p-4 border ${theme === 'dark' ? 'bg-gray-800 text-white border-gray-500' : 'bg-white border-maroon'}`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-maroon'}`}>Resolved Incidents</h2>
              <button
                className={`px-4 py-2 text-sm font-semibold rounded ${theme === 'dark' ? 'bg-gray-700 text-white border border-white hover:bg-gray-600' : 'bg-white text-maroon border border-maroon hover:bg-gray-100'}`}
                onClick={() => navigate('/dashboard')}
              >
                Go Back to Incident Reports
              </button>
            </div>
            <div className="flex justify-end mb-4">
  <button
    className={`px-2 py-1 text-sm font-semibold rounded ${sortOrder === 'recent' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-black hover:bg-gray-400'} ${theme === 'dark' ? 'bg-gray-700 text-white' : ''}`}
    onClick={() => setSortOrder("recent")}
  >
    Recent
  </button>
  <button
    className={`ml-2 px-2 py-1 text-sm font-semibold rounded ${sortOrder === 'oldest' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-black hover:bg-gray-400'} ${theme === 'dark' ? 'bg-gray-700 text-white' : ''}`}
    onClick={() => setSortOrder("oldest")}
  >
    Oldest
  </button>
</div>




            <div className="overflow-y-scroll flex-grow" style={{ maxHeight: '550px' }}>
              {filteredIncidents.length === 0 ? (
                <p className="text-center text-gray-500">No resolved incidents found.</p>
              ) : (
                filteredIncidents.map((report) => (
                  <div key={report.reportNumber} className={`border p-4 mb-4 rounded shadow flex justify-between items-start ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-500' : 'border-gray-300'}`}>
                    <div className="flex flex-col">
                      <img
                        src={report.image}
                        alt="Incident"
                        className="w-16 h-16 object-cover rounded"
                      />
                      <p className="mt-1 font-semibold text-sm">Report Number: {report.reportNumber}</p>
                      <p className="text-xs">Name: {report.name}</p>
                      <p className="text-xs">Location: {report.location}</p>
                      <p className="text-xs">Date & Time: {report.dateTime}</p>
                      <p className="text-xs">Description: {report.description}</p>
                      <p className="text-xs">Service: {report.service}</p>
                      <p className="mt-1 font-semibold text-xs text-green-600">Status: Resolved</p>

                      {/* Display uploaded proof thumbnail if available */}
                      {report.uploadedImage && (
                        <div className="mt-4 cursor-pointer" onClick={() => { setSelectedIncident(report); setShowZoomedImage(true); }}>
                          <h3 className="text-xs font-semibold mb-1">Proof of Action Taken:</h3>
                          <img src={report.uploadedImage} alt="Uploaded Proof" className="w-16 h-16 object-cover rounded" />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col justify-between">
                      <button
                        className="px-4 py-2 text-sm font-semibold bg-green-500 text-white rounded hover:bg-green-600 mb-2"
                        onClick={() => handleViewIncident(report)}
                      >
                        View
                      </button>
                      <button
                        className="px-4 py-2 text-sm font-semibold bg-blue-500 text-white rounded hover:bg-blue-600"
                        onClick={() => handleMoveBack(report)}
                      >
                        Move Back
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      {showIncidentModal && selectedIncident && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`rounded-lg p-4 w-full max-w-2xl mx-4 md:mx-auto ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
            <h2 className="text-lg font-semibold mb-4">Incident Report Details</h2>
            <div className="flex flex-col md:flex-row md:space-x-4">
              <img
                src={selectedIncident.image}
                alt="Incident"
                className="w-full md:w-1/3 h-48 object-cover rounded mb-4 md:mb-0"
              />
              <div className="flex-1">
                <p className="mb-2 text-sm"><strong>Report Number:</strong> {selectedIncident.reportNumber}</p>
                <p className="mb-2 text-sm"><strong>Name:</strong> {selectedIncident.name}</p>
                <p className="mb-2 text-sm"><strong>Location:</strong> {selectedIncident.location}</p>
                <p className="mb-2 text-sm"><strong>Date & Time:</strong> {selectedIncident.dateTime}</p>
                <p className="mb-2 text-sm"><strong>Description:</strong> {selectedIncident.description}</p>
                <p className="mb-2 text-sm"><strong>Service:</strong> {selectedIncident.service}</p>
                <p className="mb-2 text-sm"><strong>Status:</strong> Resolved</p>

                {/* Display full-size uploaded proof if available */}
                {selectedIncident.uploadedImage && (
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold mb-2">Uploaded Proof of Action Taken:</h3>
                    <img
                      src={selectedIncident.uploadedImage}
                      alt="Uploaded Proof"
                      className="w-24 h-24 object-cover rounded cursor-pointer"
                      onClick={() => setShowZoomedImage(true)}
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={() => setShowIncidentModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showZoomedImage && selectedIncident && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative">
            <img
              src={selectedIncident.uploadedImage}
              alt="Zoomed Proof"
              className="w-full max-w-2xl object-contain rounded"
            />
            <button
              className="absolute top-4 right-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              onClick={() => setShowZoomedImage(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showMoveBackModal && incidentToMoveBack && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`rounded-lg p-6 max-w-sm mx-auto ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
            <h2 className="text-lg font-semibold mb-4">Confirm Move Back</h2>
            <p>Are you sure you want to move Incident Report {incidentToMoveBack.reportNumber} back to Ongoing Incident Reports?</p>
            <div className="flex justify-end mt-4">
              <button onClick={() => setShowMoveBackModal(false)} className="mr-2 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400">Cancel</button>
              <button onClick={confirmMoveBack} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                Move Back
              </button>
            </div>
          </div>
        </div>
      )}

      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`rounded-lg p-6 max-w-sm mx-auto ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
            <h2 className="text-lg font-semibold mb-4">Confirm Logout</h2>
            <p>Are you sure you want to log out?</p>
            <div className="flex justify-end mt-4">
              <button onClick={() => setShowLogoutModal(false)} className="mr-2 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400">Cancel</button>
              <button onClick={handleLogout} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .animate-shake {
          animation: shake 0.5s;
        }
        @keyframes shake {
          0% { transform: translate(1px, 1px) rotate(0deg); }
          10% { transform: translate(-1px, -2px) rotate(-1deg); }
          20% { transform: translate(-3px, 0px) rotate(1deg); }
          30% { transform: translate(3px, 2px) rotate(0deg); }
          40% { transform: translate(1px, -1px) rotate(1deg); }
          50% { transform: translate(-1px, 2px) rotate(-1deg); }
          60% { transform: translate(-3px, 1px) rotate(0deg); }
          70% { transform: translate(3px, 1px) rotate(-1deg); }
          80% { transform: translate(-1px, -1px) rotate(1deg); }
          90% { transform: translate(1px, 2px) rotate(0deg); }
          100% { transform: translate(1px, -2px) rotate(-1deg); }
        }
      `}</style>
    </div>
  );
}

//