import {DataTypes, Model} from 'sequelize';
import {sequelize} from '../config/BancoDeDados';
import {
  BuscarTodasVendas,
  BuscarVendaPorId,
  CriarCliente,
  CriarVenda,
  EditarVenda,
  RemoverVenda
} from "../shared/Api";

class VendaModel extends Model {
  public id!: number;
  public produto!: string;
  public quantidade!: number;
  public preco!: number;
  public dataVenda!: Date;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

VendaModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      produto: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      quantidade: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      preco: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      dataVenda: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Venda',
    }
);

export const criarVenda: CriarVenda = async (venda) => {
  return await VendaModel.create(venda);
};

export const removerVenda: RemoverVenda = async (vendaId) => {
  return await VendaModel.destroy({
    where: {id: vendaId},
  });
};

export const editarVenda: EditarVenda = async (venda) => {
  const {id, produto, quantidade, preco, dataVenda} = venda;
  await VendaModel.update({produto, quantidade, preco, dataVenda}, {
    where: {id},
  });
  return venda;
};

export const buscarVendaPorId: BuscarVendaPorId = async (vendaId: number) => {
  return await VendaModel.findByPk(vendaId);
};

export const buscarTodasVendas: BuscarTodasVendas = async () => {
  return await VendaModel.findAll();
};

export default VendaModel;