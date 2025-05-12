export interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

export interface ChatRoom {
  id: string
  title: string
  lastActivity: string
  messageCount: number
  userId: string // Add userId to link chat rooms to users
}

export interface Message {
  chatId: string
  messageId: string
  role: "user" | "AI"
  content: string | { type: string; content: string }
  timestamp?: string
}
