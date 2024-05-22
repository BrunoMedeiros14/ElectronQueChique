import { zodResolver } from '@hookform/resolvers/zod'
import { useNumberFormat } from '@react-input/number-format'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Trash2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Cliente } from '../../../src-electron/models/cliente'
import { Estoque } from '../../../src-electron/models/estoque'
import { Venda } from '../../../src-electron/models/venda'
import { FormaPagamento as FormaPagamentoType } from '../../../src-electron/models/enums/forma-pagamento'
import { buscarTodosClientes } from '@/api/clientes-api'
import { buscarEstoquesNaoVendidos } from '@/api/estoques-api'
import { atualizarVendaApi, buscarVendaPorId } from '@/api/vendas-api'
import { ProcurarClienteInput } from '@/components/clientes/procurar-cliente-input'
import ProcurarEstoqueInput from '../estoques/procurar-estoque-input'
import { Button } from '@/components/ui/button'
import { DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FormaPagamento } from '@/enums/forma-pagamento'
import { gerarDoublePorValorMonetario, gerarStringReal } from '@/utils/conversores'

const formSchemaVenda = z.object({
  formaPagamento: z.nativeEnum(FormaPagamento),
  valorPago: z.string({ message: 'Campo Obrigatório' }),
  valorTotal: z.number(),
  troco: z.number(),
  desconto: z.string().refine((v) => v === '' || parseInt(v) <= 10, {
    message: 'O desconto não pode passar de 10%',
  }),
})

const gerarFormVazioVenda = () =>
  useForm<z.infer<typeof formSchemaVenda>>({
    resolver: zodResolver(formSchemaVenda),
    defaultValues: {
      formaPagamento: FormaPagamento.Dinheiro,
      valorTotal: 0,
      valorPago: '',
      troco: 0,
      desconto: '',
    },
  })

export function DialogAtualizarVenda({ vendaId }: { vendaId?: number }) {
  const queryClient = useQueryClient()

  const refBtnClose = useRef<HTMLButtonElement>()

  const atualizarVendaMutation = useMutation({
    mutationFn: atualizarVendaApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendas'] })
      refBtnClose.current.click()
    },
  })

  const [estoqueSelecionado, setEstoqueSelecionado] = useState<Estoque[]>([])
  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente>(null)

  const valorMonetario = useNumberFormat({
    locales: 'pt-BR',
    format: 'currency',
    currency: 'BRL',
  })

  const form = gerarFormVazioVenda()

  async function onSubmit({ formaPagamento, valorPago, troco, desconto, valorTotal }: z.infer<typeof formSchemaVenda>) {
    const venda: Venda = {
      id: vendaId,
      dataVenda: new Date(),
      estoque: estoqueSelecionado,
      formaPagamento: formaPagamento as unknown as FormaPagamentoType,
      valorPago: gerarDoublePorValorMonetario(valorPago),
      troco: troco,
      desconto: desconto ? parseFloat(desconto) : 0,
      valorTotal: valorTotal,
      cliente: clienteSelecionado,
    }

    atualizarVendaMutation.mutate(venda)
  }

  const handleAdicionarEstoque = (estoque: Estoque) => {
    setEstoqueSelecionado((estoques) => [...estoques, estoque])
  }

  const handleRemoverEstoque = (estoque: Estoque) => {
    setEstoqueSelecionado((estoques) => estoques.filter((estoqueAtual) => estoqueAtual !== estoque))
  }

  const { data: clientes } = useQuery<Cliente[]>({
    queryKey: ['cliente'],
    queryFn: buscarTodosClientes,
  })

  const { data: estoques } = useQuery<Estoque[]>({
    queryKey: ['estoque'],
    queryFn: buscarEstoquesNaoVendidos,
  })

  useEffect(() => {
    if (!form.getValues().valorPago) {
      return
    }
    const desconto = 1 - Number(form.getValues().desconto) / 100
    const valorTotal = estoqueSelecionado.reduce((i, a) => i + a.valorVenda, 0) * desconto
    const valorPago = gerarDoublePorValorMonetario(form.getValues().valorPago)
    const troco = valorPago - valorTotal

    form.setValue('valorTotal', valorTotal)
    form.setValue('troco', troco)
  }, [form.watch('valorPago'), form.watch('desconto'), estoqueSelecionado])

  useEffect(() => {
    if (vendaId) {
      buscarVendaPorId(vendaId).then((venda) => {
        form.setValue('valorTotal', venda.valorTotal)
        form.setValue('valorPago', gerarStringReal(venda.valorPago))
        form.setValue('troco', venda.troco)
        form.setValue('desconto', venda.desconto.toString())
        setClienteSelecionado(venda.cliente)
        setEstoqueSelecionado(venda.estoque)

        form.setValue('formaPagamento', venda.formaPagamento)
      })
    }
  }, [vendaId])

  useEffect(() => {
    const desconto = 1 - Number(form.getValues().desconto) / 100
    const valorTotal = estoqueSelecionado.reduce((i, a) => i + a.valorVenda, 0) * desconto
    form.setValue('valorTotal', valorTotal)
  }, [estoqueSelecionado, form.watch('desconto')])

  return (
    <DialogContent className="sm:max-w-[64rem]">
      <DialogHeader>
        <DialogTitle>Cadastro de Venda</DialogTitle>
        <DialogDescription>Insira abaixo os dados da venda.</DialogDescription>
      </DialogHeader>
      <div className="flex gap-4 py-4">

        <div className="border rounded-lg p-2 h-80 flex flex-col flex-1">
          <h2 className="font-semibold text-lg">Resumo da venda</h2>
          <div className="overflow-y-auto h-56 [&>*]:border-t">
            {estoqueSelecionado.map((estoque) => (
              <div key={estoque.id} className="flex justify-between p-1 gap-1 items-center first:border-t-0">
                <div className="flex-1">
                  <h4 className="font-normal">
                    {estoque.nome} - {estoque.cor}
                  </h4>
                  <p className="text-sm">{estoque.descricao}</p>
                </div>
                <p>
                  {estoque.valorVenda.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </p>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleRemoverEstoque(estoque)}
                  className="text-red-500">
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </div>
            ))}
            {estoqueSelecionado.length === 0 && (
              <div
                className="h-full w-full first:border-t-0 flex items-center justify-center text-lg font-normal text-gray-700">
                Nenhum Item selecionado
              </div>
            )}
          </div>
          <div className="flex items-center flex-1 borde border-t p-2">
            <div className="flex-1">
              Total:{' '}
              {form.watch('valorTotal').toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </div>
            <div className="flex-1">
              Troco:{' '}
              <span className={form.getValues().troco >= 0 ? 'text-green-500' : 'text-red-500'}>
                {form.watch('troco').toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
              </span>
            </div>
          </div>
        </div>

        <div className="w-[32rem]">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="h-full">
              <div className="flex flex-col gap-3 h-full">
                <FormItem className="mb-10">
                  <FormLabel>Produtos comprados*</FormLabel>
                  <FormControl>
                    <ProcurarEstoqueInput
                      adicionarEstoque={handleAdicionarEstoque}
                      placeholder="Selecione o estoque"
                      estoques={estoques && estoques.filter((estoque) => !estoqueSelecionado.includes(estoque))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>

                <div className="flex gap-2">
                  <FormField
                    control={form.control}
                    name="formaPagamento"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Foma de Pagamento*</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione uma forma..." />
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="desconto"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Desconto*</FormLabel>
                        <div className="flex items-center gap-2">
                          <FormControl>
                            <Input className="w-28" placeholder="Desconto" {...field} />
                          </FormControl>
                          %
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex gap-2">
                  <FormField
                    control={form.control}
                    name="valorPago"
                    render={({ field }) => (
                      <FormItem className="flex-1">
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
                  <FormItem className="flex-1 h-full">
                    <div>
                      <FormLabel>Cliente</FormLabel>
                    </div>
                    <FormControl>
                      <ProcurarClienteInput
                        clienteSelecionado={clienteSelecionado}
                        selecionarCliente={setClienteSelecionado}
                        listaCliente={clientes}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </div>

                <div className="flex gap-2 justify-end flex-1 items-end">
                  <Button onClick={form.handleSubmit(onSubmit)} type="submit">
                    Atualizar Venda
                  </Button>
                  <DialogClose asChild>
                    <Button ref={refBtnClose} type="button" variant="destructive">
                      Cancelar
                    </Button>
                  </DialogClose>
                </div>
              </div>

              <Button className="hidden" type="submit"></Button>
            </form>
          </Form>
        </div>
      </div>
    </DialogContent>
  )
}
