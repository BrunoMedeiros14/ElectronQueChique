import {DataTypes, Model} from "sequelize";
import {connection} from "../config/BancoDeDados";
import {Venda} from "../shared/models/Venda";
import {Conta} from "../shared/models/Conta";

class CaixaModel extends Model {
  public id: number;
  public dataHoraAbertura: Date;
  public dataHoraFechamento: Date;
  public valorInicial: number;
  public vendas: Venda[];
  public contas: Conta[];
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
      valorInicial: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
    },
    {
      sequelize: connection,
      modelName: 'Caixa',
    }
)

export default CaixaModel