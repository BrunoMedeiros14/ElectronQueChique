import ProdutoModel from '../models/Produto';
import {
  BuscarProdutoPorId,
  BuscarTodosProdutos,
  CriarProduto,
  EditarProduto,
  RemoverProduto
} from '../shared/Api';

export const criarProduto: CriarProduto = async (produto) => {
  // @ts-ignore
  return (await ProdutoModel.create(produto)).dataValues;
};

export const removerProduto: RemoverProduto = async (produtoId) => {
  const deletedRows = await ProdutoModel.destroy({
    where: {id: produtoId},
  });
  return deletedRows;
};

export const editarProduto: EditarProduto = async (produto) => {
  await ProdutoModel.update(produto, {
    where: {id: produto.id},
  });
  return produto;
};

export const buscarProdutoPorId: BuscarProdutoPorId = async (produtoId: number) => {
  return (await ProdutoModel.findByPk(produtoId)).dataValues;
};

export const buscarTodosProdutos: BuscarTodosProdutos = async () => {
  const produtos = await ProdutoModel.findAll();
  return produtos.map(p => p.dataValues);
};