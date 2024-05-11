import { zodResolver } from "@hookform/resolvers/zod";
import { useNumberFormat } from "@react-input/number-format";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { Caixa } from "src/shared/models/Caixa";
import { z } from "zod";
import { cadastrarCaixaApi } from "../../../ui/api/CaixasApi";
import {
  gerarDatePorString,
  gerarDoublePorValorMonetario,
  gerarStringPorDate,
} from "../../../ui/utils/conversores";
import { InputComMascara } from "../../components/InputComMascara";
import { Button } from "../../components/ui/button";
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
import { Input } from "../../components/ui/input";

const formSchemaCaixa = z.object({
  ativo: z.boolean(),
  dataHoraAbertura: z.string(),
  dataHoraFechamento: z.string().nullable().optional(),
  valorInicial: z.string({ message: "Campo Obrigatório" }),
});

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

export function DialogCadastrarCaixa({ isOpen }: { isOpen: boolean }) {
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
      queryClient.invalidateQueries({ queryKey: ["caixas"] });
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
        <DialogDescription>Insira abaixo os dados do caixa.</DialogDescription>
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
              render={({ field }) => (
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
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="valorInicial"
              render={({ field }) => (
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
