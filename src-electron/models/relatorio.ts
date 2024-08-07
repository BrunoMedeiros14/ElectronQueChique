import { Caixa } from './caixa'
import { Cliente } from './cliente'
import { Conta } from './conta'
import { Estoque } from './estoque'

export type ContaParaRelatorio = Omit<Conta, 'valor' | 'pago' | 'dataVencimento' | 'dataPagamento'> & {
  valor: string
  pago: string
  dataVencimento: string
  dataPagamento: string
}

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
  dataVenda: string
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
