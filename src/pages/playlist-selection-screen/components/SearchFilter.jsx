import React, { useState, useEffect, useCallback } from 'react';
import Icon from '../../../components/AppIcon';

const SearchFilter = ({ 
  onSearch, 
  totalPlaylists, 
  selectedCount, 
  onSelectAll 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const isAllSelected = selectedCount === totalPlaylists && totalPlaylists > 0;

  // Debounce search
  const debouncedSearch = useCallback(
    (query) => {
      const timeoutId = setTimeout(() => {
        onSearch(query);
      }, 300);
      return () => clearTimeout(timeoutId);
    },
    [onSearch]
  );

  useEffect(() => {
    debouncedSearch(searchQuery);
  }, [searchQuery, debouncedSearch]);

  const handleSearchChange = (value) => {
    setSearchQuery(value);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    onSearch('');
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      {/* Search Input */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Icon 
            name="Search" 
            size={18} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" 
          />
          <input
            type="text"
            placeholder="Search by name, description, or owner..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full bg-surface border border-border rounded-lg pl-10 pr-4 py-3 text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
          />
          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors duration-200"
              aria-label="Clear search"
            >
              <Icon name="X" size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        {/* Results Count */}
        <span className="text-sm text-text-secondary">
          {totalPlaylists} playlist{totalPlaylists !== 1 ? 's' : ''} found
        </span>

        {/* Select All Button */}
        {totalPlaylists > 0 && (
          <button
            onClick={onSelectAll}
            className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-hover transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background rounded px-2 py-1"
          >
            <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-200 ${
              isAllSelected 
                ? 'bg-primary border-primary' :'border-border hover:border-primary'
            }`}>
              {isAllSelected && (
                <Icon name="Check" size={12} color="white" />
              )}
            </div>
            {isAllSelected ? 'Deselect All' : 'Select All'}
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchFilter;