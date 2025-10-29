import React from 'react';

interface NavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Navbar({ activeTab, onTabChange }: NavbarProps) {
  const tabs = ['Home', 'Arts', 'Gifs', 'Sketches', 'Animes'];

  return (
    <nav className="navbar-container relative border-b-2 border-red-900 bg-black/90 backdrop-blur-sm">
      <div className="flex items-center justify-center gap-8 p-6">
        <div className="nav-title mr-8 text-red-600">
          DISCONNECTION
        </div>
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab.toLowerCase())}
            className={`nav-tab relative px-6 py-2 transition-all duration-300 ${
              activeTab === tab.toLowerCase()
                ? 'text-red-500'
                : 'text-gray-400 hover:text-red-400'
            }`}
          >
            {tab}
            <span className="blood-drip"></span>
          </button>
        ))}
      </div>
    </nav>
  );
}
