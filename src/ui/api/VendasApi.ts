import {queryOptions} from "@tanstack/react-query";
import {Venda} from "src/shared/models/Venda";

export const buscarVendas = queryOptions({
  queryKey: ["vendas"],
  queryFn: () => window.apiVenda.buscarTodasVendas(),
});

export const buscarVendaPorId = async (vendaId: number) =>
    await window.apiVenda.buscarVendaPorId(vendaId)

export const atualizarVendaApi = async (venda: Venda) =>
    await window.apiVenda.editarVenda(venda);

export const cadastrarVendaApi = async (venda: Venda) =>
    await window.apiVenda.criarVenda(venda);

export const removerVendaApi = async (vendaId: number) =>
    await window.apiVenda.removerVenda(vendaId);
