import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = ({ sidebarOpen, toggleSidebar }) => {
  const navItems = [
    { path: '/', label: 'Dashboard' },
    { path: '/custom-user', label: 'Users' },
    { path: '/pet', label: 'Pets' },
    { path: '/pet-breeds', label: 'Pet Breeds' },
    { path: '/personality-tags', label: 'Personality Tags' },
    { path: '/event-fields', label: 'Event Fields' },
    { path: '/medication-frequency', label: 'Medication Frequencies' },
    { path: '/timezone', label: 'Timezones' },
    { path: '/reminder-options', label: 'Reminder Options' },
    { path: '/deworming-frequencies', label: 'Deworming Frequencies' },
    { path: '/ngo-account', label: 'NGO Accounts' },
    { path: '/pet-to-adopt', label: 'Pets for Adoption' }
  ];

  return (
    <div
      className={`inset-y-0 left-0 w-64 bg-blue-800 text-white transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 transition-transform duration-300 ease-in-out z-30`}
    >
      <div className="p-4">
        <h2 className="text-2xl font-bold">Admin Panel</h2>
        <button
          className="md:hidden mt-2 p-2 rounded bg-blue-600 hover:bg-blue-700"
          onClick={toggleSidebar}
        >
          Close
        </button>
      </div>
      <nav className="mt-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `block py-2 px-4 hover:bg-blue-700 ${isActive ? 'bg-blue-900' : ''}`
            }
            onClick={() => sidebarOpen && toggleSidebar()}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;