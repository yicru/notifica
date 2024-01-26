import * as bplist from 'bplist-parser'
import { Notification } from '../shared/types'
import { db } from './db'

export const getNotifications = async (): Promise<Notification[]> => {
  const records = await db
    .selectFrom('record')
    .orderBy('delivered_date desc')
    .selectAll()
    .execute()

  return records.map((row) => {
    const [parsedData] = bplist.parseBuffer(Buffer.from(row.data))

    return {
      app: parsedData.app,
      title: parsedData.req.titl,
      subtitle: parsedData.req.subt,
      body: parsedData.req.body,
    }
  })
}
