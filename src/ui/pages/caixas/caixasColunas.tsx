import { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";
import React from "react";
import { Caixa } from "src/shared/models/Caixa";
import { Cliente } from "src/shared/models/Cliente";
import { Estoque } from "src/shared/models/Estoque";
import { Venda } from "src/shared/models/Venda";
import { Button } from "../../../ui/components/ui/button";
import {
  gerarStringPorDate,
  gerarStringPorcentagemPorNumeroInteiro,
  gerarStringReal,
} from "../../../ui/utils/conversores";

type ColunasCaixaProps = {
  setIdParaExcluir: React.Dispatch<React.SetStateAction<number>>;
  abrirEdicaoCaixa: (caixaId: number) => void;
};

type ColunasVendaProps = {
  setIdParaExcluir: React.Dispatch<React.SetStateAction<number>>;
  abrirEdicaoVenda: (vendaId: number) => void;
};

export const pegarColunasCaixa = ({
  setIdParaExcluir,
  abrirEdicaoCaixa,
}: ColunasCaixaProps): ColumnDef<Caixa>[] => [
  {
    accessorKey: "id",
    header: "Id",
  },
  {
    accessorKey: "ativo",
    header: "Ativo",
    cell: ({ row }) => {
      return row.getValue("ativo") ? "Sim" : "Não";
    },
  },
  {
    accessorKey: "dataHoraAbertura",
    header: "Data Abertura",
    cell: ({ row }) => {
      return row.getValue("dataPagamento")
        ? gerarStringPorDate(row.getValue("dataPagamento"))
        : "Não inserido";
    },
  },
  {
    accessorKey: "dataHoraFechamento",
    header: "Data Fechamento",
    cell: ({ row }) => {
      return row.getValue("dataPagamento")
        ? gerarStringPorDate(row.getValue("dataPagamento"))
        : "Não inserido";
    },
  },
  {
    accessorKey: "valorInicial",
    header: "Valor Inicial",
    cell: ({ row }) => {
      return gerarStringReal(row.getValue("valorInicial"));
    },
  },
  {
    accessorKey: "vendas",
    header: "Vendas",
  },
  {
    accessorKey: "contas",
    header: "Contas",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const caixaId = row.original.id;

      return (
        <div className="flex justify-center w-full gap-1">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => abrirEdicaoCaixa(caixaId)}
            className="text-orange-400 hover:text-white hover:bg-orange-400"
          >
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Button>

          <Button
            size="icon"
            variant="ghost"
            onClick={() => setIdParaExcluir(caixaId)}
            className="text-red-500 hover:text-white hover:bg-red-500"
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      );
    },
  },
];

export const pegarColunasVenda = ({
  setIdParaExcluir,
  abrirEdicaoVenda,
}: ColunasVendaProps): ColumnDef<Venda>[] => [
  {
    accessorKey: "id",
    header: "Id",
  },
  {
    accessorKey: "estoque",
    header: "Produtos",
    cell: ({ row }) => {
      const estoques = row.getValue("estoque") as Estoque[];

      return estoques.length > 0
        ? estoques.map(estoque => estoque.nome).join(", ")
        : "Sem item cadastrado";
    },
  },
  {
    accessorKey: "cliente",
    header: "Cliente",
    cell: ({ row }) => {
      const cliente = row.getValue("cliente") as Cliente;

      return cliente
        ? cliente.nome
        : "Cliente não informado";
    },
  },
  {
    accessorKey: "formaPagamento",
    header: "Forma de Pagamento",
  },
  {
    accessorKey: "desconto",
    header: "Desconto",
    cell: ({ row }) => {
      return gerarStringPorcentagemPorNumeroInteiro(row.getValue("desconto"));
    },
  },
  {
    accessorKey: "valorTotal",
    header: "Valor Total",
    cell: ({ row }) => {
      return gerarStringReal(row.getValue("valorTotal"));
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const vendaId = row.original.id;

      return (
        <div className="flex justify-center w-full gap-1">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => abrirEdicaoVenda(vendaId)}
            className="text-orange-400 hover:text-white hover:bg-orange-400"
          >
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Button>

          <Button
            size="icon"
            variant="ghost"
            onClick={() => setIdParaExcluir(vendaId)}
            className="text-red-500 hover:text-white hover:bg-red-500"
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      );
    },
  },
];
