import { Database } from 'better-sqlite3'

const criarTabelaClientes = `
  CREATE TABLE IF NOT EXISTS clientes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    data_nascimento DATE,
    endereco TEXT,
    telefone TEXT NOT NULL,
    email TEXT NOT NULL
  );
`

const criarTabelaCaixa = `
  CREATE TABLE IF NOT EXISTS caixas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    data_hora_abertura DATETIME NOT NULL,
    data_hora_fechamento DATETIME,
    valor_inicial REAL NOT NULL
  );
`

const criarTabelaContas = `
  CREATE TABLE IF NOT EXISTS contas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    valor NUMBER NOT NULL DEFAULT 0,
    descricao TEXT,
    data_vencimento DATE,
    data_pagamento DATE,
    pago BOOLEAN NOT NULL DEFAULT 0,
    caixa_id INTEGER NULL,
    FOREIGN KEY (caixa_id) REFERENCES caixas(id)
  );
`

const criarTabelaVenda = `
  CREATE TABLE IF NOT EXISTS vendas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    data_venda DATE NOT NULL,
    valor_total REAL NOT NULL,
    forma_pagamento TEXT NOT NULL,
    valor_pago REAL NOT NULL,
    troco REAL NOT NULL,
    desconto REAL NULL,
    cliente_id INTEGER NULL,
    caixa_id INTEGER,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id),
    FOREIGN KEY (caixa_id) REFERENCES caixas(id)
  );
`

const criarTabelaEstoque = `
  CREATE TABLE IF NOT EXISTS estoques (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    descricao TEXT NOT NULL,
    cor TEXT NOT NULL DEFAULT 'Outro',
    tamanho TEXT NOT NULL,
    tecido TEXT NOT NULL DEFAULT 'Outro',
    fornecedor TEXT,
    valor_compra REAL NOT NULL,
    valor_venda REAL NOT NULL,
    venda_id INTEGER NULL,
    FOREIGN KEY (venda_id) REFERENCES vendas(id)
  );
`

export const sicronizarBanco = (conn: Database): void => {
  const tabelas = [criarTabelaClientes, criarTabelaCaixa, criarTabelaContas, criarTabelaVenda, criarTabelaEstoque]

  tabelas.forEach((query) => conn.exec(query))
}
