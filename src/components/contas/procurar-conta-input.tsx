import { useRef, useState } from 'react'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../ui/command'
import { Conta } from '../../../src-electron/models/conta'

interface InputBuscaProps {
  placeholder?: string
  contas: Conta[]
  adicionarConta: (conta: Conta) => void
}


export default function ProcurarContaInput({
                                             placeholder = '',
                                             contas,
                                             adicionarConta,
                                           }: InputBuscaProps) {
  const commandRef = useRef<HTMLInputElement>()

  const [filtro, setFiltro] = useState<string>('')
  const [isFocused, setIsFocused] = useState(false)

  const handleAdicionarConta = (conta: Conta) => {
    commandRef.current.blur()
    adicionarConta(conta)
  }

  return (
    <div className="block col-span-2 w-[32rem] bg-red-500">
      <Command
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        ref={commandRef}
        className="rounded-lg border absolute h-fit w-[inherit]"
        shouldFilter={false}
      >
        <CommandInput
          className="h-10"
          placeholder={placeholder}
          value={filtro}
          onValueChange={setFiltro}
        />

        <CommandList
          className={`${!isFocused && 'hidden'} max-h-48 z-10 bg-white`}
        >
          <CommandEmpty>Sem Contas A Pagar.</CommandEmpty>

          <CommandGroup>
            {contas &&
              contas
                .filter((conta) =>
                  conta.nome.toLowerCase().includes(filtro),
                )
                .map((conta) => (
                  <CommandItem
                    onSelect={() => handleAdicionarConta(conta)}
                    key={conta.id}
                    className="flex justify-between"
                  >
                    <span className="flex-1">{`${conta.nome} - ${conta.dataVencimento} - ${conta.valor}`} </span>
                    <span>
                      {conta.valor.toLocaleString('pt-BR', {
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
