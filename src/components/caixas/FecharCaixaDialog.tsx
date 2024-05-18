import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { atualizarCaixaApi, buscarCaixaPorId } from '@/api/CaixasApi'
import { gerarDatePorString, gerarStringPorDate, gerarStringReal } from '@/utils/conversores'
import { InputComMascara } from '../InputComMascara'
import { Button } from '../ui/button'
import { DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'

const formSchemaCaixa = z.object({
  ativo: z.boolean(),
  dataHoraAbertura: z.string(),
  dataHoraFechamento: z.string().nullable().optional(),
  valorInicial: z.string({ message: 'Campo Obrigatório' }),
})

const GerarFormVazioCaixa = () =>
  useForm<z.infer<typeof formSchemaCaixa>>({
    resolver: zodResolver(formSchemaCaixa),
    defaultValues: {
      ativo: true,
      dataHoraAbertura: gerarStringPorDate(new Date()),
      dataHoraFechamento: '',
      valorInicial: '',
    },
  })

export function DialogFecharCaixa({ caixaId }: { caixaId?: number }) {
  const queryClient = useQueryClient()

  const refBtnClose = useRef<HTMLButtonElement>()

  const atualizarCaixaMutation = useMutation({
    mutationFn: atualizarCaixaApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['caixa'] })
      refBtnClose.current.click()
    },
  })

  const form = GerarFormVazioCaixa()

  useEffect(() => {
    if (caixaId) {
      buscarCaixaPorId(caixaId).then(({ ativo, dataHoraAbertura, valorInicial }) => {
        form.setValue('ativo', ativo)
        form.setValue('dataHoraAbertura', gerarStringPorDate(dataHoraAbertura))
        form.setValue('dataHoraFechamento', gerarStringPorDate(new Date()))
        form.setValue('valorInicial', gerarStringReal(valorInicial))
      })
    }
  }, [form, caixaId])

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
