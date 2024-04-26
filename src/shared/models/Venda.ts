import {Cliente} from './Cliente';
import {Produto} from './Produto';
import {FormaPagamento} from "./enums/FormaPagamento";

export class Venda {
  id?: number;
  dataVenda: Date;
  valorTotal: number;
  produtos: Produto[];
  cliente: Cliente;
  formaPagamento: FormaPagamento;
  valorPago: number;
  troco: number;
  desconto: number;
}