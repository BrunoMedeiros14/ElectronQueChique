import { zodResolver } from '@hookform/resolvers/zod'
import { useNumberFormat } from '@react-input/number-format'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Conta } from '../../../src-electron/models/Conta'
import { atualizarContaApi, buscarContaPorId, cadastrarContaApi } from '../../api/contasApi'
import { InputComMascara } from '../../components/InputComMascara'
import { Button } from '../../components/ui/button'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../components/ui/form'
import { Input } from '../../components/ui/input'
import { Switch } from '../../components/ui/switch'
import {
  gerarDatePorString,
  gerarDoublePorValorMonetario,
  gerarStringPorDate,
  gerarStringReal,
} from '../../utils/conversores'

const formSchema = z.object({
  nome: z.string({ message: 'Campo Obrigatório.' }).min(3, { message: 'Nome Deve Conter Pelo Menos 3 Letras' }),
  descricao: z
    .string({ message: 'Campo Obrigatório.' })
    .min(3, { message: 'Descrição Deve Possuir Pelo Menos 3 Letras' }),
  valor: z.string({ message: 'Campo Obrigatório' }),
  dataVencimento: z.string().nullable(),
  dataPagamento: z.string().nullable(),
  pago: z.boolean().nullable(),
})

const gerarFormVazio = () =>
  useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: '',
      descricao: '',
      valor: '',
      dataVencimento: '',
      dataPagamento: '',
      pago: false,
    },
  })

export function DialogCadastrarConta({ isOpen }: { isOpen: boolean }) {
  const queryClient = useQueryClient()

  const refBtnClose = useRef<HTMLButtonElement>()
  const valorMonetario = useNumberFormat({
    locales: 'pt-BR',
    format: 'currency',
    currency: 'BRL',
  })

  const cadastrarContaMutation = useMutation({
    mutationFn: cadastrarContaApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contas'] })
      refBtnClose.current.click()
    },
  })

  const form = gerarFormVazio()

  useEffect(() => {
    if (isOpen) {
      form.setValue('nome', '')
      form.setValue('descricao', '')
      form.setValue('valor', '')
      form.setValue('dataVencimento', '')
      form.setValue('dataPagamento', '')
      form.setValue('pago', false)
    }
  }, [isOpen])

  function onSubmit({ nome, descricao, valor, dataVencimento, dataPagamento, pago }: z.infer<typeof formSchema>) {
    const conta: Conta = {
      nome,
      descricao,
      valor: gerarDoublePorValorMonetario(valor) || 0,
      dataVencimento: gerarDatePorString(dataVencimento),
      dataPagamento: gerarDatePorString(dataPagamento),
      pago,
    }

    cadastrarContaMutation.mutate(conta)
  }

  return (
    <DialogContent className='sm:max-w-[425px]'>
      <DialogHeader>
        <DialogTitle>Cadastrar Conta</DialogTitle>
        <DialogDescription>Insira abaixo os dados da conta.</DialogDescription>
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
                    <Input placeholder='Nome da Conta' {...field} />
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
                  <FormLabel>Descrição*</FormLabel>
                  <FormControl>
                    <Input placeholder='Descrição da Conta' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='valor'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor*</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Valor da Conta'
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
              name='dataVencimento'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de Vencimento</FormLabel>
                  <FormControl>
                    <InputComMascara radix='.' mask={'00/00/0000'} unmask={true} placeholder='dd/mm/aaaa' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='dataPagamento'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de Pagamento</FormLabel>
                  <FormControl>
                    <InputComMascara radix='.' mask={'00/00/0000'} unmask={true} placeholder='dd/mm/aaaa' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='pago'
              render={({ field }) => (
                <FormItem className='flex gap-2 items-center justify-center'>
                  <FormLabel className='mt-2'>Pago</FormLabel>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
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
          Cadastrar Conta
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

export function DialogAtualizarConta({ contaId }: { contaId?: number }) {
  const queryClient = useQueryClient()

  const refBtnClose = useRef<HTMLButtonElement>()

  const atualizarContaMutation = useMutation({
    mutationFn: atualizarContaApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contas'] })
      refBtnClose.current.click()
    },
  })

  const valorMonetario = useNumberFormat({
    locales: 'pt-BR',
    format: 'currency',
    currency: 'BRL',
  })

  const form = gerarFormVazio()

  function onSubmit({ nome, descricao, valor, dataVencimento, dataPagamento, pago }: z.infer<typeof formSchema>) {
    const conta: Conta = {
      id: contaId,
      nome,
      descricao,
      valor: gerarDoublePorValorMonetario(valor) || 0,
      dataVencimento: gerarDatePorString(dataVencimento),
      dataPagamento: gerarDatePorString(dataPagamento),
      pago,
    }
    atualizarContaMutation.mutate(conta)
  }

  useEffect(() => {
    if (contaId) {
      buscarContaPorId(contaId).then(({ nome, descricao, valor, dataVencimento, dataPagamento, pago }) => {
        form.setValue('nome', nome)
        form.setValue('descricao', descricao)
        form.setValue('valor', gerarStringReal(valor))
        form.setValue('dataVencimento', gerarStringPorDate(dataVencimento))
        form.setValue('dataPagamento', gerarStringPorDate(dataPagamento))
        form.setValue('pago', pago)
      })
    }
  }, [contaId])

  return (
    <DialogContent className='sm:max-w-[32rem]'>
      <DialogHeader>
        <DialogTitle>Atualizar Conta {form.getValues().nome}</DialogTitle>
        <DialogDescription>Insira abaixo os dados atualizados da conta.</DialogDescription>
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
                    <Input placeholder='Nome da Conta' {...field} />
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
                  <FormLabel>Descrição*</FormLabel>
                  <FormControl>
                    <Input placeholder='Descrição da Conta' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='valor'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor*</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Valor da Conta'
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
              name='dataVencimento'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de Vencimento</FormLabel>
                  <FormControl>
                    <InputComMascara radix='.' mask={'00/00/0000'} unmask={true} placeholder='dd/mm/aaaa' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='dataPagamento'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de Pagamento</FormLabel>
                  <FormControl>
                    <InputComMascara radix='.' mask={'00/00/0000'} unmask={true} placeholder='dd/mm/aaaa' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='pago'
              render={({ field }) => (
                <FormItem className='flex gap-2 items-center justify-center'>
                  <FormLabel className='mt-2'>Pago</FormLabel>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
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
        <Button onClick={form.handleSubmit(onSubmit)} className='bg-blue-500' type='submit'>
          Atualizar Conta
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
