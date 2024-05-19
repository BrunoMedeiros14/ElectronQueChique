import { zodResolver } from '@hookform/resolvers/zod'
import { useNumberFormat } from '@react-input/number-format'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Trash2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Conta } from '../../../src-electron/models/Conta'
import { buscarContasNaoPagas, criarContaPagaNoCaixa, pagarContaNoCaixa } from '../../api/contasApi'
import { InputComMascara } from '../../components/InputComMascara'
import { Switch } from '../../components/ui/switch'
import { gerarDatePorString, gerarDoublePorValorMonetario, gerarStringPorDate } from '../../utils/conversores'
import { Button } from '../ui/button'
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'

const formSchemaConta = z.object({
  contaId: z.number().nullable().optional(),
  nome: z.string({ message: 'Campo Obrigatório.' }).min(3, { message: 'Nome Deve Conter Pelo Menos 3 Letras' }),
  descricao: z
    .string({ message: 'Campo Obrigatório.' })
    .min(3, { message: 'Descrição Deve Possuir Pelo Menos 3 Letras' }),
  valor: z.string({ message: 'Campo Obrigatório' }),
  dataVencimento: z.string().nullable(),
  dataPagamento: z.string().nullable(),
  pago: z.boolean().nullable(),
})

const GerarFormVazioConta = () =>
  useForm<z.infer<typeof formSchemaConta>>({
    resolver: zodResolver(formSchemaConta),
    defaultValues: {
      contaId: null,
      nome: '',
      descricao: '',
      valor: '',
      dataVencimento: '',
      dataPagamento: '',
      pago: false,
    },
  })

export function DialogAdicionarSaidaDeValores({ isOpen }: { isOpen: boolean }) {
  const queryClient = useQueryClient()
  const refBtnClose = useRef<HTMLButtonElement>()

  const form = GerarFormVazioConta()

  const criarContaPagaNoCaixaAsync = (conta: Conta) => {
    return new Promise((resolve, reject) => {
      try {
        const result = criarContaPagaNoCaixa(conta)
        resolve(result)
      } catch (error) {
        reject(error)
      }
    })
  }

  const cadastrarContaMutation = useMutation({
    mutationFn: criarContaPagaNoCaixaAsync,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contas'] })
      refBtnClose.current.click()
    },
  })

  const pagarContaNoCaixaAsync = (conta: Conta) => {
    return new Promise((resolve, reject) => {
      try {
        const result = pagarContaNoCaixa(conta)
        resolve(result)
      } catch (error) {
        reject(error)
      }
    })
  }

  const atualizarContaMutation = useMutation({
    mutationFn: pagarContaNoCaixaAsync,
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

  function onSubmitNew({
    nome,
    descricao,
    valor,
    dataVencimento,
    dataPagamento,
    pago,
  }: z.infer<typeof formSchemaConta>) {
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

  function onSubmitUpdate({
    contaId,
    nome,
    descricao,
    valor,
    dataVencimento,
    dataPagamento,
    pago,
  }: z.infer<typeof formSchemaConta>) {
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
    if (isOpen) {
      form.setValue('nome', '')
      form.setValue('descricao', '')
      form.setValue('valor', '')
      form.setValue('dataVencimento', '')
      form.setValue('dataPagamento', '')
      form.setValue('pago', false)
    }
  }, [isOpen])

  const { data: contas } = useQuery<Conta[]>({
    queryKey: ['conta'],
    queryFn: buscarContasNaoPagas,
  })

  const [contasSelecionadas, setContaSelecionada] = useState<Conta[]>([])

  const handleRemoverConta = (conta: Conta) => {
    setContaSelecionada((contas) => contas.filter((contasAtuais) => contasAtuais !== conta))
  }

  const handleAdicionarConta = (conta: Conta) => {
    setContaSelecionada((contas) => [...contas, conta])
  }

  return (
    <DialogContent className='sm:max-w-[425px]'>
      <DialogHeader>
        <DialogTitle>Cadastro de Conta</DialogTitle>
        <DialogDescription>Insira abaixo os dados da conta.</DialogDescription>
      </DialogHeader>
      <div className='grid gap-4 py-4'>
        {/* <ProcurarContaInput
          adicionarConta={handleAdicionarConta}
          placeholder='Selecione a conta'
          contas={contas && contas.filter((conta) => !contasSelecionadas.includes(conta))}
        /> */}

        <div className='border rounded-lg p-2 h-80 flex flex-col flex-1'>
          <h2 className='font-semibold text-lg'>Contas a Pagar</h2>
          <div className='overflow-y-auto h-56 [&>*]:border-t'>
            {contasSelecionadas.map((conta) => (
              <div key={conta.id} className='flex justify-between p-1 gap-1 items-center first:border-t-0'>
                <div className='flex-1'>
                  <h4 className='font-normal'>
                    {conta.nome} - {conta.valor} - {gerarStringPorDate(conta.dataVencimento)}
                  </h4>
                  <p className='text-sm'>{conta.descricao}</p>
                </div>
                <p>
                  {conta.valor.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </p>
                <Button size='icon' variant='ghost' onClick={() => handleRemoverConta(conta)} className='text-red-500'>
                  <Trash2 className='h-4 w-4' />
                  <span className='sr-only'>Delete</span>
                </Button>
              </div>
            ))}
            {contasSelecionadas.length === 0 && (
              <div className='h-full w-full first:border-t-0 flex items-center justify-center text-lg font-normal text-gray-700'>
                Nenhuma Conta Selecionada
              </div>
            )}
          </div>
          <div className='flex items-center flex-1 borde border-t p-2'>
            <div className='flex-1'>Total: {form.watch('valor')}</div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmitNew)} className='grid grid-cols-2 gap-3'>
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
        <Button onClick={form.handleSubmit(onSubmitNew)} type='submit'>
          Pagar Contas
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
