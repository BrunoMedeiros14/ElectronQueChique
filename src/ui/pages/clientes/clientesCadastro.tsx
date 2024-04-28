import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/ui/components/ui/button";
import { escutarCliqueTeclado } from "@/ui/hooks/escutarCliqueTeclado";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { Cliente } from "src/shared/models/Cliente";
import { z } from "zod";
import { clientesRoute } from ".";
import { InputComMascara } from "../../components/InputComMascara";
import { cadastrarClienteApi } from "./comunicacaoApi";

export const clientesCadastroRoute = createRoute({
  getParentRoute: () => clientesRoute,
  path: "$clienteId",
  component: ClientesCadastro,
});

const formSchema = z.object({
  nome: z.string().min(1, {
    message: "O nome do cliente não pode ser nulo.",
  }),
  celular: z
    .string()
    .regex(/^[(]?[0-9]{2}[)][-\s]?[9][-\s][0-9]{4}[-\s][0-9]{4}$/, {
      message: "Insira um número de celular válido.",
    }),
  email: z
    .string()
    .min(1, { message: "Esse campo não pode ser nulo." })
    .email("Esse email não é válido."),
  dataNascimento: z.string().nullable(),
  endereco: z.string().nullable(),
});

function ClientesCadastro() {
  const queryClient = useQueryClient();

  const navigate = useNavigate();
  const retornarParaTabela = () => navigate({ to: "/clientes/" });

  const clienteId =
    clientesCadastroRoute.useParams().clienteId === "new"
      ? null
      : clientesCadastroRoute.useParams().clienteId;

  const cadastrarClienteMutation = useMutation({
    mutationFn: cadastrarClienteApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clientes"] });
      retornarParaTabela();
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dataNascimento: null,
      email: null,
      endereco: null,
      nome: null,
      celular: null,
    },
  });

  function onSubmit({
    nome,
    dataNascimento: dataString,
    email,
    celular,
    endereco,
  }: z.infer<typeof formSchema>) {
    let dataNascimento = null;
    if (dataString) {
      const [dia, mes, ano] = dataString.split("/");
      dataNascimento = new Date(+mes, +dia - 1, +ano);
    }

    const cliente: Cliente = {
      nome,
      dataNascimento,
      email,
      telefone: celular,
      endereco,
    };
    cadastrarClienteMutation.mutate(cliente);
  }

  escutarCliqueTeclado(() => {
    retornarParaTabela();
  }, ["Escape"]);

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <div className="flex items-center">
        <h1 className="font-semibold text-lg md:text-2xl">Cadastrar Cliente</h1>
      </div>
      {/* grid grid-cols-2 gap-3 */}
      <div className="mx-auto w-9/12 max-w-[96rem] border p-4 rounded-lg">
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
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome Sobrenome" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="celular"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Celular</FormLabel>
                  <FormControl>
                    <InputComMascara
                      radix="."
                      mask={"(00) 0 0000-0000"}
                      placeholder="(00) 0 0000-0000"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input placeholder="email@gmai.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dataNascimento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de Nascimento</FormLabel>
                  <FormControl>
                    <InputComMascara
                      radix="."
                      mask={"00/00/0000"}
                      unmask={true}
                      placeholder="dd/mm/yyyy"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endereco"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Endereço</FormLabel>
                  <FormControl>
                    <Input placeholder="Rua, número, bairro" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="mt-2 flex gap-2 col-span-2 justify-end">
              <Button type="submit">Cadastrar</Button>
              <Button onClick={retornarParaTabela} variant="destructive">
                Cancelar
              </Button>
            </div>
          </form>
        </Form>
        {/* <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-2/3 space-y-6"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome Sobrenome" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form> */}
      </div>
      {clienteId && (
        <div className="col-span-2">
          <label
            htmlFor="nome"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Id
          </label>
          <input
            type="text"
            id="id"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-16 p-2.5"
            value={clienteId}
            disabled
          />
        </div>
      )}
    </main>
  );
}
