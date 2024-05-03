import {DataTypes, Model} from "sequelize";
import {connection} from "../config/BancoDeDados";
import {FormaPagamento} from "../shared/models/enums/FormaPagamento";
import Estoque from "./Estoque";
import Cliente from "./Cliente";

class VendaModel extends Model {
  public id: number;
  public dataVenda: Date;
  public valorTotal: number;
  public estoque: Estoque[];
  public cliente: Cliente;
  public formaPagamento: FormaPagamento;
  public valorPago: number;
  public troco: number;
  public desconto: number;
}
VendaModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      dataVenda: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      valorTotal: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      formaPagamento: {
        type: DataTypes.ENUM,
        values: Object.values(FormaPagamento),
        allowNull: false,
        defaultValue: FormaPagamento.Dinheiro,
      },
      valorPago: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      troco: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      desconto: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      estoque: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: true,
      },
      cliente: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize: connection,
      modelName: 'Venda',
    }
)

export default VendaModel;