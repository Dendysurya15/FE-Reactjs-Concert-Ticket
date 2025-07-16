import React, { useState, useEffect } from "react";
import { Eye, EyeOff, Home } from "lucide-react";
import { useNavigate } from "react-router";
import { useAuth } from "../../lib/AuthContext";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);

  const images = [
    "https://picsum.photos/800/1200?random=1",
    "https://picsum.photos/800/1200?random=2",
    "https://picsum.photos/800/1200?random=3",
  ];

  // Real authentication hooks
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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 10000); // Change image every 10 seconds

    return () => clearInterval(interval);
  }, [images.length]);

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
        setIsSubmitting(false);
        return;
      }

      if (!formData.password) {
        console.log("❌ Validation failed: Password required");
        setLocalError("Password is required");
        setShowError(true);
        setIsSubmitting(false);
        return;
      }

      if (!formData.email.includes("@")) {
        console.log("❌ Validation failed: Invalid email");
        setLocalError("Please enter a valid email address");
        setShowError(true);
        setIsSubmitting(false);
        return;
      }

      if (formData.password.length < 6) {
        console.log("❌ Validation failed: Password too short");
        setLocalError("Password must be at least 6 characters");
        setShowError(true);
        setIsSubmitting(false);
        return;
      }

      console.log("✅ Client validation passed");
      console.log("🔐 Attempting login for:", formData.email);

      // Call login with real auth context
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

  const handleRegisterClick = () => {
    console.log("📱 Navigating to register...");
    setIsNavigating(true);
    clearAllErrors();
    // Navigate with a small delay to show loading
    setTimeout(() => {
      navigate("/register");
    }, 100);
  };

  // Show loading spinner while checking authentication OR during login OR navigating
  if (isLoading || (isAuthenticated && isLoggingIn) || isNavigating) {
    let loadingMessage = "Loading...";
    if (isLoading) loadingMessage = "Checking authentication...";
    else if (isAuthenticated && isLoggingIn)
      loadingMessage = "Signing you in...";
    else if (isNavigating) loadingMessage = "Loading page...";

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">{loadingMessage}</p>
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
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left side - Image slideshow */}
      <div className="hidden lg:block relative bg-gradient-to-br from-blue-400 to-blue-600">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
            style={{
              backgroundImage: `url('${image}')`,
            }}
          />
        ))}

        {/* Subtle overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-gray-600/20" />

        {/* Logo */}
        <div className="absolute top-8 left-8 flex items-center space-x-2 text-white">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <Home className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <div className="font-bold text-lg">American</div>
            <div className="text-sm">Realtor</div>
          </div>
        </div>

        {/* Bottom text */}
        <div className="absolute bottom-12 left-8 text-white">
          <h1 className="text-4xl font-bold mb-2">Find Your Sweet Home</h1>
          <p className="text-lg opacity-90">
            Schedule visit just a few clicks, visit in just a few clicks
          </p>
        </div>

        {/* Dots indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {images.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex ? "bg-white" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile logo (shown only on small screens) */}
          <div className="lg:hidden flex items-center justify-center space-x-2 mb-8">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <Home className="w-5 h-5 text-white" />
            </div>
            <div className="text-blue-600">
              <div className="font-bold text-lg">American</div>
              <div className="text-sm">Realtor</div>
            </div>
          </div>

          {/* Sign In button (top right) */}

          {/* Welcome text */}
          <div className="text-center lg:text-left mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome Back to
            </h2>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              American Realtors!
            </h1>
            <p className="text-gray-600">
              Don't have an account?{" "}
              <button
                onClick={handleRegisterClick}
                disabled={isNavigating}
                className="font-medium text-blue-600 hover:text-blue-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isNavigating ? "Loading..." : "Register"}
              </button>
            </p>
          </div>

          {/* Error Display */}
          {(displayError || showError) && (
            <div className="mb-6 rounded-md bg-red-50 p-4 border border-red-200">
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

          {/* Login form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium  text-gray-700 mb-2"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                disabled={isSubmitting || isLoggingIn}
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  disabled={isSubmitting || isLoggingIn}
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isSubmitting || isLoggingIn}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={isSubmitting || isLoggingIn}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <label
                  htmlFor="remember"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Remember Me
                </label>
              </div>
              <button
                type="button"
                disabled={isSubmitting || isLoggingIn}
                className="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={
                isSubmitting ||
                isLoggingIn ||
                !formData.email ||
                !formData.password
              }
              className="w-full bg-black text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer"
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
                "Log In"
              )}
            </button>
          </form>

          {/* Test data helper (uncomment for development) */}
          {/* <div className="mt-6 text-center space-y-2">
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
          </div> */}
        </div>
      </div>
    </div>
  );
}
