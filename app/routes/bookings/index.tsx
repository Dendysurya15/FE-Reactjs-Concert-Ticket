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

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const { user, token } = useAuth();
  const { showError } = useToast();

  // Check if user is admin
  const isAdmin = user?.role === "admin";

  // Fetch bookings from API
  const fetchBookings = async (page: number = 1) => {
    try {
      setLoading(true);

      if (!token || !user) {
        throw new Error("No authentication found");
      }

      const params = new URLSearchParams({
        page: page.toString(),
        limit: ITEMS_PER_PAGE.toString(),
      });

      // ✅ For users, add user_id filter to get only their bookings
      // ✅ For admins, no filter = get all bookings
      if (!isAdmin) {
        params.append("user_id", user.id.toString());
      }

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
        userFilter: !isAdmin ? `user_id=${user.id}` : "all users",
      });
    } catch (error) {
      console.error("Error fetching bookings:", error);
      showError(
        isAdmin
          ? "Failed to load bookings"
          : "Failed to load your booking history"
      );
    } finally {
      setLoading(false);
    }
  };

  // Load data once when component mounts
  useEffect(() => {
    if (user && token) {
      fetchBookings(1);
    }
  }, [user, token]);

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchBookings(page);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Access Denied</h2>
          <p className="text-gray-600">
            You need to be logged in to access this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header - Different for admin vs user */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isAdmin ? "Bookings Management" : "My Booking History"}
          </h1>
          <p className="text-gray-600">
            {isAdmin
              ? "View all concert bookings"
              : "View your concert bookings"}
          </p>
        </div>
      </div>

      {/* Stats Summary - Only for users */}
      {!isAdmin && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {totalItems}
              </div>
              <div className="text-sm text-gray-600">Total Bookings</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {
                  bookings.filter(
                    (b) =>
                      b.status_text.toLowerCase() === "confirmed" ||
                      b.status_text.toLowerCase() === "active"
                  ).length
                }
              </div>
              <div className="text-sm text-gray-600">Confirmed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {
                  bookings.filter(
                    (b) => b.status_text.toLowerCase() === "pending"
                  ).length
                }
              </div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
          </div>
        </div>
      )}

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
