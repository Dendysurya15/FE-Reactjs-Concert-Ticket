import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import SiteHeader from "./components/siteHeader";
import { AuthProvider, useAuth } from "./lib/AuthContext";
import { ToastProvider } from "./lib/ToastContext"; // Import ToastProvider

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Define routes that shouldn't show the header (auth routes)
  const authRoutes = ["/login", "/register"];
  const isAuthRoute = authRoutes.includes(location.pathname);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Conditionally render SiteHeader */}
      {isAuthenticated && !isAuthRoute && <SiteHeader />}
      <div className={isAuthenticated && !isAuthRoute ? "pt-16" : ""}>
        <Outlet />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </AuthProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="text-6xl font-bold text-gray-900">{message}</h1>
          <p className="mt-4 text-xl text-gray-600">{details}</p>
        </div>

        {stack && (
          <div className="mt-8 text-left">
            <h2 className="text-lg font-medium text-gray-900 mb-2">
              Stack trace:
            </h2>
            <pre className="w-full p-4 overflow-x-auto bg-gray-100 rounded-md text-sm text-gray-800">
              <code>{stack}</code>
            </pre>
          </div>
        )}

        <div className="mt-8">
          <a
            href="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Go back home
          </a>
        </div>
      </div>
    </div>
  );
}
