import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Calendar as CalendarIcon } from 'lucide-react'
import * as React from 'react'
import { DateRange } from 'react-day-picker'
import { cn } from './utils'
import { Button } from '../ui/button'
import { Calendar } from '../ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'

export function CalendarioComponente({
                                       data,
                                       setData,
                                     }: {
  data: DateRange
  setData: React.Dispatch<React.SetStateAction<DateRange>>
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id="date"
          variant={'outline'}
          className={cn('w-full justify-start text-left font-normal', !data && 'text-muted-foreground')}>
          <CalendarIcon className="mr-2 h-4 w-4" />
          {data?.from ? (
            data.to ? (
              <>
                {format(data.from, 'dd/MM/yyyy')} - {format(data.to, 'dd/MM/yyyy')}
              </>
            ) : (
              format(data.from, 'dd/MM/yyyy')
            )
          ) : (
            <span>Insira o período da exportação</span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          locale={ptBR}
          initialFocus
          mode="range"
          defaultMonth={data?.from}
          selected={data}
          onSelect={setData}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  )
}
