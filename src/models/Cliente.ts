import { DataTypes, Model } from "sequelize";
import { connection } from "../config/BancoDeDados";

class ClienteModel extends Model {
  public id: number;
  public nome: string;
  public dataNascimento: Date;
  public endereco: string;
  public telefone: string;
  public email: string;
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
    sequelize: connection,
    modelName: 'Cliente',
  }
)

export default ClienteModel