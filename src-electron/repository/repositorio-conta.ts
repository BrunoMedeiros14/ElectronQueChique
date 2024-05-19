import db from '../config/banco-de-dados'
import { Conta } from '../models/conta'
import { ContaParaRelatorio } from '../models/relatorio'
import { buscarTodosCaixas } from './repositorio-caixa'

type ContaDb = {
  id: number
  nome: string
  valor: number
  descricao: string
  data_vencimento: string
  data_pagamento: string
  pago: number
  caixaId?: number
}

const contaParaModelDb = (conta: Conta, caixaId?: number): ContaDb => ({
  id: conta.id,
  nome: conta.nome,
  valor: conta.valor,
  descricao: conta.descricao,
  data_pagamento: conta.dataPagamento ? conta.dataPagamento.toISOString().split('T')[0] : null,
  data_vencimento: conta.dataVencimento ? conta.dataVencimento.toISOString().split('T')[0] : null,
  pago: conta.pago ? 1 : 0,
  caixaId: caixaId,
})

const modelDbParaConta = (contaDb: ContaDb): Conta => ({
  id: contaDb.id,
  nome: contaDb.nome,
  valor: contaDb.valor,
  descricao: contaDb.descricao,
  dataVencimento: contaDb.data_vencimento ? new Date(contaDb.data_vencimento) : null,
  dataPagamento: contaDb.data_pagamento ? new Date(contaDb.data_pagamento) : null,
  pago: contaDb.pago === 1,
})

const modelDbParaContaParaRelatorio = (contaDb: ContaDb): ContaParaRelatorio => ({
  id: contaDb.id,
  nome: contaDb.nome,
  valor: `R$ ${contaDb.valor.toFixed(2)}`,
  descricao: contaDb.descricao,
  dataVencimento: contaDb.data_vencimento ? new Date(contaDb.data_vencimento) : null,
  dataPagamento: contaDb.data_pagamento ? new Date(contaDb.data_pagamento) : null,
  pago: contaDb.pago === 1 ? 'Sim' : 'Não',
})

export const criarConta = (conta: Conta) => {
  const contaDb = contaParaModelDb(conta)
  const insertQuery = `
    INSERT INTO contas (nome , valor , descricao , data_vencimento , data_pagamento , pago)
    VALUES (@nome , @valor , @descricao , @data_vencimento , @data_pagamento , @pago)
  `

  return db.prepare(insertQuery).run(contaDb)
}

export const buscarContaPorId = (contaId: number): Conta => {
  const selectQuery = `
    SELECT * FROM contas WHERE id = ?
  `

  const stmt = db.prepare(selectQuery)
  const contaDb = stmt.get(contaId) as ContaDb

  return modelDbParaConta(contaDb)
}

export const buscarTodasContas = () => {
  const selectAllQuery = `
    SELECT * FROM contas
  `

  const contasDb = db.prepare(selectAllQuery).all() as ContaDb[]
  return contasDb.map((contaDb) => modelDbParaConta(contaDb))
}

export const buscarTodasContasParaRelatorio = () => {
  const selectAllQuery = `
    SELECT * FROM contas
  `

  const contasDb = db.prepare(selectAllQuery).all() as ContaDb[]
  return contasDb.map((contaDb) => modelDbParaContaParaRelatorio(contaDb))
}

export const editarConta = (conta: Conta) => {
  const contaDb = contaParaModelDb(conta)
  const updateQuery = `
    UPDATE contas
    SET nome = @nome , valor = @valor , descricao = @descricao ,
      data_vencimento = @data_vencimento , data_pagamento = @data_pagamento , pago = @pago
    WHERE id = @id
  `

  return db.prepare(updateQuery).run(contaDb)
}

export const removerConta = (id: number) => {
  const deleteQuery = `
    DELETE FROM contas WHERE id = ?
  `

  return db.prepare(deleteQuery).run(id)
}

export const buscarContasPorData = (dataInicio: string, dataFim: string) => {
  const selectQuery = `
    SELECT * FROM contas WHERE data_vencimento BETWEEN ? AND ?
  `

  const stmt = db.prepare(selectQuery)
  const contasDb = stmt.all(dataInicio, dataFim) as ContaDb[]

  return contasDb.map((contaDb: ContaDb) => modelDbParaConta(contaDb))
}

export const buscarContasNaoPagas = () => {
  const selectAllQuery = `
    SELECT * FROM contas c where c.pago = 0
  `

  const contasDb = db.prepare(selectAllQuery).all() as ContaDb[]

  return contasDb.map((contaDb) => modelDbParaConta(contaDb))
}

export const criarContaPagaNoCaixa = (conta: Conta) => {
  const caixaAtivo = buscarTodosCaixas().find((caixa) => caixa.ativo === true)

  if (!caixaAtivo) {
    throw new Error('Nenhum caixa ativo encontrado')
  }

  conta.dataPagamento = new Date()
  conta.pago = true

  const contaDb = contaParaModelDb(conta, caixaAtivo.id)

  const insertQuery = `
    INSERT INTO contas (nome , valor , descricao , data_vencimento , data_pagamento , pago, caixa_id)
    VALUES (@nome , @valor , @descricao , @data_vencimento , @data_pagamento , @pago, @caixaId)
  `

  return db.prepare(insertQuery).run(contaDb)
}

export const pagarContaNoCaixa = (conta: Conta) => {
  const caixaAtivo = buscarTodosCaixas().find((caixa) => caixa.ativo === true)

  if (!caixaAtivo) {
    throw new Error('Nenhum caixa ativo encontrado')
  }

  conta.dataPagamento = new Date()
  conta.pago = true

  const contaDb = contaParaModelDb(conta, caixaAtivo.id)

  const updateQuery = `
    UPDATE contas
    SET nome = @nome , valor = @valor , descricao = @descricao ,
      data_vencimento = @data_vencimento , data_pagamento = @data_pagamento , pago = @pago, caixa_id = @caixaId
    WHERE id = @id
  `

  return db.prepare(updateQuery).run(contaDb)
}
