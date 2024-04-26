import {Venda} from './Venda';
import {Conta} from './Conta';

export class Caixa {
  id?: number;
  dataHoraAbertura: Date;
  dataHoraFechamento: Date;
  vendas: Venda[];
  valorTotalVendas: number;
  contas: Conta[];
  valoresSaidos: number;
  valorTotalCartao: number;
  valorTotalDinheiro: number;
}