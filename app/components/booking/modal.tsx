// components/booking/BookingModal.tsx
import { useState } from "react";
import { useAuth } from "../../lib/AuthContext";
import { useToast } from "../../lib/ToastContext";

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

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  concert: Concert;
  onBookingSuccess?: () => void;
}

export default function BookingModal({
  isOpen,
  onClose,
  concert,
  onBookingSuccess,
}: BookingModalProps) {
  const [ticketCount, setTicketCount] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { token } = useAuth();
  const { showSuccess, showError } = useToast();

  // Early returns for when modal shouldn't show
  if (!isOpen) return null;
  if (!concert) return null;

  // Calculate available seats
  const availableSeats = concert.seat_count - (concert.seat_booked || 0);

  // Calculate total price with discount
  const discountAmount = (concert.price * concert.discount) / 100;
  const finalPrice = concert.price - discountAmount;
  const totalPrice = finalPrice * ticketCount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      showError("Please log in to make a booking");
      return;
    }

    if (ticketCount > availableSeats) {
      showError(`Only ${availableSeats} seats available`);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:3000/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          concert_id: concert.id,
          ticket_count: ticketCount,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to create booking");
      }

      const booking = await response.json();
      console.log("✅ Booking created:", booking);

      showSuccess(`Successfully booked ${ticketCount} ticket(s)!`);
      onClose();
      setTicketCount(1); // Reset form

      // Callback to refresh concert list or update UI
      if (onBookingSuccess) {
        onBookingSuccess();
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      showError(
        error instanceof Error ? error.message : "Failed to create booking"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTicketCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const count = parseInt(e.target.value);
    if (count >= 1 && count <= availableSeats) {
      setTicketCount(count);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0  bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50 p-8"
      onClick={onClose} // ✅ Click outside to close
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-md w-full my-8"
        onClick={(e) => e.stopPropagation()} // ✅ Prevent close when clicking inside modal
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-white rounded-t-lg">
          <h3 className="text-xl font-bold text-gray-900">Book Concert</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center text-xl transition-colors"
            disabled={isSubmitting}
            type="button"
          >
            ×
          </button>
        </div>

        {/* Concert Info */}
        <div className="p-6 border-b bg-gray-50">
          <h4 className="font-bold text-lg text-gray-900">{concert.name}</h4>
          <p className="text-gray-600 text-sm mt-1">{concert.place}</p>
          <p className="text-gray-600 text-sm">
            {new Date(concert.event_date).toLocaleDateString("id-ID", {
              day: "2-digit",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
          <div className="mt-2">
            <span className="text-green-600 font-medium">
              {availableSeats} seats available
            </span>
          </div>
        </div>

        {/* Booking Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {/* Ticket Count */}
            <div>
              <label
                htmlFor="ticketCount"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Number of Tickets
              </label>
              <input
                type="number"
                id="ticketCount"
                value={ticketCount}
                onChange={handleTicketCountChange}
                min="1"
                max={availableSeats}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={isSubmitting}
              />
            </div>

            {/* Price Breakdown */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span>Price per ticket:</span>
                <span className="line-through text-gray-500">
                  IDR {concert.price.toLocaleString()}
                </span>
              </div>
              {concert.discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount ({concert.discount}%):</span>
                  <span>-IDR {discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-medium">
                <span>Final price per ticket:</span>
                <span>IDR {finalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Quantity:</span>
                <span>{ticketCount} ticket(s)</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span>IDR {totalPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || availableSeats === 0}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                  Booking...
                </div>
              ) : availableSeats === 0 ? (
                "Sold Out"
              ) : (
                `Book ${ticketCount} Ticket(s)`
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
