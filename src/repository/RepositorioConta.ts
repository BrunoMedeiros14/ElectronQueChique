import {DataTypes, Model} from 'sequelize';
import {sequelize} from '../config/BancoDeDados';
import {
  BuscarContaPorId,
  BuscarTodasContas,
  CriarConta,
  EditarConta,
  RemoverConta
} from "../shared/Api";

class ContaModel extends Model {
  public id!: number;
  public nome!: string;
  public descricao!: string;
  public dataVencimento!: Date;
  public dataPagamento!: Date;
  public pago!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ContaModel.init(
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
      descricao: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      dataVencimento: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      dataPagamento: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      pago: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Conta',
    }
);

export const criarConta: CriarConta = async (conta) => {
  const {nome, descricao, dataVencimento, dataPagamento, pago} = conta;
  return await ContaModel.create({nome, descricao, dataVencimento, dataPagamento, pago});
};

export const removerConta: RemoverConta = async (contaId) => {
  return await ContaModel.destroy({
    where: {id: contaId},
  });
};

export const editarConta: EditarConta = async (conta) => {
  await ContaModel.update(conta, {
    where: {id: conta.id},
  });
  return conta;
};

export const buscarContaPorId: BuscarContaPorId = async (contaId: number) => {
  return await ContaModel.findByPk(contaId);
};

export const buscarTodasContas: BuscarTodasContas = async () => {
  return await ContaModel.findAll();
};

export default ContaModel;