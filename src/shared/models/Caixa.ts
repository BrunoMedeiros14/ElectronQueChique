import {Venda} from './Venda';
import {Conta} from './Conta';

export class Caixa {
  id?: number;
  ativo: boolean;
  dataHoraAbertura: Date;
  dataHoraFechamento: Date;
  valorInicial: number;
  vendas: Venda[];
  contas: Conta[];
}