import { queryOptions } from '@tanstack/react-query'
import { Conta } from '../../src-electron/models/conta'

export const buscarContas = queryOptions({
  queryKey: ['contas'],
  queryFn: () => window.apiConta.buscarTodasContas(),
})

export const buscarContaPorId = async (contaId: number) => await window.apiConta.buscarContaPorId(contaId)

export const cadastrarContaApi = async (conta: Conta) => await window.apiConta.criarConta(conta)

export const atualizarContaApi = async (conta: Conta) => await window.apiConta.editarConta(conta)

export const removerContaApi = async (contaId: number) => await window.apiConta.removerConta(contaId)

export const buscarContasNaoPagas = async () => await window.apiConta.buscarContasNaoPagas()

export const criarContaPagaNoCaixa = async (conta: Conta) => await window.apiConta.criarContaPagaNoCaixa(conta)

export const pagarContaNoCaixa = async (conta: Conta) => await window.apiConta.pagarContaNoCaixa(conta)
