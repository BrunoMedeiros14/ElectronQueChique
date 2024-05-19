import { queryOptions } from '@tanstack/react-query'
import { Cliente } from '../../src-electron/models/Cliente'

export const buscarClientes = queryOptions({
  queryKey: ['clientes'],
  queryFn: () => window.apiCliente.buscarTodosClientes(),
})

export const buscarTodosClientes = async () => await window.apiCliente.buscarTodosClientes()

export const buscarClientePorId = async (clienteId: number) => await window.apiCliente.buscarClientePorId(clienteId)

export const cadastrarClienteApi = async (cliente: Cliente) => await window.apiCliente.criarCliente(cliente)

export const atualizarClienteApi = async (cliente: Cliente) => await window.apiCliente.editarCliente(cliente)

export const removerClienteApi = async (clienteId: number) => await window.apiCliente.removerCliente(clienteId)
