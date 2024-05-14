import { queryOptions } from '@tanstack/react-query'
import { Caixa } from '../../src-electron/models/Caixa'
import { Venda } from '../../src-electron/models/Venda'

export const buscarVendas = queryOptions({
  queryKey: ['vendas'],
  queryFn: () => window.apiVenda.buscarTodasVendas(),
})

export const buscarVendaPorId = async (vendaId: number) => await window.apiVenda.buscarVendaPorId(vendaId)

export const atualizarVendaApi = async (venda: Venda) => await window.apiVenda.editarVenda(venda)

export const cadastrarVendaApi = async (venda: Venda) => await window.apiVenda.criarVenda(venda)

export const removerVendaApi = async (vendaId: number) => await window.apiVenda.removerVenda(vendaId)

export const buscarVendasPorCaixaId = async (caixa: Caixa) =>
  caixa ? await window.apiVenda.buscarVendasPorCaixaId(caixa.id) : []
