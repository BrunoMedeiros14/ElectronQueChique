import { Button } from '@/components/ui/button'
import { subDays } from 'date-fns'
import { useState } from 'react'
import { DateRange } from 'react-day-picker'
import * as XLSX from 'xlsx'
import { gerarRelatorio } from '../../api/relatorioApi'
import { gerarStringPorDate } from '../../utils/conversores'
import { CalendarioComponente } from './dataPicker'

export function Component() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  })

  const emitirRelatorio = async () => {
    const dataInicial = gerarStringPorDate(date.from)
    const dataFinal = gerarStringPorDate(date.to)
    console.log(dataInicial + dataFinal)
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

    data.forEach((item, index) => {
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
  }

  return (
    <main className='flex flex-1 flex-col p-4 md:p-6 max-w-[96rem] mx-auto'>
      <div className='flex items-center justify-center'>
        <h1 className='font-semibold text-lg md:text-2xl h-10'>Relatórios por Data</h1>
      </div>
      <div className='flex flex-col items-center justify-between py-3 gap-2'>
        <CalendarioComponente data={date} setData={setDate} />
        {/* <div className='w-full max-w-md p-2 border-2 border-blue-500 rounded-md'>
          <label className='text-blue-500'>Data de Início</label>
          <input type='date' value={startDate} onChange={(e) => setStartDate(e.target.value)} className='w-full mt-1' />
        </div>
        <div className='w-full max-w-md p-2 border-2 border-blue-500 rounded-md mt-4'>
          <label className='text-blue-500'>Data de Fim</label>
          <input type='date' value={endDate} onChange={(e) => setEndDate(e.target.value)} className='w-full mt-1' />
        </div> */}
        <Button onClick={emitirRelatorio} className='mt-10 h-10'>
          Emitir Relatório
        </Button>
      </div>
    </main>
  )
}
