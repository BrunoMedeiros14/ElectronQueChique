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
  {
    accessorKey: "cor",
    header: "Cor",
  },
  {
    accessorKey: "tamanho",
    header: "Tamanho",
  },
  {
    accessorKey: "vendido",
    header: "Vendido",
    cell: ({ row }) => {
      const pago: boolean = row.getValue("vendido");
      const texto = pago ? "Sim" : "Não";
      return (
        <span className={`${pago ? "text-green-600" : "text-red-600"}`}>{texto}</span>
      );
    },
  },
  {
    accessorKey: "tecido",
    header: "Tecido",
  },
  {
    accessorKey: "fornecedor",
    header: "fornecedor",
  },
  {
    accessorKey: "quantidade",
    header: "Quantidade",
  },
  {
    accessorKey: "valorCompra",
    header: "Valor da compra",
  },
  {
    accessorKey: "valorVenda",
    header: "Valor da Venda",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const estoqueId = row.original.id;

      return (
        <div className="flex justify-center w-full gap-1">
          <Button
            disabled
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
