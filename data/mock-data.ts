import type { Ticket } from "@/components/ticket-table"

// 위험도 옵션
export const severityOptions = [
  { value: "낮음", label: "낮음" },
  { value: "중간", label: "중간" },
  { value: "높음", label: "높음" },
  { value: "긴급", label: "긴급" },
]

// 상태 옵션
export const statusOptions = [
  { value: "대기중", label: "대기중" },
  { value: "진행중", label: "진행중" },
  { value: "검토중", label: "검토중" },
  { value: "완료", label: "완료" },
]

// 담당자 목록
export const assignees = [
  "김철수",
  "이영희",
  "박지민",
  "정민준",
  "최수진",
  "강동원",
  "윤서연",
  "한지훈",
  "송미나",
  "조현우",
]

// 티켓 목업 데이터 생성 함수
function generateMockTickets(count: number): Ticket[] {
  const tickets: Ticket[] = []

  for (let i = 1; i <= count; i++) {
    const severityIndex = Math.floor(Math.random() * severityOptions.length)
    const statusIndex = Math.floor(Math.random() * statusOptions.length)
    const assigneeIndex = Math.floor(Math.random() * assignees.length)

    tickets.push({
      id: `TICKET-${i.toString().padStart(4, "0")}`,
      name: `티켓 #${i} - ${getRandomTicketName()}`,
      severity: severityOptions[severityIndex].value as any,
      status: statusOptions[statusIndex].value as any,
      assignee: assignees[assigneeIndex],
    })
  }

  return tickets
}

// 랜덤 티켓 이름 생성 함수
function getRandomTicketName(): string {
  const prefixes = [
    "버그 수정",
    "기능 개선",
    "UI 업데이트",
    "성능 최적화",
    "보안 이슈",
    "데이터 마이그레이션",
    "API 통합",
    "문서화",
    "테스트 케이스",
    "리팩토링",
  ]

  const components = [
    "로그인",
    "대시보드",
    "사용자 관리",
    "결제 시스템",
    "알림 센터",
    "검색 기능",
    "보고서 생성",
    "설정 페이지",
    "프로필",
    "통계",
  ]

  const prefixIndex = Math.floor(Math.random() * prefixes.length)
  const componentIndex = Math.floor(Math.random() * components.length)

  return `${prefixes[prefixIndex]}: ${components[componentIndex]}`
}

// 50개의 목업 티켓 생성
export const mockTickets = generateMockTickets(50)
