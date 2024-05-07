import { zodResolver } from "@hookform/resolvers/zod";
import { useNumberFormat } from "@react-input/number-format";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { GroupBase, OptionProps, components } from "react-select";
import AsyncSelect from "react-select/async";
import { JSX } from "react/jsx-runtime";
import { Caixa } from "src/shared/models/Caixa";
import { Estoque } from "src/shared/models/Estoque";
import { Venda } from "src/shared/models/Venda";
import { z } from "zod";
import { FormaPagamento } from "../../../shared/models/enums/FormaPagamento";
import { cadastrarCaixaApi } from "../../../ui/api/CaixasApi";
import { cadastrarVendaApi } from "../../../ui/api/VendasApi";
import { buscarClientePorId } from "../../../ui/api/clientesApi";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

const formSchemaCaixa = z.object({
  ativo: z.boolean(),
  dataHoraAbertura: z.string(),
  dataHoraFechamento: z.string().nullable().optional(),
  valorInicial: z.string({ message: "Campo Obrigatório" }),
});

const formSchemaVenda = z.object({
  estoque: z.array(z.undefined()),
  formaPagamento: z.nativeEnum(FormaPagamento),
  valorPago: z.string({ message: "Campo Obrigatório" }),
  valorTotal: z.string({ message: "Campo Obrigatório" }),
  cliente: z.object({
    id: z.number(),
    nome: z.string(),
  }),
  troco: z.string(),
  desconto: z
    .string()
    .nullable()
    .refine((v) => parseInt(v) < 10, {
      message: "O desconto não pode passar de 10%",
    }),
});

const Option = (
  props: JSX.IntrinsicAttributes &
    OptionProps<unknown, boolean, GroupBase<unknown>>
) => {
  const { nome, fornecedor, cor, valorVenda } = props.data.estoque;

  return (
    <components.Option {...props}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ width: "50%" }}>{nome}</div>
        <div style={{ width: "30%" }}>{fornecedor}</div>
        <div style={{ width: "10%" }}>{cor}</div>
        <div style={{ width: "10%" }}>{valorVenda}</div>
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
      valorTotal: "",
      valorPago: "",
      cliente: {
        id: 0,
        nome: "",
      },
      troco: "",
      desconto: "",
    },
  });

const loadOptions = (
  inputValue: string,
  callback: (
    options: {
      value: number;
      estoque: Estoque;
      label: string;
    }[]
  ) => void
) => {
  window.apiEstoque.buscarTodosEstoques().then((estoque) => {
    const estoqueFiltrado = estoque
      .filter((item) => item.vendido === false)
      .filter(
        (item) =>
          item.nome.toLowerCase().includes(inputValue.toLowerCase()) ||
          item.fornecedor.toLowerCase().includes(inputValue.toLowerCase())
      );

    callback(
      estoqueFiltrado.map((item) => ({
        value: item.id,
        estoque: item,
        label: `${item.nome}`,
      }))
    );
  });
};

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

export function DialogCadastrarVenda({ isOpen }: { isOpen: boolean }) {
  const queryClient = useQueryClient();
  const refBtnClose = useRef<HTMLButtonElement>();

  const form = gerarFormVazioVenda();

  const cadastrarVendaMutation = useMutation({
    mutationFn: cadastrarVendaApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendas"] });
      refBtnClose.current.click();
    },
  });

  const valorMonetario = useNumberFormat({
    locales: "pt-BR",
    format: "currency",
    currency: "BRL",
  });

  async function onSubmit({
    estoque,
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
      estoque: estoque,
      formaPagamento,
      valorPago: gerarDoublePorValorMonetario(valorPago),
      troco: gerarDoublePorValorMonetario(troco),
      desconto: desconto ? parseFloat(desconto) : null,
      valorTotal: gerarDoublePorValorMonetario(valorTotal),
      cliente: clienteCompleto,
    };

    cadastrarVendaMutation.mutate(venda);
  }

  useEffect(() => {
    if (!form.getValues().valorPago) {
      return;
    }
    // const oi: Estoque;
    const valorTotal = form
      .getValues()
      .estoque.reduce((i, a) => i + a.valorVenda, 0);
    const valorPago = gerarDoublePorValorMonetario(form.getValues().valorPago);
    const troco = valorPago - valorTotal;

    form.setValue(
      "valorTotal",
      valorTotal.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      })
    );
    form.setValue(
      "troco",
      troco.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      })
    );

    // const valorCompra = gerarDoublePorValorMonetario(
    //   form.getValues().valorCompra
    // );

    // if (!isNaN(valorCompra)) {
    //   const valorComAcrescimo = valorCompra * 1.5;
    //   const valorVendaMonetario = valorComAcrescimo.toLocaleString("pt-BR", {
    //     style: "currency",
    //     currency: "BRL",
    //   });

    //   form.setValue("valorVenda", valorVendaMonetario);
    // }
  }, [form.watch("valorPago"), form.watch("estoque")]);

  return (
    <DialogContent className="sm:max-w-[64rem] h-[32rem]">
      <DialogHeader>
        <DialogTitle>Cadastro de Venda</DialogTitle>
        <DialogDescription>Insira abaixo os dados da venda.</DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="estoque"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Produtos*</FormLabel>
                  <FormControl>
                    <AsyncSelect
                      cacheOptions
                      defaultOptions
                      loadOptions={loadOptions}
                      components={{ Option }}
                      isMulti
                      onChange={(
                        selectedOptions: {
                          value: number;
                          estoque: Estoque;
                          label: string;
                        }[]
                      ) => {
                        const selectedValues = selectedOptions.map(
                          (option) => option.estoque
                        );
                        field.onChange(selectedValues);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="formaPagamento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Foma de Pagamento*</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma forma..." />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(FormaPagamento).map(
                            (formaPagamento) => (
                              <SelectItem
                                key={formaPagamento}
                                value={formaPagamento}
                              >
                                {formaPagamento}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="desconto"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Desconto(%)*</FormLabel>
                    <FormControl>
                      <Input placeholder="Desconto" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="valorPago"
                render={({ field }) => (
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
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="troco"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Troco*</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Troco"
                        {...field}
                        disabled
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                disabled={true}
                control={form.control}
                name="valorTotal"
                render={({ field }) => (
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
                    <FormMessage />
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
