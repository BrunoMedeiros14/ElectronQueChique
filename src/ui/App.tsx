import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {createRouter, RouterProvider} from "@tanstack/react-router";
import {routeTree} from "./routes";

const queryClient = new QueryClient();

const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  defaultPreloadStaleTime: 0,
  context: {
    queryClient,
  },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export function App() {
  return (
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router}/>
      </QueryClientProvider>
  );
}
