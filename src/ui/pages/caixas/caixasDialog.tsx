import {InputComMascara} from "../../components/InputComMascara";
import {Button} from "../../components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import {cadastrarCaixaApi,} from "../../../ui/api/CaixasApi";
import {
  gerarDatePorString,
  gerarDoublePorValorMonetario,
  gerarDoublePorValorPorcentagem,
  gerarStringPorcentagemPorNumeroInteiro,
  gerarStringPorDate
} from "../../../ui/utils/conversores";
import {zodResolver} from "@hookform/resolvers/zod";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useEffect, useRef} from "react";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {Caixa} from "src/shared/models/Caixa";
import {useNumberFormat} from "@react-input/number-format";
import {Input} from "../../components/ui/input";
import {FormaPagamento} from "../../../shared/models/enums/FormaPagamento";
import {cadastrarVendaApi} from "../../../ui/api/VendasApi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../../components/ui/select";
import AsyncSelect from "react-select/async";
import {components} from "react-select";
import Venda from "../../../models/Venda";
import {buscarClientePorId} from "../../../ui/api/clientesApi";

const formSchemaCaixa = z.object({
  ativo: z.boolean(),
  dataHoraAbertura: z.string(),
  dataHoraFechamento: z.string().nullable().optional(),
  valorInicial: z.string({message: "Campo Obrigatório"}),
});

const formSchemaVenda = z.object({
  estoque: z.array(z.number()),
  formaPagamento: z.nativeEnum(FormaPagamento),
  valorPago: z.string({message: "Campo Obrigatório"}),
  valorTotal: z.string({message: "Campo Obrigatório"}),
  cliente: z.object({
    id: z.number(),
    nome: z.string(),
  }),
  troco: z.string(),
  desconto: z.string(),
});

// @ts-ignore
const Option = (props) => {
  const {data} = props;
  const {label} = data;
  const [nome, fornecedor, cor, valorVenda] = label.split(" - ");

  return (
      <components.Option {...props}>
        <div style={{display: "flex", justifyContent: "space-between"}}>
          <div style={{width: '50%'}}>{nome}</div>
          <div style={{width: '30%'}}>{fornecedor}</div>
          <div style={{width: '10%'}}>{cor}</div>
          <div style={{width: '10%'}}>{valorVenda}</div>
        </div>
      </components.Option>
  );
};

const gerarFormVazioCaixa = () =>
    useForm<z.infer<typeof formSchemaCaixa>>({
      resolver: zodResolver(formSchemaCaixa),
      defaultValues: {
        ativo: true,
        dataHoraAbertura: gerarStringPorDate(new Date()),
        dataHoraFechamento: "",
        valorInicial: "",
      },
    });

const gerarFormVazioVenda = () =>
    useForm<z.infer<typeof formSchemaVenda>>({
      resolver: zodResolver(formSchemaVenda),
      defaultValues: {
        estoque: [],
        formaPagamento: FormaPagamento.Dinheiro,
        valorTotal: '0',
        valorPago: '0',
        cliente: {
          id: 0,
          nome: "",
        },
        troco: '0',
        desconto: '0',
      },
    });

const loadOptions = (inputValue: string, callback: (options: {
  value: number;
  label: string
}[]) => void) => {
  window.apiEstoque.buscarTodosEstoques().then((estoque) => {
    const estoqueFiltrado = estoque
    .filter(item => item.vendido === false)
    .filter(item =>
        item.nome.toLowerCase().includes(inputValue.toLowerCase()) ||
        item.fornecedor.toLowerCase().includes(inputValue.toLowerCase())
    );

    callback(
        estoqueFiltrado.map((item) => ({
          value: item.id,
          label: `${item.nome} - ${item.fornecedor} - ${item.cor} - R$${item.valorVenda}`,
        }))
    );
  });
};

export function DialogCadastrarCaixa({isOpen}: { isOpen: boolean }) {
  const queryClient = useQueryClient();

  const refBtnClose = useRef<HTMLButtonElement>();
  const valorMonetario = useNumberFormat({
    locales: "pt-BR",
    format: "currency",
    currency: "BRL",
  });

  const cadastrarCaixaMutation = useMutation({
    mutationFn: cadastrarCaixaApi,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["caixas"]});
      refBtnClose.current.click();
    },
  });

  const form = gerarFormVazioCaixa();

  useEffect(() => {
    if (isOpen) {
      form.setValue("ativo", true);
      form.setValue("dataHoraAbertura", gerarStringPorDate(new Date()));
      form.setValue("dataHoraFechamento", null);
      form.setValue("valorInicial", "");
    }
  }, [isOpen]);

  function onSubmit({
                      dataHoraAbertura: dataAberturaString,
                      valorInicial,
                    }: z.infer<typeof formSchemaCaixa>) {
    const caixa: Caixa = {
      ativo: true,
      dataHoraAbertura: gerarDatePorString(dataAberturaString),
      dataHoraFechamento: null,
      valorInicial: gerarDoublePorValorMonetario(valorInicial) || 0,
      contas: [],
      vendas: [],
    };

    cadastrarCaixaMutation.mutate(caixa);
  }

  return (
      <DialogContent className="sm:max-w-[32rem]">
        <DialogHeader>
          <DialogTitle>Abertura de Caixa</DialogTitle>
          <DialogDescription>
            Insira abaixo os dados do caixa.
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
                  name="dataHoraAbertura"
                  render={({field}) => (
                      <FormItem>
                        <FormLabel>Data de Abertura*</FormLabel>
                        <FormControl>
                          <InputComMascara
                              radix="."
                              mask={"00/00/0000"}
                              unmask={true}
                              placeholder="dd/mm/aaaa"
                              {...field}
                          />
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                  )}
              />

              <FormField
                  control={form.control}
                  name="valorInicial"
                  render={({field}) => (
                      <FormItem>
                        <FormLabel>Valor Abertura do Caixa*</FormLabel>
                        <FormControl>
                          <Input
                              placeholder="Valor Inicial"
                              ref={valorMonetario}
                              value={field.value}
                              onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                  )}
              />

              <Button className="hidden" type="submit"></Button>
            </form>
          </Form>
        </div>
        <DialogFooter>
          <Button onClick={form.handleSubmit(onSubmit)} type="submit">
            Abrir Caixa
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

export function DialogCadastrarVenda({isOpen}: { isOpen: boolean }) {
  const queryClient = useQueryClient();
  const refBtnClose = useRef<HTMLButtonElement>();

  const form = gerarFormVazioVenda();

  const cadastrarVendaMutation = useMutation({
    mutationFn: cadastrarVendaApi,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["vendas"]});
      refBtnClose.current.click();
    },
  });

  const valorMonetario = useNumberFormat({
    locales: "pt-BR",
    format: "currency",
    currency: "BRL",
  });

  async function onSubmit({
                            estoque: estoqueIds,
                            formaPagamento,
                            valorPago,
                            troco,
                            desconto,
                            valorTotal,
                            cliente: clienteId,
                          }: z.infer<typeof formSchemaVenda>) {
    const clienteCompleto = await buscarClientePorId(clienteId.id);
    const venda: Venda = {
      dataVenda: new Date(),
      estoque: estoqueIds,
      formaPagamento,
      valorPago: gerarDoublePorValorMonetario(valorPago),
      troco,
      desconto: gerarDoublePorValorPorcentagem(desconto),
      valorTotal: gerarDoublePorValorMonetario(valorTotal),
      cliente: clienteCompleto,
    };

    cadastrarVendaMutation.mutate(venda);
  }

  return (
      <DialogContent className="sm:max-w-[64rem] h-[32rem]">
        <DialogHeader>
          <DialogTitle>Cadastro de Venda</DialogTitle>
          <DialogDescription>
            Insira abaixo os dados da venda.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                  control={form.control}
                  name="estoque"
                  render={({field}) => (
                      <FormItem>
                        <FormLabel>Produtos*</FormLabel>
                        <FormControl>
                          <AsyncSelect
                              cacheOptions
                              defaultOptions
                              loadOptions={loadOptions}
                              components={{Option}}
                              isMulti
                              onChange={(selectedOptions) => {
                                const selectedValues = selectedOptions.map(option => option.value);
                                form.setValue("estoque", selectedValues);
                              }}
                          />
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                  )}
              />

              <div className="grid grid-cols-2 gap-3">
                <FormField
                    control={form.control}
                    name="formaPagamento"
                    render={({field}) => (
                        <FormItem>
                          <FormLabel>Foma de Pagamento*</FormLabel>
                          <FormControl>
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione uma forma..."/>
                              </SelectTrigger>
                              <SelectContent>
                                {Object.values(FormaPagamento).map((formaPagamento) => (
                                    <SelectItem key={formaPagamento} value={formaPagamento}>
                                      {formaPagamento}
                                    </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage/>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="valorPago"
                    render={({field}) => (
                        <FormItem>
                          <FormLabel>Valor Pago*</FormLabel>
                          <FormControl>
                            <Input
                                placeholder="Valor Pago"
                                ref={valorMonetario}
                                value={field.value}
                                onChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage/>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="troco"
                    render={({field}) => (
                        <FormItem>
                          <FormLabel>Troco*</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="Troco" {...field} disabled/>
                          </FormControl>
                          <FormMessage/>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="desconto"
                    rules={{max: {value: 10, message: "O desconto não pode ser maior que 10%"}}}
                    render={({field, fieldState: {error}}) => (
                        <FormItem>
                          <FormLabel>Desconto*</FormLabel>
                          <FormControl>
                            <InputComMascara
                                placeholder="Desconto"
                                value={gerarStringPorcentagemPorNumeroInteiro(field.value)}
                                onChange={(e: {
                                  target: { value: string; };
                                }) => {
                                  const valor = gerarDoublePorValorPorcentagem(e.target.value);
                                  if (valor > 10) {
                                    console.error("O desconto não pode ser maior que 10%");
                                  } else {
                                    field.onChange(valor);
                                  }
                                }}
                            />
                          </FormControl>
                          <FormMessage>{error?.message}</FormMessage>
                        </FormItem>
                    )}
                />

                <FormField disabled={true}
                           control={form.control}
                           name="valorTotal"
                           render={({field}) => (
                               <FormItem>
                                 <FormLabel>Valor Total*</FormLabel>
                                 <FormControl>
                                   <InputComMascara
                                       radix="."
                                       // mask={"R$ 0,00"}
                                       unmask={false}
                                       placeholder="Valor Total"
                                       {...field}
                                   />
                                 </FormControl>
                                 <FormMessage/>
                               </FormItem>
                           )}
                />

              </div>
              <Button className="hidden" type="submit"></Button>
            </form>
          </Form>
        </div>
        <DialogFooter>
          <Button onClick={form.handleSubmit(onSubmit)} type="submit">
            Cadastrar Venda
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

// export function DialogAtualizarCaixa({caixaId}: { caixaId?: number }) {
//   const queryClient = useQueryClient();
//   const refBtnClose = useRef<HTMLButtonElement>();
//
//   const atualizarCaixaMutation = useMutation({
//     mutationFn: atualizarCaixaApi,
//     onSuccess: () => {
//       queryClient.invalidateQueries({queryKey: ["caixas"]});
//       refBtnClose.current.click();
//     },
//   });
//
//   const form = gerarFormVazio();
//
//   function onSubmit({
//                       ativo,
//                       dataHoraAbertura: dataAberturaString,
//                       dataHoraFechamento: dataFechamentoString,
//                       valorInicial,
//                     }: z.infer<typeof formSchema>) {
//     const dataHoraAbertura = gerarDatePorString(dataAberturaString);
//     const dataHoraFechamento = dataFechamentoString ? gerarDatePorString(dataFechamentoString) : null;
//
//     type caixa = {
//       ativo: boolean;
//       dataHoraAbertura: Date;
//       dataHoraFechamento: Date | null;
//       valorInicial: number;
//     };
//
//     // @ts-ignore
//     atualizarCaixaMutation.mutate(caixa);
//   }
//
//   useEffect(() => {
//     if (caixaId) {
//       buscarCaixaPorId(caixaId).then(
//           ({
//              ativo,
//              dataHoraAbertura,
//              dataHoraFechamento,
//              valorInicial,
//            }) => {
//             form.setValue("ativo", ativo);
//             form.setValue("dataHoraAbertura", gerarStringPorDate(dataHoraAbertura));
//             form.setValue("dataHoraFechamento", gerarStringPorDate(dataHoraFechamento));
//             form.setValue("valorInicial", valorInicial);
//           }
//       );
//     }
//   }, [caixaId]);
//
//   return (
//       <DialogContent className="sm:max-w-[32rem]">
//         <DialogHeader>
//           <DialogTitle>Atualizar Caixa</DialogTitle>
//           <DialogDescription>
//             Insira abaixo os dados atualizados do caixa.
//           </DialogDescription>
//         </DialogHeader>
//         <div className="grid gap-4 py-4">
//           <Form {...form}>
//             <form
//                 onSubmit={form.handleSubmit(onSubmit)}
//                 className="grid grid-cols-2 gap-3"
//             >
//               <FormField
//                   control={form.control}
//                   name="ativo"
//                   render={({field}) => (
//                       <FormItem>
//                         <FormLabel>Ativo*</FormLabel>
//                         <FormControl>
//                           <input type="checkbox" checked={field.value} onChange={field.onChange}
//                                  onBlur={field.onBlur} ref={field.ref} disabled/>
//                         </FormControl>
//                         <FormMessage/>
//                       </FormItem>
//                   )}
//               />
//
//               <FormField
//                   control={form.control}
//                   name="ativo"
//                   render={({field}) => (
//                       <FormItem>
//                         <FormLabel>Ativo*</FormLabel>
//                         <FormControl>
//                           <input type="checkbox" checked={field.value} onChange={field.onChange}
//                                  onBlur={field.onBlur} ref={field.ref} disabled/>
//                         </FormControl>
//                         <FormMessage/>
//                       </FormItem>
//                   )}
//               />
//
//
//               <FormField
//                   control={form.control}
//                   name="valorInicial"
//                   render={({field}) => (
//                       <FormItem>
//                         <FormLabel>Valor Inicial</FormLabel>
//                         <FormControl>
//                           <input type="number" {...field} disabled/>
//                         </FormControl>
//                         <FormMessage/>
//                       </FormItem>
//                   )}
//               />
//
//               <Button className="hidden" type="submit"></Button>
//             </form>
//           </Form>
//         </div>
//         <DialogFooter>
//           <Button onClick={form.handleSubmit(onSubmit)} type="submit">
//             Atualizar Caixa
//           </Button>
//           <DialogClose asChild>
//             <Button ref={refBtnClose} type="button" variant="destructive">
//               Cancelar
//             </Button>
//           </DialogClose>
//         </DialogFooter>
//       </DialogContent>
//   );
// }