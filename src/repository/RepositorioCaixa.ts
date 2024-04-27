import CaixaModel from '../models/Caixa';
import {
  BuscarCaixaPorId,
  BuscarTodosCaixas,
  CriarCaixa,
  EditarCaixa,
  RemoverCaixa
} from '../shared/Api';

export const criarCaixa: CriarCaixa = async (caixa) => {
  // @ts-ignore
  return (await CaixaModel.create(caixa)).dataValues;
};

export const removerCaixa: RemoverCaixa = async (caixaId) => {
  const deletedRows = await CaixaModel.destroy({
    where: {id: caixaId},
  });
  return deletedRows;
};

export const editarCaixa: EditarCaixa = async (caixa) => {
  await CaixaModel.update(caixa, {
    where: {id: caixa.id},
  });
  return caixa;
};

export const buscarCaixaPorId: BuscarCaixaPorId = async (caixaId: number) => {
  return (await CaixaModel.findByPk(caixaId)).dataValues;
};

export const buscarTodosCaixas: BuscarTodosCaixas = async () => {
  const caixas = await CaixaModel.findAll();
  return caixas.map(c => c.dataValues);
};