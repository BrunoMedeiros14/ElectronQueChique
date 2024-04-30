const formatoData = new Intl.DateTimeFormat("pt-Br", { dateStyle: "short" });

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