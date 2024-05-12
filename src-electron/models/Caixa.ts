import { Conta } from './Conta'
import { Venda } from './Venda'

export type Caixa = {
  id?: number
  ativo: boolean
  dataHoraAbertura: Date
  dataHoraFechamento: Date
  valorInicial: number
  vendas: Venda[]
  contas: Conta[]
}
