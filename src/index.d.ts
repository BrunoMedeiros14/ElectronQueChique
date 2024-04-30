import { apiCaixa, apiCliente, apiConta, apiEstoque, apiVenda } from "./preload";

declare global {
  interface Window {
    apiCaixa: typeof apiCaixa
    apiCliente: typeof apiCliente
    apiConta: typeof apiConta
    apiEstoque: typeof apiEstoque
    apiVenda: typeof apiVenda
  }
}