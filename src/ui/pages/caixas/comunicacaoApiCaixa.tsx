import {queryOptions} from "@tanstack/react-query";
import {Caixa} from "src/shared/models/Caixa";
import Venda from "../../../models/Venda";

export const buscarCaixas = queryOptions({
  queryKey: ["caixas"],
  queryFn: () => window.apiCaixa.buscarTodosCaixas(),
});

export const buscarVendas = queryOptions({
  queryKey: ["vendas"],
  queryFn: () => window.apiVenda.buscarTodasVendas(),
});

export const buscarCaixaPorId = (caixaId: number) =>
    queryOptions({
      queryKey: ["caixas", {caixaId}],
      queryFn: () => window.apiCaixa.buscarCaixaPorId(caixaId),
    });

export const buscarVendaPorId = (vendaId: number) =>
    queryOptions({
      queryKey: ["vendas", {vendaId}],
      queryFn: () => window.apiVenda.buscarVendaPorId(vendaId),
    });

export const cadastrarCaixaApi = async (caixa: Caixa) =>
    await window.apiCaixa.criarCaixa(caixa);

export const cadastrarVendaApi = async (venda: Venda) =>
    await window.apiVenda.criarVenda(venda);

export const atualizarCaixaApi = async (caixa: Caixa) =>
    await window.apiCaixa.editarCaixa(caixa);

export const atualizarVendaApi = async (venda: Venda) =>
    await window.apiVenda.editarVenda(venda);

export const removerCaixaApi = async (caixaId: number) =>
    await window.apiCaixa.removerCaixa(caixaId);

export const removerVendaApi = async (vendaId: number) =>
    await window.apiVenda.removerVenda(vendaId);