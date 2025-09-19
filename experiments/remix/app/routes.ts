import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/store/products", "./routes/products._index.tsx"), // Pfad relativ zum app-Verzeichnis
  route("/store/products/:handle", "./routes/products.$handle.tsx"),

  // 404 Catch-all Route (MUSS als letzte Route stehen!)
  route("*", "./routes/404.tsx"),
] satisfies RouteConfig;
