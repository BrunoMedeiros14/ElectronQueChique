import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import {Input} from "../../components/ui/input";
import {Button} from "../../../ui/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../ui/components/ui/dialog";
import {escutarCliqueTeclado} from "../../../ui/hooks/escutarCliqueTeclado";
import {zodResolver} from "@hookform/resolvers/zod";
import {useMutation, useQueryClient, useSuspenseQuery,} from "@tanstack/react-query";
import {createRoute, useNavigate} from "@tanstack/react-router";
import {useRef} from "react";
import {useForm} from "react-hook-form";
import {Conta} from "src/shared/models/Conta";
import {z} from "zod";
import {contasRoute} from ".";
import {InputComMascara} from "../../components/InputComMascara";
import {atualizarContaApi, buscarContaPorId, cadastrarContaApi,} from "./comunicacaoApi";

export const contasCadastroRoute = createRoute({
  getParentRoute: () => contasRoute,
  path: "$contaId",
  component: ContasCadastro,
});

const formSchema = z.object({
  nome: z.string({message: "Campo obrigatório."}).min(3, {
    message: "O nome da conta não pode ser nulo.",
  }),
  descricao: z.string({message: "Campo obrigatório."}).min(3, {
    message: "A descrição da conta não pode ser nula.",
  }),
  valor: z.number({message: "Campo obrigatório."}),
  dataVencimento: z.string().optional(),
  dataPagamento: z.string().optional(),
  pago: z.boolean().optional(),
});

const gerarDatePorString = (dataString: string) => {
  if (dataString) {
    const [dia, mes, ano] = dataString.split("/");
    console.log(dia, mes, ano);
    return new Date(+ano, +mes - 1, +dia);
  }
  return null;
};

export const gerarStringPorData = (dataNascimento: Date) => {
  if (!dataNascimento) return null;
  const dia = String(dataNascimento.getDate()).padStart(2, "0");
  const mes = String(dataNascimento.getMonth() + 1).padStart(2, "0");
  const ano = dataNascimento.getFullYear();

  return `${dia}/${mes}/${ano}`;
};

function ContasCadastro() {
  const contaId: number =
      contasCadastroRoute.useParams().contaId === "new"
          ? null
          : Number(contasCadastroRoute.useParams().contaId);

  const queryClient = useQueryClient();
  const buscarConta = (contaId: number) =>
      useSuspenseQuery(buscarContaPorId(contaId)).data;


  // @ts-ignore
  const {descricao, nome, valor, dataVencimento, dataPagamento, pago}: Conta = contaId
      ? buscarConta(contaId)
      : {descricao: "", nome: "", valor: 0};

  const navigate = useNavigate();
  const retornarParaTabela = () => navigate({to: "/contas/"});

  const cadastrarContaMutation = useMutation({
    mutationFn: cadastrarContaApi,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["contas"]});
      retornarParaTabela();
    },
  });

  const atualizarContaMutation = useMutation({
    mutationFn: atualizarContaApi,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["contas"]});
      retornarParaTabela();
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      descricao,
      nome,
      valor,
      dataVencimento: dataVencimento ? dataVencimento.toISOString().split('T')[0] : "",
      dataPagamento: dataPagamento ? dataPagamento.toISOString().split('T')[0] : "",
      pago: pago ?? false,
    },
  });


  function onSubmit({
                      nome,
                      descricao,
                      valor,
                      dataVencimento,
                      dataPagamento,
                      pago,
                    }: z.infer<typeof formSchema>) {

    const conta: Conta = {
      id: contaId,
      nome,
      descricao,
      valor,
      dataVencimento: new Date(dataVencimento),
      dataPagamento: new Date(dataPagamento),
      pago,
    };
    if (contaId) {
      atualizarContaMutation.mutate(conta);
      return;
    }
    cadastrarContaMutation.mutate(conta);
  }

  escutarCliqueTeclado(() => {
    retornarParaTabela();
  }, ["Escape"]);

  return (
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <div className="flex items-center">
          <h1 className="font-semibold text-lg md:text-2xl">
            {contaId ? `Editar conta ${nome}` : "Cadastrar Conta"}
          </h1>
        </div>
        <div className="mx-auto w-9/12 max-w-[96rem] border p-4 rounded-lg">
          <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid grid-cols-2 gap-3"
            >
              <FormField
                  control={form.control}
                  name="nome"
                  render={({field}) => (
                      <FormItem>
                        <FormLabel>Nome*</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome da Conta" {...field} />
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                  )}
              />

              <FormField
                  control={form.control}
                  name="descricao"
                  render={({field}) => (
                      <FormItem>
                        <FormLabel>Descrição*</FormLabel>
                        <FormControl>
                          <Input placeholder="Descrição da Conta" {...field} />
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                  )}
              />

              <FormField
                  control={form.control}
                  name="valor"
                  render={({field}) => (
                      <FormItem>
                        <FormLabel>Valor*</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Valor da Conta" {...field} />
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                  )}
              />
              <FormField
                  control={form.control}
                  name="dataVencimento"
                  render={({field}) => (
                      <FormItem>
                        <FormLabel>Data de Vencimento</FormLabel>
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
                  name="dataPagamento"
                  render={({field}) => (
                      <FormItem>
                        <FormLabel>Data de Pagamento</FormLabel>
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
                  name="pago"
                  render={({field}) => (
                      <FormItem>
                        <FormLabel>Pago</FormLabel>
                        <FormControl>
                          <input type="checkbox" checked={field.value} onChange={field.onChange}/>
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                  )}
              />
              <div className="mt-2 flex gap-2 col-span-2 justify-end">
                {contaId ? (
                    <Button type="submit" className="bg-amber-500">
                      Editar
                    </Button>
                ) : (
                    <Button type="submit">Cadastrar</Button>
                )}
                <Button onClick={retornarParaTabela} variant="destructive">
                  Cancelar
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </main>
  );
}

export function DialogCadastrarConta() {
  const queryClient = useQueryClient();

  const refBtnClose = useRef<HTMLButtonElement>();

  const cadastrarContaMutation = useMutation({
    mutationFn: cadastrarContaApi,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["contas"]});
      refBtnClose.current.click();
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      descricao: "",
      nome: "",
      valor: 0,
      dataVencimento: "",
      dataPagamento: "",
      pago: false,
    },
  });

  function onSubmit({
                      nome,
                      descricao,
                      valor,
                      dataVencimento,
                      dataPagamento,
                      pago,
                    }: z.infer<typeof formSchema>) {

    const conta: Conta = {
      nome,
      descricao,
      valor,
      dataVencimento: new Date(dataVencimento),
      dataPagamento: new Date(dataPagamento),
      pago,
    };

    cadastrarContaMutation.mutate(conta);
  }

  return (
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Cadastrar Conta</DialogTitle>
          <DialogDescription>
            Insira abaixo os dados da conta.
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
                  render={({field}) => (
                      <FormItem>
                        <FormLabel>Nome*</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome da Conta" {...field} />
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                  )}
              />

              <FormField
                  control={form.control}
                  name="descricao"
                  render={({field}) => (
                      <FormItem>
                        <FormLabel>Descrição*</FormLabel>
                        <FormControl>
                          <Input placeholder="Descrição da Conta" {...field} />
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                  )}
              />

              <FormField
                  control={form.control}
                  name="valor"
                  render={({field}) => (
                      <FormItem>
                        <FormLabel>Valor*</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Valor da Conta" {...field} />
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                  )}
              />
              <FormField
                  control={form.control}
                  name="dataVencimento"
                  render={({field}) => (
                      <FormItem>
                        <FormLabel>Data de Vencimento</FormLabel>
                        <FormControl>
                          <InputComMascara
                              radix="."
                              mask={"00/00/0000"}
                              unmask={true}
                              placeholder="dd/mm/yyyy"
                              {...field}
                          />
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                  )}
              />
              <FormField
                  control={form.control}
                  name="dataPagamento"
                  render={({field}) => (
                      <FormItem>
                        <FormLabel>Data de Pagamento</FormLabel>
                        <FormControl>
                          <InputComMascara
                              radix="."
                              mask={"00/00/0000"}
                              unmask={true}
                              placeholder="dd/mm/yyyy"
                              {...field}
                          />
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                  )}
              />
              <FormField
                  control={form.control}
                  name="pago"
                  render={({field}) => (
                      <FormItem>
                        <FormLabel>Pago</FormLabel>
                        <FormControl>
                          <input type="checkbox" checked={field.value} onChange={field.onChange}/>
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
          <Button onClick={form.handleSubmit(onSubmit)} type="submit">Cadastrar Conta</Button>
          <DialogClose asChild>
            <Button ref={refBtnClose} type="button" variant="destructive">
              Cancelar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
  );
}