// import { DataTypes, Model } from 'sequelize';
// import { connection } from '../config/BancoDeDados';
// import {
//   BuscarCaixaPorId,
//   BuscarTodosCaixas,
//   CriarCaixa,
//   EditarCaixa,
//   RemoverCaixa
// } from "../shared/Api";

// export const criarCaixa: CriarCaixa = async (caixa) => {
//   const {descricao, saldoInicial, saldoFinal, dataAbertura} = caixa;
//   return await CaixaModel.create({descricao, saldoInicial, saldoFinal, dataAbertura});
// };

// export const removerCaixa: RemoverCaixa = async (caixaId) => {
//   return await CaixaModel.destroy({
//     where: {id: caixaId},
//   });
// };

// export const editarCaixa: EditarCaixa = async (caixa) => {
//   const {id, descricao, saldoInicial, saldoFinal, dataAbertura} = caixa;
//   await CaixaModel.update({descricao, saldoInicial, saldoFinal, dataAbertura}, {
//     where: {id},
//   });
//   return caixa;
// };

// export const buscarCaixaPorId: BuscarCaixaPorId = async (caixaId: number) => {
//   return await CaixaModel.findByPk(caixaId);
// };

// export const buscarTodosCaixas: BuscarTodosCaixas = async () => {
//   return await CaixaModel.findAll();
// };

// export default CaixaModel;