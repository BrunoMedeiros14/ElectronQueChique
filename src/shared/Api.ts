import { Cliente } from "./models/Cliente";

export type CriarCliente = (cliente: Cliente) => Promise<Cliente>
export type RemoverCliente = (clienteId: number) => Promise<number>
export type EditarCliente = (cliente: Cliente) => Promise<Cliente>
export type BuscarClientePorId = (clienteId: Cliente) => Promise<Cliente>
export type BuscarTodosClientes = () => Promise<Cliente[]>

// export type Api = {

// }