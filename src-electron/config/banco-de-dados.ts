import SqliteDb from 'better-sqlite3'
import { sicronizarBanco } from './banco-de-dados-schemas'

const conn = new SqliteDb('local.db')

sicronizarBanco(conn)

export default conn
