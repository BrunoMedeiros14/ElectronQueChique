import { apiCaixa, apiCliente, apiConta, apiEstoque, apiRelatorio, apiVenda } from '../../src-electron/preload'

declare global {

  interface Window {
    apiCaixa: typeof apiCaixa
    apiVenda: typeof apiVenda
    apiConta: typeof apiConta
    apiCliente: typeof apiCliente
    apiEstoque: typeof apiEstoque
    apiRelatorio: typeof apiRelatorio
  }

}
