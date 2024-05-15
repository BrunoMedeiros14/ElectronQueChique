import { Caixa } from './Caixa'
import { Cliente } from './Cliente'
import { Conta } from './Conta'
import { Estoque } from './Estoque'
import { Venda } from './Venda'

export type RelatorioType = {
  caixasData: Caixa[]
  vendasData: Venda[]
  estoquesData: Estoque[]
  contasData: Conta[]
  clientesData: Cliente[]
}
