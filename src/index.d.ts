import { apiCliente } from "./preload";

declare global {
  interface Window { apiCliente: typeof apiCliente }
}