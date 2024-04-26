import {DataTypes, Model} from 'sequelize';
import {sequelize} from '../config/BancoDeDados';
import {
  BuscarCaixaPorId,
  BuscarTodosCaixas,
  CriarCaixa,
  EditarCaixa,
  RemoverCaixa
} from "../shared/Api";

class CaixaModel extends Model {
  public id!: number;
  public descricao!: string;
  public saldoInicial!: number;
  public saldoFinal!: number;
  public dataAbertura!: Date;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

CaixaModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      descricao: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      saldoInicial: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      saldoFinal: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      dataAbertura: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Caixa',
    }
);

export const criarCaixa: CriarCaixa = async (caixa) => {
  const {descricao, saldoInicial, saldoFinal, dataAbertura} = caixa;
  return await CaixaModel.create({descricao, saldoInicial, saldoFinal, dataAbertura});
};

export const removerCaixa: RemoverCaixa = async (caixaId) => {
  return await CaixaModel.destroy({
    where: {id: caixaId},
  });
};

export const editarCaixa: EditarCaixa = async (caixa) => {
  const {id, descricao, saldoInicial, saldoFinal, dataAbertura} = caixa;
  await CaixaModel.update({descricao, saldoInicial, saldoFinal, dataAbertura}, {
    where: {id},
  });
  return caixa;
};

export const buscarCaixaPorId: BuscarCaixaPorId = async (caixaId: number) => {
  return await CaixaModel.findByPk(caixaId);
};

export const buscarTodosCaixas: BuscarTodosCaixas = async () => {
  return await CaixaModel.findAll();
};

export default CaixaModel;