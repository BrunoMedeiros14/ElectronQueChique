import { queryOptions } from "@tanstack/react-query";
import { Estoque } from "src/shared/models/Estoque";

export const buscarEstoques = queryOptions({
  queryKey: ["estoques"],
  queryFn: () => window.apiEstoque.buscarTodosEstoques(),
});

export const buscarEstoquePorId = async (estoqueId: number) =>
  await window.apiEstoque.buscarEstoquePorId(estoqueId)

export const atualizarEstoqueApi = async (estoque: Estoque) =>
  await window.apiEstoque.editarEstoque(estoque);

export const cadastrarEstoqueApi = async (estoque: Estoque) =>
  await window.apiEstoque.criarEstoque(estoque);

export const removerEstoqueApi = async (estoqueId: number) =>
  await window.apiEstoque.removerEstoque(estoqueId);
