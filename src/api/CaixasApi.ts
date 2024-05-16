import { queryOptions } from '@tanstack/react-query'
import { Caixa } from '../../src-electron/models/Caixa'

export const buscarCaixaAtivo = async () => await window.apiCaixa.buscarCaixaAtivo()

export const buscarCaixaPorId = async (caixaId: number) => await window.apiCaixa.buscarCaixaPorId(caixaId)

export const atualizarCaixaApi = async (caixa: Caixa) => await window.apiCaixa.editarCaixa(caixa)

export const cadastrarCaixaApi = async (caixa: Caixa) => await window.apiCaixa.criarCaixa(caixa)

export const removerCaixaApi = async (caixaId: number) => await window.apiCaixa.removerCaixa(caixaId)

export const caixaAtivoQueryOptions = queryOptions({
  queryKey: ['caixa'],
  queryFn: () => buscarCaixaAtivo(),
})
