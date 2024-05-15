import { ipcMain } from 'electron'
import { RelatorioType } from '../models/relatorio'
import { buscarCaixasPorData } from '../repository/RepositorioCaixa'
import { buscarTodosClientes } from '../repository/RepositorioCliente'
import { buscarContasPorData } from '../repository/RepositorioConta'
import { buscarTodosEstoques } from '../repository/RepositorioEstoque'
import { buscarVendasPorData } from '../repository/RepositorioVenda'

const gerarRelatorio = (startDate: string, endDate: string) => {
  const converterData = (data: string) => {
    const [dia, mes, ano] = data.split('/')
    return `${ano}-${dia}-${mes}`
  }
  const caixasData = buscarCaixasPorData(converterData(startDate), converterData(endDate))
  const vendasData = buscarVendasPorData(converterData(startDate), converterData(endDate))
  const estoquesData = buscarTodosEstoques()
  const contasData = buscarContasPorData(converterData(startDate), converterData(endDate))
  const clientesData = buscarTodosClientes()
  console.log(vendasData)

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
