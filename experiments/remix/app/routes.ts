import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/store/products", "./routes/products._index.tsx"), // Pfad relativ zum app-Verzeichnis
] satisfies RouteConfig;
