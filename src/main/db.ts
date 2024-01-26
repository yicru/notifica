import os from 'node:os'
import path from 'node:path'
import SQLite from 'better-sqlite3'
import { Kysely, Selectable, SqliteDialect } from 'kysely'

export interface Database {
  record: RecordTable
}

export interface RecordTable {
  data: Uint8Array
  delivered_date: number
}

export type Record = Selectable<RecordTable>

const DB_PATH = path.join(
  os.tmpdir(),
  '/../0/com.apple.notificationcenter/db2/db',
)

const dialect = new SqliteDialect({
  database: new SQLite(DB_PATH),
})

export const db = new Kysely<Database>({
  dialect,
})
