import { queryOptions } from "@tanstack/react-query";
import { Cliente } from "src/shared/models/Cliente";
import { Estoque } from "src/shared/models/Estoque";

export const buscarEstoques = queryOptions({
  queryKey: ["estoque"],
  queryFn: () => window.apiEstoque.buscarTodosEstoques(),
});


export const buscarClientePorId = async (clienteId: number) =>
  await window.apiCliente.buscarClientePorId(clienteId)

export const atualizarClienteApi = async (cliente: Cliente) =>
  await window.apiCliente.editarCliente(cliente);

export const cadastrarEstoqueApi = async (estoque: Estoque) =>
  await window.apiEstoque.criarEstoque(estoque);

export const removerEstoqueApi = async (estoqueId: number) =>
  await window.apiEstoque.removerEstoque(estoqueId);
