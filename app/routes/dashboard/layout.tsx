import { Outlet, useNavigate } from "react-router";
import { useAuth } from "../../lib/AuthContext";
import { Navigate } from "react-router";
import { useEffect } from "react";

export default function DashboardLayout() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const navigation = [
    // Common navigation for both roles
    { name: "Dashboard", href: "/dashboard", icon: "🏠" },
    { name: "Concerts", href: "/dashboard/concerts", icon: "🎵" },
    { name: "My Bookings", href: "/dashboard/bookings", icon: "🎫" },
    { name: "Profile", href: "/dashboard/profile", icon: "👤" },

    // Admin-only navigation
    ...(user?.role === "admin"
      ? [
          { name: "Users", href: "/dashboard/users", icon: "👥" },
          { name: "Analytics", href: "/dashboard/analytics", icon: "📊" },
        ]
      : []),
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-sm">
          <div className="p-4">
            <h1 className="text-xl font-bold text-gray-900">Concert Tickets</h1>
            <p className="text-sm text-gray-500">
              {user?.role === "admin" ? "Admin Panel" : "User Dashboard"}
            </p>
          </div>

          <nav className="mt-8 px-4 space-y-2">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900"
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </a>
            ))}
          </nav>

          <div className="absolute bottom-0 w-64 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {user?.name.charAt(0).toUpperCase()}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700">
                    {user?.name}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {user?.role}
                  </p>
                </div>
              </div>
              <button
                onClick={logout}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1">
          {/* Header */}
          <header className="bg-white shadow-sm">
            <div className="px-8 py-4">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">
                  Welcome, {user?.name}!
                </h1>
                <div className="flex items-center space-x-4">
                  {user?.role === "admin" && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Admin
                    </span>
                  )}
                  <span className="text-sm text-gray-500">
                    {new Date().toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </header>

          {/* Page content */}
          <main className="p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
