import { useState, useEffect } from "react";
import { useAuth } from "../../lib/AuthContext";
import { useToast } from "../../lib/ToastContext";

// UPDATED INTERFACE - Now matches your dashboard
interface Concert {
  id?: number;
  name: string;
  description: string;
  price: number;
  place: string;
  seat_count: number;
  seat_booked?: number; // Added this
  discount: number;
  event_date: string;
  event_end: string;
  status: "active" | "inactive" | "cancelled";
  created_at?: string; // Added this
  updated_at?: string; // Added this
}

interface ConcertFormProps {
  concert?: Concert;
  onSave: (concert: Concert) => void;
  onCancel: () => void;
  // Removed isOpen prop since we don't need modal behavior
}

export default function ConcertForm({
  concert,
  onSave,
  onCancel,
}: ConcertFormProps) {
  const [formData, setFormData] = useState<Concert>({
    name: "",
    description: "",
    price: 0,
    place: "",
    seat_count: 0,
    seat_booked: 0, // Added default
    discount: 0,
    event_date: "",
    event_end: "",
    status: "active",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { token } = useAuth();
  const { showSuccess, showError } = useToast();

  const API_BASE_URL = "http://localhost:3000";

  // Initialize form data when concert prop changes
  useEffect(() => {
    if (concert) {
      setFormData({
        ...concert,
        event_date: concert.event_date
          ? new Date(concert.event_date).toISOString().slice(0, 16)
          : "",
        event_end: concert.event_end
          ? new Date(concert.event_end).toISOString().slice(0, 16)
          : "",
      });
    } else {
      setFormData({
        name: "",
        description: "",
        price: 0,
        place: "",
        seat_count: 0,
        seat_booked: 0,
        discount: 0,
        event_date: "",
        event_end: "",
        status: "active",
      });
    }
    setErrors({});
  }, [concert]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) || 0 : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Concert name is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (formData.price <= 0) {
      newErrors.price = "Price must be greater than 0";
    }

    if (!formData.place.trim()) {
      newErrors.place = "Venue/place is required";
    }

    if (formData.seat_count <= 0) {
      newErrors.seat_count = "Seat count must be greater than 0";
    }

    if (formData.discount < 0 || formData.discount > 100) {
      newErrors.discount = "Discount must be between 0 and 100";
    }

    if (!formData.event_date) {
      newErrors.event_date = "Event start date is required";
    }

    if (!formData.event_end) {
      newErrors.event_end = "Event end date is required";
    }

    if (formData.event_date && formData.event_end) {
      const startDate = new Date(formData.event_date);
      const endDate = new Date(formData.event_end);

      if (startDate >= endDate) {
        newErrors.event_end = "End date must be after start date";
      }

      if (startDate <= new Date()) {
        newErrors.event_date = "Event date must be in the future";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const submitData = {
        ...formData,
        event_date: new Date(formData.event_date).toISOString(),
        event_end: new Date(formData.event_end).toISOString(),
      };

      const url = concert
        ? `${API_BASE_URL}/concerts/${concert.id}`
        : `${API_BASE_URL}/concerts`;

      const method = concert ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to save concert");
      }

      const savedConcert = await response.json();

      showSuccess(
        concert
          ? "Concert updated successfully!"
          : "Concert created successfully!"
      );
      onSave(savedConcert);
    } catch (error) {
      console.error("Error saving concert:", error);
      showError(
        error instanceof Error ? error.message : "Failed to save concert"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Removed the modal check - now it always renders
  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900">
            {concert ? "Edit Concert" : "Create New Concert"}
          </h3>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 gap-6">
          {/* Concert Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Concert Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.name ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Enter concert name"
            />
            {errors.name && (
              <p className="mt-2 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.description ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Enter concert description"
            />
            {errors.description && (
              <p className="mt-2 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          {/* Price and Discount */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Price (IDR) *
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                step="1000"
                className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.price ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="150000"
              />
              {errors.price && (
                <p className="mt-2 text-sm text-red-600">{errors.price}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="discount"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Discount (%)
              </label>
              <input
                type="number"
                id="discount"
                name="discount"
                value={formData.discount}
                onChange={handleChange}
                min="0"
                max="100"
                className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.discount ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="0"
              />
              {errors.discount && (
                <p className="mt-2 text-sm text-red-600">{errors.discount}</p>
              )}
            </div>
          </div>

          {/* Place and Seat Count */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="place"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Venue/Place *
              </label>
              <input
                type="text"
                id="place"
                name="place"
                value={formData.place}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.place ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Jakarta Convention Center"
              />
              {errors.place && (
                <p className="mt-2 text-sm text-red-600">{errors.place}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="seat_count"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Total Seats *
              </label>
              <input
                type="number"
                id="seat_count"
                name="seat_count"
                value={formData.seat_count}
                onChange={handleChange}
                min="1"
                className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.seat_count ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="1000"
              />
              {errors.seat_count && (
                <p className="mt-2 text-sm text-red-600">{errors.seat_count}</p>
              )}
            </div>
          </div>

          {/* Event Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="event_date"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Event Start Date *
              </label>
              <input
                type="datetime-local"
                id="event_date"
                name="event_date"
                value={formData.event_date}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.event_date ? "border-red-300" : "border-gray-300"
                }`}
              />
              {errors.event_date && (
                <p className="mt-2 text-sm text-red-600">{errors.event_date}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="event_end"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Event End Date *
              </label>
              <input
                type="datetime-local"
                id="event_end"
                name="event_end"
                value={formData.event_end}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.event_end ? "border-red-300" : "border-gray-300"
                }`}
              />
              {errors.event_end && (
                <p className="mt-2 text-sm text-red-600">{errors.event_end}</p>
              )}
            </div>
          </div>

          {/* Status */}
          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 sm:flex-none sm:px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                {concert ? "Updating..." : "Creating..."}
              </div>
            ) : concert ? (
              "Update Concert"
            ) : (
              "Create Concert"
            )}
          </button>

          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="flex-1 sm:flex-none sm:px-8 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
