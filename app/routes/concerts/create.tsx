// routes/concerts/create.tsx
import { useNavigate } from "react-router";
import { useAuth } from "../../lib/AuthContext";
import ConcertForm from "../../components/concert/Form";

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

export default function CreateConcert() {
  const { user } = useAuth();
  const navigate = useNavigate();

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

  const handleSaveConcert = async (concert: Concert) => {
    try {
      // Call your API to create the concert
      const response = await fetch("/api/concerts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`, // Adjust based on your auth implementation
        },
        body: JSON.stringify({
          name: concert.name,
          description: concert.description,
          price: concert.price,
          place: concert.place,
          seat_count: concert.seat_count,
          discount: concert.discount,
          event_date: concert.event_date,
          event_end: concert.event_end,
          status: concert.status,
        }),
      });

      if (response.ok) {
        // Navigate back to dashboard on success
        navigate("/dashboard");
      } else {
        // Handle error
        const errorData = await response.json();
        console.error("Error creating concert:", errorData);
        // You might want to show a toast notification here
      }
    } catch (error) {
      console.error("Error creating concert:", error);
      // Handle network or other errors
    }
  };

  const handleCancel = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Create New Concert
          </h1>
          <p className="text-gray-600 mt-2">
            Fill in the details to create a new concert event.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <ConcertForm onSave={handleSaveConcert} onCancel={handleCancel} />
        </div>
      </div>
    </div>
  );
}
