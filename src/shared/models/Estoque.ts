import {Cor} from './enums/Cor';
import {Tecido} from './enums/Tecido';

export class Estoque {
  id?: number;
  nome: string;
  descricao: string;
  cor: Cor;
  tamanho: string;
  vendido: boolean;
  tecido: Tecido;
  fornecedor: string;
  quantidade: number;
  valorCompra: number;
  valorVenda: number;
}