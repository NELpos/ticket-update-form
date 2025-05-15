import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"
import { mockTickets } from "@/data/mock-data"

// 티켓 조회 함수
async function getTickets(query?: string) {
  // 실제 구현에서는 데이터베이스에서 조회하는 로직이 들어갑니다
  let tickets = mockTickets

  if (query) {
    const lowerQuery = query.toLowerCase()
    tickets = tickets.filter(
      (ticket) =>
        ticket.name.toLowerCase().includes(lowerQuery) ||
        ticket.id.toLowerCase().includes(lowerQuery) ||
        ticket.status.toLowerCase().includes(lowerQuery) ||
        ticket.severity.toLowerCase().includes(lowerQuery),
    )
  }

  return tickets.slice(0, 5) // 최대 5개만 반환
}

// 티켓 상태 업데이트 함수
async function updateTicketStatus(ticketId: string, newStatus: string) {
  // 실제 구현에서는 데이터베이스 업데이트 로직이 들어갑니다
  const ticket = mockTickets.find((t) => t.id === ticketId)
  if (!ticket) {
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

  // 실제로는 여기서 데이터베이스 업데이트가 이루어집니다
  return {
    success: true,
    message: `티켓 ${ticketId}의 상태가 '${newStatus}'로 업데이트되었습니다.`,
    ticket: { ...ticket, status: newStatus },
  }
}

// 티켓 담당자 변경 함수
async function assignTicket(ticketId: string, assignee: string) {
  // 실제 구현에서는 데이터베이스 업데이트 로직이 들어갑니다
  const ticket = mockTickets.find((t) => t.id === ticketId)
  if (!ticket) {
    return { success: false, message: `티켓 ${ticketId}를 찾을 수 없습니다.` }
  }

  // 실제로는 여기서 데이터베이스 업데이트가 이루어집니다
  return {
    success: true,
    message: `티켓 ${ticketId}가 ${assignee}에게 할당되었습니다.`,
    ticket: { ...ticket, assignee },
  }
}

// 특정 티켓 조회 함수
async function getTicketById(ticketId: string) {
  const ticket = mockTickets.find((t) => t.id === ticketId)
  if (!ticket) {
    return { success: false, message: `티켓 ${ticketId}를 찾을 수 없습니다.` }
  }

  return { success: true, ticket }
}

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = streamText({
    model: openai("gpt-4o"),
    messages,
    temperature: 0.7,
    maxTokens: 1000,
    tools: [
      {
        name: "getTickets",
        description: "티켓 목록을 조회합니다. 선택적으로 검색어를 사용하여 필터링할 수 있습니다.",
        parameters: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description: "티켓 이름, ID, 상태 또는 위험도로 필터링하기 위한 검색어 (선택사항)",
            },
          },
          required: [],
        },
        execute: async ({ query }) => {
          const tickets = await getTickets(query)
          return { tickets, action: "showTickets" }
        },
      },
      {
        name: "getTicketById",
        description: "특정 ID의 티켓 상세 정보를 조회합니다.",
        parameters: {
          type: "object",
          properties: {
            ticketId: {
              type: "string",
              description: "조회할 티켓의 ID",
            },
          },
          required: ["ticketId"],
        },
        execute: async ({ ticketId }) => {
          const result = await getTicketById(ticketId)
          return { ...result, action: "showTicketDetail" }
        },
      },
      {
        name: "updateTicketStatus",
        description: "티켓의 상태를 업데이트합니다.",
        parameters: {
          type: "object",
          properties: {
            ticketId: {
              type: "string",
              description: "업데이트할 티켓의 ID",
            },
            newStatus: {
              type: "string",
              description: "새로운 상태 (대기중, 진행중, 검토중, 완료 중 하나)",
            },
          },
          required: ["ticketId", "newStatus"],
        },
        execute: async ({ ticketId, newStatus }) => {
          return await updateTicketStatus(ticketId, newStatus)
        },
      },
      {
        name: "assignTicket",
        description: "티켓에 담당자를 할당합니다.",
        parameters: {
          type: "object",
          properties: {
            ticketId: {
              type: "string",
              description: "할당할 티켓의 ID",
            },
            assignee: {
              type: "string",
              description: "담당자 이름",
            },
          },
          required: ["ticketId", "assignee"],
        },
        execute: async ({ ticketId, assignee }) => {
          return await assignTicket(ticketId, assignee)
        },
      },
    ],
    systemPrompt: `
      당신은 티켓 관리 시스템의 AI 어시스턴트입니다. 사용자가 티켓 관련 질문을 하면 적절한 도구를 사용하여 정보를 제공하고 작업을 수행합니다.
      
      티켓 조회, 상태 업데이트, 담당자 할당 등의 작업을 수행할 수 있습니다.
      
      응답은 항상 한국어로 제공하며, 정중하고 전문적인 어조를 유지합니다.
      
      티켓 상태는 '대기중', '진행중', '검토중', '완료' 중 하나입니다.
      
      사용자가 티켓 관련 질문이 아닌 일반적인 질문을 하면, 티켓 관리 시스템과 관련된 대화로 유도하세요.
      
      티켓 조회 요청이 있을 때는 반드시 getTickets 도구를 사용하세요. 티켓 목록을 조회하면 UI가 자동으로 조정됩니다.
      특정 티켓 조회 요청이 있을 때는 getTicketById 도구를 사용하세요.
      
      티켓 정보를 표시할 때는 다음 형식의 JSON을 포함하세요:
      
      \`\`\`json
      {"tickets": [...티켓 목록...]}
      \`\`\`
      
      또는 특정 티켓의 경우:
      
      \`\`\`json
      {"ticket": {...티켓 정보...}}
      \`\`\`
    `,
  })

  return result.toDataStreamResponse()
}
