import { type UserActivityLog, ActivityTypes } from "./types"
import { mockUsers } from "./mock-data"

// IP 주소 생성 함수
function generateRandomIP() {
  return `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(
    Math.random() * 255,
  )}.${Math.floor(Math.random() * 255)}`
}

// 과거 날짜 생성 함수 (최대 30일 전까지)
function generatePastDate(maxDaysAgo = 30) {
  const date = new Date()
  const daysAgo = Math.floor(Math.random() * maxDaysAgo)
  date.setDate(date.getDate() - daysAgo)

  // 시간도 랜덤하게 설정
  date.setHours(Math.floor(Math.random() * 24))
  date.setMinutes(Math.floor(Math.random() * 60))
  date.setSeconds(Math.floor(Math.random() * 60))

  return date.toISOString()
}

// 페이지 경로 목록
const pageRoutes = ["/dashboard", "/users", "/audit", "/settings", "/profile", "/chat-rooms", "/analytics", "/reports"]

// 활동 로그 생성 함수
function generateActivityLogs(count: number): UserActivityLog[] {
  const logs: UserActivityLog[] = []

  for (let i = 0; i < count; i++) {
    const user = mockUsers[Math.floor(Math.random() * mockUsers.length)]
    const actionTypes = Object.values(ActivityTypes)
    const action = actionTypes[Math.floor(Math.random() * actionTypes.length)]

    let target = ""
    let targetType = ""
    let details = ""

    // 액션에 따라 다른 상세 정보 생성
    switch (action) {
      case ActivityTypes.LOGIN:
        details = `IP 주소: ${generateRandomIP()}`
        break
      case ActivityTypes.LOGOUT:
        details = `세션 종료됨`
        break
      case ActivityTypes.USER_CREATE:
      case ActivityTypes.USER_UPDATE:
      case ActivityTypes.USER_DELETE:
      case ActivityTypes.PASSWORD_RESET:
        const targetUser = mockUsers[Math.floor(Math.random() * mockUsers.length)]
        target = targetUser.id
        targetType = "user"
        details = `대상 사용자: ${targetUser.name}`
        break
      case ActivityTypes.PAGE_ACCESS:
        const page = pageRoutes[Math.floor(Math.random() * pageRoutes.length)]
        target = page
        targetType = "page"
        details = `접근 페이지: ${page}`
        break
      case ActivityTypes.CHAT_VIEW:
        const chatId = `chat-${Math.floor(Math.random() * 100)}`
        target = chatId
        targetType = "chat"
        details = `채팅 ID: ${chatId}`
        break
      case ActivityTypes.SETTINGS_CHANGE:
        const settings = ["알림 설정", "보안 설정", "표시 설정", "언어 설정"]
        const setting = settings[Math.floor(Math.random() * settings.length)]
        target = setting
        targetType = "setting"
        details = `변경된 설정: ${setting}`
        break
      case ActivityTypes.ROLE_CHANGE:
        const targetUser2 = mockUsers[Math.floor(Math.random() * mockUsers.length)]
        const roles = ["admin", "user", "manager"]
        const newRole = roles[Math.floor(Math.random() * roles.length)]
        target = targetUser2.id
        targetType = "user"
        details = `사용자: ${targetUser2.name}, 새 역할: ${newRole}`
        break
      case ActivityTypes.BULK_ACTION:
        const actions = ["삭제", "역할 변경", "상태 변경"]
        const bulkAction = actions[Math.floor(Math.random() * actions.length)]
        const count = Math.floor(Math.random() * 20) + 1
        details = `작업: ${bulkAction}, 영향받은 사용자 수: ${count}`
        break
    }

    logs.push({
      id: `log-${i + 1}`,
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      action,
      target,
      targetType,
      details,
      ipAddress: generateRandomIP(),
      timestamp: generatePastDate(),
    })
  }

  // 날짜순으로 정렬 (최신순)
  return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

// 200개의 활동 로그 생성
export const mockActivityLogs = generateActivityLogs(200)
