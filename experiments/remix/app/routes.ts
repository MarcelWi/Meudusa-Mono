// routes.ts - Auth Routes hinzufügen
import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),

  // Auth Routes
  route("/auth/login", "./routes/auth.login.tsx"),
  route("/auth/register", "./routes/auth.register.tsx"),

  // Protected Account Routes
  route("/account", "./routes/account._index.tsx"),
  route("/account/profile", "./routes/account.profile.tsx"),
  route("/account/orders", "./routes/account.orders.tsx"),
  route("/account/addresses", "./routes/account.addresses.tsx"),

  // Store Routes
  route("/store/products", "./routes/products._index.tsx"),
  route("/store/products/:handle", "./routes/products.$handle.tsx"),

  route("*", "./routes/404.tsx"),
] satisfies RouteConfig;
