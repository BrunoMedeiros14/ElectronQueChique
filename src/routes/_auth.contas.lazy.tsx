import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { createLazyFileRoute } from '@tanstack/react-router'
import { Receipt } from 'lucide-react'
import { useRef, useState } from 'react'
import { buscarContas, removerContaApi } from '../api/contas-api'
import { pegarColunasConta } from '../components/contas/contas-colunas'
import { DialogAtualizarConta, DialogCadastrarConta } from '../components/contas/contas-dialog'
import { cn } from '../components/lib/utils'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/ui/alert-dialog'
import { Button, buttonVariants } from '../components/ui/button'
import { DataTable } from '../components/ui/data-table'
import { Dialog, DialogTrigger } from '../components/ui/dialog'
import { Input } from '../components/ui/input'
import { useEscutarCliqueTeclado } from '../hooks/escutar-clique-teclado'

export const Route = createLazyFileRoute('/_auth/contas')({
  component: Component,
  pendingComponent: () => <div>Loading...</div>,
})

export function Component() {
  const refBotaoCadastro = useRef<HTMLButtonElement>()
  const refBotaoAtualizacao = useRef<HTMLButtonElement>()

  const [searchValue, setSearchValue] = useState('')
  const [idParaExcluir, setIdParaExcluir] = useState<number>(null)
  const [idParaEditar, setIdParaEditar] = useState<number>(null)
  const [dialogAberto, setDialogAberto] = useState(false)

  const { data: contas } = useSuspenseQuery(buscarContas)
  const queryClient = useQueryClient()

  const removerContaMutation = useMutation({
    mutationFn: removerContaApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contas'] })
      setIdParaExcluir(null)
    },
  })

  const abrirEdicaoConta = (contaId: number) => {
    setIdParaEditar(contaId)
    refBotaoAtualizacao.current.click()
  }

  const colunasConta = pegarColunasConta({
    abrirEdicaoConta,
    setIdParaExcluir,
  })

  useEscutarCliqueTeclado(() => {
    refBotaoCadastro.current.click()
  }, ['F1'])

  return (
    <main className='mx-auto flex max-w-[96rem] flex-1 flex-col p-4 md:p-6'>
      <div className='flex items-center'>
        <h1 className='h-10 text-lg font-semibold md:text-2xl'>Contas</h1>
      </div>

      <div className='flex items-center justify-between gap-2 py-3'>
        <Input
          placeholder='Pesquisar contas...'
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className='max-w-lg'
        />
        <Dialog onOpenChange={setDialogAberto}>
          <DialogTrigger asChild>
            <Button ref={refBotaoCadastro} className='ml-auto h-10'>
              <Receipt className='mr-2' />
              Adicionar nova (F1)
            </Button>
          </DialogTrigger>
          <DialogCadastrarConta isOpen={dialogAberto} />
        </Dialog>
      </div>

      <DataTable
        columns={colunasConta}
        dados={contas}
        colunaParaFiltrar='nome'
        filtro={searchValue}
        textoParaVazio='Sem Dados Registrados'
      />

      {
        <AlertDialog open={idParaExcluir !== null}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>A Conta será Apagada</AlertDialogTitle>
              <AlertDialogDescription>
                Se essa ação for realizada, não será possível recuperar os dados da conta, deseja continuar?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setIdParaExcluir(null)} className='destructive'>
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                className={cn(buttonVariants({ variant: 'destructive' }))}
                onClick={() => removerContaMutation.mutate(idParaExcluir)}>
                Apagar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      }
      {
        <Dialog>
          <DialogTrigger ref={refBotaoAtualizacao} />
          <DialogAtualizarConta contaId={idParaEditar} />
        </Dialog>
      }
    </main>
  )
}
