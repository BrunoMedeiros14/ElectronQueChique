import { subDays } from 'date-fns'
import { useRef, useState } from 'react'
import { DateRange } from 'react-day-picker'
import * as XLSX from 'xlsx'
import { gerarRelatorio } from '../api/relatorioApi'
import { gerarStringPorDate } from '../utils/conversores'
import { CalendarioComponente } from './DataPicker'
import { Button } from './ui/button'
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'

export default function GerarRelatorioComponent() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  })
  const refBotaoFechar = useRef<HTMLButtonElement | null>()

  const emitirRelatorio = async () => {
    const dataInicial = gerarStringPorDate(date.from)
    const dataFinal = gerarStringPorDate(date.to)

    const { caixasData, vendasData, estoquesData, contasData, clientesData } = await gerarRelatorio(
      dataInicial,
      dataFinal
    )

    const data = [
      { key: 'caixas', value: caixasData },
      { key: 'vendas', value: vendasData },
      { key: 'estoques', value: estoquesData },
      { key: 'contas', value: contasData },
      { key: 'clientes', value: clientesData },
    ]

    const workbook = XLSX.utils.book_new()

    data.forEach((item) => {
      const worksheet = XLSX.utils.json_to_sheet(item.value)
      XLSX.utils.book_append_sheet(workbook, worksheet, item.key)
    })

    const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'binary' })

    const s2ab = (s: string) => {
      const buf = new ArrayBuffer(s.length)
      const view = new Uint8Array(buf)
      for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff
      return buf
    }

    const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' })
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = 'relatorio.xlsx'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    refBotaoFechar.current.click()
  }

  return (
    <DialogContent className='sm:max-w-[24rem]'>
      <DialogHeader>
        <DialogTitle>Gerar relatório</DialogTitle>
        <DialogDescription>Preencha o intervalo de data do qual você deseja gerar o relatório.</DialogDescription>
      </DialogHeader>
      <CalendarioComponente data={date} setData={setDate} />
      <Button className='hidden' type='submit'></Button>
      <DialogFooter>
        <Button onClick={emitirRelatorio} className='bg-blue-500' type='submit'>
          Emitir Relatório
        </Button>
        <DialogClose asChild>
          <Button ref={refBotaoFechar} type='button' variant='destructive'>
            Cancelar
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  )
}
