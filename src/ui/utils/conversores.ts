const formatoData = new Intl.DateTimeFormat("pt-Br", { dateStyle: "short" });
const formatoReal = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })

export const gerarDatePorString = (dataString: string) => {
  if (dataString) {
    const [dia, mes, ano] = dataString.split("/");
    return new Date(+ano, +mes - 1, +dia);
  }
  return null;
};

export const gerarStringPorDate = (dataNascimento: Date) => dataNascimento
  ? formatoData.format(dataNascimento)
  : null;

export const gerarStringReal = (valor: number) => formatoReal.format(valor)

export const gerarDoublePorValorMonetario = (valor: string): number => parseFloat(valor.replace(/[^\d,]/g, '').replace(',', '.'));