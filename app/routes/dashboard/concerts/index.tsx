import { useAuth } from "../../../lib/AuthContext";
import { Link } from "react-router";

export default function ConcertsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  return (
    <div className="space-y-6">
      {/* Header with role-based actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isAdmin ? "Manage Concerts" : "Available Concerts"}
          </h1>
          <p className="text-gray-600">
            {isAdmin
              ? "Create and manage concert events"
              : "Browse and book tickets for upcoming concerts"}
          </p>
        </div>

        {/* Admin-only create button */}
        {isAdmin && (
          <Link
            to="/dashboard/concerts/create"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            + Create Concert
          </Link>
        )}
      </div>

      {/* Role-based concert list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* This would be populated with actual concert data */}
        <ConcertCard
          concert={{
            id: 1,
            name: "Rock Festival 2024",
            place: "Jakarta Stadium",
            price: 150000,
            date: "2024-12-25",
            availableSeats: 750,
          }}
          isAdmin={isAdmin}
        />
        {/* More concert cards... */}
      </div>
    </div>
  );
}

// Concert Card component with role-based actions
function ConcertCard({ concert, isAdmin }: { concert: any; isAdmin: boolean }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {concert.name}
      </h3>
      <div className="space-y-2 text-sm text-gray-600">
        <p>📍 {concert.place}</p>
        <p>💰 Rp {concert.price.toLocaleString()}</p>
        <p>📅 {concert.date}</p>
        <p>🎫 {concert.availableSeats} seats available</p>
      </div>

      <div className="mt-4 space-y-2">
        {isAdmin ? (
          // Admin actions
          <div className="flex space-x-2">
            <Link
              to={`/dashboard/concerts/${concert.id}/edit`}
              className="flex-1 bg-blue-600 text-white text-center py-2 rounded-md text-sm hover:bg-blue-700"
            >
              Edit
            </Link>
            <Link
              to={`/dashboard/concerts/${concert.id}`}
              className="flex-1 bg-gray-600 text-white text-center py-2 rounded-md text-sm hover:bg-gray-700"
            >
              View
            </Link>
          </div>
        ) : (
          // User actions
          <div className="flex space-x-2">
            <Link
              to={`/dashboard/concerts/${concert.id}`}
              className="flex-1 bg-blue-600 text-white text-center py-2 rounded-md text-sm hover:bg-blue-700"
            >
              View Details
            </Link>
            <Link
              to={`/dashboard/bookings/create?concert=${concert.id}`}
              className="flex-1 bg-green-600 text-white text-center py-2 rounded-md text-sm hover:bg-green-700"
            >
              Book Now
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
