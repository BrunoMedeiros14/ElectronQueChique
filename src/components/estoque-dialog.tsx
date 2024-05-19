import { zodResolver } from '@hookform/resolvers/zod'
import { useNumberFormat } from '@react-input/number-format'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Estoque } from '../../src-electron/models/estoque'
import { atualizarEstoqueApi, buscarEstoquePorId, cadastrarEstoqueApi } from '../api/estoques-api'
import { Cor } from '../enums/cor'
import { Tecido } from '../enums/tecido'
import { gerarDoublePorValorMonetario } from '../utils/conversores'
import { Button } from './ui/button'
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
import { Input } from './ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'

const formSchema = z.object({
  nome: z.string({ message: 'Campo Obrigatório' }).min(3, { message: 'Nome Deve Conter Pelo Menos 3 Letras' }),
  descricao: z
    .string({ message: 'Campo obrigatório.' })
    .min(3, { message: 'Descrição Deve Conter Pelo Menos 3 Letras' }),
  cor: z.string().refine((value) => Object.values(Cor).includes(value as Cor), {
    message: 'Campo Obrigatório',
  }),
  tamanho: z.string({ message: 'Campo Obrigatório' }).min(1, { message: 'Campo Obrigatório' }),
  vendido: z.boolean(),
  tecido: z.string().refine((value) => Object.values(Tecido).includes(value as Tecido), {
    message: 'Campo Obrigatório',
  }),
  fornecedor: z.string().nullable(),
  quantidade: z.string().min(1, { message: 'Quantidade Deve Ser Declarada' }),
  valorCompra: z.string().refine((value) => value !== '', { message: 'Campo Obrigatório' }),
  valorVenda: z.string().refine((value) => value !== '', { message: 'Campo Obrigatório' }),
})

const GerarFormVazio = () =>
  useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: '',
      descricao: '',
      cor: '',
      tamanho: '',
      vendido: false,
      tecido: '',
      fornecedor: '',
      quantidade: '1',
      valorCompra: '',
      valorVenda: '',
    },
  })

export function DialogCadastrarEstoque({ isOpen }: { isOpen: boolean }) {
  const queryClient = useQueryClient()
  const form = GerarFormVazio()

  const [lucro, setLucro] = useState(0)

  const refBtnClose = useRef<HTMLButtonElement>()
  const valorMonetarioCompra = useNumberFormat({
    locales: 'pt-BR',
    format: 'currency',
    currency: 'BRL',
  })

  const valorMonetarioVenda = useNumberFormat({
    locales: 'pt-BR',
    format: 'currency',
    currency: 'BRL',
  })

  const cadastrarEstoqueMutation = useMutation({
    mutationFn: cadastrarEstoqueApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['estoques'] })
      refBtnClose.current.click()
    },
  })

  useEffect(() => {
    if (isOpen) {
      form.setValue('nome', '')
      form.setValue('descricao', '')
      form.setValue('cor', '')
      form.setValue('tamanho', '')
      form.setValue('vendido', false)
      form.setValue('tecido', '')
      form.setValue('fornecedor', '')
      form.setValue('quantidade', '1')
      form.setValue('valorCompra', '')
      form.setValue('valorVenda', '')
    }
  }, [isOpen])

  useEffect(() => {
    const valorCompra = gerarDoublePorValorMonetario(form.getValues().valorCompra)

    if (!isNaN(valorCompra)) {
      const valorComAcrescimo = valorCompra * 1.5
      const valorVendaMonetario = valorComAcrescimo.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      })

      form.setValue('valorVenda', valorVendaMonetario)
    }
  }, [form.watch('valorCompra')])

  useEffect(() => {
    const valorCompra = gerarDoublePorValorMonetario(form.getValues().valorCompra)

    const valorVenda = gerarDoublePorValorMonetario(form.getValues().valorVenda)

    if (!isNaN(valorCompra) && !isNaN(valorVenda)) {
      const lucroCalculado = valorVenda - valorCompra
      setLucro(lucroCalculado)
    } else {
      setLucro(0)
    }
  }, [form.watch('valorVenda')])

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
      cor: cor as Cor,
      tamanho,
      vendido,
      tecido: tecido as Tecido,
      fornecedor,
      quantidade: Number(quantidade),
      valorCompra: gerarDoublePorValorMonetario(valorCompra) || 0,
      valorVenda: gerarDoublePorValorMonetario(valorVenda) || 0,
    }

    cadastrarEstoqueMutation.mutate(estoque)
  }

  return (
    <DialogContent className='sm:max-w-[32rem]'>
      <DialogHeader>
        <DialogTitle>Cadastrar Estoque</DialogTitle>
        <DialogDescription>Insira abaixo os dados do estoque.</DialogDescription>
      </DialogHeader>
      <div className='grid gap-4 py-4'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='grid grid-cols-2 gap-3'>
            <FormField
              control={form.control}
              name='nome'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome*</FormLabel>
                  <FormControl>
                    <Input placeholder='Nome do produto' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='descricao'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descricao*</FormLabel>
                  <FormControl>
                    <Input placeholder='Descrição' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='cor'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cor*</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder='Selecione uma Cor' />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(Cor).map((cor) => (
                          <SelectItem key={cor} value={cor}>
                            {cor}
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
              name='tecido'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tecido*</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder='Selecione um Tecido' />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(Tecido).map((tecido) => (
                          <SelectItem key={tecido} value={tecido}>
                            {tecido}
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
              name='tamanho'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tamanho*</FormLabel>
                  <FormControl>
                    <Input placeholder='Tamanho do produto' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='fornecedor'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Marca</FormLabel>
                  <FormControl>
                    <Input placeholder='Marca do Item' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='quantidade'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantidade*</FormLabel>
                  <FormControl>
                    <Input type='number' placeholder='Quantidade' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='valorCompra'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor da Compra*</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Valor de compra'
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
              name='valorVenda'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor da Venda*</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Valor de Venda'
                      ref={valorMonetarioVenda}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <label>
                <strong>Lucro Estimado</strong>
              </label>
              <div className={`${lucro >= 0 ? 'text-green-500' : 'text-red-500'} font-bold mt-4`}>
                {isNaN(lucro)
                  ? 'R$ 0,00'
                  : lucro.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
              </div>
            </div>

            <Button className='hidden' type='submit'></Button>
          </form>
        </Form>
      </div>
      <DialogFooter>
        <Button onClick={form.handleSubmit(onSubmit)} type='submit'>
          Cadastrar Estoque
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

export function DialogAtualizarEstoque({ estoqueId }: { estoqueId?: number }) {
  const queryClient = useQueryClient()
  const form = GerarFormVazio()

  const [lucro, setLucro] = useState(0)
  const [pegouApi, setPegouApi] = useState(false)

  const refBtnClose = useRef<HTMLButtonElement>()
  const valorMonetarioCompra = useNumberFormat({
    locales: 'pt-BR',
    format: 'currency',
    currency: 'BRL',
  })

  const valorMonetarioVenda = useNumberFormat({
    locales: 'pt-BR',
    format: 'currency',
    currency: 'BRL',
  })

  const atualizarEstoqueMutation = useMutation({
    mutationFn: atualizarEstoqueApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['estoques'] })
      refBtnClose.current.click()
    },
  })

  useEffect(() => {
    if (estoqueId) {
      buscarEstoquePorId(estoqueId).then(
        ({ nome, descricao, cor, tamanho, vendido, tecido, fornecedor, quantidade, valorCompra, valorVenda }) => {
          form.setValue('nome', nome)
          form.setValue('descricao', descricao)
          form.setValue('cor', cor)
          form.setValue('tamanho', tamanho)
          form.setValue('vendido', vendido)
          form.setValue('tecido', tecido)
          form.setValue('fornecedor', fornecedor)
          form.setValue('quantidade', String(quantidade))
          form.setValue(
            'valorCompra',
            valorCompra.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            })
          )
          form.setValue(
            'valorVenda',
            valorVenda.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            })
          )
          setPegouApi(true)
        }
      )
    }
  }, [estoqueId])

  useEffect(() => {
    if (pegouApi) {
      setPegouApi(false)
      return
    }
    const valorCompra = gerarDoublePorValorMonetario(form.getValues().valorCompra)

    if (!isNaN(valorCompra)) {
      const valorComAcrescimo = valorCompra * 1.5
      const valorVendaMonetario = valorComAcrescimo.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      })

      form.setValue('valorVenda', valorVendaMonetario)
    }
  }, [form.watch('valorCompra')])

  useEffect(() => {
    const valorCompra = gerarDoublePorValorMonetario(form.getValues().valorCompra)

    const valorVenda = gerarDoublePorValorMonetario(form.getValues().valorVenda)

    if (!isNaN(valorCompra) && !isNaN(valorVenda)) {
      const lucroCalculado = valorVenda - valorCompra
      setLucro(lucroCalculado)
    } else {
      setLucro(0)
    }
  }, [form.watch('valorVenda')])

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
    }
    atualizarEstoqueMutation.mutate(estoque)
  }

  return (
    <DialogContent className='sm:max-w-[32rem]'>
      <DialogHeader>
        <DialogTitle>Atualizar {form.getValues().nome}</DialogTitle>
        <DialogDescription>Insira abaixo os dados atualizados do estoque.</DialogDescription>
      </DialogHeader>
      <div className='grid gap-4 py-4'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='grid grid-cols-2 gap-3'>
            <FormField
              control={form.control}
              name='nome'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome*</FormLabel>
                  <FormControl>
                    <Input placeholder='Nome do produto' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='descricao'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descricao*</FormLabel>
                  <FormControl>
                    <Input placeholder='Descrição' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='cor'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cor*</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder='Selecione uma Cor' />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(Cor).map((cor) => (
                          <SelectItem key={cor} value={cor}>
                            {cor}
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
              name='tecido'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tecido*</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder='Selecione um Tecido' />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(Tecido).map((tecido) => (
                          <SelectItem key={tecido} value={tecido}>
                            {tecido}
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
              name='tamanho'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tamanho*</FormLabel>
                  <FormControl>
                    <Input placeholder='Tamanho do produto' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='fornecedor'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Marca</FormLabel>
                  <FormControl>
                    <Input placeholder='Marca do Item' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='quantidade'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantidade*</FormLabel>
                  <FormControl>
                    <Input type='number' placeholder='Quantidade' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='valorCompra'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor da Compra*</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Valor de compra'
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
              name='valorVenda'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor da Venda*</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Valor de Venda'
                      ref={valorMonetarioVenda}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <label>
                <strong>Lucro Estimado</strong>
              </label>
              <div className={`${lucro >= 0 ? 'text-green-500' : 'text-red-500'} font-bold mt-4`}>
                {isNaN(lucro)
                  ? 'R$ 0,00'
                  : lucro.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
              </div>
            </div>

            <Button className='hidden' type='submit'></Button>
          </form>
        </Form>
      </div>
      <DialogFooter>
        <Button onClick={form.handleSubmit(onSubmit)} className='bg-blue-500' type='submit'>
          Atualizar Estoque
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
