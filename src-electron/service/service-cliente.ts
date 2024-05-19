import { ipcMain } from 'electron'
import {
  BuscarClientePorId,
  BuscarTodosClientes,
  CriarCliente,
  EditarCliente,
  RemoverCliente,
} from '../api'
import {
  buscarClientePorId,
  buscarTodosClientes,
  editarCliente,
  removerCliente,
  salvarCliente,
} from '../repository/repositorio-cliente'

export function serviceCliente() {
  ipcMain.handle('criarCliente', (_, ...args: Parameters<CriarCliente>) =>
    salvarCliente(...args)
  )
  ipcMain.handle('removerCliente', (_, ...args: Parameters<RemoverCliente>) =>
    removerCliente(...args)
  )
  ipcMain.handle('editarCliente', (_, ...args: Parameters<EditarCliente>) =>
    editarCliente(...args)
  )
  ipcMain.handle(
    'buscarClientePorId',
    (_, ...args: Parameters<BuscarClientePorId>) => buscarClientePorId(...args)
  )
  ipcMain.handle(
    'buscarTodosClientes',
    (_, ...args: Parameters<BuscarTodosClientes>) =>
      buscarTodosClientes(...args)
  )
}
