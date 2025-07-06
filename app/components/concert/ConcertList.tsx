import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../lib/AuthContext";
import { useToast } from "../../lib/ToastContext";
import ConcertCard, {
  ConcertCardSkeleton,
} from "../../components/concert/ConcertCard";
import SearchFilter from "../../components/concert/SearchFilter";

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
}

export default function ConcertsList({
  onCreateConcert,
  onEditConcert,
}: ConcertsListProps) {
  const [concerts, setConcerts] = useState<Concert[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("event_date");

  const { user, token } = useAuth();
  const { showSuccess, showError } = useToast();

  const API_BASE_URL = "http://localhost:3000";

  // Fetch concerts with filters
  const fetchConcerts = useCallback(
    async (pageNum: number = 1, append: boolean = false) => {
      try {
        if (pageNum === 1) {
          setLoading(true);
        } else {
          setLoadingMore(true);
        }

        const params = new URLSearchParams({
          page: pageNum.toString(),
          limit: "12",
          ...(searchQuery && { search: searchQuery }),
          ...(dateRange.start && { start_date: dateRange.start }),
          ...(dateRange.end && { end_date: dateRange.end }),
          ...(statusFilter !== "all" && { status: statusFilter }),
          ...(sortBy && { sort_by: sortBy }),
        });

        const response = await fetch(`${API_BASE_URL}/concerts?${params}`, {
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch concerts");
        }

        const result: ConcertsResponse = await response.json();

        if (append) {
          setConcerts((prev) => [...prev, ...result.data]);
        } else {
          setConcerts(result.data);
        }

        setTotal(result.total);
        setHasMore(result.has_next);
        setPage(pageNum);
      } catch (error) {
        console.error("Error fetching concerts:", error);
        showError("Failed to load concerts. Please try again.");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [searchQuery, dateRange, statusFilter, sortBy, token, showError]
  );

  // Initial load
  useEffect(() => {
    fetchConcerts(1, false);
  }, [fetchConcerts]);

  // Search handler
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1);
  };

  // Filter handlers
  const handleDateFilter = (startDate: string, endDate: string) => {
    setDateRange({ start: startDate, end: endDate });
    setPage(1);
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    setPage(1);
  };

  const handleSortBy = (sort: string) => {
    setSortBy(sort);
    setPage(1);
  };

  // Load more concerts
  const loadMore = () => {
    if (hasMore && !loadingMore) {
      fetchConcerts(page + 1, true);
    }
  };

  // Infinite scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 1000 &&
        hasMore &&
        !loadingMore &&
        !loading
      ) {
        loadMore();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, loadingMore, loading, page]);

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
    console.log("Book concert:", concert.id);
    showSuccess(`Booking for ${concert.name} - Feature coming soon!`);
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
            {user.role === "admin" ? "Manage Concerts" : "Browse Concerts"}
          </h1>
          <p className="text-gray-600">
            {total > 0
              ? `${total} concert${total !== 1 ? "s" : ""} found`
              : "No concerts found"}
          </p>
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

      {/* Search and Filters */}
      <SearchFilter
        onSearch={handleSearch}
        onFilterDate={handleDateFilter}
        onFilterStatus={handleStatusFilter}
        onSortBy={handleSortBy}
        loading={loading}
      />

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
      {!loading && concerts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎵</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No concerts found
          </h3>
          <p className="text-gray-600 mb-6">
            {searchQuery || dateRange.start || statusFilter !== "all"
              ? "Try adjusting your search filters"
              : "No concerts are currently available"}
          </p>
          {user.role === "admin" && onCreateConcert && (
            <button
              onClick={onCreateConcert}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <span className="mr-2">➕</span>
              Create First Concert
            </button>
          )}
        </div>
      )}

      {/* Load More Button */}
      {!loading && hasMore && concerts.length > 0 && (
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
                  ></path>
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
      {concerts.length > 0 && (
        <div className="text-center text-sm text-gray-500">
          Showing {concerts.length} of {total} concerts
        </div>
      )}
    </div>
  );
}
