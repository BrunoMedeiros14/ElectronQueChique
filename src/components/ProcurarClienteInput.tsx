import React from 'react'
import { Cliente } from '../../src-electron/models/Cliente'
import { Button } from './ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/command'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'

export function ProcurarClienteInput({
  clienteSelecionado,
  selecionarCliente,
  listaCliente,
}: {
  clienteSelecionado: Cliente | null
  selecionarCliente: (cliente: Cliente | null) => void
  listaCliente: Cliente[]
}) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant='outline' className='w-full'>
          {clienteSelecionado ? <>{clienteSelecionado.nome}</> : <>Selecione o cliente</>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className=' p-0' align='start'>
        <Command>
          <CommandInput placeholder='Filtre por nome...' />
          <CommandList>
            <CommandEmpty>Nenhum cliente encontrado.</CommandEmpty>
            <CommandGroup>
              {listaCliente &&
                listaCliente.map((cliente) => (
                  <CommandItem
                    key={cliente.id}
                    onSelect={() => {
                      selecionarCliente(cliente)
                      setOpen(false)
                    }}>
                    {cliente.nome}
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
