import {queryOptions} from "@tanstack/react-query";

export const buscarCaixas = queryOptions({
  queryKey: ["caixas"],
  queryFn: () => window.apiCaixa.buscarTodosCaixas(),
});

export const buscarCaixaPorId = (caixaId: number) =>
    queryOptions({
      queryKey: ["caixas", {caixaId}],
      queryFn: () => window.apiCaixa.buscarCaixaPorId(caixaId),
    });