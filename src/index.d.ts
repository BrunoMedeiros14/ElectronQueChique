import {apiCaixa, apiCliente, apiConta, apiProduto, apiVenda} from "./preload";

declare global {
  interface Window {
    apiCaixa: typeof apiCaixa
    apiCliente: typeof apiCliente
    apiConta: typeof apiConta
    apiProduto: typeof apiProduto
    apiVenda: typeof apiVenda
  }

}