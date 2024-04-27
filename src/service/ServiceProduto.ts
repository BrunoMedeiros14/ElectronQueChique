import {ipcMain} from 'electron';
import {
  buscarProdutoPorId,
  buscarTodosProdutos,
  criarProduto,
  editarProduto,
  removerProduto
} from '../repository/RepositorioProduto';
import {
  BuscarProdutoPorId,
  BuscarTodosProdutos,
  CriarProduto,
  EditarProduto,
  RemoverProduto
} from '../shared/Api';

export function serviceProduto() {
  ipcMain.handle("criarProduto", (_, ...args: Parameters<CriarProduto>) => criarProduto(...args))
  ipcMain.handle("removerProduto", (_, ...args: Parameters<RemoverProduto>) => removerProduto(...args))
  ipcMain.handle("editarProduto", (_, ...args: Parameters<EditarProduto>) => editarProduto(...args))
  ipcMain.handle("buscarProdutoPorId", (_, ...args: Parameters<BuscarProdutoPorId>) => buscarProdutoPorId(...args))
  ipcMain.handle("buscarTodosProdutos", (_, ...args: Parameters<BuscarTodosProdutos>) => buscarTodosProdutos(...args))
}