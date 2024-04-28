import {queryOptions} from "@tanstack/react-query";
import {Conta} from "src/shared/models/Conta";

export const buscarContas = queryOptions({
  queryKey: ["contas"],
  queryFn: () => window.apiConta.buscarTodasContas(),
});

export const buscarContaPorId = (contaId: number) =>
    queryOptions({
      queryKey: ["contas", {contaId}],
      queryFn: () => window.apiConta.buscarContaPorId(contaId),
    });

export const cadastrarContaApi = async (conta: Conta) =>
    await window.apiConta.criarConta(conta);

export const atualizarContaApi = async (conta: Conta) =>
    await window.apiConta.editarConta(conta);

export const removerContaApi = async (contaId: number) =>
    await window.apiConta.removerConta(contaId);