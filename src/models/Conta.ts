import {DataTypes, Model} from "sequelize";
import {connection} from "../config/BancoDeDados";

class ContaModel extends Model {
  public id: number;
  public nome: string;
  public valor: number;
  public descricao: string;
  public dataVencimento: Date;
  public dataPagamento: Date;
  public pago: boolean;
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
      valor: {
        type: DataTypes.NUMBER,
        allowNull: false,
        defaultValue: 0.00,
      },
      descricao: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      dataVencimento: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      dataPagamento: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      pago: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize: connection,
      modelName: 'Conta',
    }
)

export default ContaModel;