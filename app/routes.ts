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

  // Dashboard routes (role-based layout)
  layout("routes/dashboard/layout.tsx", [
    // Dashboard home (redirects based on role)
    route("dashboard", "routes/dashboard/index.tsx"),

    // // Concert routes (both roles, different UI)
    // route("dashboard/concerts", "routes/dashboard/concerts/index.tsx"),
    // route("dashboard/concerts/create", "routes/dashboard/concerts/create.tsx"), // Admin only
    // route("dashboard/concerts/:id", "routes/dashboard/concerts/$id.tsx"),
    // route(
    //   "dashboard/concerts/:id/edit",
    //   "routes/dashboard/concerts/$id.edit.tsx"
    // ), // Admin only

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
  ]),

  // 404 page
  // route("*", "routes/404.tsx"),
] satisfies RouteConfig;
