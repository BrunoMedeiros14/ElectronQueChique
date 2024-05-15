import { ipcMain } from 'electron'
import { RelatorioType } from '../models/relatorio'
import { buscarCaixasPorData } from '../repository/RepositorioCaixa'
import { buscarClientesPorData } from '../repository/RepositorioCliente'
import { buscarContasPorData } from '../repository/RepositorioConta'
import { buscarEstoquesPorData } from '../repository/RepositorioEstoque'
import { buscarVendasPorData } from '../repository/RepositorioVenda'

const gerarRelatorio = (startDate: string, endDate: string) => {
  const converterData = (data: string) => {
    const [dia, mes, ano] = data.split('/')
    return `${ano}-${dia}-${mes}`
  }
  const caixasData = buscarCaixasPorData(converterData(startDate), converterData(endDate))
  const vendasData = buscarVendasPorData(converterData(startDate), converterData(endDate))
  const estoquesData = buscarEstoquesPorData(converterData(startDate), converterData(endDate))
  const contasData = buscarContasPorData(converterData(startDate), converterData(endDate))
  const clientesData = buscarClientesPorData(converterData(startDate), converterData(endDate))

  const relatorio = {
    caixasData,
    vendasData,
    estoquesData,
    contasData,
    clientesData,
  }
  console.log('🚀 ~ gerarRelatorio ~ relatorio:', relatorio)

  return relatorio
}

// console.log(gerarRelatorio('2020-01-01', '2025-01-01'))
// console.log(gerarRelatorio('01/01/2020', '01/01/2025'))

export function servicoRelatorio() {
  ipcMain.handle(
    'gerarRelatorio',
    (_, startDate: string, endDate: string): RelatorioType => gerarRelatorio(startDate, endDate)
  )
}
