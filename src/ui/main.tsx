import { createRoot } from "react-dom/client";

import {
  RouterProvider
} from "@tanstack/react-router";
import { StrictMode } from "react";
import { router } from "./routes";



declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

createRoot(document.querySelector("#root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
