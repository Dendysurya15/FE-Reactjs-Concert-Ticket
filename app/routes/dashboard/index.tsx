// routes/dashboard/index.tsx
import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../lib/AuthContext";
import ConcertsList from "../../components/concert/ConcertList";
import BookingModal from "../../components/booking/modal";

interface Concert {
  id?: number;
  name: string;
  description: string;
  price: number;
  place: string;
  seat_count: number;
  seat_booked?: number;
  discount: number;
  event_date: string;
  event_end: string;
  status: "active" | "inactive" | "cancelled";
  created_at?: string;
  updated_at?: string;
}

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [refreshKey, setRefreshKey] = useState(0);
  // Modal state
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedConcert, setSelectedConcert] = useState<Concert | null>(null);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const handleCreateConcert = () => {
    navigate("/dashboard/concerts/create");
  };

  const handleEditConcert = (concert: Concert) => {
    navigate(`/dashboard/concerts/${concert.id}/edit`);
  };

  // ✅ NEW: Handle booking - this opens the modal
  const handleBookConcert = (concert: Concert) => {
    console.log("Opening booking modal for:", concert.name);
    setSelectedConcert(concert);
    setIsBookingModalOpen(true);
  };

  const handleBookingSuccess = () => {
    // Close modal first
    setIsBookingModalOpen(false);
    setSelectedConcert(null);

    // Trigger re-render of ConcertsList component to refresh data
    setRefreshKey((prev) => prev + 1);

    // No immediate refresh - let the toast display naturally for its full 5 seconds
    // The ConcertsList will re-render and fetch fresh data automatically
  };

  return (
    <div>
      <ConcertsList
        key={refreshKey}
        onCreateConcert={handleCreateConcert}
        onEditConcert={handleEditConcert}
        onBookConcert={handleBookConcert}
      />

      {/* ✅ NEW: Booking Modal */}
      {selectedConcert && (
        <BookingModal
          isOpen={isBookingModalOpen}
          onClose={() => {
            setIsBookingModalOpen(false);
            setSelectedConcert(null);
          }}
          concert={selectedConcert}
          onBookingSuccess={handleBookingSuccess}
        />
      )}
    </div>
  );
}
