import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../../lib/AuthContext";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);

  const { login, isAuthenticated, isLoading, isLoggingIn, error, clearError } =
    useAuth();
  const navigate = useNavigate();

  // Handle navigation when authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      console.log("🚀 User authenticated, navigating to dashboard...");
      // Small delay to ensure smooth transition
      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 100);
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Handle error persistence - combine local and context errors
  const displayError = localError || error;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Only clear errors when user starts typing
    if (displayError && value.length > 0) {
      setLocalError(null);
      clearError();
      setShowError(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("🚀 Form submit triggered");

    // CRITICAL: Prevent all default behaviors
    e.preventDefault();
    e.stopPropagation();

    if (isSubmitting || isLoggingIn) {
      console.log("⚠️ Already submitting, ignoring");
      return;
    }

    // Clear previous errors
    setLocalError(null);
    clearError();
    setShowError(false);
    setIsSubmitting(true);

    console.log("🔄 Starting login process");

    try {
      // Client-side validation
      if (!formData.email.trim()) {
        console.log("❌ Validation failed: Email required");
        setLocalError("Email is required");
        setShowError(true);
        setIsSubmitting(false); // Clear loading state
        return;
      }

      if (!formData.password) {
        console.log("❌ Validation failed: Password required");
        setLocalError("Password is required");
        setShowError(true);
        setIsSubmitting(false); // Clear loading state
        return;
      }

      if (!formData.email.includes("@")) {
        console.log("❌ Validation failed: Invalid email");
        setLocalError("Please enter a valid email address");
        setShowError(true);
        setIsSubmitting(false); // Clear loading state
        return;
      }

      if (formData.password.length < 6) {
        console.log("❌ Validation failed: Password too short");
        setLocalError("Password must be at least 6 characters");
        setShowError(true);
        setIsSubmitting(false); // Clear loading state
        return;
      }

      console.log("✅ Client validation passed");
      console.log("🔐 Attempting login for:", formData.email);

      // Call login
      console.log("🔄 Calling login...");
      const result = await login(formData.email.trim(), formData.password);

      if (result.success) {
        console.log(
          "✅ Login successful - navigation will be handled by useEffect"
        );
        // Don't set isSubmitting to false here - keep loading until navigation
        // isSubmitting will stay true to prevent multiple submissions
      } else {
        console.error("❌ Login failed:", result.error);
        setLocalError(result.error || "Login failed. Please try again.");
        setShowError(true);
        // Clear submitting state immediately on failure
        setIsSubmitting(false);
      }
    } catch (unexpectedError) {
      console.error("💥 Unexpected error in handleSubmit:", unexpectedError);
      setLocalError("An unexpected error occurred. Please try again.");
      setShowError(true);
      // Clear submitting state on unexpected error too
      setIsSubmitting(false);
    }

    console.log("🏁 Login process finished");
  };

  const clearAllErrors = () => {
    setLocalError(null);
    clearError();
    setShowError(false);
  };

  // Show loading spinner while checking authentication OR during login
  if (isLoading || (isAuthenticated && isLoggingIn)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">
            {isLoading ? "Checking authentication..." : "Signing you in..."}
          </p>
        </div>
      </div>
    );
  }

  // If already authenticated, show loading (this prevents flash)
  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center bg-blue-100 rounded-full">
            <span className="text-2xl">🎵</span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to Concert Tickets
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-blue-600 hover:text-blue-500"
              onClick={clearAllErrors}
            >
              Create one here
            </Link>
          </p>
        </div>

        <form
          className="mt-8 space-y-6"
          onSubmit={handleSubmit}
          noValidate
          action="#"
        >
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                disabled={isSubmitting || isLoggingIn}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                disabled={isSubmitting || isLoggingIn}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Persistent Error Display */}
          {(displayError || showError) && (
            <div className="rounded-md bg-red-50 p-4 border border-red-200">
              <div className="flex">
                <div className="flex-shrink-0">
                  <span className="text-red-400 text-lg">⚠️</span>
                </div>
                <div className="ml-3 flex-1">
                  <h3 className="text-sm font-medium text-red-800">
                    Login Failed
                  </h3>
                  <p className="mt-1 text-sm text-red-700">{displayError}</p>
                </div>
                <div className="ml-auto pl-3">
                  <button
                    type="button"
                    onClick={clearAllErrors}
                    className="inline-flex rounded-md bg-red-50 p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-red-50"
                  >
                    <span className="sr-only">Dismiss</span>
                    <span className="text-sm">✕</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={
                isSubmitting ||
                isLoggingIn ||
                !formData.email ||
                !formData.password
              }
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isSubmitting || isLoggingIn ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
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
                  {isLoggingIn ? "Signing in..." : "Processing..."}
                </span>
              ) : (
                "Sign in"
              )}
            </button>
          </div>

          <div className="text-center space-y-2">
            <p className="text-sm text-gray-500">
              <strong>Need to test?</strong>
            </p>
            <p className="text-xs text-gray-400">
              First register a new account, then login with those credentials
            </p>
            <div className="flex space-x-2 justify-center">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  console.log("🧪 Filling test data");
                  setFormData({
                    email: "test@example.com",
                    password: "password123",
                  });
                  clearAllErrors();
                }}
                className="text-xs text-blue-600 hover:text-blue-500 underline"
              >
                Fill test email
              </button>
              <span className="text-xs text-gray-300">|</span>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  console.log("🧹 Clearing errors");
                  clearAllErrors();
                }}
                className="text-xs text-gray-500 hover:text-gray-700 underline"
              >
                Clear errors
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
