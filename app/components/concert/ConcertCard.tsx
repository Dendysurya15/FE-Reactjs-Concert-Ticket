import { useAuth } from "../../lib/AuthContext";
import {
  MapPin,
  Calendar,
  Ticket,
  Edit3,
  Trash2,
  Clock,
  X,
} from "lucide-react";

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
        return "bg-green-50 text-green-700 border-green-200";
      case "inactive":
        return "bg-gray-50 text-gray-700 border-gray-200";
      case "cancelled":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const isEventPast = new Date(concert.event_date) < new Date();
  const isSoldOut = getAvailableSeats() <= 0;

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 group">
      {/* Concert Image Placeholder */}
      <div className="h-28 bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/80 to-blue-600/80"></div>
        <span className="text-5xl text-white relative z-10">🎵</span>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
      </div>

      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
            {concert.name}
          </h3>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
              concert.status
            )}`}
          >
            {concert.status}
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-5 line-clamp-2 leading-relaxed">
          {concert.description}
        </p>

        {/* Event Details */}
        <div className="space-y-3 mb-5">
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-3 text-gray-400" />
            <span>{concert.place}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-3 text-gray-400" />
            <span>{formatDate(concert.event_date)}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Ticket className="w-4 h-4 mr-3 text-gray-400" />
            <span>
              {getAvailableSeats()} / {concert.seat_count} seats available
            </span>
          </div>
        </div>

        {/* Price */}
        <div className="mb-6">
          {concert.discount > 0 ? (
            <div className="flex items-center space-x-3">
              <span className="text-xl font-bold text-green-600">
                {formatPrice(concert.price, concert.discount)}
              </span>
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(concert.price)}
              </span>
              <span className="bg-red-50 text-red-700 text-xs px-2 py-1 rounded-full font-semibold border border-red-200">
                -{concert.discount}%
              </span>
            </div>
          ) : (
            <span className="text-xl font-bold text-gray-900">
              {formatPrice(concert.price)}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex space-x-3">
          {user?.role === "admin" ? (
            <>
              <button
                onClick={() => onEdit?.(concert)}
                className="flex-1 px-4 py-3 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center justify-center space-x-2 shadow-sm hover:shadow-md"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => onDelete?.(concert.id)}
                className="px-4 py-3 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-all duration-200 flex items-center justify-center shadow-sm hover:shadow-md"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          ) : (
            <button
              onClick={() => onBook?.(concert)}
              disabled={isEventPast || isSoldOut || concert.status !== "active"}
              className={`w-full px-4 py-3 text-sm font-semibold rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-sm ${
                isEventPast || isSoldOut || concert.status !== "active"
                  ? "bg-gray-100 text-gray-500 cursor-not-allowed border border-gray-200"
                  : "bg-black text-white hover:bg-gray-800 hover:shadow-md"
              }`}
            >
              {isEventPast ? (
                <>
                  <Clock className="w-4 h-4" />
                  <span>Event Ended</span>
                </>
              ) : isSoldOut ? (
                <>
                  <Ticket className="w-4 h-4" />
                  <span>Sold Out</span>
                </>
              ) : concert.status !== "active" ? (
                <>
                  <X className="w-4 h-4" />
                  <span>Unavailable</span>
                </>
              ) : (
                <>
                  <Ticket className="w-4 h-4" />
                  <span>Book Now</span>
                </>
              )}
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
    <div className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse border border-gray-100">
      {/* Image skeleton */}
      <div className="h-48 bg-gray-200"></div>

      <div className="p-6">
        {/* Title skeleton */}
        <div className="flex justify-between items-start mb-4">
          <div className="h-6 bg-gray-200 rounded-lg w-3/4"></div>
          <div className="h-5 bg-gray-200 rounded-full w-16"></div>
        </div>

        {/* Description skeleton */}
        <div className="space-y-2 mb-5">
          <div className="h-4 bg-gray-200 rounded-lg w-full"></div>
          <div className="h-4 bg-gray-200 rounded-lg w-2/3"></div>
        </div>

        {/* Details skeleton */}
        <div className="space-y-3 mb-5">
          <div className="h-4 bg-gray-200 rounded-lg w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded-lg w-2/3"></div>
          <div className="h-4 bg-gray-200 rounded-lg w-1/3"></div>
        </div>

        {/* Price skeleton */}
        <div className="h-6 bg-gray-200 rounded-lg w-24 mb-6"></div>

        {/* Button skeleton */}
        <div className="h-12 bg-gray-200 rounded-lg"></div>
      </div>
    </div>
  );
}
