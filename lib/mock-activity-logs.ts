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

// 액션 타입에 따른 changes 데이터 생성 함수
function generateChangesData(action: string, targetUser?: any) {
  switch (action) {
    case ActivityTypes.LOGIN:
      return {
        session: {
          id: `sess_${Math.random().toString(36).substring(2, 10)}`,
          userAgent: [
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15",
            "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36",
          ][Math.floor(Math.random() * 3)],
          loginTime: new Date().toISOString(),
          device: ["Desktop", "Mobile", "Tablet"][Math.floor(Math.random() * 3)],
          location: {
            country: ["대한민국", "미국", "일본", "중국", "영국"][Math.floor(Math.random() * 5)],
            city: ["서울", "뉴욕", "도쿄", "베이징", "런던"][Math.floor(Math.random() * 5)],
          },
        },
      }
    case ActivityTypes.LOGOUT:
      return {
        session: {
          id: `sess_${Math.random().toString(36).substring(2, 10)}`,
          duration: `${Math.floor(Math.random() * 120)}분`,
          logoutReason: ["사용자 요청", "세션 만료", "관리자에 의한 강제 종료"][Math.floor(Math.random() * 3)],
        },
      }
    case ActivityTypes.USER_CREATE:
      return {
        user: {
          id: targetUser?.id || `user-${Math.random().toString(36).substring(2, 10)}`,
          name: targetUser?.name || `신규 사용자 ${Math.floor(Math.random() * 100)}`,
          email: targetUser?.email || `user${Math.floor(Math.random() * 100)}@example.com`,
          role: targetUser?.role || ["admin", "user", "manager"][Math.floor(Math.random() * 3)],
          createdAt: new Date().toISOString(),
        },
      }
    case ActivityTypes.USER_UPDATE:
      const oldValues = {
        name: `이전 이름 ${Math.floor(Math.random() * 100)}`,
        email: `old${Math.floor(Math.random() * 100)}@example.com`,
        role: ["admin", "user", "manager"][Math.floor(Math.random() * 3)],
      }
      const newValues = {
        name: targetUser?.name || `새 이름 ${Math.floor(Math.random() * 100)}`,
        email: targetUser?.email || `new${Math.floor(Math.random() * 100)}@example.com`,
        role: targetUser?.role || ["admin", "user", "manager"][Math.floor(Math.random() * 3)],
      }
      return {
        userId: targetUser?.id || `user-${Math.random().toString(36).substring(2, 10)}`,
        changes: {
          before: oldValues,
          after: newValues,
        },
        updatedFields: Object.keys(oldValues).filter((_, i) => Math.random() > 0.5),
      }
    case ActivityTypes.USER_DELETE:
      return {
        deletedUser: {
          id: targetUser?.id || `user-${Math.random().toString(36).substring(2, 10)}`,
          name: targetUser?.name || `삭제된 사용자 ${Math.floor(Math.random() * 100)}`,
          email: targetUser?.email || `deleted${Math.floor(Math.random() * 100)}@example.com`,
          role: targetUser?.role || ["admin", "user", "manager"][Math.floor(Math.random() * 3)],
          accountCreated: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
          deletionReason: ["요청에 의한 삭제", "관리자 결정", "계정 비활성화", "보안 위반"][
            Math.floor(Math.random() * 4)
          ],
        },
      }
    case ActivityTypes.PASSWORD_RESET:
      return {
        passwordReset: {
          userId: targetUser?.id || `user-${Math.random().toString(36).substring(2, 10)}`,
          userName: targetUser?.name || `사용자 ${Math.floor(Math.random() * 100)}`,
          requestTime: new Date(Date.now() - Math.random() * 1000000).toISOString(),
          completionTime: new Date().toISOString(),
          method: ["이메일", "관리자 요청", "본인 확인 후 재설정"][Math.floor(Math.random() * 3)],
          expirySet: new Date(Date.now() + 86400000).toISOString(), // 24시간 후
        },
      }
    case ActivityTypes.PAGE_ACCESS:
      const page = pageRoutes[Math.floor(Math.random() * pageRoutes.length)]
      return {
        pageAccess: {
          url: page,
          referrer: Math.random() > 0.5 ? pageRoutes[Math.floor(Math.random() * pageRoutes.length)] : null,
          duration: `${Math.floor(Math.random() * 300)}초`,
          userAgent: [
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15",
            "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36",
          ][Math.floor(Math.random() * 3)],
          device: ["Desktop", "Mobile", "Tablet"][Math.floor(Math.random() * 3)],
        },
      }
    case ActivityTypes.CHAT_VIEW:
      const chatId = `chat-${Math.floor(Math.random() * 100)}`
      return {
        chatSession: {
          chatId,
          title: `채팅 세션 ${Math.floor(Math.random() * 100)}`,
          startTime: new Date(Date.now() - Math.random() * 1000000).toISOString(),
          endTime: new Date().toISOString(),
          messageCount: Math.floor(Math.random() * 50),
          participants: Array.from({ length: Math.floor(Math.random() * 3) + 1 }, (_, i) => ({
            userId: `user-${Math.floor(Math.random() * 100)}`,
            name: `참가자 ${i + 1}`,
            role: ["admin", "user", "manager"][Math.floor(Math.random() * 3)],
          })),
        },
      }
    case ActivityTypes.SETTINGS_CHANGE:
      const settings = ["알림 설정", "보안 설정", "표시 설정", "언어 설정"]
      const setting = settings[Math.floor(Math.random() * settings.length)]
      const oldSetting = {
        notifications: Math.random() > 0.5,
        theme: ["light", "dark", "system"][Math.floor(Math.random() * 3)],
        language: ["ko", "en", "ja", "zh"][Math.floor(Math.random() * 4)],
        securityLevel: ["low", "medium", "high"][Math.floor(Math.random() * 3)],
      }
      const newSetting = { ...oldSetting }

      // 랜덤하게 하나의 설정 변경
      const keys = Object.keys(oldSetting)
      const randomKey = keys[Math.floor(Math.random() * keys.length)] as keyof typeof oldSetting

      if (typeof oldSetting[randomKey] === "boolean") {
        newSetting[randomKey] = !oldSetting[randomKey]
      } else if (Array.isArray(oldSetting[randomKey])) {
        const options = ["light", "dark", "system", "ko", "en", "ja", "zh", "low", "medium", "high"]
        let newValue
        do {
          newValue = options[Math.floor(Math.random() * options.length)]
        } while (newValue === oldSetting[randomKey])
        newSetting[randomKey] = newValue
      }

      return {
        settingsChange: {
          category: setting,
          changes: {
            before: oldSetting,
            after: newSetting,
          },
          changedBy: {
            userId: targetUser?.id || `user-${Math.random().toString(36).substring(2, 10)}`,
            name: targetUser?.name || `사용자 ${Math.floor(Math.random() * 100)}`,
          },
        },
      }
    case ActivityTypes.ROLE_CHANGE:
      return {
        roleChange: {
          userId: targetUser?.id || `user-${Math.random().toString(36).substring(2, 10)}`,
          userName: targetUser?.name || `사용자 ${Math.floor(Math.random() * 100)}`,
          previousRole: ["admin", "user", "manager"].filter((r) => r !== targetUser?.role)[
            Math.floor(Math.random() * 2)
          ],
          newRole: targetUser?.role || ["admin", "user", "manager"][Math.floor(Math.random() * 3)],
          changedBy: {
            userId: `user-${Math.random().toString(36).substring(2, 10)}`,
            name: `관리자 ${Math.floor(Math.random() * 10)}`,
            role: "admin",
          },
          reason: ["업무 역할 변경", "승진", "권한 조정", "보안 정책 변경", "요청에 의한 변경"][
            Math.floor(Math.random() * 5)
          ],
        },
      }
    case ActivityTypes.BULK_ACTION:
      const actions = ["삭제", "역할 변경", "상태 변경"]
      const bulkAction = actions[Math.floor(Math.random() * actions.length)]
      const count = Math.floor(Math.random() * 20) + 1

      return {
        bulkAction: {
          actionType: bulkAction,
          affectedCount: count,
          affectedUsers: Array.from({ length: Math.min(count, 5) }, (_, i) => ({
            userId: `user-${Math.floor(Math.random() * 100)}`,
            name: `사용자 ${i + 1}`,
          })),
          initiatedBy: {
            userId: targetUser?.id || `user-${Math.random().toString(36).substring(2, 10)}`,
            name: targetUser?.name || `관리자 ${Math.floor(Math.random() * 10)}`,
            role: "admin",
          },
          timestamp: new Date().toISOString(),
          status: ["완료", "진행 중", "일부 실패"][Math.floor(Math.random() * 3)],
        },
      }
    default:
      return {}
  }
}

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
    let targetUser = null

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
        targetUser = mockUsers[Math.floor(Math.random() * mockUsers.length)]
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
        targetUser = mockUsers[Math.floor(Math.random() * mockUsers.length)]
        const roles = ["admin", "user", "manager"]
        const newRole = roles[Math.floor(Math.random() * roles.length)]
        target = targetUser.id
        targetType = "user"
        details = `사용자: ${targetUser.name}, 새 역할: ${newRole}`
        break
      case ActivityTypes.BULK_ACTION:
        const actions = ["삭제", "역할 변경", "상태 변경"]
        const bulkAction = actions[Math.floor(Math.random() * actions.length)]
        const count = Math.floor(Math.random() * 20) + 1
        details = `작업: ${bulkAction}, 영향받은 사용자 수: ${count}`
        break
    }

    // changes 데이터 생성
    const changes = generateChangesData(action, targetUser)

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
      changes, // JSON 데이터 추가
    })
  }

  // 날짜순으로 정렬 (최신순)
  return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

// 200개의 활동 로그 생성
export const mockActivityLogs = generateActivityLogs(200)
