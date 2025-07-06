// routes/dashboard/bookings.tsx
import { useState, useEffect } from "react";
import { useAuth } from "../../lib/AuthContext";
import { useToast } from "../../lib/ToastContext";
import BookingsTable from "../../components/booking/table";

interface Booking {
  id: number;
  user_id: number;
  concert_id: number;
  ticket_count: number;
  total_price: number;
  status: number;
  status_text: string;
  booking_date: string;
  created_at: string;
  updated_at: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
  concert?: {
    id: number;
    title: string;
    artist: string;
    date: string;
    venue: string;
  };
}

interface BookingsResponse {
  data: Booking[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  };
}

const ITEMS_PER_PAGE = 10;

export default function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const { user, token } = useAuth();
  const { showError } = useToast();

  // Fetch bookings from API
  const fetchBookings = async (page: number = 1) => {
    try {
      setLoading(true);

      if (!token) {
        throw new Error("No authentication token found");
      }

      const params = new URLSearchParams({
        page: page.toString(),
        limit: ITEMS_PER_PAGE.toString(),
      });

      const response = await fetch(`http://localhost:3000/bookings?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Error response body:", errorText);
        throw new Error(
          `Failed to fetch bookings: ${response.status} ${response.statusText}`
        );
      }

      const data: BookingsResponse = await response.json();
      console.log("📊 API Response data:", data);

      setBookings(data.data || []);
      setTotalPages(data.pagination?.total_pages || 1);
      setTotalItems(data.pagination?.total || 0);
      setCurrentPage(data.pagination?.page || 1);

      console.log("📄 Pagination state:", {
        totalPages: data.pagination?.total_pages,
        totalItems: data.pagination?.total,
        currentPage: data.pagination?.page,
      });
    } catch (error) {
      console.error("Error fetching bookings:", error);
      showError("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  // Load data once when component mounts
  useEffect(() => {
    if (user?.role === "admin" && token) {
      fetchBookings(1);
    }
  }, [user?.role, token]);

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchBookings(page);
  };

  if (user?.role !== "admin") {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Access Denied</h2>
          <p className="text-gray-600">
            You don't have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Bookings Management
          </h1>
          <p className="text-gray-600">View all concert bookings</p>
        </div>
      </div>

      {/* Table Component with Pagination */}
      <BookingsTable
        bookings={bookings}
        loading={loading}
        pagination={{
          currentPage,
          totalPages,
          totalItems,
          itemsPerPage: ITEMS_PER_PAGE,
        }}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
