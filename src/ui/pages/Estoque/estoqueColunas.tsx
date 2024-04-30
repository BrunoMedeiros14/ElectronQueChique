import { Button } from "@/ui/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";
import { Estoque } from "src/shared/models/Estoque";

type ColunasEstoqueProps = {
  setIdParaExcluir: React.Dispatch<React.SetStateAction<number>>;
  abrirEdicaoEstoque: (estoqueId: number) => void;
};

export const pegarColunasEstoque = ({
  setIdParaExcluir,
  abrirEdicaoEstoque,
}: ColunasEstoqueProps): ColumnDef<Estoque>[] => [
  {
    accessorKey: "id",
    header: "Id",
  },
  {
    accessorKey: "nome",
    header: "Nome",
    filterFn: "includesString",
  },
  {
    accessorKey: "descricao",
    header: "Descrição",
  },
  // {
  //   accessorKey: "cor",
  //   header: "Descrição",
  // },
  // {
  //   accessorKey: "tamanho",
  //   header: "Descrição",
  // },
  // {
  //   accessorKey: "vendido",
  //   header: "Descrição",
  // },
  // {
  //   accessorKey: "tecido",
  //   header: "Descrição",
  // },
  // {
  //   accessorKey: "fornecedor",
  //   header: "Descrição",
  // },
  // {
  //   accessorKey: "quantidade",
  //   header: "Descrição",
  // },
  // {
  //   accessorKey: "valorCompra",
  //   header: "Descrição",
  // },
  // {
  //   accessorKey: "valorVenda",
  //   header: "Descrição",
  // },
  // {
  //   accessorKey: "dataNascimento",
  //   header: "Data de Nascimento",
  //   cell: ({ row }) => {
  //     return row.getValue("dataNascimento") === null
  //       ? "Não cadastrado"
  //       : gerarStringPorDate(row.getValue("dataNascimento"));
  //   },
  // },
  // {
  //   accessorKey: "endereco",
  //   header: "Endereço",
  //   cell: ({ row }) => {
  //     return row?.getValue("endereco") === ""
  //       ? "Não cadastrado"
  //       : row?.getValue("endereco");
  //   },
  // },
  {
    id: "actions",
    cell: ({ row }) => {
      const estoqueId = row.original.id;

      return (
        <div className="flex justify-center w-full gap-1">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => abrirEdicaoEstoque(estoqueId)}
            className="text-orange-400 hover:text-white hover:bg-orange-400"
          >
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Button>

          <Button
            size="icon"
            variant="ghost"
            onClick={() => setIdParaExcluir(estoqueId)}
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
