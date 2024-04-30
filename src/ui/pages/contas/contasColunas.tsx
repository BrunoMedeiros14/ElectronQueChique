import { gerarStringPorDate, gerarStringReal } from "@/ui/utils/conversores";
import { ColumnDef } from "@tanstack/react-table";
import { Conta } from "src/shared/models/Conta";

// type ColunasContaProps = {
//   setIdParaExcluir: React.Dispatch<React.SetStateAction<number>>;
//   abrirEdicaoConta: (contaId: number) => void;
// };

export const pegarColunasConta = () //   {
//   setIdParaExcluir,
//   abrirEdicaoConta,
// }: ColunasContaProps
: ColumnDef<Conta>[] => [
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
    accessorKey: "valor",
    header: "Valor",
    cell: ({ row }) => {
      const valor = parseFloat(row.getValue("valor"));
      const formatted = gerarStringReal(valor);
      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "dataVencimento",
    header: "Data de Vencimento",
    cell: ({ row }) => {
      return row.getValue("dataVencimento")
        ? gerarStringPorDate(row.getValue("dataVencimento"))
        : "Não inserido";
    },
  },
  {
    accessorKey: "dataPagamento",
    header: "Data de Pagamento",
    cell: ({ row }) => {
      return row.getValue("dataPagamento")
        ? gerarStringPorDate(row.getValue("dataPagamento"))
        : "Não inserido";
    },
  },
  {
    accessorKey: "pago",
    header: "Pago",
    cell: ({ row }) => {
      const pago: boolean = row.getValue("pago");
      const texto = pago ? "Sim" : "Não";
      return (
        <span className={`${pago ? "text-green-600" : "text-red-600"}`}>{texto}</span>
      );
    },
  },
  // {
  //   id: "actions",
  //   cell: ({ row }) => {
  //     const clienteId = row.original.id;

  //     return (
  //       <div className="flex justify-center w-full gap-1">
  //         <Button
  //           size="icon"
  //           variant="ghost"
  //           onClick={() => abrirEdicaoCliente(clienteId)}
  //           className="text-orange-400 hover:text-white hover:bg-orange-400"
  //         >
  //           <Pencil className="h-4 w-4" />
  //           <span className="sr-only">Edit</span>
  //         </Button>

  //         <Button
  //           size="icon"
  //           variant="ghost"
  //           onClick={() => setIdParaExcluir(clienteId)}
  //           className="text-red-500 hover:text-white hover:bg-red-500"
  //         >
  //           <Trash2 className="h-4 w-4" />
  //           <span className="sr-only">Delete</span>
  //         </Button>
  //       </div>
  //     );
  //   },
  // },
];
