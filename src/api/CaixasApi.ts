import { Caixa } from '../../src-electron/models/Caixa'

export const buscarCaixaAtivo = async () =>
  await window.apiCaixa
    .buscarTodosCaixas()
    .then((caixas) => caixas.find((caixa) => caixa.dataHoraFechamento === null) || null)

export const buscarCaixaPorId = async (caixaId: number) => await window.apiCaixa.buscarCaixaPorId(caixaId)

export const atualizarCaixaApi = async (caixa: Caixa) => await window.apiCaixa.editarCaixa(caixa)

export const cadastrarCaixaApi = async (caixa: Caixa) => await window.apiCaixa.criarCaixa(caixa)

export const removerCaixaApi = async (caixaId: number) => await window.apiCaixa.removerCaixa(caixaId)
