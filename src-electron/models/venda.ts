import { Cliente } from './cliente'
import { Estoque } from './estoque'
import { FormaPagamento } from './enums/forma-pagamento'

export type Venda = {
  id?: number
  dataVenda: Date
  valorTotal: number
  estoque: Estoque[]
  cliente?: Cliente
  formaPagamento: FormaPagamento
  valorPago: number
  troco: number
  desconto: number
}

export type VendaRelatorio = {
  id?: number
  dataVenda: Date
  valorTotal: number
  estoque: string
  cliente?: string
  formaPagamento: FormaPagamento
  valorPago: number
  troco: number
  desconto: number
}
