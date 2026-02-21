import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core"

export const vidyarthi = sqliteTable("vidyarthi", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  naam: text("naam").notNull(),
  kaksha: integer("kaksha").notNull(),
  pitaNaam: text("pita_naam"),
  mobile: text("mobile"),
  banaya: text("banaya").default(new Date().toISOString()),
})

export const fees = sqliteTable("fees", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  vidyarthiId: integer("vidyarthi_id").notNull(),
  maah: text("maah").notNull(),
  rakam: real("rakam").notNull(),
  chukaya: real("chukaya").default(0),
  tarikh: text("tarikh").default(new Date().toISOString()),
})

export const upasthiti = sqliteTable("upasthiti", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  vidyarthiId: integer("vidyarthi_id").notNull(),
  tarikh: text("tarikh").notNull(),
  sthiti: text("sthiti").notNull(),
})

export const result = sqliteTable("result", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  vidyarthiId: integer("vidyarthi_id").notNull(),
  vishay: text("vishay").notNull(),
  ank: integer("ank").notNull(),
  banaya: text("banaya").default(new Date().toISOString()),
})