import { queryOptions } from "@tanstack/react-query";

export const buscarClientes = queryOptions({
  queryKey: ["clientes"],
  queryFn: () => window.apiCliente.buscarTodosClientes(),
});

export const buscarClientePorId = (clienteId: number) =>
  queryOptions({
    queryKey: ["clientes", { clienteId }],
    queryFn: () => window.apiCliente.buscarClientePorId(clienteId),
  });
