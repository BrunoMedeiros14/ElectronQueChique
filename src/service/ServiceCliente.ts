import { ipcMain } from 'electron';
import { buscarClientePorId, buscarTodosClientes, criarCliente, editarCliente, removerCliente } from '../repository/RepositorioCliente';
import { BuscarClientePorId, BuscarTodosClientes, CriarCliente, EditarCliente, RemoverCliente } from '../shared/Api';

export function serviceCliente() {
  ipcMain.handle("criarCliente", (_, ...args: Parameters<CriarCliente>) => criarCliente(...args))
  ipcMain.handle("removerCliente", (_, ...args: Parameters<RemoverCliente>) => removerCliente(...args))
  ipcMain.handle("editarCliente", (_, ...args: Parameters<EditarCliente>) => editarCliente(...args))
  ipcMain.handle("buscarClientePorId", (_, ...args: Parameters<BuscarClientePorId>) => buscarClientePorId(...args))
  ipcMain.handle("buscarTodosClientes", (_, ...args: Parameters<BuscarTodosClientes>) => buscarTodosClientes(...args))
}

