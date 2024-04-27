import {DataTypes, Model} from "sequelize";
import {connection} from "../config/BancoDeDados";
import {Venda} from "../shared/models/Venda";
import {Conta} from "../shared/models/Conta";

class CaixaModel extends Model {
  public id: number;
  public dataHoraAbertura: Date;
  public dataHoraFechamento: Date;
  public vendas: Venda[];
  public valorTotalVendas: number;
  public contas: Conta[];
  public valoresSaidos: number;
  public valorTotalCartao: number;
  public valorTotalDinheiro: number;
}

CaixaModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      dataHoraAbertura: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      dataHoraFechamento: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      valorTotalVendas: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      valoresSaidos: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      valorTotalCartao: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      valorTotalDinheiro: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      sequelize: connection,
      modelName: 'Caixa',
    }
)

export default CaixaModel