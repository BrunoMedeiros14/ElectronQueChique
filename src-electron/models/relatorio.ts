import { Caixa } from './Caixa'
import { Cliente } from './Cliente'
import { Conta } from './Conta'
import { Estoque } from './Estoque'

export type ContaParaRelatorio = Omit<Conta, 'valor' | 'pago'> & { valor: string; pago: string }
export type CaixaParaRelatorio = Omit<Caixa, 'vendas' | 'contas' | 'valorInicial' | 'ativo'> & {
  valorInicial: string
  ativo: string
}

export type EstoqueParaRelarorio = Omit<Estoque, 'vendido' | 'valorCompra' | 'valorVenda'> & {
  vendido: string
  valorCompra: string
  valorVenda: string
}

export type VendaParaRelatorio = {
  id: number
  cliente: string
  dataVenda: Date
  formaPagamento: string
  valorTotal: string
  valorPago: string
  troco: string
  desconto: string
}

export type RelatorioType = {
  caixasData: CaixaParaRelatorio[]
  vendasData: VendaParaRelatorio[]
  estoquesData: EstoqueParaRelarorio[]
  contasData: ContaParaRelatorio[]
  clientesData: Cliente[]
}
