import React, { createContext, useContext, useEffect, useState } from "react";

interface User {
  id: number;
  name: string;
  email: string;
  age: number;
  token: string;
  role: "admin" | "user";
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  register: (userData: RegisterData) => Promise<{
    success: boolean;
    error?: string;
    shouldRedirectToLogin?: boolean;
  }>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  isLoggingIn: boolean;
  error: string | null;
  clearError: () => void;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  age: number;
}

interface LoginResponse {
  token: string;
  expires_at: string;
  user: User;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // API base URL - matches your Go backend
  const API_BASE_URL = "http://localhost:3000";

  useEffect(() => {
    // Check if user is already logged in
    const savedToken = localStorage.getItem("auth_token");
    if (savedToken) {
      setToken(savedToken);
      // Verify token and get user data
      fetchUserProfile(savedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchUserProfile = async (authToken: string) => {
    try {
      console.log("🔍 Fetching user profile...");

      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });

      console.log("📡 Profile response status:", response.status);

      if (response.ok) {
        const userData: User = await response.json();
        console.log("✅ User profile loaded:", userData.email);
        setUser(userData);
        setToken(authToken);
        setError(null);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.log("❌ Profile error:", response.status, errorData);

        // Token is invalid, remove it
        localStorage.removeItem("auth_token");
        setToken(null);
        setUser(null);
      }
    } catch (err) {
      console.error("💥 Error fetching user profile:", err);
      localStorage.removeItem("auth_token");
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      setError(null);
      setIsLoggingIn(true);

      console.log("🔐 AuthContext: Starting login for:", email);

      const requestBody = { email, password };
      console.log("📤 AuthContext: Sending login request...");

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      console.log("📡 AuthContext: Login response status:", response.status);

      let data;
      try {
        data = await response.json();
        console.log("📥 AuthContext: Login response data:", data);
      } catch (parseError) {
        console.error(
          "💥 AuthContext: Failed to parse response as JSON:",
          parseError
        );
        const errorMessage = "Server returned invalid response";
        setError(errorMessage);
        setIsLoggingIn(false);
        return { success: false, error: errorMessage };
      }

      if (!response.ok) {
        console.log(
          "❌ AuthContext: Login failed with status:",
          response.status
        );

        let errorMessage = "Login failed";

        if (data?.error) {
          errorMessage = data.error;
        } else if (data?.details) {
          errorMessage = data.details;
        } else {
          switch (response.status) {
            case 400:
              errorMessage =
                "Invalid email or password format. Please check your input.";
              break;
            case 401:
              errorMessage = "Invalid email or password. Please try again.";
              break;
            case 404:
              errorMessage =
                "User not found. Please check your email or register first.";
              break;
            case 429:
              errorMessage = "Too many login attempts. Please try again later.";
              break;
            case 500:
            case 502:
            case 503:
              errorMessage = "Server error. Please try again in a moment.";
              break;
            default:
              errorMessage = `Login failed (${response.status}). Please try again.`;
          }
        }

        setError(errorMessage);
        setIsLoggingIn(false);
        return { success: false, error: errorMessage };
      }

      // Success path
      const loginData: LoginResponse = data;
      console.log(
        "✅ AuthContext: Login successful for user:",
        loginData.user.email
      );

      // Save token to localStorage
      localStorage.setItem("auth_token", loginData.token);

      // Update state
      setToken(loginData.token);
      setUser(loginData.user);
      setError(null);

      console.log("✅ AuthContext: Login completed successfully");
      return { success: true };
    } catch (err) {
      console.error("💥 AuthContext: Login error:", err);

      const errorMessage =
        err instanceof Error ? err.message : "Login failed. Please try again.";
      setError(errorMessage);
      setIsLoggingIn(false);
      return { success: false, error: errorMessage };
    } finally {
      console.log("🏁 AuthContext: Login finally block");
    }
  };

  const register = async (
    userData: RegisterData
  ): Promise<{
    success: boolean;
    error?: string;
    shouldRedirectToLogin?: boolean;
  }> => {
    try {
      setError(null);
      setIsLoggingIn(true);

      console.log("📝 Attempting registration for:", userData.email);

      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      console.log("📡 Registration response status:", response.status);

      let data;
      try {
        data = await response.json();
        console.log("📥 Registration response data:", data);
      } catch (parseError) {
        console.error("💥 Failed to parse response as JSON:", parseError);
        const errorMessage = "Server returned invalid response";
        setError(errorMessage);
        setIsLoggingIn(false);
        return { success: false, error: errorMessage };
      }

      if (!response.ok) {
        console.log("❌ Registration failed with status:", response.status);

        let errorMessage = "Registration failed";

        if (data?.error) {
          errorMessage = data.error;
        } else if (data?.details) {
          errorMessage = data.details;
        } else {
          switch (response.status) {
            case 400:
              errorMessage =
                "Invalid registration data. Please check all fields.";
              break;
            case 409:
              errorMessage =
                "Email already exists. Please use a different email or login instead.";
              break;
            case 422:
              errorMessage = "Invalid data format. Please check your input.";
              break;
            case 500:
            case 502:
            case 503:
              errorMessage = "Server error. Please try again in a moment.";
              break;
            default:
              errorMessage = `Registration failed (${response.status}). Please try again.`;
          }
        }

        setError(errorMessage);
        setIsLoggingIn(false);
        return { success: false, error: errorMessage };
      }

      console.log("✅ Registration successful for user:", userData.email);

      // DON'T save token or set user - just return success
      // This allows the component to decide what to do next
      setError(null);
      setIsLoggingIn(false);

      return {
        success: true,
        shouldRedirectToLogin: true,
      };
    } catch (err) {
      console.error("💥 Registration error:", err);

      const errorMessage =
        err instanceof Error
          ? err.message
          : "Registration failed. Please try again.";
      setError(errorMessage);
      setIsLoggingIn(false);
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    console.log("👋 Logging out user");
    localStorage.removeItem("auth_token");
    setToken(null);
    setUser(null);
    setError(null);
    setIsLoggingIn(false);
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    isAuthenticated: !!token && !!user,
    isLoading,
    isLoggingIn,
    error,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
