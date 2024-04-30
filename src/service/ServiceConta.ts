import { ipcMain } from 'electron';
import {
  buscarContaPorId,
  buscarTodasContas,
  criarConta,
  editarConta,
  removerConta
} from '../repository/RepositorioConta';
import {
  BuscarContaPorId,
  BuscarTodasContas,
  CriarConta,
  EditarConta,
  RemoverConta
} from '../shared/Api';

export function serviceConta() {
  ipcMain.handle("criarConta", (_, ...args: Parameters<CriarConta>) => criarConta(...args))
  ipcMain.handle("removerConta", (_, ...args: Parameters<RemoverConta>) => removerConta(...args))
  ipcMain.handle("editarConta", (_, ...args: Parameters<EditarConta>) => editarConta(...args))
  ipcMain.handle("buscarContaPorId", (_, ...args: Parameters<BuscarContaPorId>) => buscarContaPorId(...args))
  ipcMain.handle("buscarTodasContas", (_, ...args: Parameters<BuscarTodasContas>) => buscarTodasContas(...args))
}