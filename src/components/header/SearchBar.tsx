import React, { useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const SearchBar: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement search functionality
    console.log('Searching for:', searchQuery);
  };

  return (
    <div className="relative">
      <form onSubmit={handleSearch} className="flex items-center">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
        >
          <MagnifyingGlassIcon className="h-5 w-5" />
        </button>
        
        <div
          className={`transition-all duration-300 ease-in-out ${
            isExpanded ? 'w-64 opacity-100' : 'w-0 opacity-0'
          }`}
        >
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск..."
            className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent ${
              !isExpanded && 'hidden'
            }`}
          />
        </div>
      </form>
    </div>
  );
};

export default SearchBar; 