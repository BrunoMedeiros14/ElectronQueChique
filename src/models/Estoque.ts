import {DataTypes, Model} from "sequelize";
import {connection} from "../config/BancoDeDados";
import {Cor} from "../shared/models/enums/Cor";
import {Tecido} from "../shared/models/enums/Tecido";

class EstoqueModel extends Model {
  public id: number;
  public nome: string;
  public descricao: string;
  public cor: Cor;
  public tamanho: string;
  public vendido: boolean;
  public tecido: Tecido;
  public fornecedor: string;
  public quantidade: number;
  public valorCompra: number;
  public valorVenda: number;
}

EstoqueModel.init(
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
      cor: {
        type: DataTypes.ENUM,
        values: Object.values(Cor),
        allowNull: false,
        defaultValue: Cor.Outro,
      },
      tamanho: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Único',
      },
      vendido: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      tecido: {
        type: DataTypes.ENUM,
        values: Object.values(Tecido),
        allowNull: false,
        defaultValue: Tecido.Outro,
      },
      fornecedor: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      quantidade: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      valorCompra: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      valorVenda: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
    },
    {
      sequelize: connection,
      modelName: 'Estoque',
    }
)

export default EstoqueModel;