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

// 사용자 활동 로그 타입 정의
export interface UserActivityLog {
  id: string
  userId: string
  userName: string
  userRole: string
  action: string
  target?: string
  targetType?: string
  details?: string
  ipAddress?: string
  timestamp: string
  changes?: object // JSON 데이터를 담을 changes 필드 추가
}

// 활동 로그 타입 상수
export const ActivityTypes = {
  LOGIN: "로그인",
  LOGOUT: "로그아웃",
  USER_CREATE: "사용자 생성",
  USER_UPDATE: "사용자 수정",
  USER_DELETE: "사용자 삭제",
  PASSWORD_RESET: "비밀번호 초기화",
  PAGE_ACCESS: "페이지 접근",
  CHAT_VIEW: "채팅 조회",
  SETTINGS_CHANGE: "설정 변경",
  ROLE_CHANGE: "역할 변경",
  BULK_ACTION: "일괄 작업",
} as const
