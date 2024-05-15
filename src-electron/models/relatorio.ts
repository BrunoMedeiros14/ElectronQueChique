import { Caixa } from './Caixa'
import { Cliente } from './Cliente'
import { Conta } from './Conta'
import { Estoque } from './Estoque'
import { VendaRelatorio } from './Venda'

export type RelatorioType = {
  caixasData: Caixa[]
  vendasData: VendaRelatorio[]
  estoquesData: Estoque[]
  contasData: Conta[]
  clientesData: Cliente[]
}
