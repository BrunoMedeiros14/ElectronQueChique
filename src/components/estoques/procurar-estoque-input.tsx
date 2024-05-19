import { useRef, useState } from 'react'
import { Estoque } from '../../../src-electron/models/estoque'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../ui/command'

interface InputBuscaProps {
  placeholder?: string
  estoques: Estoque[]
  adicionarEstoque: (estoque: Estoque) => void
}


export default function ProcurarEstoqueInput({
  placeholder = '',
  estoques,
  adicionarEstoque,
}: InputBuscaProps) {
  const commandRef = useRef<HTMLInputElement>()

  const [filtro, setFiltro] = useState<string>('')
  const [isFocused, setIsFocused] = useState(false)

  const handleAdicionarEstoque = (estoque: Estoque) => {
    commandRef.current.blur()
    adicionarEstoque(estoque)
  }

  return (
    <div className='block col-span-2 w-[32rem] bg-red-500'>
      <Command
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        ref={commandRef}
        className='rounded-lg border absolute h-fit w-[inherit]'
        shouldFilter={false}
      >
        <CommandInput
          className='h-10'
          placeholder={placeholder}
          value={filtro}
          onValueChange={setFiltro}
        />
        <CommandList
          className={`${!isFocused && 'hidden'} max-h-48 z-10 bg-white`}
        >
          <CommandEmpty>Sem estoque cadastrado.</CommandEmpty>

          <CommandGroup>
            {estoques &&
              estoques
                .filter((estoque) =>
                  estoque.nome.toLowerCase().includes(filtro)
                )
                .map((estoque) => (
                  <CommandItem
                    onSelect={() => handleAdicionarEstoque(estoque)}
                    key={estoque.id}
                    className='flex justify-between'
                  >
                    <span className='flex-1'>{`${estoque.nome} - ${estoque.cor}`}</span>
                    <span>
                      {estoque.valorVenda.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      })}
                    </span>
                  </CommandItem>
                ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  )
}
