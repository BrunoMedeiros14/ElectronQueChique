import {contextBridge, ipcRenderer} from 'electron';
import {
  BuscarCaixaPorId,
  BuscarClientePorId,
  BuscarContaPorId,
  BuscarProdutoPorId,
  BuscarTodasContas,
  BuscarTodasVendas,
  BuscarTodosCaixas,
  BuscarTodosClientes,
  BuscarTodosProdutos,
  BuscarVendaPorId,
  CriarCaixa,
  CriarCliente,
  CriarConta,
  CriarProduto,
  CriarVenda,
  EditarCaixa,
  EditarCliente,
  EditarConta,
  EditarProduto,
  EditarVenda,
  RemoverCaixa,
  RemoverCliente,
  RemoverConta,
  RemoverProduto,
  RemoverVenda
} from './shared/Api';

if (!process.contextIsolated) {
  throw new Error('contextIsolation must be enabled in the BrowserWindow')
}

export const apiCliente = {
  criarCliente: (...args: Parameters<CriarCliente>): ReturnType<CriarCliente> => ipcRenderer.invoke('criarCliente', ...args),
  removerCliente: (...args: Parameters<RemoverCliente>): ReturnType<RemoverCliente> => ipcRenderer.invoke('removerCliente', ...args),
  editarCliente: (...args: Parameters<EditarCliente>): ReturnType<EditarCliente> => ipcRenderer.invoke('editarCliente', ...args),
  buscarClientePorId: (...args: Parameters<BuscarClientePorId>): ReturnType<BuscarClientePorId> => ipcRenderer.invoke('buscarClientePorId', ...args),
  buscarTodosClientes: (...args: Parameters<BuscarTodosClientes>): ReturnType<BuscarTodosClientes> => ipcRenderer.invoke('buscarTodosClientes', ...args)
}

export const apiCaixa = {
  criarCaixa: (...args: Parameters<CriarCaixa>): ReturnType<CriarCaixa> => ipcRenderer.invoke('criarCaixa', ...args),
  removerCaixa: (...args: Parameters<RemoverCaixa>): ReturnType<RemoverCaixa> => ipcRenderer.invoke('removerCaixa', ...args),
  editarCaixa: (...args: Parameters<EditarCaixa>): ReturnType<EditarCaixa> => ipcRenderer.invoke('editarCaixa', ...args),
  buscarCaixaPorId: (...args: Parameters<BuscarCaixaPorId>): ReturnType<BuscarCaixaPorId> => ipcRenderer.invoke('buscarCaixaPorId', ...args),
  buscarTodosCaixas: (...args: Parameters<BuscarTodosCaixas>): ReturnType<BuscarTodosCaixas> => ipcRenderer.invoke('buscarTodosCaixas', ...args)
}

export const apiConta = {
  criarConta: (...args: Parameters<CriarConta>): ReturnType<CriarConta> => ipcRenderer.invoke('criarConta', ...args),
  removerConta: (...args: Parameters<RemoverConta>): ReturnType<RemoverConta> => ipcRenderer.invoke('removerConta', ...args),
  editarConta: (...args: Parameters<EditarConta>): ReturnType<EditarConta> => ipcRenderer.invoke('editarConta', ...args),
  buscarContaPorId: (...args: Parameters<BuscarContaPorId>): ReturnType<BuscarContaPorId> => ipcRenderer.invoke('buscarContaPorId', ...args),
  buscarTodasContas: (...args: Parameters<BuscarTodasContas>): ReturnType<BuscarTodasContas> => ipcRenderer.invoke('buscarTodosContas', ...args)
}

export const apiProduto = {
  criarProduto: (...args: Parameters<CriarProduto>): ReturnType<CriarProduto> => ipcRenderer.invoke('criarProduto', ...args),
  removerProduto: (...args: Parameters<RemoverProduto>): ReturnType<RemoverProduto> => ipcRenderer.invoke('removerProduto', ...args),
  editarProduto: (...args: Parameters<EditarProduto>): ReturnType<EditarProduto> => ipcRenderer.invoke('editarProduto', ...args),
  buscarProdutoPorId: (...args: Parameters<BuscarProdutoPorId>): ReturnType<BuscarProdutoPorId> => ipcRenderer.invoke('buscarProdutoPorId', ...args),
  buscarTodosProdutos: (...args: Parameters<BuscarTodosProdutos>): ReturnType<BuscarTodosProdutos> => ipcRenderer.invoke('buscarTodosProdutos', ...args)
}

export const apiVenda = {
  criarVenda: (...args: Parameters<CriarVenda>): ReturnType<CriarVenda> => ipcRenderer.invoke('criarVenda', ...args),
  removerVenda: (...args: Parameters<RemoverVenda>): ReturnType<RemoverVenda> => ipcRenderer.invoke('removerVenda', ...args),
  editarVenda: (...args: Parameters<EditarVenda>): ReturnType<EditarVenda> => ipcRenderer.invoke('editarVenda', ...args),
  buscarVendaPorId: (...args: Parameters<BuscarVendaPorId>): ReturnType<BuscarVendaPorId> => ipcRenderer.invoke('buscarVendaPorId', ...args),
  buscarTodasVendas: (...args: Parameters<BuscarTodasVendas>): ReturnType<BuscarTodasVendas> => ipcRenderer.invoke('buscarTodosVendas', ...args)
}


try {
  contextBridge.exposeInMainWorld('apiCaixa', apiCaixa)
  contextBridge.exposeInMainWorld('apiCliente', apiCliente)
  contextBridge.exposeInMainWorld('apiConta', apiConta)
  contextBridge.exposeInMainWorld('apiProduto', apiProduto)
  contextBridge.exposeInMainWorld('apiVenda', apiVenda)
  contextBridge.exposeInMainWorld('context', {
    locale: navigator.language,
  })

} catch (error) {
  console.error(error)
}
