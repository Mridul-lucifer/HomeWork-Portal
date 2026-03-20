import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { HomeIcon, BookOpenIcon, PhotographIcon, CogIcon, ClipboardListIcon } from '@heroicons/react/outline';

const MobileNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { name: 'Homework', icon: <ClipboardListIcon className="w-6 h-6" />, path: '/homework' },
    { name: 'Classwork', icon: <BookOpenIcon className="w-6 h-6" />, path: '/classwork' },
    { name: 'Album', icon: <PhotographIcon className="w-6 h-6" />, path: '/gallery' },
    { name: 'Settings', icon: <CogIcon className="w-6 h-6" />, path: '/settings' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 flex justify-between items-center z-50 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      {navItems.map((item) => (
        <button
          key={item.name}
          onClick={() => navigate(item.path)}
          className={`flex flex-col items-center space-y-1 transition-colors ${
            location.pathname === item.path ? 'text-red-800' : 'text-gray-400'
          }`}
        >
          {item.icon}
          <span className="text-[10px] font-bold uppercase tracking-wider">{item.name}</span>
        </button>
      ))}
    </div>
  );
};

export default MobileNav;