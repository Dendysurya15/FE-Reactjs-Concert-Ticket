// routes/dashboard/index.tsx
import { useNavigate } from "react-router";
import { useAuth } from "../../lib/AuthContext";
import ConcertsList from "../../components/concert/ConcertList";

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

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const handleCreateConcert = () => {
    navigate("/concerts/create");
  };

  const handleEditConcert = (concert: Concert) => {
    navigate(`/concerts/${concert.id}/edit`);
  };

  return (
    <div>
      <ConcertsList
        onCreateConcert={handleCreateConcert}
        onEditConcert={handleEditConcert}
      />
    </div>
  );
}
