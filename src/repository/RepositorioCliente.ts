import {DataTypes, Model} from 'sequelize';
import {sequelize} from '../config/BancoDeDados';
import {
  BuscarClientePorId,
  BuscarTodosClientes,
  CriarCliente,
  EditarCliente,
  RemoverCliente
} from '../shared/Api';

class ClienteModel extends Model {
  public id!: number;
  public nome!: string;
  public dataNascimento!: Date;
  public endereco!: string;
  public telefone!: string;
  public email!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ClienteModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nome: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      dataNascimento: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      endereco: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      telefone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      sequelize,
      modelName: 'Cliente',
    }
);

export const criarCliente: CriarCliente = async (cliente) => {
  return await ClienteModel.create(cliente);
};

export const removerCliente: RemoverCliente = async (clienteId) => {
  const deletedRows = await ClienteModel.destroy({
    where: {id: clienteId},
  });
  return deletedRows;
};

export const editarCliente: EditarCliente = async (cliente) => {
  await ClienteModel.update(cliente, {
    where: {id: cliente.id},
  });
  return cliente;
};

export const buscarClientePorId: BuscarClientePorId = async (clienteId: number) => {
  return await ClienteModel.findByPk(clienteId);
};

export const buscarTodosClientes: BuscarTodosClientes = async () => {
  return await ClienteModel.findAll();
};
