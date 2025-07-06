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

  // Admin bookings management
  route("dashboard/bookings", "routes/bookings/index.tsx"),

  // User history - separate file that imports the same component
  route("dashboard/history", "routes/history/index.tsx"),

  // Concert routes - now under dashboard
  route("dashboard/concerts/create", "routes/concerts/create.tsx"),
  route("dashboard/concerts/:id/edit", "routes/concerts/edit.tsx"),
] satisfies RouteConfig;
