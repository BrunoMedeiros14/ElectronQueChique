import { ipcMain } from 'electron'
import { BuscarTodasVendas, BuscarVendaPorId, CriarVenda, EditarVenda, RemoverVenda } from '../Api'
import {
  buscarTodasVendas,
  buscarVendaPorId,
  buscarVendasPorCaixaId,
  criarVenda,
  editarVenda,
  removerVenda,
} from '../repository/RepositorioVenda'

ipcMain.handle('criarVenda', (_, ...args: Parameters<CriarVenda>) => criarVenda(...args))

export function serviceVenda() {
  ipcMain.handle('removerVenda', (_, ...args: Parameters<RemoverVenda>) => removerVenda(...args))
  ipcMain.handle('editarVenda', (_, ...args: Parameters<EditarVenda>) => editarVenda(...args))
  ipcMain.handle('buscarVendaPorId', (_, ...args: Parameters<BuscarVendaPorId>) => buscarVendaPorId(...args))
  ipcMain.handle('buscarTodasVendas', (_, ...args: Parameters<BuscarTodasVendas>) => buscarTodasVendas(...args))
  ipcMain.handle('buscarVendasPorCaixaId', (_, caixaId) => buscarVendasPorCaixaId(caixaId))
}
