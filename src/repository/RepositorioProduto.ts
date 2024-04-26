import {DataTypes, Model} from 'sequelize';
import {sequelize} from '../config/BancoDeDados';
import {
  BuscarProdutoPorId,
  BuscarTodosProdutos,
  CriarProduto,
  EditarProduto,
  RemoverProduto
} from "../shared/Api";

class ProdutoModel extends Model {
  public id!: number;
  public nome!: string;
  public descricao!: string;
  public preco!: number;
  public quantidadeEmEstoque!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ProdutoModel.init(
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
      preco: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      quantidadeEmEstoque: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Produto',
    }
);

export const criarProduto: CriarProduto = async (produto) => {
  const {nome, descricao, preco, quantidadeEmEstoque} = produto;
  return await ProdutoModel.create({nome, descricao, preco, quantidadeEmEstoque});
};

export const removerProduto: RemoverProduto = async (produtoId) => {
  return await ProdutoModel.destroy({
    where: {id: produtoId},
  });
};

export const editarProduto: EditarProduto = async (produto) => {
  const {id, nome, descricao, preco, quantidadeEmEstoque} = produto;
  await ProdutoModel.update({nome, descricao, preco, quantidadeEmEstoque}, {
    where: {id},
  });
  return produto;
};

export const buscarProdutoPorId: BuscarProdutoPorId = async (produtoId: number) => {
  return await ProdutoModel.findByPk(produtoId);
};

export const buscarTodosProdutos: BuscarTodosProdutos = async () => {
  return await ProdutoModel.findAll();
};

export default ProdutoModel;