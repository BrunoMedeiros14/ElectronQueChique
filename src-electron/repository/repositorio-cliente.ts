import db from '../config/banco-de-dados'
import { Cliente } from '../models/cliente'

export type ClienteDb = {
  id: number
  nome: string
  data_nascimento: string
  endereco: string
  telefone: string
  email: string
}

const clienteParaModelDb = (cliente: Cliente): ClienteDb => ({
  id: cliente.id,
  nome: cliente.nome,
  data_nascimento: cliente.dataNascimento
    ? cliente.dataNascimento.toISOString().split('T')[0]
    : null,
  endereco: cliente.endereco,
  telefone: cliente.telefone,
  email: cliente.email,
})

export const modelDbParaCliente = (clienteDb: ClienteDb): Cliente => ({
  id: clienteDb.id,
  nome: clienteDb.nome,
  dataNascimento: clienteDb.data_nascimento
    ? new Date(clienteDb.data_nascimento)
    : null,
  endereco: clienteDb.endereco,
  telefone: clienteDb.telefone,
  email: clienteDb.email,
})

export const salvarCliente = (cliente: Cliente) => {
  const clienteDb = clienteParaModelDb(cliente)
  const insertQuery = `
    INSERT INTO clientes (nome, data_nascimento, endereco, telefone, email)
    VALUES (@nome, @data_nascimento, @endereco, @telefone, @email)
  `

  return db.prepare(insertQuery).run(clienteDb)
}

export const buscarClientePorId = (clienteId: number): Cliente => {
  const selectQuery = `
    SELECT * FROM clientes WHERE id = ?
  `

  const stmt = db.prepare(selectQuery)
  const clienteDb = stmt.get(clienteId) as ClienteDb

  return modelDbParaCliente(clienteDb)
}

export const buscarTodosClientes = () => {
  const selectAllQuery = `
    SELECT * FROM clientes
  `

  const clientesDb = db.prepare(selectAllQuery).all() as ClienteDb[]
  return clientesDb.map((clienteDb) => modelDbParaCliente(clienteDb))
}

export const editarCliente = (cliente: Cliente) => {
  const clienteDb = clienteParaModelDb(cliente)
  const updateQuery = `
    UPDATE clientes
    SET nome = @nome, data_nascimento = @data_nascimento, endereco = @endereco, telefone = @telefone, email = @email
    WHERE id = @id
  `

  return db.prepare(updateQuery).run(clienteDb)
}

export const removerCliente = (id: number) => {
  const deleteQuery = `
    DELETE FROM clientes WHERE id = ?
  `

  return db.prepare(deleteQuery).run(id)
}

export const buscarClientesPorData = (dataInicio: string, dataFim: string) => {
  const selectQuery = `
    SELECT * FROM clientes WHERE data_nascimento BETWEEN ? AND ?
  `

  const stmt = db.prepare(selectQuery)
  const clientesDb = stmt.all(dataInicio, dataFim) as ClienteDb[]

  return clientesDb.map((clienteDb: ClienteDb) => modelDbParaCliente(clienteDb))
}
