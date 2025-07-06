import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { useAuth } from "../lib/AuthContext";
import { useToast } from "../lib/ToastContext";

interface SidebarProps {
  children: React.ReactNode;
}

export default function Sidebar({ children }: SidebarProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(true); // New: controls if sidebar exists at all
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { showSuccess } = useToast();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Get user initials for avatar
  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join("");
  };

  // Get navigation items based on role
  const getNavigationItems = () => {
    const commonItems = [{ name: "Dashboard", href: "/dashboard", icon: "📊" }];

    if (user?.role === "admin") {
      return [
        ...commonItems,
        { name: "Bookings", href: "/dashboard/bookings", icon: "🎫" },
      ];
    } else {
      return [
        ...commonItems,
        { name: "History", href: "/dashboard/history", icon: "📋" },
      ];
    }
  };

  const navigationItems = getNavigationItems();

  const isCurrentPath = (href: string) => {
    return (
      location.pathname === href || location.pathname.startsWith(href + "/")
    );
  };

  const handleLogout = () => {
    logout();
    showSuccess("Logged out successfully!");
    navigate("/login");
    setUserDropdownOpen(false);
  };

  const handleProfile = () => {
    navigate("/dashboard/profile");
    setUserDropdownOpen(false);
  };

  // Generate breadcrumbs from current path
  const generateBreadcrumbs = () => {
    const pathSegments = location.pathname.split("/").filter(Boolean);
    const breadcrumbs = [];

    for (let i = 0; i < pathSegments.length; i++) {
      const segment = pathSegments[i];
      const href = "/" + pathSegments.slice(0, i + 1).join("/");
      const name = segment.charAt(0).toUpperCase() + segment.slice(1);
      breadcrumbs.push({ name, href });
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  if (!user) return null;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile sidebar overlay - TRANSPARENT or very light */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          {/* Remove the overlay div completely OR make it super transparent */}
          {/* <div className="fixed inset-0 bg-transparent"></div> */}
        </div>
      )}

      {/* Sidebar - PUSHES content on desktop, overlays on mobile */}
      <div
        className={`bg-white shadow-lg transition-all duration-300 ease-in-out ${
          // Desktop: always visible if sidebarVisible, pushes content
          sidebarVisible
            ? "lg:w-64 lg:static lg:translate-x-0"
            : "lg:w-0 lg:static lg:translate-x-0"
        } ${
          // Mobile: fixed overlay
          sidebarOpen
            ? "fixed inset-y-0 left-0 z-50 w-64 translate-x-0"
            : "fixed inset-y-0 left-0 z-50 w-64 -translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Only show content if sidebar should be visible */}
        <div
          className={`flex flex-col h-full transition-opacity duration-300 ${
            sidebarVisible
              ? "opacity-100"
              : "lg:opacity-0 lg:pointer-events-none"
          }`}
        >
          {/* Sidebar header */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 bg-white">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">🎵</span>
              </div>
              <div
                className={`transition-all duration-300 overflow-hidden ${
                  sidebarVisible ? "opacity-100 w-auto" : "opacity-0 w-0"
                }`}
              >
                <h2 className="text-lg font-semibold text-gray-900 whitespace-nowrap">
                  Concert Hub
                </h2>
                <p className="text-xs text-gray-500 whitespace-nowrap">
                  {user.role === "admin" ? "Admin Panel" : ""}
                </p>
              </div>
            </div>

            {/* Hide sidebar button (desktop) */}
            <button
              onClick={() => setSidebarVisible(false)}
              className="hidden lg:block p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors duration-200"
              title="Hide sidebar"
            >
              <svg
                className="h-5 w-5 transition-transform duration-200"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                />
              </svg>
            </button>

            {/* Close button (mobile) */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors duration-200"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
            {navigationItems.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  navigate(item.href);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isCurrentPath(item.href)
                    ? "bg-blue-100 text-blue-700 border-r-2 border-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span className="text-lg mr-3">{item.icon}</span>
                <span>{item.name}</span>
              </button>
            ))}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="w-full flex items-center space-x-3 p-2 text-sm rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
              >
                {/* User avatar */}
                <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                  {getUserInitials(user.name)}
                </div>

                {/* User info */}
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>

                {/* Dropdown arrow */}
                <svg
                  className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
                    userDropdownOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Dropdown menu */}
              {userDropdownOpen && (
                <div className="absolute bottom-full mb-2 left-0 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none transform transition-all duration-200 origin-bottom">
                  <div className="py-1">
                    <button
                      onClick={handleProfile}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2 transition-colors duration-200"
                    >
                      <span>👤</span>
                      <span>Profile</span>
                    </button>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2 transition-colors duration-200"
                    >
                      <span>🚪</span>
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main content area - Gets pushed by sidebar on desktop */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top bar with breadcrumbs and mobile menu */}
        <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center space-x-4">
            {/* Mobile hamburger (always visible on mobile) */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors duration-200"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            {/* Show sidebar button (desktop - only when sidebar is hidden) */}
            {!sidebarVisible && (
              <button
                onClick={() => setSidebarVisible(true)}
                className="hidden lg:block p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-all duration-200"
                title="Show sidebar"
              >
                <svg
                  className="h-6 w-6 transition-transform duration-200 hover:scale-110"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            )}

            {/* Breadcrumbs */}
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2">
                {breadcrumbs.map((breadcrumb, index) => (
                  <li key={breadcrumb.href} className="flex items-center">
                    {index > 0 && (
                      <svg
                        className="h-4 w-4 text-gray-400 mx-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    )}
                    <span
                      className={`text-sm transition-colors duration-200 ${
                        index === breadcrumbs.length - 1
                          ? "text-gray-900 font-medium"
                          : "text-gray-500 hover:text-gray-700 cursor-pointer"
                      }`}
                      onClick={() =>
                        index < breadcrumbs.length - 1 &&
                        navigate(breadcrumb.href)
                      }
                    >
                      {breadcrumb.name}
                    </span>
                  </li>
                ))}
              </ol>
            </nav>
          </div>

          {/* Right side - could add notifications, etc */}
          <div className="flex items-center space-x-4">
            {/* Add any top-right actions here */}
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
