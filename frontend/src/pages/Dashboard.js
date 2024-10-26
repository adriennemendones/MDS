import React, { useState, useEffect, useRef } from 'react';
import { FaUserCircle, FaSearch, FaCog, FaBell, FaChartBar, FaSignOutAlt, FaBars, FaUpload, FaTimes } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [shake, setShake] = useState(false);
  const settingsMenuRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [selectedService, setSelectedService] = useState("");
  const [sortOrder, setSortOrder] = useState("recent");
  const [showIncidentModal, setShowIncidentModal] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [showZoomedImage, setShowZoomedImage] = useState(false);
  const [resolvedIncidents, setResolvedIncidents] = useState(JSON.parse(localStorage.getItem('resolvedIncidents')) || []);

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

  const handleDateClick = (day) => {
    const newDate = new Date(calendarYear, currentMonth, day);
    setSelectedDate(newDate);
  };

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

  const handleImageUpload = (event) => {
    if (event.target.files && event.target.files[0]) {
      setUploadedImage(URL.createObjectURL(event.target.files[0]));
    }
  };

  const handleSendToHSO = () => {
    if (selectedIncident) {
      const updatedIncident = { ...selectedIncident, uploadedImage };
      const updatedResolvedIncidents = [...resolvedIncidents, updatedIncident];
      setResolvedIncidents(updatedResolvedIncidents);
      localStorage.setItem('resolvedIncidents', JSON.stringify(updatedResolvedIncidents));
      alert('Incident report sent to HSO with the uploaded proof.');
      setShowIncidentModal(false);
    }
  };
  

  const services = [
    "Security Services",
    "Maintenance and Facilities Management",
    "Transportation and Fleet Management",
    "Environmental Health and Safety (EHS)",
    "Custodial Services",
    "Event Management and Logistics",
    "Utilities Management"
  ];

  const incidentReports = [
    {
      reportNumber: 1,
      name: "John Doe",
      location: "Cafeteria",
      dateTime: "2024-10-01 14:30",
      description: "Fire alarm triggered.",
      image: "https://via.placeholder.com/150",
      status: "Ongoing",
      service: "Security Services"
    },
    {
      reportNumber: 2,
      name: "Alice Johnson",
      location: "Room 202",
      dateTime: "2024-10-03 11:15",
      description: "Broken window in room 202.",
      image: "https://via.placeholder.com/150",
      status: "Ongoing",
      service: "Maintenance and Facilities Management"
    },
    {
      reportNumber: 3,
      name: "Bob Brown",
      location: "Building Entrance",
      dateTime: "2024-10-04 15:45",
      description: "Power outage in building.",
      image: "https://via.placeholder.com/150",
      status: "Ongoing",
      service: "Utilities Management"
    },
    {
      reportNumber: 4,
      name: "Charlie Green",
      location: "Hallway",
      dateTime: "2024-10-05 10:30",
      description: "Water leakage in hallway.",
      image: "https://via.placeholder.com/150",
      status: "Ongoing",
      service: "Maintenance and Facilities Management"
    },
    {
      reportNumber: 5,
      name: "Dave Wilson",
      location: "Parking Lot A",
      dateTime: "2024-10-06 08:00",
      description: "Vehicle parked in a restricted area.",
      image: "https://via.placeholder.com/150",
      status: "Ongoing",
      service: "Transportation and Fleet Management"
    },
    {
      reportNumber: 6,
      name: "Eva Adams",
      location: "Parking Lot B",
      dateTime: "2024-10-07 14:20",
      description: "Accident involving two vehicles.",
      image: "https://via.placeholder.com/150",
      status: "Ongoing",
      service: "Transportation and Fleet Management"
    },
    {
      reportNumber: 7,
      name: "Frank Turner",
      location: "Room 303",
      dateTime: "2024-10-08 10:45",
      description: "Broken light in classroom.",
      image: "https://via.placeholder.com/150",
      status: "Ongoing",
      service: "Maintenance and Facilities Management"
    },
    {
      reportNumber: 8,
      name: "Gina Parker",
      location: "Campus Grounds",
      dateTime: "2024-10-09 12:00",
      description: "Hazardous waste improperly disposed.",
      image: "https://via.placeholder.com/150",
      status: "Ongoing",
      service: "Environmental Health and Safety (EHS)"
    },
    {
      reportNumber: 9,
      name: "Henry Hill",
      location: "Science Lab",
      dateTime: "2024-10-10 09:30",
      description: "Chemical spill in the lab.",
      image: "https://via.placeholder.com/150",
      status: "Ongoing",
      service: "Environmental Health and Safety (EHS)"
    },
    {
      reportNumber: 10,
      name: "Irene Lane",
      location: "Main Hall",
      dateTime: "2024-10-11 15:00",
      description: "Event setup for university fair.",
      image: "https://via.placeholder.com/150",
      status: "Ongoing",
      service: "Event Management and Logistics"
    },
    {
      reportNumber: 11,
      name: "Jack Lee",
      location: "Library",
      dateTime: "2024-10-12 11:00",
      description: "Request for additional cleaning supplies.",
      image: "https://via.placeholder.com/150",
      status: "Ongoing",
      service: "Custodial Services"
    }
  ];

  const unresolvedIncidentReports = incidentReports.filter(incident => !resolvedIncidents.some(resolved => resolved.reportNumber === incident.reportNumber));

  const sortedIncidentReports = unresolvedIncidentReports
    .filter(report =>
      (selectedService === "" || report.service === selectedService) &&
      (report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description.toLowerCase().includes(searchTerm.toLowerCase()))
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
              <a onClick={() => navigate('/dashboard')} className={`flex items-center px-4 py-2 text-white ${location.pathname === '/dashboard' ? 'bg-gray-400' : 'hover:bg-gray-400'} transition-colors duration-300 rounded`}>
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
                <div key={index} className="border p-0 text-center h-8"></div>
              ))}
              {[...Array(new Date(calendarYear, currentMonth + 1, 0).getDate())].map((_, index) => {
                const day = index + 1;
                const isToday = day === todayDate;
                return (
                  <div
                    key={index}
                    className={`border p-0 text-center cursor-pointer hover:bg-gray-200 h-8 ${isToday ? 'bg-yellow-300' : ''} ${theme === 'dark' ? 'bg-gray-800 text-white' : ''}`}
                    onClick={() => handleDateClick(day)}
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
              <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-maroon'}`}>Incident Reports</h2>
              <button
                className={`px-4 py-2 text-sm font-semibold rounded ${theme === 'dark' ? 'bg-gray-700 text-white border border-white' : 'bg-white text-maroon border border-maroon'}`}
                onClick={() => navigate('/resolved-incidents')}
              >
                View Resolved Incidents
              </button>
            </div>

            <div className="mb-4">
            <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>
  Filter by Service:
</label>
<select
  value={selectedService}
  onChange={(e) => setSelectedService(e.target.value)}
  className={`mt-2 block w-full  shadow-sm  border border-gray-400 focus:outline-none focus:ring ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-500' : 'bg-white text-black border-gray-300'}`}
>
  <option value="">All Services</option>
  {services.map(service => (
    <option key={service} value={service}>{service}</option>
  ))}
</select>

            </div>

            <div className="flex justify-end mb-4">
                <button
                    className={`px-2 py-1 text-sm font-semibold rounded ${sortOrder === 'recent' ? (theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-300') : 'bg-gray-200 hover:bg-gray-300'}`}
                    onClick={() => setSortOrder("recent")}
                >
                    Recent
                </button>
                <button
                    className={`ml-2 px-2 py-1 text-sm font-semibold rounded ${sortOrder === 'oldest' ? (theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-300') : 'bg-gray-200 hover:bg-gray-300'}`}
                    onClick={() => setSortOrder("oldest")}
                >
                    Oldest
                </button>
            </div>


            <div className="overflow-y-scroll flex-grow" style={{ maxHeight: '530px' }}>
              {sortedIncidentReports.map(report => (
                <div key={report.reportNumber} className={`border p-4 mb-4 rounded shadow flex justify-between items-start ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-500' : 'border-gray-300'}`}>
                  <div className="flex flex-col">
                    <img
                      src={report.image}
                      alt="Incident"
                      className="w-20 h-20 object-cover rounded"
                    />
                    <p className="mt-1 font-semibold text-sm">Report Number: {report.reportNumber}</p>
                    <p className="text-xs">Name: {report.name}</p>
                    <p className="text-xs">Location: {report.location}</p>
                    <p className="text-xs">Date & Time: {report.dateTime}</p>
                    <p className="text-xs">Description: {report.description}</p>
                    <p className="mt-1 font-semibold text-xs">Status: {report.status}</p>
                  </div>
                  <button
                    className="px-4 py-2 text-sm font-semibold bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={() => handleViewIncident(report)}
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {showIncidentModal && selectedIncident && (
        <div className={`fixed inset-0 ${theme === 'dark' ? 'bg-black bg-opacity-75' : 'bg-black bg-opacity-50'} flex items-center justify-center z-50`}>
          <div className={`rounded-lg p-8 w-full max-w-4xl mx-4 md:mx-auto ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white'}`}>
            <h2 className="text-2xl font-semibold mb-4">Incident Report Details</h2>
            <div className="flex flex-col md:flex-row md:space-x-6">
              <img
                src={selectedIncident.image}
                alt="Incident"
                className="w-full md:w-1/3 h-48 object-cover rounded mb-4 md:mb-0"
              />
              <div className="flex-1">
                <p className="mb-2"><strong>Report Number:</strong> {selectedIncident.reportNumber}</p>
                <p className="mb-2"><strong>Name:</strong> {selectedIncident.name}</p>
                <p className="mb-2"><strong>Location:</strong> {selectedIncident.location}</p>
                <p className="mb-2"><strong>Date & Time:</strong> {selectedIncident.dateTime}</p>
                <p className="mb-2"><strong>Description:</strong> {selectedIncident.description}</p>
                <p className="mb-2"><strong>Status:</strong> {selectedIncident.status}</p>

                <div className="mt-4">
                <label className={`block mb-2 text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>
  Upload Proof of Action Taken:
</label>

                  <div className="flex items-center space-x-2 relative">
                  <label className={`flex items-center px-4 py-2 text-sm font-semibold rounded-lg shadow cursor-pointer ${theme === 'dark' ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}>
                    <FaUpload className="mr-2" />
                    {uploadedImage ? 'Change Image' : 'Upload Image'}
                    <input type="file" className="hidden" onChange={handleImageUpload} />
                    </label>

                    {uploadedImage && (
                      <div className="flex items-center space-x-2 relative">
                        <img
                          src={uploadedImage}
                          alt="Uploaded Proof"
                          className="w-16 h-16 object-cover rounded cursor-pointer"
                          onClick={() => setShowZoomedImage(true)}
                        />
                        <button
                          className="px-4 py-2 text-sm font-semibold bg-green-500 text-white rounded hover:bg-green-600"
                          onClick={handleSendToHSO}
                        >
                          Send to HSO
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 mr-2"
                onClick={() => setUploadedImage(null)}
              >
                Remove Image
              </button>
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

      {showZoomedImage && uploadedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative">
            <img
              src={uploadedImage}
              alt="Zoomed Proof"
              className="w-full max-w-3xl object-contain"
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

      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`rounded-lg p-6 max-w-sm mx-auto ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white'}`}>
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