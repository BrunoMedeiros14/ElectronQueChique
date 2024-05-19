import { ipcMain } from 'electron'
import { RelatorioType } from '../models/relatorio'
import { buscarCaixasPorDataParaRelatorio } from '../repository/RepositorioCaixa'
import { buscarTodosClientes } from '../repository/RepositorioCliente'
import { buscarTodasContasParaRelatorio } from '../repository/RepositorioConta'
import { buscarTodosEstoquesParaRelatorio } from '../repository/RepositorioEstoque'
import { buscarVendasPorDataParaRelatorio } from '../repository/RepositorioVenda'

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

  const relatorio = {
    caixasData,
    vendasData,
    estoquesData,
    contasData,
    clientesData,
  }

  return relatorio
}

export function servicoRelatorio() {
  ipcMain.handle(
    'gerarRelatorio',
    (_, startDate: string, endDate: string): RelatorioType => gerarRelatorio(startDate, endDate)
  )
}
