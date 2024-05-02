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
import {Input} from "../../components/ui/input";
import {
  atualizarEstoqueApi,
  buscarEstoquePorId,
  cadastrarEstoqueApi
} from "../../../ui/api/estoquesApi";
import {Switch} from "../../../ui/components/ui/switch";
import {Cor} from "../../../ui/enums/Cor";
import {Tecido} from "../../../ui/enums/Tecido";
import {gerarDoublePorValorMonetario} from "../../../ui/utils/conversores";
import {zodResolver} from "@hookform/resolvers/zod";
import {useNumberFormat} from "@react-input/number-format";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import React, {useEffect, useRef, useState} from "react";
import {useForm} from "react-hook-form";
import {Estoque} from "src/shared/models/Estoque";
import {z} from "zod";

const formSchema = z.object({
  nome: z
  .string({message: "Campo Obrigatório"})
  .min(3, {message: "Nome Deve Conter Pelo Menos 3 Letras"}),
  descricao: z
  .string({message: "Campo obrigatório."})
  .min(3, {message: "Descrição Deve Conter Pelo Menos 3 Letras"}),
  cor: z
  .string().refine(value => Object.values(Cor).includes(value as Cor), {
    message: "Campo Obrigatório",
  }),
  tamanho: z
  .string({message: "Campo Obrigatório"})
  .min(1, {message: "Campo Obrigatório"}),
  vendido: z.boolean(),
  tecido: z
  .string().refine(value => Object.values(Tecido).includes(value as Tecido), {
    message: "Campo Obrigatório",
  }),
  fornecedor: z.string().nullable(),
  quantidade: z.string().min(1, {message: "Quantidade Deve Ser Declarada"}),
  valorCompra: z.string().refine(value => value !== '', {message: "Campo Obrigatório"}),
  valorVenda: z.string().refine(value => value !== '', {message: "Campo Obrigatório"}),
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
        quantidade: "1",
        valorCompra: "",
        valorVenda: "",
      },
    });

export function DialogCadastrarEstoque({isOpen}: { isOpen: boolean }) {
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
      queryClient.invalidateQueries({queryKey: ["estoques"]});
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
      form.setValue("quantidade", "1");
      form.setValue("valorCompra", "");
      form.setValue("valorVenda", "");
    }
  }, [isOpen]);

  useEffect(() => {
    const valorCompra = form.watch("valorCompra");
    if (valorCompra) {
      const valorNumerico = parseFloat(valorCompra.replace(/[^0-9.]/g, ''));

      if (!isNaN(valorNumerico)) {
        const valorEmReais = valorNumerico / 100;
        const valorComAcrescimo = valorEmReais * 1.5;
        const valorVendaMonetario = valorComAcrescimo.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        });

        form.setValue("valorVenda", valorVendaMonetario);
      }
    }
  }, [form, form.watch("valorCompra")]);

  const [lucro, setLucro] = useState(0);

  const {watch} = form;
  const valorCompra = watch("valorCompra");
  const valorVenda = watch("valorVenda");

  useEffect(() => {
    const valorCompraNumerico = parseFloat(valorCompra.replace(/[^0-9.]/g, '').replace(',', '.'));
    const valorVendaNumerico = parseFloat(valorVenda.replace(/[^0-9.]/g, '').replace(',', '.'));

    if (!isNaN(valorCompraNumerico) && !isNaN(valorVendaNumerico)) {
      const lucroCalculado = valorVendaNumerico - valorCompraNumerico;
      setLucro(lucroCalculado);
    }
  }, [valorCompra, valorVenda]);

  function removerDuasCasasDecimais(valor: number): number {
    return valor / 100;
  }

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
      quantidade: Number(quantidade),
      valorCompra: gerarDoublePorValorMonetario(valorCompra) || 0,
      valorVenda: gerarDoublePorValorMonetario(valorVenda) || 0,
    };

    cadastrarEstoqueMutation.mutate(estoque);
  }

  return (
      <DialogContent className="sm:max-w-[32rem]">
        <DialogHeader>
          <DialogTitle>Cadastrar Estoque</DialogTitle>
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
                  render={({field}) => (
                      <FormItem>
                        <FormLabel>Nome*</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome do produto" {...field} />
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
                        <FormLabel>Descricao*</FormLabel>
                        <FormControl>
                          <Input placeholder="Descrição" {...field} />
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                  )}
              />

              <FormField
                  control={form.control}
                  name="cor"
                  render={({field}) => (
                      <FormItem>
                        <FormLabel>Cor*</FormLabel>
                        <FormControl>
                          <select {...field} style={{
                            appearance: 'none',
                            backgroundColor: '#fff',
                            border: '1px solid #ced4da',
                            borderRadius: '4px',
                            padding: '10px',
                            width: '100%',
                            fontSize: '1rem',
                            lineHeight: '1.0',
                            color: '#495057',
                            paddingRight: '1.0rem'
                          }}>
                            <option value="">Selecione uma Cor</option>
                            {Object.values(Cor).map((cor) => (
                                <option key={cor} value={cor}>
                                  {cor}
                                </option>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                  )}
              />

              <FormField
                  control={form.control}
                  name="tecido"
                  render={({field}) => (
                      <FormItem>
                        <FormLabel>Tecido*</FormLabel>
                        <FormControl>
                          <select {...field} style={{
                            appearance: 'none',
                            backgroundColor: '#fff',
                            border: '1px solid #ced4da',
                            borderRadius: '4px',
                            padding: '10px',
                            width: '100%',
                            fontSize: '1rem',
                            lineHeight: '1.0',
                            color: '#495057',
                            paddingRight: '1.0rem'
                          }}>
                            <option value="">Selecione um Tecido</option>
                            {Object.values(Tecido).map((tecido) => (
                                <option key={tecido} value={tecido}>
                                  {tecido}
                                </option>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                  )}
              />

              <FormField
                  control={form.control}
                  name="tamanho"
                  render={({field}) => (
                      <FormItem>
                        <FormLabel>Tamanho*</FormLabel>
                        <FormControl>
                          <Input placeholder="Tamanho do produto" {...field} />
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                  )}
              />

              <FormField
                  control={form.control}
                  name="fornecedor"
                  render={({field}) => (
                      <FormItem>
                        <FormLabel>Marca</FormLabel>
                        <FormControl>
                          <Input placeholder="Marca do Item" {...field} />
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                  )}
              />

              <FormField
                  control={form.control}
                  name="quantidade"
                  render={({field}) => (
                      <FormItem>
                        <FormLabel>Quantidade*</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Quantidade" {...field} />
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                  )}
              />

              <FormField
                  control={form.control}
                  name="valorCompra"
                  render={({field}) => (
                      <FormItem>
                        <FormLabel>Valor da Compra*</FormLabel>
                        <FormControl>
                          <Input
                              placeholder="Valor de compra"
                              ref={valorMonetarioCompra}
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
                  name="valorVenda"
                  render={({field}) => (
                      <FormItem>
                        <FormLabel>Valor da Venda*</FormLabel>
                        <FormControl>
                          <Input
                              placeholder="Valor de Venda"
                              ref={valorMonetarioVenda}
                              value={field.value}
                              onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                  )}
              />

              <div>
                <label>
                  <strong>Lucro Estimado</strong>
                </label>
                <div
                    style={{
                      color: lucro >= 0 ? 'green' : 'red',
                      fontWeight: 'bold',
                      marginTop: '15px',
                    }}
                >
                  {isNaN(lucro) ? "R$ 0,00" : (lucro >= 0 ? "+ R$ " : "- R$ ") + Math.abs(removerDuasCasasDecimais(lucro)).toFixed(2)}
                </div>
              </div>

              <FormField
                  control={form.control}
                  name="vendido"
                  render={({field}) => (
                      <FormItem className="flex flex-col gap-2 items-start justify-start">
                        <FormLabel className="mt-2">Vendido</FormLabel>
                        <FormControl>
                          <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
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

export function DialogAtualizarEstoque({estoqueId}: { estoqueId?: number }) {
  const queryClient = useQueryClient();

  const refBtnClose = useRef<HTMLButtonElement>();

  const atualizarEstoqueMutation = useMutation({
    mutationFn: atualizarEstoqueApi,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["estoques"]});
      refBtnClose.current.click();
    },
  });

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

  const form = gerarFormVazio();

  const [lucro, setLucro] = useState(0);
  const {watch} = form;
  const valorCompra = watch("valorCompra");
  const valorVenda = watch("valorVenda");

  useEffect(() => {
    const valorCompraNumerico = parseFloat(valorCompra.replace(/[^0-9.]/g, '').replace(',', '.'));
    const valorVendaNumerico = parseFloat(valorVenda.replace(/[^0-9.]/g, '').replace(',', '.'));

    if (!isNaN(valorCompraNumerico) && !isNaN(valorVendaNumerico)) {
      const lucroCalculado = valorVendaNumerico - valorCompraNumerico;
      setLucro(lucroCalculado);
    }
  }, [valorCompra, valorVenda]);

  function removerDuasCasasDecimais(valor: number): number {
    return valor / 100;
  }

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
      id: estoqueId,
      nome,
      descricao,
      cor: cor as Cor,
      tamanho,
      vendido,
      tecido: tecido as Tecido,
      fornecedor,
      quantidade: Number(quantidade),
      valorCompra: gerarDoublePorValorMonetario(valorCompra) || 0,
      valorVenda: gerarDoublePorValorMonetario(valorVenda) || 0,
    };
    atualizarEstoqueMutation.mutate(estoque);
  }

  useEffect(() => {
    if (estoqueId) {
      buscarEstoquePorId(estoqueId).then(
          ({
             nome,
             descricao,
             cor,
             tamanho,
             vendido,
             tecido,
             fornecedor,
             quantidade,
             valorCompra,
             valorVenda
           }) => {
            form.setValue("nome", nome);
            form.setValue("descricao", descricao);
            form.setValue("cor", cor);
            form.setValue("tamanho", tamanho);
            form.setValue("vendido", vendido);
            form.setValue("tecido", tecido);
            form.setValue("fornecedor", fornecedor);
            form.setValue("quantidade", String(quantidade));
            form.setValue("valorCompra", valorCompra.toString());
            form.setValue("valorVenda", valorVenda.toString());
          }
      );
    }
  }, [estoqueId]);

  return (
      <DialogContent className="sm:max-w-[32rem]">
        <DialogHeader>
          <DialogTitle>Atualizar {form.getValues().nome}</DialogTitle>
          <DialogDescription>
            Insira abaixo os dados atualizados do estoque.
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
                          <Input placeholder="Nome do produto" {...field} />
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
                        <FormLabel>Descricao*</FormLabel>
                        <FormControl>
                          <Input placeholder="Descrição" {...field} />
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                  )}
              />

              <FormField
                  control={form.control}
                  name="cor"
                  render={({field}) => (
                      <FormItem>
                        <FormLabel>Cor*</FormLabel>
                        <FormControl>
                          <select {...field} style={{
                            appearance: 'none',
                            backgroundColor: '#fff',
                            border: '1px solid #ced4da',
                            borderRadius: '4px',
                            padding: '10px',
                            width: '100%',
                            fontSize: '1rem',
                            lineHeight: '1.0',
                            color: '#495057',
                            paddingRight: '1.0rem'
                          }}>
                            <option value="">Selecione uma Cor</option>
                            {Object.values(Cor).map((cor) => (
                                <option key={cor} value={cor}>
                                  {cor}
                                </option>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                  )}
              />

              <FormField
                  control={form.control}
                  name="tecido"
                  render={({field}) => (
                      <FormItem>
                        <FormLabel>Tecido*</FormLabel>
                        <FormControl>
                          <select {...field} style={{
                            appearance: 'none',
                            backgroundColor: '#fff',
                            border: '1px solid #ced4da',
                            borderRadius: '4px',
                            padding: '10px',
                            width: '100%',
                            fontSize: '1rem',
                            lineHeight: '1.0',
                            color: '#495057',
                            paddingRight: '1.0rem'
                          }}>
                            <option value="">Selecione um Tecido</option>
                            {Object.values(Tecido).map((tecido) => (
                                <option key={tecido} value={tecido}>
                                  {tecido}
                                </option>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                  )}
              />

              <FormField
                  control={form.control}
                  name="tamanho"
                  render={({field}) => (
                      <FormItem>
                        <FormLabel>Tamanho*</FormLabel>
                        <FormControl>
                          <Input placeholder="Tamanho do produto" {...field} />
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                  )}
              />

              <FormField
                  control={form.control}
                  name="fornecedor"
                  render={({field}) => (
                      <FormItem>
                        <FormLabel>Marca</FormLabel>
                        <FormControl>
                          <Input placeholder="Marca do Item" {...field} />
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                  )}
              />

              <FormField
                  control={form.control}
                  name="quantidade"
                  render={({field}) => (
                      <FormItem>
                        <FormLabel>Quantidade*</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Quantidade" {...field} />
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                  )}
              />

              <FormField
                  control={form.control}
                  name="valorCompra"
                  render={({field}) => (
                      <FormItem>
                        <FormLabel>Valor da Compra*</FormLabel>
                        <FormControl>
                          <Input
                              placeholder="Valor de compra"
                              ref={valorMonetarioCompra}
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
                  name="valorVenda"
                  render={({field}) => (
                      <FormItem>
                        <FormLabel>Valor da Venda*</FormLabel>
                        <FormControl>
                          <Input
                              placeholder="Valor de Venda"
                              ref={valorMonetarioVenda}
                              value={field.value}
                              onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                  )}
              />

              <div>
                <label>
                  <strong>Lucro Estimado</strong>
                </label>
                <div
                    style={{
                      color: lucro >= 0 ? 'green' : 'red',
                      fontWeight: 'bold',
                      marginTop: '15px',
                    }}
                >
                  {isNaN(lucro) ? "R$ 0,00" : (lucro >= 0 ? "+ R$ " : "- R$ ") + Math.abs(removerDuasCasasDecimais(lucro)).toFixed(2)}
                </div>
              </div>

              <FormField
                  control={form.control}
                  name="vendido"
                  render={({field}) => (
                      <FormItem className="flex flex-col gap-2 items-start justify-start">
                        <FormLabel className="mt-2">Vendido</FormLabel>
                        <FormControl>
                          <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
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
          <Button
              onClick={form.handleSubmit(onSubmit)}
              className="bg-blue-500"
              type="submit"
          >
            Atualizar Estoque
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