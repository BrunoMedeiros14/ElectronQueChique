import { ipcMain } from 'electron'
import { RelatorioType } from '../models/relatorio'
import { buscarCaixasPorDataParaRelatorio } from '../repository/repositorio-caixa'
import { buscarTodosClientes } from '../repository/repositorio-cliente'
import { buscarTodasContasParaRelatorio } from '../repository/repositorio-conta'
import { buscarTodosEstoquesParaRelatorio } from '../repository/repositorio-estoque'
import { buscarVendasPorDataParaRelatorio } from '../repository/repositorio-venda'

const gerarRelatorio = (startDate: string, endDate: string) => {

  const converterDataInicio = (data: string) => {
    const [dia, mes, ano] = data.split('/')
    return `${ano}-${mes}-${dia}`
  }

  const converterDataFinal = (data: string) => {
    const [dia, mes, ano] = data.split('/')
    const dataFormatada = new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia))
    dataFormatada.setDate(dataFormatada.getDate() + 1)
    const diaFormatado = String(dataFormatada.getDate()).padStart(2, '0')
    const mesFormatado = String(dataFormatada.getMonth() + 1).padStart(2, '0')
    const anoFormatado = dataFormatada.getFullYear()
    return `${anoFormatado}-${mesFormatado}-${diaFormatado}`
  }

  const caixasData = buscarCaixasPorDataParaRelatorio(converterDataInicio(startDate), converterDataFinal(endDate))
  const vendasData = buscarVendasPorDataParaRelatorio(converterDataInicio(startDate), converterDataFinal(endDate))

  const estoquesData = buscarTodosEstoquesParaRelatorio()
  const contasData = buscarTodasContasParaRelatorio()
  const clientesData = buscarTodosClientes()

  return {
    caixasData,
    vendasData,
    estoquesData,
    contasData,
    clientesData,
  }
}

export function servicoRelatorio() {
  ipcMain.handle(
    'gerarRelatorio',
    (_, startDate: string, endDate: string): RelatorioType => gerarRelatorio(startDate, endDate),
  )
}
