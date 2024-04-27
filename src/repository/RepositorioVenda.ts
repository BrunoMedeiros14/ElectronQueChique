import VendaModel from '../models/Venda';
import {
  BuscarTodasVendas,
  BuscarVendaPorId,
  CriarVenda,
  EditarVenda,
  RemoverVenda
} from '../shared/Api';

export const criarVenda: CriarVenda = async (venda) => {
  // @ts-ignore
  return (await VendaModel.create(venda)).dataValues;
};

export const removerVenda: RemoverVenda = async (vendaId) => {
  const deletedRows = await VendaModel.destroy({
    where: {id: vendaId},
  });
  return deletedRows;
};

export const editarVenda: EditarVenda = async (venda) => {
  await VendaModel.update(venda, {
    where: {id: venda.id},
  });
  return venda;
};

export const buscarVendaPorId: BuscarVendaPorId = async (vendaId: number) => {
  return (await VendaModel.findByPk(vendaId)).dataValues;
};

export const buscarTodasVendas: BuscarTodasVendas = async () => {
  const vendas = await VendaModel.findAll();
  return vendas.map(v => v.dataValues);
};