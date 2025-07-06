import {
  type RouteConfig,
  index,
  route,
  layout,
} from "@react-router/dev/routes";

export default [
  // Landing page
  index("routes/index.tsx"),

  // Auth routes (no layout)
  route("login", "routes/auth/login.tsx"),
  route("register", "routes/auth/register.tsx"),

  route("dashboard", "routes/dashboard/index.tsx"),

  // Booking routes (both roles)
  // route("dashboard/bookings", "routes/dashboard/bookings/index.tsx"),
  // route("dashboard/bookings/create", "routes/dashboard/bookings/create.tsx"),
  // route("dashboard/bookings/:id", "routes/dashboard/bookings/$id.tsx"),
  // route(
  //   "dashboard/bookings/:id/cancel",
  //   "routes/dashboard/bookings/$id.cancel.tsx"
  // ),

  // User management (admin only)
  // route("dashboard/users", "routes/dashboard/users/index.tsx"),
  // route("dashboard/users/:id", "routes/dashboard/users/$id.tsx"),

  // // Analytics (admin only)
  // route("dashboard/analytics", "routes/dashboard/analytics/index.tsx"),

  // // Profile (both roles)
  // route("dashboard/profile", "routes/dashboard/profile.tsx"),

  // 404 page
  // route("*", "routes/404.tsx"),
] satisfies RouteConfig;
