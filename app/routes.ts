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

  // Dashboard
  route("dashboard", "routes/dashboard/index.tsx"),

  // Admin bookings management
  route("dashboard/bookings", "routes/bookings/index.tsx"),

  // Concert routes - separate files to avoid duplicate route IDs
  route("concerts/create", "routes/concerts/create.tsx"),
  route("concerts/:id/edit", "routes/concerts/edit.tsx"),

  // 404 page
  // route("*", "routes/404.tsx"),
] satisfies RouteConfig;
