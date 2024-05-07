import SqliteDb from "better-sqlite3";
import { sicronizarBanco } from "./bancoDeDadosSchemas";

const conn = new SqliteDb("local.db");

sicronizarBanco(conn)

export default conn;