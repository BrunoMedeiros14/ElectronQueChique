import { RelatorioType } from '../../src-electron/models/relatorio'

export const gerarRelatorio = (startTime: string, endTime: string): Promise<RelatorioType> =>
  window.apiRelatorio.gerarRelatorio(startTime, endTime)
