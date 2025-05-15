"use client"

import { useRef, useEffect } from "react"
import { Send, User, Bot } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useChat } from "ai/react"
import { Card, CardContent } from "@/components/ui/card"
import { useLayout } from "@/context/layout-context"

export function ChatPanel() {
  const { setIsTicketView, setActiveTicketId } = useLayout()
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/chat",
  })

  const messagesEndRef = useRef<HTMLDivElement>(null)

  // 새 메시지가 추가될 때마다 스크롤을 아래로 이동
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // 메시지 내용을 분석하여 티켓 관련 액션 감지
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1]

      // 어시스턴트 메시지만 처리
      if (lastMessage.role === "assistant") {
        try {
          // 티켓 목록 조회 액션 감지
          if (lastMessage.content.includes('"tickets":') || lastMessage.content.includes('"action":"showTickets"')) {
            setIsTicketView(true)
            setActiveTicketId(null)
          }

          // 특정 티켓 조회 액션 감지
          if (lastMessage.content.includes('"action":"showTicketDetail"')) {
            const jsonMatch = lastMessage.content.match(/```json([\s\S]*?)```/)
            if (jsonMatch && jsonMatch[1]) {
              const ticketData = JSON.parse(jsonMatch[1].trim())
              if (ticketData.ticket && ticketData.ticket.id) {
                setIsTicketView(true)
                setActiveTicketId(ticketData.ticket.id)
              }
            }
          }
        } catch (e) {
          console.error("Error parsing message content:", e)
        }
      }
    }
  }, [messages, setIsTicketView, setActiveTicketId])

  // 시간 포맷 함수
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  // 티켓 정보 렌더링 함수
  const renderTicketInfo = (content: string) => {
    // 티켓 정보가 JSON 형식으로 포함되어 있는지 확인
    try {
      if (content.includes('"tickets":')) {
        // JSON 부분 추출 시도
        const jsonMatch = content.match(/```json([\s\S]*?)```/)
        if (jsonMatch && jsonMatch[1]) {
          const ticketsData = JSON.parse(jsonMatch[1].trim())

          if (ticketsData.tickets && Array.isArray(ticketsData.tickets)) {
            return (
              <>
                <div className="mb-2">{content.split("```json")[0]}</div>
                <Card className="mb-2 bg-muted/30">
                  <CardContent className="p-3">
                    <h4 className="text-sm font-medium mb-2">티켓 목록</h4>
                    <div className="space-y-2">
                      {ticketsData.tickets.map((ticket: any, index: number) => (
                        <div key={index} className="text-xs p-2 border rounded-md">
                          <div className="font-medium">{ticket.name}</div>
                          <div className="flex justify-between mt-1">
                            <span>ID: {ticket.id}</span>
                            <span>상태: {ticket.status}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>담당자: {ticket.assignee}</span>
                            <span>위험도: {ticket.severity}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                <div>{content.split("```")[2] || ""}</div>
              </>
            )
          }
        }
      } else if (content.includes('"ticket":')) {
        // 단일 티켓 정보 추출 시도
        const jsonMatch = content.match(/```json([\s\S]*?)```/)
        if (jsonMatch && jsonMatch[1]) {
          const ticketData = JSON.parse(jsonMatch[1].trim())

          if (ticketData.ticket) {
            const ticket = ticketData.ticket
            return (
              <>
                <div className="mb-2">{content.split("```json")[0]}</div>
                <Card className="mb-2 bg-muted/30">
                  <CardContent className="p-3">
                    <h4 className="text-sm font-medium mb-2">티켓 정보</h4>
                    <div className="p-2 border rounded-md">
                      <div className="font-medium">{ticket.name}</div>
                      <div className="grid grid-cols-2 gap-1 mt-1 text-xs">
                        <span>ID: {ticket.id}</span>
                        <span>상태: {ticket.status}</span>
                        <span>담당자: {ticket.assignee}</span>
                        <span>위험도: {ticket.severity}</span>
                        <span>우선순위: {ticket.priority}</span>
                        <span>카테고리: {ticket.category}</span>
                        <span>환경: {ticket.environment}</span>
                        <span>마감일: {ticket.dueDate}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <div>{content.split("```")[2] || ""}</div>
              </>
            )
          }
        }
      }
    } catch (e) {
      console.error("Error parsing ticket data:", e)
    }

    // JSON 파싱에 실패하면 원본 내용 반환
    return content
  }

  return (
    <div className="flex flex-col h-full border rounded-md overflow-hidden bg-background">
      <div className="p-3 border-b bg-muted/30">
        <h2 className="text-lg font-semibold">고객 지원 채팅</h2>
        <p className="text-sm text-muted-foreground">실시간 지원을 통해 문의사항을 해결하세요</p>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="flex justify-center items-center h-32">
              <p className="text-muted-foreground text-center">
                안녕하세요! 티켓 관리 시스템 AI 어시스턴트입니다.
                <br />
                티켓 조회나 관리에 대해 질문해 주세요.
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`flex items-start gap-2 max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={message.role === "user" ? "/placeholder.svg?height=32&width=32" : ""} />
                    <AvatarFallback>
                      {message.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div
                      className={`rounded-lg p-3 ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <div className="text-sm whitespace-pre-wrap">
                        {message.role === "assistant" ? renderTicketInfo(message.content) : message.content}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatTime(new Date(message.createdAt || Date.now()))}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-start gap-2 max-w-[80%]">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="rounded-lg p-3 bg-muted text-muted-foreground">
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-2 bg-current rounded-full animate-bounce"></div>
                      <div className="h-2 w-2 bg-current rounded-full animate-bounce delay-75"></div>
                      <div className="h-2 w-2 bg-current rounded-full animate-bounce delay-150"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="p-3 border-t">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input placeholder="메시지를 입력하세요..." value={input} onChange={handleInputChange} className="flex-1" />
          <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}
