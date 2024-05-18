import db from '../config/bancoDeDados'
import { Caixa } from '../models/Caixa'

type CaixaDb = {
  id: number
  data_hora_abertura: string
  data_hora_fechamento?: string
  valor_inicial: number
}

const caixaParaModelDb = (caixa: Caixa): CaixaDb => ({
  id: caixa.id,
  data_hora_abertura: caixa.dataHoraAbertura.toISOString(),
  data_hora_fechamento: caixa.dataHoraFechamento ? caixa.dataHoraFechamento.toISOString() : null,
  valor_inicial: caixa.valorInicial,
})

const modelDbParaCaixa = (caixaDb: CaixaDb): Caixa => ({
  id: caixaDb.id,
  ativo: !caixaDb.data_hora_fechamento,
  dataHoraAbertura: new Date(caixaDb.data_hora_abertura),
  dataHoraFechamento: caixaDb.data_hora_fechamento ? new Date(caixaDb.data_hora_fechamento) : null,
  valorInicial: caixaDb.valor_inicial,
  vendas: null,
  contas: null,
})

export const criarCaixa = (caixa: Caixa) => {
  const caixaDb = caixaParaModelDb(caixa)
  const insertQuery = `
    INSERT INTO caixas (data_hora_abertura, data_hora_fechamento, valor_inicial)
    VALUES (@data_hora_abertura, @data_hora_fechamento, @valor_inicial)
  `

  return db.prepare(insertQuery).run(caixaDb)
}

export const buscarCaixaPorId = (caixaId: number): Caixa => {
  const selectQuery = `
    SELECT * FROM caixas WHERE id = ?
  `

  const stmt = db.prepare(selectQuery)
  const caixaDb = stmt.get(caixaId) as CaixaDb

  return modelDbParaCaixa(caixaDb)
}

export const buscarCaixaAtivo = (): Caixa | null => {
  const selectQuery = `
    SELECT * FROM caixas WHERE data_hora_fechamento IS NULL
  `

  const stmt = db.prepare(selectQuery)
  const caixaDb = stmt.get() as CaixaDb

  return caixaDb ? modelDbParaCaixa(caixaDb) : null
}

export const buscarTodosCaixas = () => {
  const selectAllQuery = `
    SELECT * FROM caixas
  `

  const caixasDb = db.prepare(selectAllQuery).all() as CaixaDb[]
  return caixasDb.map((caixaDb) => modelDbParaCaixa(caixaDb))
}

export const editarCaixa = (caixa: Caixa) => {
  const caixaDb = caixaParaModelDb(caixa)
  const updateQuery = `
    UPDATE caixas
    SET data_hora_abertura = @data_hora_abertura, data_hora_fechamento = @data_hora_fechamento, valor_inicial = @valor_inicial
    WHERE id = @id
  `

  return db.prepare(updateQuery).run(caixaDb)
}

export const removerCaixa = (id: number) => {
  const deleteQuery = `
    DELETE FROM caixas WHERE id = ?
  `

  return db.prepare(deleteQuery).run(id)
}

export const buscarCaixasPorData = (dataInicio: string, dataFim: string) => {
  console.log('dataInicio', dataInicio)
  console.log('dataFim', dataFim)

  const selectQuery = `
    SELECT * FROM caixas WHERE data_hora_abertura BETWEEN ? AND ?
  `

  const stmt = db.prepare(selectQuery)
  const caixasDb = stmt.all(dataInicio, dataFim) as CaixaDb[]

  return caixasDb.map((caixaDb: CaixaDb) => modelDbParaCaixa(caixaDb))
}
