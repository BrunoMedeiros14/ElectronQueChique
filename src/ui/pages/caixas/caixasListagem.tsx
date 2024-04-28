import {useSuspenseQuery} from "@tanstack/react-query";
import {createRoute} from "@tanstack/react-router";
import {caixasRoute} from ".";
import {buscarCaixas, buscarVendas} from "./comunicacaoApiCaixa";
import {useState} from 'react';
import {UserPlus} from "lucide-react";
import {Button} from "../../components/ui/button";

export const caixasListagemRoute = createRoute({
  getParentRoute: () => caixasRoute,
  path: "/caixa",
// @ts-ignore
  loader: ({context: {queryClient}}) =>
      queryClient.ensureQueryData(buscarCaixas),
  component: CaixasListagem,
});

function CaixasListagem() {
  const [caixaAberta, setCaixaAberta] = useState(false);
  const vendasQuery = useSuspenseQuery(buscarVendas);
  console.log("Caixa: " + caixaAberta);

  const abrirCaixa = () => {
    // Implemente a lógica para abrir a caixa aqui
    setCaixaAberta(true);
  };

  const fecharCaixa = () => {
    setCaixaAberta(false);
  };

  const realizarVenda = () => {
  };

  const realizarSaida = () => {
  };

  return (
      <>
        <div className="pb-2 flex justify-between items-center">
          <h1 className="font-bold text-2xl">Caixas</h1>
          {caixaAberta ? (
              <>
                <button onClick={realizarVenda} type="button">Venda (F1)</button>
                <button onClick={realizarSaida} type="button">Saída (F2)</button>
                <button onClick={fecharCaixa} type="button">Fechar Caixa (F3)</button>
              </>
          ) : (
              <Button onClick={abrirCaixa} className="ml-auto" size="sm">
                <UserPlus className="mr-2"/>
                Abrir Caixa (F1)
              </Button>
          )}
        </div>
        {caixaAberta && (
            <div className="relative overflow-x-auto">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                <thead>
                <tr>
                  <th>Id</th>
                  <th>Data da Venda</th>
                  <th>Valor Total</th>
                  <th>Produtos</th>
                  <th>Cliente</th>
                  <th>Forma de Pagamento</th>
                  <th>Valor Pago</th>
                  <th>Troco</th>
                  <th>Desconto</th>
                </tr>
                </thead>
                <tbody>
                {vendasQuery.data.map((venda) => (
                    <tr key={venda.id}>
                      <td>{venda.id}</td>
                      <td>{venda.dataVenda.toLocaleDateString()}</td>
                      <td>{venda.valorTotal}</td>
                      <td>{venda.produtos.map(produto => produto.nome).join(', ')}</td>
                      <td>{venda.cliente.nome}</td>
                      <td>{venda.formaPagamento}</td>
                      <td>{venda.valorPago}</td>
                      <td>{venda.troco}</td>
                      <td>{venda.desconto}</td>
                    </tr>
                ))}
                </tbody>
              </table>
            </div>
        )}
      </>
  );
}