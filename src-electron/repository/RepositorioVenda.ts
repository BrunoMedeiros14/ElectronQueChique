import db from '../config/bancoDeDados'
import { Venda } from '../models/Venda'
import { FormaPagamento } from '../models/enums/FormaPagamento'
import { buscarTodosCaixas } from './RepositorioCaixa'
import {
  EstoqueDb,
  inserirIdVenda,
  modelDbParaEstoque,
  removerIdVenda,
} from './RepositorioEstoque'

type VendaDb = {
  id: number
  data_venda: string
  valor_total: number
  forma_pagamento: string
  valor_pago: number
  troco: number
  desconto: number
  cliente_id?: number
  estoque_json?: string
  cliente_json?: string
  caixa_id?: number
}

const vendaParaModelDb = (venda: Venda, caixaId?: number): VendaDb => ({
  id: venda.id,
  data_venda: venda.dataVenda
    ? venda.dataVenda.toISOString().split('T')[0]
    : null,
  valor_total: venda.valorTotal,
  forma_pagamento: venda.formaPagamento,
  valor_pago: venda.valorPago,
  troco: venda.troco,
  desconto: venda.desconto,
  cliente_id: venda.cliente?.id,
  caixa_id: caixaId,
})

const modelDbParaVenda = (vendaDb: VendaDb): Venda => ({
  id: vendaDb.id,
  dataVenda: vendaDb.data_venda ? new Date(vendaDb.data_venda) : null,
  valorTotal: vendaDb.valor_total,
  estoque: vendaDb.estoque_json
    ? JSON.parse(vendaDb.estoque_json)
        .filter((estoque: EstoqueDb) => estoque.id)
        .map((estoque: EstoqueDb) =>
          estoque.id ? modelDbParaEstoque(estoque) : null
        )
    : [],
  cliente: vendaDb.cliente_json
    ? JSON.parse(vendaDb.cliente_json).id
      ? JSON.parse(vendaDb.cliente_json)
      : null
    : null,
  formaPagamento: vendaDb.forma_pagamento as FormaPagamento,
  valorPago: vendaDb.valor_pago,
  troco: vendaDb.troco,
  desconto: vendaDb.desconto,
})

export const criarVenda = (venda: Venda) => {
  const caixaAtivo = buscarTodosCaixas().find((caixa) => caixa.ativo === true)

  if (!caixaAtivo) {
    throw new Error('Nenhum caixa ativo encontrado')
  }

  const caixaId = caixaAtivo.id

  const vendaDb = vendaParaModelDb(venda, caixaId)
  const insertQuery = `
    INSERT INTO vendas (data_venda, valor_total, forma_pagamento, valor_pago, troco, desconto, cliente_id, caixa_id)
    VALUES (@data_venda, @valor_total, @forma_pagamento, @valor_pago, @troco, @desconto, @cliente_id, @caixa_id)
  `

  const vendaId = db.prepare(insertQuery).run(vendaDb).lastInsertRowid

  venda.estoque.forEach((estoque) => {
    inserirIdVenda(estoque.id, Number(vendaId))
  })
}

export const buscarVendaPorId = (vendaId: number): Venda => {
  const selectQuery = `
    SELECT * FROM vendas WHERE id = ?
  `

  const stmt = db.prepare(selectQuery)
  const vendaDb = stmt.get(vendaId) as VendaDb

  return modelDbParaVenda(vendaDb)
}

export const buscarTodasVendas = () => {
  const selectAllQuery = `
    SELECT
      v.id,
      v.data_venda,
      v.valor_total,
      v.forma_pagamento,
      v.valor_pago,
      v.troco,
      v.desconto,
      v.cliente_id,
    JSON_GROUP_ARRAY(json_object(
      'id', e.id,
      'nome', e.nome,
      'descricao', e.descricao,
      'cor', e.cor,
      'tamanho', e.tamanho,
      'tecido', e.tecido,
      'fornecedor', e.fornecedor,
      'quantidade', e.quantidade,
      'valor_compra', e.valor_compra,
      'valor_venda', e.valor_venda,
      'venda_id', e.venda_id
    )) as estoque_json,
    json_object(
      'id', c.id,
      'nome', c.nome,
      'data_nascimento', c.data_nascimento,
      'endereco', c.endereco,
      'telefone', c.telefone,
      'email', c.email
    ) as cliente_json
    FROM vendas v
    LEFT JOIN estoques e ON v.id = e.venda_id
    LEFT JOIN clientes c ON v.cliente_id = c.id
    GROUP BY v.id
  `

  return db
    .prepare(selectAllQuery)
    .all()
    .map((vendaDb: VendaDb) => modelDbParaVenda(vendaDb))
}

buscarTodasVendas()

export const editarVenda = (venda: Venda) => {
  const vendaDb = vendaParaModelDb(venda)
  const updateQuery = `
    UPDATE vendas
    SET data_venda = @data_venda, valor_total = @valor_total, forma_pagamento = @forma_pagamento,
      valor_pago = @valor_pago, troco = @troco, desconto = @desconto, cliente_id = @cliente_id
    WHERE id = @id
  `

  return db.prepare(updateQuery).run(vendaDb)
}

export const removerVenda = (id: number) => {
  removerIdVenda(id)

  const deleteQuery = `
    DELETE FROM vendas WHERE id = ?
  `

  return db.prepare(deleteQuery).run(id)
}

export const buscarVendasPorData = (dataInicio: string, dataFim: string) => {
  const selectQuery = `
    SELECT * FROM vendas WHERE data_venda BETWEEN ? AND ?
  `

  const stmt = db.prepare(selectQuery)
  const vendasDb = stmt.all(dataInicio, dataFim) as VendaDb[]

  return vendasDb.map((vendaDb: VendaDb) => modelDbParaVenda(vendaDb))
}

export const buscarVendasPorCaixaId = (caixaId: number) => {
  const selectQuery = `
    SELECT * FROM vendas WHERE caixa_id = ?
  `

  const stmt = db.prepare(selectQuery)
  const vendasDb = stmt.all(caixaId) as VendaDb[]

  return vendasDb?.map((vendaDb: VendaDb) => modelDbParaVenda(vendaDb)) ?? []
}
