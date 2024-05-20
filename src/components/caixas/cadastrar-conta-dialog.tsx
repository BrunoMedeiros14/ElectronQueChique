import { zodResolver } from '@hookform/resolvers/zod'
import { useNumberFormat } from '@react-input/number-format'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Conta } from '../../../src-electron/models/conta'
import { criarContaPagaNoCaixa } from '@/api/contas-api'
import { InputComMascara } from '../ui/input-com-mascara'
import { gerarDatePorString, gerarDoublePorValorMonetario } from '@/utils/conversores'
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
  valor: z.string({ message: 'Campo Obrigatório' }).min(1, { message: 'Valor Deve Ser Maior Que 0' }),
  dataVencimento: z.string().nullable(),
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
                       }: z.infer<typeof formSchemaConta>) {

    let dataVencimentoDate: Date | undefined

    if (dataVencimento) {
      dataVencimentoDate = gerarDatePorString(dataVencimento)
      dataVencimentoDate.setDate(dataVencimentoDate.getDate() + 1)
    }

    const dataPagamento = new Date()
    dataPagamento.setDate(new Date().getDate() + 1)

    const conta: Conta = {
      nome,
      descricao,
      valor: gerarDoublePorValorMonetario(valor) || 0,
      dataVencimento: dataVencimentoDate,
      dataPagamento: dataPagamento,
      pago: true,
    }

    cadastrarContaMutation.mutate(conta)
  }

  useEffect(() => {
    if (isOpen) {
      form.setValue('nome', '')
      form.setValue('descricao', '')
      form.setValue('valor', '')
      form.setValue('dataVencimento', '')
    }
  }, [isOpen])

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Cadastro de Conta</DialogTitle>
        <DialogDescription>Insira abaixo os dados da conta.</DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmitNew)} className="grid grid-cols-2 gap-3">
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
                    <InputComMascara radix="." mask={'00/00/0000'} unmask={true} placeholder="dd/mm/aaaa" {...field} />
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
        <Button onClick={form.handleSubmit(onSubmitNew)} type="submit">
          Pagar Contas
        </Button>
        <DialogClose asChild>
          <Button ref={refBtnClose} type="button" variant="destructive">
            Cancelar
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  )
}
