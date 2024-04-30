import { cadastrarContaApi } from "@/ui/api/contasApi";
import { InputComMascara } from "@/ui/components/InputComMascara";
import { Button } from "@/ui/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/ui/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/ui/components/ui/form";
import { Input } from "@/ui/components/ui/input";
import { Switch } from "@/ui/components/ui/switch";
import {
  gerarDatePorString,
  gerarDoublePorValorMonetario,
} from "@/ui/utils/conversores";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNumberFormat } from "@react-input/number-format";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { Conta } from "src/shared/models/Conta";
import { z } from "zod";

const formSchema = z.object({
  nome: z
    .string({ message: "Campo obrigatório." })
    .min(3, { message: "O nome da conta não pode ser nulo." }),
  descricao: z
    .string({ message: "Campo obrigatório." })
    .min(3, { message: "A descrição da conta não pode ser nula." }),
  valor: z
    .string({ message: "Campo obrigatório." }),
  dataVencimento: z.string().nullable(),
  dataPagamento: z.string().nullable(),
  pago: z.boolean().nullable(),
});

const gerarFormVazio = () =>
  useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      descricao: "",
      valor: "",
      dataVencimento: "",
      dataPagamento: "",
      pago: false,
    },
  });

export function DialogCadastrarConta({ isOpen }: { isOpen: boolean }) {
  const queryClient = useQueryClient();

  const refBtnClose = useRef<HTMLButtonElement>();
  const valorMonetario = useNumberFormat({
    locales: "pt-BR",
    format: "currency",
    currency: "BRL",
  });

  const cadastrarContaMutation = useMutation({
    mutationFn: cadastrarContaApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contas"] });
      refBtnClose.current.click();
    },
  });

  const form = gerarFormVazio();

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
      valor: gerarDoublePorValorMonetario(valor) || 0,
      dataVencimento: gerarDatePorString(dataVencimento),
      dataPagamento: gerarDatePorString(dataPagamento),
      pago,
    };
    cadastrarContaMutation.mutate(conta);
  }

  useEffect(() => {
    if (isOpen) {
      form.setValue("nome", "");
      form.setValue("descricao", "");
      form.setValue("valor", "");
      form.setValue("dataVencimento", "");
      form.setValue("dataPagamento", "");
      form.setValue("pago", false);
    }
  }, [isOpen]);

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Cadastrar Conta</DialogTitle>
        <DialogDescription>Insira abaixo os dados da conta.</DialogDescription>
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
                    <Input placeholder="Nome da Conta" {...field} />
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
                  <FormLabel>Descrição*</FormLabel>
                  <FormControl>
                    <Input placeholder="Descrição da Conta" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="valor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor*</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Valor da Conta"
                      ref={valorMonetario}
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
              name="dataVencimento"
              render={({ field }) => (
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
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dataPagamento"
              render={({ field }) => (
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
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pago"
              render={({ field }) => (
                <FormItem className="flex gap-2 items-center justify-center">
                  <FormLabel className="mt-2">Pago</FormLabel>
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
          Cadastrar Conta
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
