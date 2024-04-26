import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./Root";

export const caixaRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/caixa",
  component: Caixa,
});

function Caixa() {
  return (
    <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg">
      caixa
    </div>
  );
}
