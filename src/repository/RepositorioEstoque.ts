import { BuscarEstoquePorId, BuscarTodosEstoques, CriarEstoque, EditarEstoque, RemoverEstoque } from 'src/shared/Api';
import EstoqueModel from '../models/Estoque';

export const criarEstoque: CriarEstoque = async (estoque) => {
  return (await EstoqueModel.create(estoque)).dataValues;
};

export const removerEstoque: RemoverEstoque = async (estoqueId) => {
  const deletedRows = await EstoqueModel.destroy({
    where: { id: estoqueId },
  });
  return deletedRows;
};

export const editarEstoque: EditarEstoque = async (estoque) => {
  await EstoqueModel.update(estoque, {
    where: { id: estoque.id },
  });
  return estoque;
};

export const buscarEstoquePorId: BuscarEstoquePorId = async (estoqueId: number) => {
  return (await EstoqueModel.findByPk(estoqueId)).dataValues;
};

export const buscarTodosEstoques: BuscarTodosEstoques = async () => {
  const estoques = await EstoqueModel.findAll();
  return estoques.map(p => p.dataValues);
};