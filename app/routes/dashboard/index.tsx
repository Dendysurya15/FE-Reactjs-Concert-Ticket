import { useAuth } from "../../lib/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();

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

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome back, {user.name}! 👋
        </h1>
        <p className="text-gray-600">
          {user.role === "admin"
            ? "Manage your concert venue from the admin panel."
            : "Find and book amazing concerts near you."}
        </p>

        {/* User info card */}
        <div className="mt-4 bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-2">
            Account Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Email:</span>
              <span className="ml-2 font-medium">{user.email}</span>
            </div>
            <div>
              <span className="text-gray-500">Role:</span>
              <span
                className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                  user.role === "admin"
                    ? "bg-purple-100 text-purple-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {user.role === "admin" ? "🔧 Administrator" : "🎫 Customer"}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Age:</span>
              <span className="ml-2 font-medium">{user.age}</span>
            </div>
            <div>
              <span className="text-gray-500">Member since:</span>
              <span className="ml-2 font-medium">
                {new Date(user.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Role-specific content */}
      {user.role === "admin" ? (
        <AdminDashboardContent />
      ) : (
        <UserDashboardContent />
      )}
    </div>
  );
}

function AdminDashboardContent() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Stats Cards */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <span className="text-2xl">🎵</span>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-900">
              Total Concerts
            </h3>
            <p className="text-2xl font-bold text-blue-600">24</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <span className="text-2xl">🎫</span>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-900">
              Total Bookings
            </h3>
            <p className="text-2xl font-bold text-green-600">1,247</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <span className="text-2xl">👥</span>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-900">Active Users</h3>
            <p className="text-2xl font-bold text-purple-600">589</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="md:col-span-2 lg:col-span-3">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <span className="mr-2">➕</span>
              Add New Concert
            </button>
            <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <span className="mr-2">👥</span>
              Manage Users
            </button>
            <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <span className="mr-2">📊</span>
              View Analytics
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function UserDashboardContent() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Featured Concerts */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          🔥 Featured Concerts
        </h3>
        <div className="space-y-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900">Summer Music Festival</h4>
            <p className="text-sm text-gray-600">
              July 15, 2025 • Madison Square Garden
            </p>
            <div className="mt-2 flex justify-between items-center">
              <span className="text-lg font-bold text-green-600">$89</span>
              <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                Book Now
              </button>
            </div>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900">Rock Night Live</h4>
            <p className="text-sm text-gray-600">
              July 22, 2025 • Central Park
            </p>
            <div className="mt-2 flex justify-between items-center">
              <span className="text-lg font-bold text-green-600">$65</span>
              <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          📋 Recent Bookings
        </h3>
        <div className="space-y-4">
          <div className="border-l-4 border-green-500 bg-green-50 p-4 rounded">
            <h4 className="font-medium text-gray-900">Jazz Evening</h4>
            <p className="text-sm text-gray-600">Booked on June 28, 2025</p>
            <span className="inline-block mt-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
              Confirmed
            </span>
          </div>
          <div className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded">
            <h4 className="font-medium text-gray-900">Pop Concert</h4>
            <p className="text-sm text-gray-600">Booked on June 25, 2025</p>
            <span className="inline-block mt-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              Upcoming
            </span>
          </div>
        </div>
        <button className="w-full mt-4 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          View All Bookings
        </button>
      </div>
    </div>
  );
}
