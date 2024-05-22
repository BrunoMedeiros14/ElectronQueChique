import { ipcMain } from 'electron'
import { BuscarEstoquePorId, BuscarTodosEstoques, CriarEstoque, EditarEstoque, RemoverEstoque } from '../api'
import {
  buscarEstoquePorId,
  buscarEstoquesNaoVendidos,
  buscarTodosEstoques,
  criarEstoque,
  editarEstoque,
  removerEstoque,
} from '../repository/repositorio-estoque'

export function serviceEstoque() {
  ipcMain.handle('criarEstoque', (_, ...args: Parameters<CriarEstoque>) =>
    criarEstoque(...args),
  )

  ipcMain.handle('removerEstoque', (_, ...args: Parameters<RemoverEstoque>) =>
    removerEstoque(...args),
  )

  ipcMain.handle('editarEstoque', (_, ...args: Parameters<EditarEstoque>) =>
    editarEstoque(...args),
  )

  ipcMain.handle(
    'buscarEstoquePorId',
    (_, ...args: Parameters<BuscarEstoquePorId>) => buscarEstoquePorId(...args),
  )

  ipcMain.handle(
    'buscarTodosEstoques',
    (_, ...args: Parameters<BuscarTodosEstoques>) =>
      buscarTodosEstoques(...args),
  )

  ipcMain.handle(
    'buscarEstoquesNaoVendidos',
    (_, ...args: Parameters<BuscarTodosEstoques>) =>
      buscarEstoquesNaoVendidos(...args),
  )
}
