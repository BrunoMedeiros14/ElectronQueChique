import { ipcMain } from 'electron'
import {
  BuscarCaixaPorId,
  BuscarTodosCaixas,
  CriarCaixa,
  EditarCaixa,
  RemoverCaixa,
} from '../Api'
import {
  buscarCaixaPorId,
  buscarTodosCaixas,
  criarCaixa,
  editarCaixa,
  removerCaixa,
} from '../repository/RepositorioCaixa'

export function serviceCaixa() {
  ipcMain.handle('criarCaixa', (_, ...args: Parameters<CriarCaixa>) =>
    criarCaixa(...args)
  )
  ipcMain.handle('removerCaixa', (_, ...args: Parameters<RemoverCaixa>) =>
    removerCaixa(...args)
  )
  ipcMain.handle('editarCaixa', (_, ...args: Parameters<EditarCaixa>) =>
    editarCaixa(...args)
  )
  ipcMain.handle(
    'buscarCaixaPorId',
    (_, ...args: Parameters<BuscarCaixaPorId>) => buscarCaixaPorId(...args)
  )
  ipcMain.handle(
    'buscarTodosCaixas',
    (_, ...args: Parameters<BuscarTodosCaixas>) => buscarTodosCaixas(...args)
  )
}
