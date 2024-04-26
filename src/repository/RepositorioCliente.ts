import ClienteModel from '../models/Cliente';
import {
  BuscarClientePorId,
  BuscarTodosClientes,
  CriarCliente,
  EditarCliente,
  RemoverCliente
} from '../shared/Api';

export const criarCliente: CriarCliente = async (cliente) => {
  return (await ClienteModel.create(cliente)).dataValues;
};

export const removerCliente: RemoverCliente = async (clienteId) => {
  const deletedRows = await ClienteModel.destroy({
    where: { id: clienteId },
  });
  return deletedRows;
};

export const editarCliente: EditarCliente = async (cliente) => {
  await ClienteModel.update(cliente, {
    where: { id: cliente.id },
  });
  return cliente;
};

export const buscarClientePorId: BuscarClientePorId = async (clienteId: number) => {
  return (await ClienteModel.findByPk(clienteId)).dataValues;
};

export const buscarTodosClientes: BuscarTodosClientes = async () => {
  const clientes = await ClienteModel.findAll();
  return clientes.map(c => c.dataValues);
};
