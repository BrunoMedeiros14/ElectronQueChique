import { queryOptions } from "@tanstack/react-query";
import { Cliente } from "src/shared/models/Cliente";

export const buscarClientes = queryOptions({
  queryKey: ["clientes"],
  queryFn: () => window.apiCliente.buscarTodosClientes(),
});

export const buscarClientePorId = (clienteId: number) =>
  queryOptions({
    queryKey: ["clientes", { clienteId }],
    queryFn: () => window.apiCliente.buscarClientePorId(clienteId),
  });

export const cadastrarClienteApi = async (cliente: Cliente) => 
  await window.apiCliente.criarCliente(cliente);

export const removerClienteApi = async (clienteId: number) => 
  await window.apiCliente.removerCliente(clienteId);