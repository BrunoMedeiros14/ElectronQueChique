import { Conta } from './conta'
import { Venda } from './venda'

export type Caixa = {
  id?: number
  ativo: boolean
  dataHoraAbertura: Date
  dataHoraFechamento: Date
  valorInicial: number
  vendas: Venda[]
  contas: Conta[]
}
