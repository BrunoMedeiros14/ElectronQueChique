const formatoReal = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

const preencherZeroNumeroData = (numero: number) => numero.toString().padStart(2, '0')

export const gerarDatePorString = (dataString: string) => {
  if (dataString) {
    const [dia, mes, ano] = dataString.split('/')
    return new Date(+ano, +mes - 1, +dia)
  }
  return null
}

export const gerarDateStringPorString = (dataString: string) => {
  if (dataString) {
    const [ano, mes, dia] = dataString.split('-')
    return `${dia}/${mes}/${ano}`
  }
  return null
}

export const gerarStringPorDate = (data: Date) =>
  data
    ? `${preencherZeroNumeroData(data.getUTCDate())}/${preencherZeroNumeroData(data.getUTCMonth() + 1)}/${data.getUTCFullYear()}`
    : null

export const gerarStringPorDateNaoUTC = (data: Date) =>
  data
    ? `${preencherZeroNumeroData(data.getDate())}/${preencherZeroNumeroData(data.getMonth() + 1)}/${data.getFullYear()}`
    : null

export const gerarStringReal = (valor: number) => formatoReal.format(valor)

export const gerarDoublePorValorMonetario = (valor: string): number =>
  parseFloat(valor.replace(/[^\d,]/g, '').replace(',', '.'))

export const gerarStringPorcentagemPorNumeroInteiro = (valor: number): string => (valor ? `${valor}%` : '0%')

export const gerarDoublePorValorPorcentagem = (valor: string): number => {
  const valorSemPorcentagem = valor.replace('%', '')
  return parseFloat(valorSemPorcentagem)
}
