import ContaModel from '../models/Conta';
import {
  BuscarContaPorId,
  BuscarTodasContas,
  CriarConta,
  EditarConta,
  RemoverConta
} from '../shared/Api';

export const criarConta: CriarConta = async (conta) => {
  return (await ContaModel.create(conta)).dataValues;
};

export const removerConta: RemoverConta = async (contaId) => {
  const deletedRows = await ContaModel.destroy({
    where: { id: contaId },
  });
  return deletedRows;
};

export const editarConta: EditarConta = async (conta) => {
  await ContaModel.update(conta, {
    where: { id: conta.id },
  });
  return conta;
};

export const buscarContaPorId: BuscarContaPorId = async (contaId: number) => {
  return (await ContaModel.findByPk(contaId)).dataValues;
};

export const buscarTodasContas: BuscarTodasContas = async () => {
  const contas = await ContaModel.findAll();
  return contas.map(c => c.dataValues);
};