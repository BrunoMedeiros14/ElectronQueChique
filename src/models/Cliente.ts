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
      allowNull: true,
    },
    endereco: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    telefone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: false,
    },
  },
  {
    sequelize: connection,
    modelName: 'Cliente',
  }
)

export default ClienteModel