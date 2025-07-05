import { Link } from "react-router";
import { useAuth } from "../../lib/AuthContext";

export default function DashboardPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">{isAdmin ? "👑" : "🎵"}</span>
              </div>
            </div>
            <div className="ml-4">
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {user?.name}!
              </h1>
              <p className="text-sm text-gray-500">
                {isAdmin ? "Admin Dashboard" : "User Dashboard"} •{" "}
                {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">🎵</span>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {isAdmin ? "Total Concerts" : "Available Concerts"}
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {isAdmin ? "12" : "8"}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">🎫</span>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {isAdmin ? "Total Bookings" : "My Bookings"}
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {isAdmin ? "156" : "3"}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {isAdmin && (
          <>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <span className="text-2xl">👥</span>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Users
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">89</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <span className="text-2xl">💰</span>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Revenue
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        $23,400
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {isAdmin ? (
              <>
                <Link
                  to="/dashboard/concerts/create"
                  className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <div className="flex-shrink-0">
                    <span className="text-2xl">➕</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      Create Concert
                    </p>
                    <p className="text-sm text-gray-500">
                      Add a new concert event
                    </p>
                  </div>
                </Link>

                <Link
                  to="/dashboard/concerts"
                  className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <div className="flex-shrink-0">
                    <span className="text-2xl">🎵</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      Manage Concerts
                    </p>
                    <p className="text-sm text-gray-500">
                      View and edit concerts
                    </p>
                  </div>
                </Link>

                <Link
                  to="/dashboard/bookings"
                  className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <div className="flex-shrink-0">
                    <span className="text-2xl">📋</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      View Bookings
                    </p>
                    <p className="text-sm text-gray-500">Manage all bookings</p>
                  </div>
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/dashboard/concerts"
                  className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <div className="flex-shrink-0">
                    <span className="text-2xl">🎵</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      Browse Concerts
                    </p>
                    <p className="text-sm text-gray-500">
                      Find amazing concerts
                    </p>
                  </div>
                </Link>

                <Link
                  to="/dashboard/bookings"
                  className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <div className="flex-shrink-0">
                    <span className="text-2xl">🎫</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      My Bookings
                    </p>
                    <p className="text-sm text-gray-500">View your tickets</p>
                  </div>
                </Link>

                <Link
                  to="/dashboard/profile"
                  className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <div className="flex-shrink-0">
                    <span className="text-2xl">👤</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      Profile Settings
                    </p>
                    <p className="text-sm text-gray-500">Update your profile</p>
                  </div>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Recent Activity
          </h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <span className="text-sm">🎵</span>
              <p className="text-sm text-gray-600">
                {isAdmin
                  ? 'New concert "Rock Festival 2024" created'
                  : 'You viewed "Rock Festival 2024"'}
              </p>
              <span className="text-xs text-gray-400">2 hours ago</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm">🎫</span>
              <p className="text-sm text-gray-600">
                {isAdmin
                  ? 'New booking received for "Jazz Night"'
                  : 'You booked tickets for "Jazz Night"'}
              </p>
              <span className="text-xs text-gray-400">1 day ago</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm">👤</span>
              <p className="text-sm text-gray-600">
                {isAdmin
                  ? "New user registered"
                  : "Profile updated successfully"}
              </p>
              <span className="text-xs text-gray-400">3 days ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
