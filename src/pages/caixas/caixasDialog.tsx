import { atualizarCaixaApi, buscarCaixaPorId, cadastrarCaixaApi } from '@/api/caixasApi'
import { buscarTodosClientes } from '@/api/clientesApi'
import { buscarEstoquesNaoVendidos } from '@/api/estoquesApi'
import { atualizarVendaApi, buscarVendaPorId } from '@/api/vendasApi'
import { InputComMascara } from '@/components/InputComMascara'
import { ProcurarClienteInput } from '@/components/ProcurarClienteInput'
import ProcurarEstoqueInput from '@/components/ProcurarEstoqueInput'
import { Button } from '@/components/ui/button'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FormaPagamento } from '@/enums/FormaPagamento'
import {
  gerarDatePorString,
  gerarDoublePorValorMonetario,
  gerarStringPorDate,
  gerarStringReal,
} from '@/utils/conversores'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNumberFormat } from '@react-input/number-format'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Trash2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { redirect } from 'react-router-dom'
import { z } from 'zod'
import { Caixa } from '../../../src-electron/models/Caixa'
import { Cliente } from '../../../src-electron/models/Cliente'
import { Estoque } from '../../../src-electron/models/Estoque'
import { Venda } from '../../../src-electron/models/Venda'
import { FormaPagamento as FormaPagamentoType } from '../../../src-electron/models/enums/FormaPagamento'

const formSchemaCaixa = z.object({
  ativo: z.boolean(),
  dataHoraAbertura: z.string(),
  dataHoraFechamento: z.string().nullable().optional(),
  valorInicial: z.string({ message: 'Campo Obrigatório' }),
})

const gerarFormVazioCaixa = () =>
  useForm<z.infer<typeof formSchemaCaixa>>({
    resolver: zodResolver(formSchemaCaixa),
    defaultValues: {
      ativo: true,
      dataHoraAbertura: gerarStringPorDate(new Date()),
      dataHoraFechamento: '',
      valorInicial: '',
    },
  })

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

export function DialogCadastrarCaixa({ isOpen }: { isOpen: boolean }) {
  const queryClient = useQueryClient()

  const refBtnClose = useRef<HTMLButtonElement>()
  const valorMonetario = useNumberFormat({
    locales: 'pt-BR',
    format: 'currency',
    currency: 'BRL',
  })

  const cadastrarCaixaMutation = useMutation({
    mutationFn: cadastrarCaixaApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['caixas'] })
      refBtnClose.current.click()
      redirect('/caixa/painel')
    },
  })

  const form = gerarFormVazioCaixa()

  useEffect(() => {
    if (isOpen) {
      form.setValue('ativo', true)
      form.setValue('dataHoraAbertura', gerarStringPorDate(new Date()))
      form.setValue('dataHoraFechamento', null)
      form.setValue('valorInicial', '')
    }
  }, [isOpen])

  function onSubmit({ dataHoraAbertura: dataAberturaString, valorInicial }: z.infer<typeof formSchemaCaixa>) {
    const caixa: Caixa = {
      ativo: true,
      dataHoraAbertura: gerarDatePorString(dataAberturaString),
      dataHoraFechamento: null,
      valorInicial: gerarDoublePorValorMonetario(valorInicial) || 0,
      contas: [],
      vendas: [],
    }

    cadastrarCaixaMutation.mutate(caixa)
  }

  return (
    <DialogContent className='sm:max-w-[32rem]'>
      <DialogHeader>
        <DialogTitle>Abertura de Caixa</DialogTitle>
        <DialogDescription>Insira abaixo os dados do caixa.</DialogDescription>
      </DialogHeader>
      <div className='grid gap-4 py-4'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='grid grid-cols-2 gap-3'>
            <FormField
              control={form.control}
              name='dataHoraAbertura'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de Abertura*</FormLabel>
                  <FormControl>
                    <InputComMascara radix='.' mask={'00/00/0000'} unmask={true} placeholder='dd/mm/aaaa' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='valorInicial'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor Abertura do Caixa*</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Valor Inicial'
                      ref={valorMonetario}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className='hidden' type='submit'></Button>
          </form>
        </Form>
      </div>
      <DialogFooter>
        <Button onClick={form.handleSubmit(onSubmit)} type='submit'>
          Abrir Caixa
        </Button>
        <DialogClose asChild>
          <Button ref={refBtnClose} type='button' variant='destructive'>
            Cancelar
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  )
}

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
      dataVenda: new Date(),
      estoque: estoqueSelecionado,
      formaPagamento: formaPagamento as unknown as FormaPagamentoType,
      valorPago: gerarDoublePorValorMonetario(valorPago),
      troco: troco,
      desconto: desconto ? parseFloat(desconto) : null,
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
      buscarVendaPorId(vendaId).then(({ valorTotal, valorPago, troco, desconto, cliente, estoque }) => {
        form.setValue('valorTotal', valorTotal)
        form.setValue('valorPago', gerarStringReal(valorPago))
        form.setValue('troco', troco)
        form.setValue('desconto', desconto.toString())
        setClienteSelecionado(cliente)
        setEstoqueSelecionado(estoque)
      })
    }
  }, [vendaId])

  useEffect(() => {
    const desconto = 1 - Number(form.getValues().desconto) / 100
    const valorTotal = estoqueSelecionado.reduce((i, a) => i + a.valorVenda, 0) * desconto
    form.setValue('valorTotal', valorTotal)
  }, [estoqueSelecionado, form.watch('desconto')])

  return (
    <DialogContent className='sm:max-w-[64rem]'>
      <DialogHeader>
        <DialogTitle>Cadastro de Venda</DialogTitle>
        <DialogDescription>Insira abaixo os dados da venda.</DialogDescription>
      </DialogHeader>
      <div className='flex gap-4 py-4'>
        <div className='border rounded-lg p-2 h-80 flex flex-col flex-1'>
          <h2 className='font-semibold text-lg'>Resumo da venda</h2>
          <div className='overflow-y-auto h-56 [&>*]:border-t'>
            {estoqueSelecionado.map((estoque) => (
              <div key={estoque.id} className='flex justify-between p-1 gap-1 items-center first:border-t-0'>
                <div className='flex-1'>
                  <h4 className='font-normal'>
                    {estoque.nome} - {estoque.cor}
                  </h4>
                  <p className='text-sm'>{estoque.descricao}</p>
                </div>
                <p>
                  {estoque.valorVenda.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </p>
                <Button
                  size='icon'
                  variant='ghost'
                  onClick={() => handleRemoverEstoque(estoque)}
                  className='text-red-500'>
                  <Trash2 className='h-4 w-4' />
                  <span className='sr-only'>Delete</span>
                </Button>
              </div>
            ))}
            {estoqueSelecionado.length === 0 && (
              <div className='h-full w-full first:border-t-0 flex items-center justify-center text-lg font-normal text-gray-700'>
                Nenhum Item selecionado
              </div>
            )}
          </div>
          <div className='flex items-center flex-1 borde border-t p-2'>
            <div className='flex-1'>
              Total:{' '}
              {form.watch('valorTotal').toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </div>
            <div className='flex-1'>
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
        <div className='w-[32rem]'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='h-full'>
              <div className='flex flex-col gap-3 h-full'>
                <FormItem className='mb-10'>
                  <FormLabel>Produtos comprados*</FormLabel>
                  <FormControl>
                    <ProcurarEstoqueInput
                      adicionarEstoque={handleAdicionarEstoque}
                      placeholder='Selecione o estoque'
                      estoques={estoques && estoques.filter((estoque) => !estoqueSelecionado.includes(estoque))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>

                <div className='flex gap-2'>
                  <FormField
                    control={form.control}
                    name='formaPagamento'
                    render={({ field }) => (
                      <FormItem className='flex-1'>
                        <FormLabel>Foma de Pagamento*</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger>
                              <SelectValue placeholder='Selecione uma forma...' />
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
                    name='desconto'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Desconto*</FormLabel>
                        <div className='flex items-center gap-2'>
                          <FormControl>
                            <Input className='w-28' placeholder='Desconto' {...field} />
                          </FormControl>
                          %
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className='flex gap-2'>
                  <FormField
                    control={form.control}
                    name='valorPago'
                    render={({ field }) => (
                      <FormItem className='flex-1'>
                        <FormLabel>Valor Pago*</FormLabel>
                        <FormControl>
                          <Input
                            placeholder='Valor Pago'
                            ref={valorMonetario}
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormItem className='flex-1 h-full'>
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
                <div className='flex gap-2 justify-end flex-1 items-end'>
                  <Button onClick={form.handleSubmit(onSubmit)} type='submit'>
                    Cadastrar Venda
                  </Button>
                  <DialogClose asChild>
                    <Button ref={refBtnClose} type='button' variant='destructive'>
                      Cancelar
                    </Button>
                  </DialogClose>
                </div>
              </div>
              <Button className='hidden' type='submit'></Button>
            </form>
          </Form>
        </div>
      </div>
    </DialogContent>
  )
}

export function DialogFecharCaixa({ caixaId }: { caixaId?: number }) {
  const queryClient = useQueryClient()

  const refBtnClose = useRef<HTMLButtonElement>()

  const atualizarCaixaMutation = useMutation({
    mutationFn: atualizarCaixaApi,
    onSuccess: () => {
      redirect('/caixa')
      queryClient.invalidateQueries({ queryKey: ['caixas'] })
      refBtnClose.current.click()
    },
  })

  const form = gerarFormVazioCaixa()

  useEffect(() => {
    if (caixaId) {
      buscarCaixaPorId(caixaId).then(({ ativo, dataHoraAbertura, valorInicial }) => {
        form.setValue('ativo', ativo)
        form.setValue('dataHoraAbertura', gerarStringPorDate(dataHoraAbertura))
        form.setValue('dataHoraFechamento', gerarStringPorDate(new Date()))
        form.setValue('valorInicial', gerarStringReal(valorInicial))
      })
    }
  }, [caixaId])

  async function onSubmit({ dataHoraFechamento: dataFechamentoString }: z.infer<typeof formSchemaCaixa>) {
    const currentCaixa = await buscarCaixaPorId(caixaId)

    currentCaixa.ativo = false
    currentCaixa.dataHoraFechamento = gerarDatePorString(dataFechamentoString)

    atualizarCaixaMutation.mutate(currentCaixa)
  }

  return (
    <DialogContent className='sm:max-w-[32rem]'>
      <DialogHeader>
        <DialogTitle>Fechamento do Caixa</DialogTitle>
      </DialogHeader>
      <div className='grid gap-4 py-4'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='grid grid-cols-2 gap-3'>
            <FormField
              control={form.control}
              name='dataHoraFechamento'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de Fechamento*</FormLabel>
                  <FormControl>
                    <InputComMascara radix='.' mask={'00/00/0000'} unmask={true} placeholder='dd/mm/aaaa' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className='hidden' type='submit'></Button>
          </form>
        </Form>
      </div>
      <DialogFooter>
        <Button onClick={form.handleSubmit(onSubmit)} type='submit'>
          Fechar Caixa
        </Button>
        <DialogClose asChild>
          <Button ref={refBtnClose} type='button' variant='destructive'>
            Cancelar
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  )
}
