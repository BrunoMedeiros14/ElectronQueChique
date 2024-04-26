import { contextBridge, ipcRenderer } from 'electron';
import { BuscarClientePorId, BuscarTodosClientes, CriarCliente, EditarCliente, RemoverCliente } from './shared/Api';

if (!process.contextIsolated) {
  throw new Error('contextIsolation must be enabled in the BrowserWindow')
}

export const apiCliente = {
  criarCliente: (...args: Parameters<CriarCliente>): ReturnType<CriarCliente> => ipcRenderer.invoke('criarCliente', ...args),
  removerCliente: (...args: Parameters<RemoverCliente>): ReturnType<RemoverCliente> => ipcRenderer.invoke('removerCliente', ...args),
  editarCliente: (...args: Parameters<EditarCliente>): ReturnType<EditarCliente> => ipcRenderer.invoke('editarCliente', ...args),
  buscarClientePorId: (...args: Parameters<BuscarClientePorId>): ReturnType<BuscarClientePorId> => ipcRenderer.invoke('buscarClientePorId', ...args),
  buscarTodosClientes: (...args: Parameters<BuscarTodosClientes>): ReturnType<BuscarTodosClientes> => {console.log(2); return ipcRenderer.invoke('buscarTodosClientes', ...args)}
}

try {
  contextBridge.exposeInMainWorld('context', {
    locale: navigator.language,
  })
  contextBridge.exposeInMainWorld('cliente', apiCliente)
} catch (error) {
  console.error(error)
}
