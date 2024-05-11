import { Venda } from "src/shared/models/Venda";
import { FormaPagamento } from "src/shared/models/enums/FormaPagamento";
import db from "../config/bancoDeDados";
import { inserirIdVenda } from "./RepositorioEstoque";

type VendaDb = {
  id: number,
  data_venda: string,
  valor_total: number,
  forma_pagamento: string,
  valor_pago: number,
  troco: number,
  desconto: number,
  cliente_id?: number,
}

const vendaParaModelDb = (venda: Venda): VendaDb => ({
  id: venda.id,
  data_venda: venda.dataVenda ? venda.dataVenda.toISOString().split('T')[0] : null,
  valor_total: venda.valorTotal,
  forma_pagamento: venda.formaPagamento,
  valor_pago: venda.valorPago,
  troco: venda.troco,
  desconto: venda.desconto,
  cliente_id: null,
})

const modelDbParaVenda = (vendaDb: VendaDb): Venda => ({
  id: vendaDb.id,
  dataVenda: vendaDb.data_venda ? new Date(vendaDb.data_venda) : null,
  valorTotal: vendaDb.valor_total,
  estoque: null,
  cliente: null,
  formaPagamento: vendaDb.forma_pagamento as FormaPagamento,
  valorPago: vendaDb.valor_pago,
  troco: vendaDb.troco,
  desconto: vendaDb.desconto,
})

export const criarVenda = (venda: Venda) => {
  const vendaDb = vendaParaModelDb(venda)
  const insertQuery = `
    INSERT INTO vendas (data_venda, valor_total, forma_pagamento, valor_pago, troco, desconto, cliente_id)
    VALUES (@data_venda, @valor_total, @forma_pagamento, @valor_pago, @troco, @desconto, @cliente_id)
  `;

  const vendaId = db
    .prepare(insertQuery)
    .run(vendaDb).lastInsertRowid;

  venda.estoque.forEach(estoque => {
    inserirIdVenda(estoque.id, Number(vendaId));
  })
};

export const buscarVendaPorId = (vendaId: number): Venda => {
  const selectQuery = `
    SELECT * FROM vendas WHERE id = ?
  `;

  const stmt = db.prepare(selectQuery);
  const vendaDb = stmt.get(vendaId) as VendaDb;

  return modelDbParaVenda(vendaDb);
};

export const buscarTodasVendas = () => {
  const selectAllQuery = `
    SELECT * FROM vendas
  `;

  const vendasDb = db.prepare(selectAllQuery).all() as VendaDb[];
  return vendasDb.map(vendaDb => modelDbParaVenda(vendaDb));
};

export const editarVenda = (venda: Venda) => {
  const vendaDb = vendaParaModelDb(venda)
  const updateQuery = `
    UPDATE vendas
    SET data_venda = @data_venda, valor_total = @valor_total, forma_pagamento = @forma_pagamento,
      valor_pago = @valor_pago, troco = @troco, desconto = @desconto, cliente_id = @cliente_id
    WHERE id = @id
  `;

  return db.prepare(updateQuery).run(vendaDb);
};

export const removerVenda = (id: number) => {
  const deleteQuery = `
    DELETE FROM vendas WHERE id = ?
  `;

  return db.prepare(deleteQuery).run(id);
};