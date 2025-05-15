"use server"

import { mockTickets } from "@/data/mock-data"
import { revalidatePath } from "next/cache"

// 실제 구현에서는 데이터베이스 연동 로직이 들어갑니다
// 현재는 메모리에서 mockTickets를 조작하는 방식으로 구현합니다

// 티켓 상태 업데이트 함수
export async function updateTicketStatus(ticketId: string, newStatus: string) {
  const ticketIndex = mockTickets.findIndex((t) => t.id === ticketId)

  if (ticketIndex === -1) {
    return { success: false, message: `티켓 ${ticketId}를 찾을 수 없습니다.` }
  }

  // 상태 유효성 검사
  const validStatuses = ["대기중", "진행중", "검토중", "완료"]
  if (!validStatuses.includes(newStatus)) {
    return {
      success: false,
      message: `유효하지 않은 상태입니다. 가능한 상태: ${validStatuses.join(", ")}`,
    }
  }

  // 티켓 상태 업데이트
  mockTickets[ticketIndex].status = newStatus as any

  // 페이지 리프레시를 위한 revalidatePath 호출
  revalidatePath("/")
  revalidatePath(`/tickets/${ticketId}`)

  return {
    success: true,
    message: `티켓 ${ticketId}의 상태가 '${newStatus}'로 업데이트되었습니다.`,
    ticket: mockTickets[ticketIndex],
  }
}

// 티켓 담당자 변경 함수
export async function assignTicket(ticketId: string, assignee: string) {
  const ticketIndex = mockTickets.findIndex((t) => t.id === ticketId)

  if (ticketIndex === -1) {
    return { success: false, message: `티켓 ${ticketId}를 찾을 수 없습니다.` }
  }

  // 티켓 담당자 업데이트
  mockTickets[ticketIndex].assignee = assignee

  // 페이지 리프레시를 위한 revalidatePath 호출
  revalidatePath("/")
  revalidatePath(`/tickets/${ticketId}`)

  return {
    success: true,
    message: `티켓 ${ticketId}가 ${assignee}에게 할당되었습니다.`,
    ticket: mockTickets[ticketIndex],
  }
}

// 티켓 검색 함수
export async function searchTickets(query: string) {
  if (!query || query.trim() === "") {
    return { tickets: mockTickets.slice(0, 10) } // 검색어가 없으면 최근 10개 반환
  }

  const lowerQuery = query.toLowerCase()
  const filteredTickets = mockTickets.filter(
    (ticket) =>
      ticket.name.toLowerCase().includes(lowerQuery) ||
      ticket.id.toLowerCase().includes(lowerQuery) ||
      ticket.status.toLowerCase().includes(lowerQuery) ||
      ticket.severity.toLowerCase().includes(lowerQuery) ||
      ticket.assignee.toLowerCase().includes(lowerQuery),
  )

  return { tickets: filteredTickets.slice(0, 10) } // 최대 10개만 반환
}
