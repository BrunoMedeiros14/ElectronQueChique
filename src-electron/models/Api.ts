import { Caixa } from './Caixa'
import { Cliente } from './Cliente'
import { Conta } from './Conta'
import { Estoque } from './Estoque'
import { Venda } from './Venda'

export type CriarCliente = (cliente: Cliente) => Promise<Cliente>
export type RemoverCliente = (clienteId: number) => Promise<number>
export type EditarCliente = (cliente: Cliente) => Promise<Cliente>
export type BuscarClientePorId = (clienteId: number) => Promise<Cliente>
export type BuscarTodosClientes = () => Promise<Cliente[]>

export type CriarConta = (conta: Conta) => Promise<Conta>
export type RemoverConta = (contaId: number) => Promise<number>
export type EditarConta = (conta: Conta) => Promise<Conta>
export type BuscarContaPorId = (contaId: number) => Promise<Conta>
export type BuscarTodasContas = () => Promise<Conta[]>

export type CriarVenda = (venda: Venda) => Promise<Venda>
export type RemoverVenda = (vendaId: number) => Promise<number>
export type EditarVenda = (venda: Venda) => Promise<Venda>
export type BuscarVendaPorId = (vendaId: number) => Promise<Venda>
export type BuscarTodasVendas = () => Promise<Venda[]>
export type BuscarVendasPorCaixaId = (caixaId: number) => Promise<Venda[]>

export type CriarEstoque = (estoque: Estoque) => Promise<Estoque>
export type RemoverEstoque = (estoqueId: number) => Promise<number>
export type EditarEstoque = (estoque: Estoque) => Promise<Estoque>
export type BuscarEstoquePorId = (estoqueId: number) => Promise<Estoque>
export type BuscarEstoquesNaoVendidos = () => Promise<Estoque[]>
export type BuscarTodosEstoques = () => Promise<Estoque[]>

export type CriarCaixa = (caixa: Caixa) => Promise<Caixa>
export type RemoverCaixa = (caixaId: number) => Promise<number>
export type EditarCaixa = (caixa: Caixa) => Promise<Caixa>
export type BuscarCaixaPorId = (caixaId: number) => Promise<Caixa>
export type BuscarTodosCaixas = () => Promise<Caixa[]>
