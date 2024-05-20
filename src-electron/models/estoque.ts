import { Cor } from './enums/cor'
import { Tecido } from './enums/tecido'

export type Estoque = {
  id?: number
  nome: string
  descricao: string
  cor: Cor
  tamanho: string
  vendido: boolean
  tecido: Tecido
  fornecedor: string
  valorCompra: number
  valorVenda: number
}
