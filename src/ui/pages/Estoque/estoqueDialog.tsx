import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cadastrarEstoqueApi } from "@/ui/api/estoquesApi";
import { Switch } from "@/ui/components/ui/switch";
import { Cor } from "@/ui/enums/Cor";
import { Tecido } from "@/ui/enums/Tecido";
import { gerarDoublePorValorMonetario } from "@/ui/utils/conversores";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNumberFormat } from "@react-input/number-format";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { Estoque } from "src/shared/models/Estoque";
import { z } from "zod";

const formSchema = z.object({
  nome: z
    .string({ message: "Campo obrigatório." })
    .min(3, { message: "O nome do cliente não pode ser nulo." }),
  descricao: z
    .string({ message: "Campo obrigatório." })
    .min(3, { message: "O nome do cliente não pode ser nulo." }),
  cor: z
    .string({ message: "Campo obrigatório." })
    .min(3, { message: "O nome do cliente não pode ser nulo." }),
  tamanho: z
    .string({ message: "Campo obrigatório." })
    .min(3, { message: "O nome do cliente não pode ser nulo." }),
  vendido: z.boolean(),
  tecido: z
    .string({ message: "Campo obrigatório." })
    .min(3, { message: "O nome do cliente não pode ser nulo." }),
  fornecedor: z.string().nullable(),
  quantidade: z.number().min(1, { message: "Insira uma quantidade válida." }),
  valorCompra: z.string({ message: "Campo obrigatório." }),
  valorVenda: z.string({ message: "Campo obrigatório." }),
});

const gerarFormVazio = () =>
  useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      descricao: "",
      cor: "",
      tamanho: "",
      vendido: false,
      tecido: "",
      fornecedor: "",
      quantidade: 0,
      valorCompra: "",
      valorVenda: "",
    },
  });

export function DialogCadastrarCliente({ isOpen }: { isOpen: boolean }) {
  const queryClient = useQueryClient();

  const refBtnClose = useRef<HTMLButtonElement>();
  const valorMonetarioCompra = useNumberFormat({
    locales: "pt-BR",
    format: "currency",
    currency: "BRL",
  });
  const valorMonetarioVenda = useNumberFormat({
    locales: "pt-BR",
    format: "currency",
    currency: "BRL",
  });

  const cadastrarEstoqueMutation = useMutation({
    mutationFn: cadastrarEstoqueApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clientes"] });
      refBtnClose.current.click();
    },
  });

  const form = gerarFormVazio();

  useEffect(() => {
    if (isOpen) {
      form.setValue("nome", "");
      form.setValue("descricao", "");
      form.setValue("cor", "");
      form.setValue("tamanho", "");
      form.setValue("vendido", false);
      form.setValue("tecido", "");
      form.setValue("fornecedor", "");
      form.setValue("quantidade", 0);
      form.setValue("valorCompra", "");
      form.setValue("valorVenda", "");
    }
  }, [isOpen]);

  function onSubmit({
    nome,
    descricao,
    cor,
    tamanho,
    vendido,
    tecido,
    fornecedor,
    quantidade,
    valorCompra,
    valorVenda,
  }: z.infer<typeof formSchema>) {
    const estoque: Estoque = {
      nome,
      descricao,
      cor: Cor.Amarelo,
      tamanho,
      vendido,
      tecido: Tecido.Algodao,
      fornecedor,
      quantidade,
      valorCompra: gerarDoublePorValorMonetario(valorCompra) || 0,
      valorVenda: gerarDoublePorValorMonetario(valorVenda) || 0,
    };

    cadastrarEstoqueMutation.mutate(estoque);
  }

  return (
    <DialogContent className="sm:max-w-[32rem]">
      <DialogHeader>
        <DialogTitle>Cadastrar estoque</DialogTitle>
        <DialogDescription>
          Insira abaixo os dados do estoque.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-2 gap-3"
          >
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome*</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do produto" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="descricao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descricao*</FormLabel>
                  <FormControl>
                    <Input placeholder="Descrição" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cor*</FormLabel>
                  <FormControl>
                    <Input placeholder="Descrição do produto" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tamanho"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tamanho*</FormLabel>
                  <FormControl>
                    <Input placeholder="Tamanho do produto" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tecido"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tecido*</FormLabel>
                  <FormControl>
                    <Input placeholder="Tecido do produto" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fornecedor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fornecedor</FormLabel>
                  <FormControl>
                    <Input placeholder="Fornecedor do produto" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="quantidade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantidade*</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Quantidade" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="valorCompra"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor da compra*</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Valor de compra"
                      ref={valorMonetarioCompra}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="valorVenda"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor da venda*</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Valor de Venda"
                      ref={valorMonetarioVenda}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="vendido"
              render={({ field }) => (
                <FormItem className="flex gap-2 items-center justify-center">
                  <FormLabel className="mt-2">Vendido</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className="hidden" type="submit"></Button>
          </form>
        </Form>
      </div>
      <DialogFooter>
        <Button onClick={form.handleSubmit(onSubmit)} type="submit">
          Cadastrar Estoque
        </Button>
        <DialogClose asChild>
          <Button ref={refBtnClose} type="button" variant="destructive">
            Cancelar
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
}

// export function DialogAtualizarCliente({ clienteId }: { clienteId?: number }) {
//   const queryClient = useQueryClient();

//   const refBtnClose = useRef<HTMLButtonElement>();

//   const atualizarClienteMutation = useMutation({
//     mutationFn: atualizarClienteApi,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["clientes"] });
//       refBtnClose.current.click();
//     },
//   });

//   const form = gerarFormVazio();

//   function onSubmit({
//     nome,
//     dataNascimento: dataString,
//     email,
//     celular,
//     endereco,
//   }: z.infer<typeof formSchema>) {
//     const dataNascimento = gerarDatePorString(dataString);

//     const cliente: Cliente = {
//       id: clienteId,
//       nome,
//       dataNascimento,
//       email,
//       telefone: celular,
//       endereco,
//     };
//     atualizarClienteMutation.mutate(cliente);
//   }

//   useEffect(() => {
//     if (clienteId) {
//       buscarClientePorId(clienteId).then(
//         ({ dataNascimento, email, endereco, nome, telefone }) => {
//           form.setValue("dataNascimento", gerarStringPorDate(dataNascimento));
//           form.setValue("email", email);
//           form.setValue("endereco", endereco);
//           form.setValue("nome", nome);
//           form.setValue("celular", telefone);
//         }
//       );
//     }
//   }, [clienteId]);

//   return (
//     <DialogContent className="sm:max-w-[32rem]">
//       <DialogHeader>
//         <DialogTitle>Atualizar cliente {form.getValues().nome}</DialogTitle>
//         <DialogDescription>
//           Insira abaixo os dados atualizados do cliente.
//         </DialogDescription>
//       </DialogHeader>
//       <div className="grid gap-4 py-4">
//         <Form {...form}>
//           <form
//             onSubmit={form.handleSubmit(onSubmit)}
//             className="grid grid-cols-2 gap-3"
//           >
//             <FormField
//               control={form.control}
//               name="nome"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Nome*</FormLabel>
//                   <FormControl>
//                     <Input placeholder="Nome Sobrenome" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="celular"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Celular*</FormLabel>
//                   <FormControl>
//                     <InputComMascara
//                       radix="."
//                       mask={"(00) 0 0000-0000"}
//                       placeholder="(00) 0 0000-0000"
//                       {...field}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="email"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>E-mail*</FormLabel>
//                   <FormControl>
//                     <Input placeholder="email@gmail.com" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="dataNascimento"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Data de Nascimento</FormLabel>
//                   <FormControl>
//                     <InputComMascara
//                       radix="."
//                       mask={"00/00/0000"}
//                       unmask={true}
//                       placeholder="dd/mm/aaaa"
//                       {...field}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="endereco"
//               render={({ field }) => (
//                 <FormItem className="col-span-2">
//                   <FormLabel>Endereço</FormLabel>
//                   <FormControl>
//                     <Input placeholder="Rua, número, bairro" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <Button className="hidden" type="submit"></Button>
//           </form>
//         </Form>
//       </div>
//       <DialogFooter>
//         <Button
//           onClick={form.handleSubmit(onSubmit)}
//           className="bg-amber-500"
//           type="submit"
//         >
//           Atualizar Cliente
//         </Button>
//         <DialogClose asChild>
//           <Button ref={refBtnClose} type="button" variant="destructive">
//             Cancelar
//           </Button>
//         </DialogClose>
//       </DialogFooter>
//     </DialogContent>
//   );
// }
