import { useState } from "react";

interface SearchFilterProps {
  onSearch: (query: string) => void;
  onFilterDate: (startDate: string, endDate: string) => void;
  onFilterStatus: (status: string) => void;
  onSortBy: (sortBy: string) => void;
  loading?: boolean;
}

export default function SearchFilter({
  onSearch,
  onFilterDate,
  onFilterStatus,
  onSortBy,
  loading,
}: SearchFilterProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("all");
  const [sortBy, setSortBy] = useState("event_date");
  const [showFilters, setShowFilters] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch(value);
  };

  const handleDateFilter = () => {
    onFilterDate(startDate, endDate);
  };

  const handleStatusFilter = (newStatus: string) => {
    setStatus(newStatus);
    onFilterStatus(newStatus);
  };

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
    onSortBy(newSortBy);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setStartDate("");
    setEndDate("");
    setStatus("all");
    setSortBy("event_date");
    onSearch("");
    onFilterDate("", "");
    onFilterStatus("all");
    onSortBy("event_date");
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      {/* Search Bar */}
      <div className="flex flex-col lg:flex-row gap-4 mb-4">
        <div className="flex-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search concerts by name, place, or description..."
              value={searchQuery}
              onChange={handleSearchChange}
              disabled={loading}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
            />
          </div>
        </div>

        {/* Filter Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2 transition-colors"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z"
            />
          </svg>
          <span>Filters</span>
          <svg
            className={`h-4 w-4 transition-transform ${
              showFilters ? "rotate-180" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="border-t border-gray-200 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Date Range
              </label>
              <div className="space-y-2">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="Start date"
                />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="End date"
                />
              </div>
              <button
                onClick={handleDateFilter}
                className="mt-2 w-full px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
              >
                Apply Date Filter
              </button>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => handleStatusFilter(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="event_date">Event Date</option>
                <option value="created_at">Created Date</option>
                <option value="name">Name (A-Z)</option>
                <option value="price">Price (Low to High)</option>
                <option value="price_desc">Price (High to Low)</option>
                <option value="seat_available">Available Seats</option>
              </select>
            </div>

            {/* Actions */}
            <div className="flex flex-col justify-end">
              <button
                onClick={clearFilters}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {(searchQuery ||
        startDate ||
        endDate ||
        status !== "all" ||
        sortBy !== "event_date") && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-600">Active filters:</span>

            {searchQuery && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Search: "{searchQuery}"
                <button
                  onClick={() => {
                    setSearchQuery("");
                    onSearch("");
                  }}
                  className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full bg-blue-200 hover:bg-blue-300"
                >
                  ×
                </button>
              </span>
            )}

            {(startDate || endDate) && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Date: {startDate || "Start"} - {endDate || "End"}
                <button
                  onClick={() => {
                    setStartDate("");
                    setEndDate("");
                    onFilterDate("", "");
                  }}
                  className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full bg-green-200 hover:bg-green-300"
                >
                  ×
                </button>
              </span>
            )}

            {status !== "all" && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                Status: {status}
                <button
                  onClick={() => handleStatusFilter("all")}
                  className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full bg-purple-200 hover:bg-purple-300"
                >
                  ×
                </button>
              </span>
            )}

            {sortBy !== "event_date" && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                Sort: {sortBy.replace("_", " ")}
                <button
                  onClick={() => handleSortChange("event_date")}
                  className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full bg-orange-200 hover:bg-orange-300"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
