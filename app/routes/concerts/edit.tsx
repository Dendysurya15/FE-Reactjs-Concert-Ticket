// routes/concerts/edit.tsx
import { useNavigate, useParams } from "react-router";
import { useAuth } from "../../lib/AuthContext";
import ConcertForm from "../../components/concert/Form";
import { useState, useEffect } from "react";

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

export default function EditConcert() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [concert, setConcert] = useState<Concert | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id || !user) return;

    const fetchConcert = async () => {
      try {
        // Debug: Log the URL being called
        const url = `http://localhost:3000/concerts/${id}`; // Use full URL like in the form
        console.log("Fetching concert from:", url);
        console.log("User token:", user.token ? "Token exists" : "No token");

        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${user.token}`, // Adjust based on your auth implementation
          },
        });

        console.log("Response status:", response.status);
        console.log("Response ok:", response.ok);

        if (response.ok) {
          const concertData = await response.json();
          console.log("Concert data received:", concertData);

          // Convert Go time format to JavaScript format if needed
          const formattedConcert: Concert = {
            ...concertData,
            event_date: new Date(concertData.event_date)
              .toISOString()
              .slice(0, 16), // Format for datetime-local input
            event_end: new Date(concertData.event_end)
              .toISOString()
              .slice(0, 16),
          };
          setConcert(formattedConcert);
        } else {
          const errorText = await response.text();
          console.log("Error response:", errorText);
          setError(`Failed to fetch concert data: ${response.status}`);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Error fetching concert data");
      } finally {
        setLoading(false);
      }
    };

    fetchConcert();
  }, [id, user]);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading concert data...</p>
        </div>
      </div>
    );
  }

  if (error || !concert) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto py-8 px-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error || "Concert not found"}</p>
            <button
              onClick={() => navigate("/dashboard")}
              className="mt-2 text-red-600 hover:text-red-800 underline"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleSaveConcert = async (updatedConcert: Concert) => {
    try {
      const response = await fetch(`http://localhost:3000/concerts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`, // Adjust based on your auth implementation
        },
        body: JSON.stringify({
          name: updatedConcert.name,
          description: updatedConcert.description,
          price: updatedConcert.price,
          place: updatedConcert.place,
          seat_count: updatedConcert.seat_count,
          discount: updatedConcert.discount,
          event_date: updatedConcert.event_date,
          event_end: updatedConcert.event_end,
          status: updatedConcert.status,
        }),
      });

      if (response.ok) {
        // Navigate back to dashboard on success
        navigate("/dashboard");
      } else {
        // Handle error
        const errorData = await response.json();
        console.error("Error updating concert:", errorData);
        // You might want to show a toast notification here
      }
    } catch (error) {
      console.error("Error updating concert:", error);
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
          <h1 className="text-2xl font-bold text-gray-900">Edit Concert</h1>
          <p className="text-gray-600 mt-2">
            Update the concert details below.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <ConcertForm
            concert={concert}
            onSave={handleSaveConcert}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </div>
  );
}
