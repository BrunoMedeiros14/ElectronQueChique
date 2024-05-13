import db from '../config/bancoDeDados'
import { Conta } from '../models/Conta'

type ContaDb = {
  id: number
  nome: string
  valor: number
  descricao: string
  data_vencimento: string
  data_pagamento: string
  pago: number
}

const contaParaModelDb = (conta: Conta): ContaDb => ({
  id: conta.id,
  nome: conta.nome,
  valor: conta.valor,
  descricao: conta.descricao,
  data_pagamento: conta.dataPagamento
    ? conta.dataPagamento.toISOString().split('T')[0]
    : null,
  data_vencimento: conta.dataVencimento
    ? conta.dataVencimento.toISOString().split('T')[0]
    : null,
  pago: conta.pago ? 1 : 0,
})

const modelDbParaConta = (contaDb: ContaDb): Conta => ({
  id: contaDb.id,
  nome: contaDb.nome,
  valor: contaDb.valor,
  descricao: contaDb.descricao,
  dataVencimento: contaDb.data_vencimento
    ? new Date(contaDb.data_vencimento)
    : null,
  dataPagamento: contaDb.data_pagamento
    ? new Date(contaDb.data_pagamento)
    : null,
  pago: contaDb.pago === 1,
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
  `;

  const stmt = db.prepare(selectQuery);
  const contasDb = stmt.all(dataInicio, dataFim) as ContaDb[];

  return contasDb.map((contaDb: ContaDb) => modelDbParaConta(contaDb));
}
