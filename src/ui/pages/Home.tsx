import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./Root";

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: function Index() {
    return <h1>Tela de boas vindas!</h1>;
  },
});