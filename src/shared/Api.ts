import {Cliente} from "./models/Cliente";
import {Conta} from "./models/Conta";
import {Venda} from "./models/Venda";
import {Produto} from "./models/Produto";
import {Caixa} from "./models/Caixa";

export type CriarCliente = (cliente: Cliente) => Promise<Cliente>
export type RemoverCliente = (clienteId: number) => Promise<number>
export type EditarCliente = (cliente: Cliente) => Promise<Cliente>
export type BuscarClientePorId = (clienteId: number) => Promise<Cliente>
export type BuscarTodosClientes = () => Promise<Cliente[]>

export type CriarConta = (conta: Conta) => Promise<Conta>
export type RemoverConta = (contaId: number) => Promise<number>
export type EditarConta = (conta: Conta) => Promise<Conta>
export type BuscarContaPorId = (contaId: number) => Promise<Conta>
export type BuscarTodasContas = () => Promise<Conta[]>

export type CriarVenda = (venda: Venda) => Promise<Venda>
export type RemoverVenda = (vendaId: number) => Promise<number>
export type EditarVenda = (venda: Venda) => Promise<Venda>
export type BuscarVendaPorId = (vendaId: number) => Promise<Venda>
export type BuscarTodasVendas = () => Promise<Venda[]>

export type CriarProduto = (produto: Produto) => Promise<Produto>
export type RemoverProduto = (produtoId: number) => Promise<number>
export type EditarProduto = (produto: Produto) => Promise<Produto>
export type BuscarProdutoPorId = (produtoId: number) => Promise<Produto>
export type BuscarTodosProdutos = () => Promise<Produto[]>

export type CriarCaixa = (caixa: Caixa) => Promise<Caixa>
export type RemoverCaixa = (caixaId: number) => Promise<number>
export type EditarCaixa = (caixa: Caixa) => Promise<Caixa>
export type BuscarCaixaPorId = (caixaId: number) => Promise<Caixa>
export type BuscarTodosCaixas = () => Promise<Caixa[]>
