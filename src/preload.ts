import { contextBridge, ipcRenderer } from 'electron';
import {
  BuscarCaixaPorId,
  BuscarClientePorId,
  BuscarContaPorId,
  BuscarEstoquePorId,
  BuscarEstoquesNaoVendidos,
  BuscarTodasContas,
  BuscarTodasVendas,
  BuscarTodosCaixas,
  BuscarTodosClientes,
  BuscarTodosEstoques,
  BuscarVendaPorId,
  CriarCaixa,
  CriarCliente,
  CriarConta,
  CriarEstoque,
  CriarVenda,
  EditarCaixa,
  EditarCliente,
  EditarConta,
  EditarEstoque,
  EditarVenda,
  RemoverCaixa,
  RemoverCliente,
  RemoverConta,
  RemoverEstoque,
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
  buscarTodasContas: (...args: Parameters<BuscarTodasContas>): ReturnType<BuscarTodasContas> => ipcRenderer.invoke('buscarTodasContas', ...args)
}

export const apiEstoque = {
  criarEstoque: (...args: Parameters<CriarEstoque>): ReturnType<CriarEstoque> => ipcRenderer.invoke('criarEstoque', ...args),
  removerEstoque: (...args: Parameters<RemoverEstoque>): ReturnType<RemoverEstoque> => ipcRenderer.invoke('removerEstoque', ...args),
  editarEstoque: (...args: Parameters<EditarEstoque>): ReturnType<EditarEstoque> => ipcRenderer.invoke('editarEstoque', ...args),
  buscarEstoquePorId: (...args: Parameters<BuscarEstoquePorId>): ReturnType<BuscarEstoquePorId> => ipcRenderer.invoke('buscarEstoquePorId', ...args),
  buscarTodosEstoques: (...args: Parameters<BuscarTodosEstoques>): ReturnType<BuscarTodosEstoques> => ipcRenderer.invoke('buscarTodosEstoques', ...args),
  buscarEstoquesNaoVendidos: (...args: Parameters<BuscarEstoquesNaoVendidos>): ReturnType<BuscarEstoquesNaoVendidos> => ipcRenderer.invoke('buscarEstoquesNaoVendidos', ...args)
}

export const apiVenda = {
  criarVenda: (...args: Parameters<CriarVenda>): ReturnType<CriarVenda> => ipcRenderer.invoke('criarVenda', ...args),
  removerVenda: (...args: Parameters<RemoverVenda>): ReturnType<RemoverVenda> => ipcRenderer.invoke('removerVenda', ...args),
  editarVenda: (...args: Parameters<EditarVenda>): ReturnType<EditarVenda> => ipcRenderer.invoke('editarVenda', ...args),
  buscarVendaPorId: (...args: Parameters<BuscarVendaPorId>): ReturnType<BuscarVendaPorId> => ipcRenderer.invoke('buscarVendaPorId', ...args),
  buscarTodasVendas: (...args: Parameters<BuscarTodasVendas>): ReturnType<BuscarTodasVendas> => ipcRenderer.invoke('buscarTodasVendas', ...args)
}

try {
  contextBridge.exposeInMainWorld('apiCliente', apiCliente)
  contextBridge.exposeInMainWorld('apiConta', apiConta)

  contextBridge.exposeInMainWorld('apiCaixa', apiCaixa)
  contextBridge.exposeInMainWorld('apiEstoque', apiEstoque)
  contextBridge.exposeInMainWorld('apiVenda', apiVenda)
  contextBridge.exposeInMainWorld('context', {
    locale: navigator.language,
  })

} catch (error) {
  console.error(error)
}
