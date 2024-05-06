import {queryOptions} from "@tanstack/react-query";
import {Caixa} from "src/shared/models/Caixa";

export const buscarCaixas = queryOptions({
  queryKey: ["caixas"],
  queryFn: () => window.apiCaixa.buscarTodosCaixas(),
});

export const buscarCaixaPorId = async (caixaId: number) =>
    await window.apiCaixa.buscarCaixaPorId(caixaId)

export const atualizarCaixaApi = async (caixa: Caixa) =>
    await window.apiCaixa.editarCaixa(caixa);

export const cadastrarCaixaApi = async (caixa: Caixa) =>
    await window.apiCaixa.criarCaixa(caixa);

export const removerCaixaApi = async (caixaId: number) =>
    await window.apiCaixa.removerCaixa(caixaId);
