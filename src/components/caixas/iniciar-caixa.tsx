import { Suspense, lazy, useRef, useState } from 'react'
import { FaCashRegister } from 'react-icons/fa'
import { Button } from '../ui/button'
import { Dialog, DialogTrigger } from '../ui/dialog'

const DialogAbrirCaixa = lazy(() => import('./abrir-caixa-dialog'))

export function ComponenteIniciarCaixa() {
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
          {dialogAberto && (
            <Suspense fallback={<>Carregando...</>}>
              <DialogAbrirCaixa />
            </Suspense>
          )}
        </Dialog>
      </div>
    </div>
  )
}
