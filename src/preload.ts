import { contextBridge, ipcRenderer } from 'electron'
import { BuscarClientePorId, BuscarTodosClientes, CriarCliente, EditarCliente, RemoverCliente } from './shared/Api'

if (!process.contextIsolated) {
  throw new Error('contextIsolation must be enabled in the BrowserWindow')
}

try {
  contextBridge.exposeInMainWorld('context', {
    locale: navigator.language,
  })
  contextBridge.exposeInMainWorld('cliente', {
    criarCliente: (...args: Parameters<CriarCliente>) => ipcRenderer.invoke('getNotes', ...args),
    removerCliente: (...args: Parameters<RemoverCliente>) => ipcRenderer.invoke('getNotes', ...args),
    editarCliente: (...args: Parameters<EditarCliente>) => ipcRenderer.invoke('getNotes', ...args),
    buscarClientePorId: (...args: Parameters<BuscarClientePorId>) => ipcRenderer.invoke('getNotes', ...args),
    buscarTodosClientes: (...args: Parameters<BuscarTodosClientes>) => ipcRenderer.invoke('getNotes', ...args)
  })
} catch (error) {
  console.error(error)
}
