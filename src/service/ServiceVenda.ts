import {ipcMain} from 'electron';
import {
  buscarTodasVendas,
  buscarVendaPorId,
  criarVenda,
  editarVenda,
  removerVenda
} from '../repository/RepositorioVenda';
import {
  BuscarTodasVendas,
  BuscarVendaPorId,
  CriarVenda,
  EditarVenda,
  RemoverVenda
} from '../shared/Api';

ipcMain.handle("criarVenda", (_, ...args: Parameters<CriarVenda>) => criarVenda(...args))

export function serviceVenda() {
  ipcMain.handle("removerVenda", (_, ...args: Parameters<RemoverVenda>) => removerVenda(...args))
  ipcMain.handle("editarVenda", (_, ...args: Parameters<EditarVenda>) => editarVenda(...args))
  ipcMain.handle("buscarVendaPorId", (_, ...args: Parameters<BuscarVendaPorId>) => buscarVendaPorId(...args))
  ipcMain.handle("buscarTodasVendas", (_, ...args: Parameters<BuscarTodasVendas>) => buscarTodasVendas(...args))
}