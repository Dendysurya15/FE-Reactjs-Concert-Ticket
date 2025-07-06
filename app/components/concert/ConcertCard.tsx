import { useAuth } from "../../lib/AuthContext";

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

interface ConcertCardProps {
  concert: Concert;
  onEdit?: (concert: Concert) => void;
  onDelete?: (id: number) => void;
  onBook?: (concert: Concert) => void;
}

export default function ConcertCard({
  concert,
  onEdit,
  onDelete,
  onBook,
}: ConcertCardProps) {
  const { user } = useAuth();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (price: number, discount: number = 0) => {
    const discountedPrice = price - (price * discount) / 100;
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(discountedPrice);
  };

  const getAvailableSeats = () => {
    return concert.seat_count - concert.seat_booked;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const isEventPast = new Date(concert.event_date) < new Date();
  const isSoldOut = getAvailableSeats() <= 0;

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      {/* Concert Image Placeholder */}
      <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
        <span className="text-4xl text-white">🎵</span>
      </div>

      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
            {concert.name}
          </h3>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
              concert.status
            )}`}
          >
            {concert.status}
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {concert.description}
        </p>

        {/* Event Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <span className="mr-2">📍</span>
            <span>{concert.place}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <span className="mr-2">📅</span>
            <span>{formatDate(concert.event_date)}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <span className="mr-2">🎫</span>
            <span>
              {getAvailableSeats()} / {concert.seat_count} seats available
            </span>
          </div>
        </div>

        {/* Price */}
        <div className="mb-4">
          {concert.discount > 0 ? (
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-green-600">
                {formatPrice(concert.price, concert.discount)}
              </span>
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(concert.price)}
              </span>
              <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                -{concert.discount}%
              </span>
            </div>
          ) : (
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(concert.price)}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          {user?.role === "admin" ? (
            <>
              <button
                onClick={() => onEdit?.(concert)}
                className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                ✏️ Edit
              </button>
              <button
                onClick={() => onDelete?.(concert.id)}
                className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
              >
                🗑️
              </button>
            </>
          ) : (
            <button
              onClick={() => onBook?.(concert)}
              disabled={isEventPast || isSoldOut || concert.status !== "active"}
              className={`w-full px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                isEventPast || isSoldOut || concert.status !== "active"
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {isEventPast
                ? "⏰ Event Ended"
                : isSoldOut
                ? "🎫 Sold Out"
                : concert.status !== "active"
                ? "❌ Unavailable"
                : "🎫 Book Now"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Skeleton Card Component
export function ConcertCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
      {/* Image skeleton */}
      <div className="h-48 bg-gray-300"></div>

      <div className="p-6">
        {/* Title skeleton */}
        <div className="flex justify-between items-start mb-3">
          <div className="h-6 bg-gray-300 rounded w-3/4"></div>
          <div className="h-5 bg-gray-300 rounded w-16"></div>
        </div>

        {/* Description skeleton */}
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-gray-300 rounded w-full"></div>
          <div className="h-4 bg-gray-300 rounded w-2/3"></div>
        </div>

        {/* Details skeleton */}
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          <div className="h-4 bg-gray-300 rounded w-2/3"></div>
          <div className="h-4 bg-gray-300 rounded w-1/3"></div>
        </div>

        {/* Price skeleton */}
        <div className="h-6 bg-gray-300 rounded w-24 mb-4"></div>

        {/* Button skeleton */}
        <div className="h-10 bg-gray-300 rounded"></div>
      </div>
    </div>
  );
}
