import { QueryClient } from "@tanstack/react-query";
import {
  createRootRouteWithContext
} from "@tanstack/react-router";
import { Sidebar } from "../components/Sidebar";

export const rootRoute = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  component: RootComponent,
});

function RootComponent() {
  return <Sidebar />
  //  (
  //   <>
  //     <div className="p-2 flex gap-2 text-lg">
  //       <Link
  //         to="/"
  //         activeProps={{
  //           className: "font-bold",
  //         }}
  //         activeOptions={{ exact: true }}
  //       >
  //         Home
  //       </Link>{" "}
  //       <Link
  //         to={"/posts"}
  //         activeProps={{
  //           className: "font-bold",
  //         }}
  //       >
  //         Posts
  //       </Link>
  //     </div>
  //     <hr />
  //     <Outlet />
  //     {/* <ReactQueryDevtools buttonPosition="top-right" />
  //     <TanStackRouterDevtools position="bottom-right" /> */}
  //   </>
  // );
}
