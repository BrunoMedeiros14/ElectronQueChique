
import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./Root";

export const estoqueRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/estoque",
  component: Estoque,
});

function Estoque() {
  return (
    <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg">
      estoque
    </div>
  );
}