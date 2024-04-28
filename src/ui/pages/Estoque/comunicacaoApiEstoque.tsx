import {queryOptions} from "@tanstack/react-query";

export const buscarEstoque = queryOptions({
  queryKey: ["estoque"],
  queryFn: () => window.apiEstoque.buscarTodosEstoques(),
});

export const buscarEstoquePorId = (estoqueId: number) =>
    queryOptions({
      queryKey: ["estoque", {estoqueId}],
      queryFn: () => window.apiEstoque.buscarEstoquePorId(estoqueId),
    });