import { Cliente } from '../models/cliente'
import { Conta } from '../models/conta'
import { Cor } from '../models/enums/cor'
import { Tecido } from '../models/enums/tecido'
import { Estoque } from '../models/estoque'
import { salvarCliente } from '../repository/repositorio-cliente'
import { criarConta } from '../repository/repositorio-conta'
import { criarEstoque } from '../repository/repositorio-estoque'

const estoqueArray: Estoque[] = []
const contaArray: Conta[] = []
const clienteArray: Cliente[] = []

function generateRandomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

function generateRandomNumber(min: number, max: number): number {
  return Math.random() * (max - min) + min
}

function generateRandomBoolean(): boolean {
  return Math.random() < 0.5
}

function generateRandomText(length: number): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

function getRandomEnumValue<T>(enumObj: T): T[keyof T] {
  const enumValues = Object.values(enumObj)
  const randomIndex = Math.floor(Math.random() * enumValues.length)
  return enumValues[randomIndex]
}

for (let i = 0; i < 30; i++) {
  const estoque: Estoque = {
    nome: generateRandomText(8),
    descricao: generateRandomText(20),
    cor: getRandomEnumValue(Cor),
    tamanho: generateRandomText(4),
    vendido: generateRandomBoolean(),
    tecido: getRandomEnumValue(Tecido),
    fornecedor: generateRandomText(10),
    valorCompra: generateRandomNumber(10, 100),
    valorVenda: generateRandomNumber(50, 200),
  }
  estoqueArray.push(estoque)
}

for (let i = 0; i < 30; i++) {
  const conta: Conta = {
    nome: generateRandomText(8),
    valor: generateRandomNumber(50, 500),
    descricao: generateRandomText(20),
    dataVencimento: generateRandomDate(new Date(2020, 0, 1), new Date(2025, 11, 31)),
    dataPagamento: generateRandomDate(new Date(2020, 0, 1), new Date()),
    pago: generateRandomBoolean(),
  }
  contaArray.push(conta)
}

for (let i = 0; i < 30; i++) {
  const cliente: Cliente = {
    nome: generateRandomText(8),
    dataNascimento: generateRandomDate(new Date(1950, 0, 1), new Date(2005, 11, 31)),
    endereco: generateRandomText(20),
    telefone: generateRandomText(10),
    email: generateRandomText(8) + '@example.com',
  }
  clienteArray.push(cliente)
}

clienteArray.forEach((c) => salvarCliente(c))
estoqueArray.forEach((e) => criarEstoque(e))
contaArray.forEach((c) => criarConta(c))
