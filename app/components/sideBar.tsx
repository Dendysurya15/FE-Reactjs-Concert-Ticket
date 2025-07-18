import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { useAuth } from "../lib/AuthContext";
import { useToast } from "../lib/ToastContext";
import {
  Home,
  BarChart3,
  Ticket,
  History,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  User,
  LogOut,
  AlignLeft,
} from "lucide-react";

interface SidebarProps {
  children: React.ReactNode;
}

export default function Sidebar({ children }: SidebarProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(true);
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
    const commonItems = [
      {
        name: "Dashboard",
        href: "/dashboard",
        icon: BarChart3,
      },
    ];

    if (user?.role === "admin") {
      return [
        ...commonItems,
        { name: "Bookings", href: "/dashboard/bookings", icon: Ticket },
      ];
    } else {
      return [
        ...commonItems,
        { name: "History", href: "/dashboard/history", icon: History },
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
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="fixed inset-0 bg-black bg-opacity-25"></div>
        </div>
      )}

      {/* Sidebar */}
      <div
        className={`bg-white shadow-xl transition-all duration-300 ease-in-out border-r border-gray-100 ${
          sidebarVisible
            ? "lg:w-64 lg:static lg:translate-x-0"
            : "lg:w-0 lg:static lg:translate-x-0"
        } ${
          sidebarOpen
            ? "fixed inset-y-0 left-0 z-50 w-64 translate-x-0"
            : "fixed inset-y-0 left-0 z-50 w-64 -translate-x-full lg:translate-x-0"
        }`}
      >
        <div
          className={`flex flex-col h-full transition-opacity duration-300 ${
            sidebarVisible
              ? "opacity-100"
              : "lg:opacity-0 lg:pointer-events-none"
          }`}
        >
          {/* Sidebar header */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-100 bg-white">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center shadow-md">
                <Home className="w-4 h-4 text-white" />
              </div>
              <div
                className={`transition-all duration-300 overflow-hidden ${
                  sidebarVisible ? "opacity-100 w-auto" : "opacity-0 w-0"
                }`}
              >
                <h2 className="text-lg font-bold text-gray-900 whitespace-nowrap">
                  American
                </h2>
                <p className="text-xs text-gray-500 whitespace-nowrap -mt-1">
                  Realtor {user.role === "admin" ? "Admin" : ""}
                </p>
              </div>
            </div>

            {/* Hide sidebar button (desktop) */}
            <button
              onClick={() => setSidebarVisible(false)}
              className="hidden lg:block p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all duration-200"
              title="Hide sidebar"
            >
              <ChevronLeft className="h-4 w-4 cursor-pointer" />
            </button>

            {/* Close button (mobile) */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all duration-200"
            >
              <X className="h-5 w-5 cursor-pointer" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    navigate(item.href);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group ${
                    isCurrentPath(item.href)
                      ? "bg-blue-50 text-blue-700 shadow-sm border border-blue-100"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <IconComponent
                    className={`w-5 h-5 mr-3 transition-colors duration-200 ${
                      isCurrentPath(item.href)
                        ? "text-blue-700"
                        : "text-gray-400 group-hover:text-gray-600"
                    }`}
                  />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-gray-100 bg-gray-50/50">
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="w-full flex items-center space-x-3 p-3 text-sm rounded-xl hover:bg-white hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 border border-transparent hover:border-gray-100"
              >
                {/* User avatar */}
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0 shadow-md">
                  {getUserInitials(user.name)}
                </div>

                {/* User info */}
                <div className="flex-1 text-left">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>

                {/* Dropdown arrow */}
                <ChevronDown
                  className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
                    userDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown menu */}
              {/* Dropdown menu */}
              {userDropdownOpen && (
                <div className="absolute bottom-full mb-2 left-0 w-full rounded-xl shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none transform transition-all duration-200 origin-bottom border border-gray-100">
                  <div className="py-1">
                    <button
                      onClick={handleProfile}
                      className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3 transition-colors duration-200 first:rounded-t-xl last:rounded-b-xl"
                    >
                      <User className="w-4 h-4 text-gray-400" />
                      <span>Profile</span>
                    </button>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3 transition-colors duration-200 first:rounded-t-xl last:rounded-b-xl"
                    >
                      <LogOut className="w-4 h-4 text-gray-400" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top bar with breadcrumbs and mobile menu */}
        <div className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 lg:px-6 shadow-sm">
          <div className="flex items-center space-x-4">
            {/* Mobile hamburger */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all duration-200"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Show sidebar button (desktop) */}
            {!sidebarVisible && (
              <button
                onClick={() => setSidebarVisible(true)}
                className="hidden lg:block p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all duration-200"
                title="Show sidebar"
              >
                <AlignLeft className="h-5 w-5 cursor-pointer" />
              </button>
            )}

            {/* Breadcrumbs */}
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2">
                {breadcrumbs.map((breadcrumb, index) => (
                  <li key={breadcrumb.href} className="flex items-center">
                    {index > 0 && (
                      <ChevronRight className="h-4 w-4 text-gray-300 mx-2 cursor-pointer" />
                    )}
                    <span
                      className={`text-sm transition-colors duration-200 cursor-pointer ${
                        index === breadcrumbs.length - 1
                          ? "text-gray-900 font-semibold"
                          : "text-gray-500 hover:text-gray-700"
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

          {/* Right side */}
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
