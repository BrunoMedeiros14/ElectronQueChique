import {Cliente} from './Cliente';
import {Estoque} from './Estoque';
import {FormaPagamento} from "./enums/FormaPagamento";

export class Venda {
  id?: number;
  dataVenda: Date;
  valorTotal: number;
  estoque: Estoque[];
  cliente: Cliente;
  formaPagamento: FormaPagamento;
  valorPago: number;
  troco: number;
  desconto: number;
}