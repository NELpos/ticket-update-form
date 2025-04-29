import { pgTable, serial, varchar, text } from "drizzle-orm/pg-core"

// 위험도 테이블
export const severityTable = pgTable("severity", {
  id: serial("id").primaryKey(),
  value: varchar("value", { length: 50 }).notNull().unique(),
  label: varchar("label", { length: 50 }).notNull(),
})

// 상태 테이블
export const statusTable = pgTable("status", {
  id: serial("id").primaryKey(),
  value: varchar("value", { length: 50 }).notNull().unique(),
  label: varchar("label", { length: 50 }).notNull(),
})

// 우선순위 테이블
export const priorityTable = pgTable("priority", {
  id: serial("id").primaryKey(),
  value: varchar("value", { length: 50 }).notNull().unique(),
  label: varchar("label", { length: 50 }).notNull(),
})

// 카테고리 테이블
export const categoryTable = pgTable("category", {
  id: serial("id").primaryKey(),
  value: varchar("value", { length: 50 }).notNull().unique(),
  label: varchar("label", { length: 50 }).notNull(),
})

// 환경 테이블
export const environmentTable = pgTable("environment", {
  id: serial("id").primaryKey(),
  value: varchar("value", { length: 50 }).notNull().unique(),
  label: varchar("label", { length: 50 }).notNull(),
})

// 담당자 테이블
export const assigneeTable = pgTable("assignee", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
})

// 보고자 테이블
export const reporterTable = pgTable("reporter", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
})

// 티켓 테이블
export const ticketTable = pgTable("ticket", {
  id: serial("id").primaryKey(),
  ticketId: varchar("ticket_id", { length: 50 }).notNull().unique(),
  name: text("name").notNull(),
  severity: varchar("severity", { length: 50 }).notNull(),
  status: varchar("status", { length: 50 }).notNull(),
  assignee: varchar("assignee", { length: 100 }).notNull(),
  priority: varchar("priority", { length: 50 }).notNull(),
  dueDate: varchar("due_date", { length: 50 }).notNull(),
  category: varchar("category", { length: 50 }).notNull(),
  environment: varchar("environment", { length: 50 }).notNull(),
  estimatedTime: varchar("estimated_time", { length: 50 }).notNull(),
  reporter: varchar("reporter", { length: 100 }).notNull(),
})

// 타입 정의
export type SelectOption = {
  value: string
  label: string
}

export type Assignee = {
  id: number
  name: string
}

export type Reporter = {
  id: number
  name: string
}
