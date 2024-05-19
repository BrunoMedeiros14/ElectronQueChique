import { ipcMain } from 'electron'
import { BuscarContaPorId, BuscarTodasContas, CriarConta, EditarConta, RemoverConta } from '../api'
import { Conta } from '../models/conta'
import {
  buscarContaPorId,
  buscarContasNaoPagas,
  buscarTodasContas,
  criarConta,
  criarContaPagaNoCaixa,
  editarConta,
  pagarContaNoCaixa,
  removerConta,
} from '../repository/repositorio-conta'

export function serviceConta() {
  ipcMain.handle('criarConta', (_, ...args: Parameters<CriarConta>) => criarConta(...args))
  ipcMain.handle('removerConta', (_, ...args: Parameters<RemoverConta>) => removerConta(...args))
  ipcMain.handle('editarConta', (_, ...args: Parameters<EditarConta>) => editarConta(...args))
  ipcMain.handle('buscarContaPorId', (_, ...args: Parameters<BuscarContaPorId>) => buscarContaPorId(...args))
  ipcMain.handle('buscarTodasContas', (_, ...args: Parameters<BuscarTodasContas>) => buscarTodasContas(...args))
  ipcMain.handle('buscarContasNaoPagas', (_, ...args: Parameters<BuscarTodasContas>) => buscarContasNaoPagas(...args))
  ipcMain.handle('criarContaPagaNoCaixa', (_, conta: Conta) => criarContaPagaNoCaixa(conta))
  ipcMain.handle('pagarContaNoCaixa', (_, conta: Conta) => pagarContaNoCaixa(conta))
}
