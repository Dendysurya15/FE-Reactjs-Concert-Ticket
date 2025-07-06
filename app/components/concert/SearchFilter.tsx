import { useState, useEffect, useCallback, useRef } from "react";

interface SearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  debounceMs?: number;
  className?: string;
}

export default function Search({
  onSearch,
  placeholder = "Search concerts...",
  debounceMs = 500,
  className = "",
}: SearchProps) {
  console.log("🔍 Search component rendered with props:", {
    placeholder,
    debounceMs,
    className,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  console.log("🔍 Search component state:", { searchQuery, isSearching });

  // Debounced search function
  const debouncedSearch = useCallback(
    (query: string) => {
      console.log("⏱️ Debounced search called with:", query);

      // Clear existing timeout
      if (debounceTimeoutRef.current) {
        console.log("⏱️ Clearing existing timeout");
        clearTimeout(debounceTimeoutRef.current);
      }

      // Set loading state only if query is not empty
      if (query.trim()) {
        console.log("⏱️ Setting searching state to true");
        setIsSearching(true);
      }

      // Create new timeout
      debounceTimeoutRef.current = setTimeout(() => {
        console.log("🚀 Executing search after debounce:", query);
        onSearch(query);
        setIsSearching(false);
      }, debounceMs);

      console.log("⏱️ New timeout created with delay:", debounceMs);
    },
    [onSearch, debounceMs]
  );

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log("🔍 Search input changed:", value);
    setSearchQuery(value);
    debouncedSearch(value);
  };

  // Clear search
  const handleClear = () => {
    setSearchQuery("");
    onSearch("");
    setIsSearching(false);

    // Clear timeout if exists
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Keep focus on input
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        {/* Search Icon */}
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {isSearching ? (
            <svg
              className="animate-spin h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : (
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          )}
        </div>

        {/* Search Input */}
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          autoComplete="off"
          spellCheck="false"
        />

        {/* Clear Button */}
        {searchQuery && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <button
              onClick={handleClear}
              className="h-5 w-5 text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition-colors"
              type="button"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
