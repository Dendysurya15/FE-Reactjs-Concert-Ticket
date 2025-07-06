import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "../../lib/AuthContext";
import { useToast } from "../../lib/ToastContext";
import ConcertCard, {
  ConcertCardSkeleton,
} from "../../components/concert/ConcertCard";
import Search from "../../components/concert/SearchFilter"; // Adjust path as needed

interface Concert {
  id: number;
  name: string;
  description: string;
  price: number;
  place: string;
  seat_count: number;
  seat_booked: number;
  discount: number;
  event_date: string;
  event_end: string;
  status: "active" | "inactive" | "cancelled";
  created_at: string;
  updated_at: string;
}

interface ConcertsResponse {
  data: Concert[];
  total: number;
  page: number;
  limit: number;
  has_next: boolean;
}

interface ConcertsListProps {
  onCreateConcert?: () => void;
  onEditConcert?: (concert: Concert) => void;
  onBookConcert?: (concert: Concert) => void;
}

export default function ConcertsList({
  onCreateConcert,
  onEditConcert,
  onBookConcert,
}: ConcertsListProps) {
  const [concerts, setConcerts] = useState<Concert[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const { user, token } = useAuth();
  const { showSuccess, showError } = useToast();
  const abortControllerRef = useRef<AbortController | null>(null);

  const API_BASE_URL = "http://localhost:3000";

  // Fetch concerts with search support
  const fetchConcerts = useCallback(
    async (
      pageNum: number = 1,
      append: boolean = false,
      search: string = ""
    ) => {
      console.log("📡 fetchConcerts called with:", { pageNum, append, search });
      console.log("📡 API_BASE_URL:", API_BASE_URL);
      console.log("📡 token exists:", !!token);

      try {
        // Cancel previous request if exists
        if (abortControllerRef.current) {
          console.log("📡 Aborting previous request");
          abortControllerRef.current.abort();
        }

        // Create new abort controller
        abortControllerRef.current = new AbortController();

        if (pageNum === 1) {
          if (search.trim()) {
            console.log("📡 Setting isSearching to true");
            setIsSearching(true);
          } else {
            console.log("📡 Setting loading to true");
            setLoading(true);
          }
        } else {
          console.log("📡 Setting loadingMore to true");
          setLoadingMore(true);
        }

        const params = new URLSearchParams({
          page: pageNum.toString(),
          limit: "12",
          sort_by: "event_date",
        });

        // Add search query if provided
        if (search.trim()) {
          params.append("search", search.trim());
          console.log("📡 Added search param:", search.trim());
        }

        const url = `${API_BASE_URL}/concerts?${params}`;
        console.log("📡 Making request to:", url);

        const response = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          signal: abortControllerRef.current.signal,
        });

        console.log("📡 Response status:", response.status);
        console.log("📡 Response ok:", response.ok);

        if (!response.ok) {
          throw new Error(
            `Failed to fetch concerts: ${response.status} ${response.statusText}`
          );
        }

        const result: ConcertsResponse = await response.json();

        console.log("📡 API Response:", result);
        console.log("📡 Found concerts count:", result.data.length);
        console.log("📡 Total available:", result.total);

        if (append) {
          console.log("📡 Appending to existing concerts");
          setConcerts((prev) => [...prev, ...result.data]);
        } else {
          console.log("📡 Replacing concerts list");
          setConcerts(result.data);
        }

        setTotal(result.total);
        setHasMore(result.has_next);
        setPage(pageNum);

        console.log("📡 State updated successfully");
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          console.log("📡 Request was aborted");
          return;
        }
        console.error("📡 Error fetching concerts:", error);
        showError("Failed to load concerts. Please try again.");
      } finally {
        console.log("📡 Cleaning up loading states");
        setLoading(false);
        setLoadingMore(false);
        setIsSearching(false);
      }
    },
    [token, showError]
  );

  // Handle search with debounce
  const handleSearch = useCallback(
    (query: string) => {
      console.log("🎯 handleSearch called with query:", query);
      console.log("🎯 Current searchQuery state:", searchQuery);
      console.log("🎯 Current concerts count:", concerts.length);

      setSearchQuery(query);

      // Reset pagination
      setPage(1);
      setHasMore(true);

      console.log("🎯 About to call fetchConcerts with query:", query);

      // Fetch new results
      fetchConcerts(1, false, query);
    },
    [fetchConcerts, searchQuery, concerts.length]
  );

  // Initial load - only run once
  useEffect(() => {
    console.log("🚀 Initial load useEffect running");
    fetchConcerts(1, false, "");
  }, []);

  // Load more concerts
  const loadMore = useCallback(() => {
    if (hasMore && !loadingMore && !loading) {
      fetchConcerts(page + 1, true, searchQuery);
    }
  }, [hasMore, loadingMore, loading, page, searchQuery, fetchConcerts]);

  // Infinite scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 1000 &&
        hasMore &&
        !loadingMore &&
        !loading &&
        !isSearching
      ) {
        loadMore();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, loadingMore, loading, isSearching, loadMore]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Delete concert (admin only)
  const handleDeleteConcert = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this concert?")) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/concerts/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete concert");
      }

      showSuccess("Concert deleted successfully!");
      setConcerts((prev) => prev.filter((concert) => concert.id !== id));
      setTotal((prev) => prev - 1);
    } catch (error) {
      console.error("Error deleting concert:", error);
      showError("Failed to delete concert. Please try again.");
    }
  };

  // Book concert (user only)
  const handleBookConcert = (concert: Concert) => {
    if (onBookConcert) {
      onBookConcert(concert);
    } else {
      console.log("Book concert:", concert.id);
      showSuccess(`Booking for ${concert.name} - Feature coming soon!`);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setPage(1);
    setHasMore(true);
    fetchConcerts(1, false, "");
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {user.role === "admin" ? "Manage Concerts" : "Concerts"}
          </h1>
        </div>

        {/* Add Concert Button (Admin Only) */}
        {user.role === "admin" && onCreateConcert && (
          <button
            onClick={onCreateConcert}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <span className="mr-2">➕</span>
            Add New Concert
          </button>
        )}
      </div>

      {/* Search Component */}
      <div className="max-w-md">
        <Search
          onSearch={(query) => {
            console.log(
              "🔄 Search component onSearch prop called with:",
              query
            );
            handleSearch(query);
          }}
          placeholder="Search concerts by name, place, or description..."
          debounceMs={500}
          className="w-full"
        />
      </div>

      {/* Search Results Info */}
      {searchQuery && (
        <div className="text-sm text-gray-600 flex items-center gap-2">
          {isSearching ? (
            <div className="flex items-center gap-2">
              <svg
                className="animate-spin h-4 w-4"
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
              Searching...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span>
                Found {total} result{total !== 1 ? "s" : ""} for "{searchQuery}"
              </span>
              <button
                onClick={handleClearSearch}
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Clear search
              </button>
            </div>
          )}
        </div>
      )}

      {/* Concert Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Actual Concert Cards */}
        {concerts.map((concert) => (
          <ConcertCard
            key={concert.id}
            concert={concert}
            onEdit={
              user.role === "admin" && onEditConcert
                ? () => onEditConcert(concert)
                : undefined
            }
            onDelete={user.role === "admin" ? handleDeleteConcert : undefined}
            onBook={user.role === "user" ? handleBookConcert : undefined}
          />
        ))}

        {/* Loading Skeletons */}
        {(loading || loadingMore) &&
          Array.from({ length: loading ? 6 : 3 }, (_, i) => (
            <ConcertCardSkeleton key={`skeleton-${i}`} />
          ))}
      </div>

      {/* Empty State */}
      {!loading && !isSearching && concerts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎵</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchQuery ? "No concerts found" : "No concerts available"}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchQuery
              ? `No concerts match your search "${searchQuery}"`
              : "No concerts are currently available"}
          </p>
          {searchQuery ? (
            <button
              onClick={handleClearSearch}
              className="inline-flex items-center px-4 py-2 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors"
            >
              <span className="mr-2">🔍</span>
              Show All Concerts
            </button>
          ) : (
            user.role === "admin" &&
            onCreateConcert && (
              <button
                onClick={onCreateConcert}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <span className="mr-2">➕</span>
                Create First Concert
              </button>
            )
          )}
        </div>
      )}

      {/* Load More Button */}
      {!loading && !isSearching && hasMore && concerts.length > 0 && (
        <div className="text-center">
          <button
            onClick={loadMore}
            disabled={loadingMore}
            className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loadingMore ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5"
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
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Loading more...
              </>
            ) : (
              "Load More Concerts"
            )}
          </button>
        </div>
      )}

      {/* Footer Info */}
      {concerts.length > 0 && !isSearching && (
        <div className="text-center text-sm text-gray-500">
          Showing {concerts.length} of {total} concerts
          {searchQuery && ` matching "${searchQuery}"`}
        </div>
      )}
    </div>
  );
}
