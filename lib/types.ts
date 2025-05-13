export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: "admin" | "user" | "manager" // 사용자 역할 추가
}

export interface ChatRoom {
  id: string
  title: string
  lastActivity: string
  messageCount: number
  userId: string
  type: string // 채팅방 산업 분류 추가
}

export interface Message {
  chatId: string
  messageId: string
  role: "user" | "AI"
  content: string | { type: string; content: string }
  timestamp?: string
}
