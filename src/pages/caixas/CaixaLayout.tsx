import { useQuery } from '@tanstack/react-query'
import { useRef, useState } from 'react'
import { FaCashRegister } from 'react-icons/fa'
import { Navigate } from 'react-router-dom'
import { Caixa } from '../../../src-electron/models/Caixa'
import { buscarCaixaAtivo } from '../../api/caixasApi'
import { Button } from '../../components/ui/button'
import { Dialog, DialogTrigger } from '../../components/ui/dialog'
import { DialogCadastrarCaixa } from './caixasDialog'

export function Component() {
  const { data: caixa } = useQuery<Caixa>({
    queryKey: ['caixas'],
    queryFn: buscarCaixaAtivo,
  })

  return caixa !== null ? <Navigate to='painel' replace /> : <ComponenteIniciarCaixa />
}

function ComponenteIniciarCaixa() {
  const refBotaoCadastro = useRef<HTMLButtonElement>()
  const [dialogAberto, setDialogAberto] = useState(false)

  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <h1 className='text-5xl font-bold'>Caixa Fechado, Abra Um Novo</h1>
      <div className='mt-20 flex items-center justify-between py-3 gap-2'>
        <Dialog onOpenChange={setDialogAberto}>
          <DialogTrigger asChild>
            <Button ref={refBotaoCadastro} className='w-140 h-110 ml-auto text-white bg-blue-500 text-5xl p-4'>
              <FaCashRegister className='mr-4 text-5xl' />
              Abrir Caixa
            </Button>
          </DialogTrigger>
          <DialogCadastrarCaixa isOpen={dialogAberto} />
        </Dialog>
      </div>
    </div>
  )
}
