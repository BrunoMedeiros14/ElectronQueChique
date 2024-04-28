
import { createRoute } from "@tanstack/react-router";
import { painelRoute } from "../../routes";

export const estoqueRoute = createRoute({
  getParentRoute: () => painelRoute,
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