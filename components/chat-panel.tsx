"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send, User, Bot } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// 메시지 타입 정의
type Message = {
  id: string
  content: string
  sender: "user" | "agent"
  timestamp: Date
}

// 샘플 메시지 데이터
const initialMessages: Message[] = [
  {
    id: "1",
    content: "안녕하세요! 티켓 관리 시스템에 오신 것을 환영합니다. 무엇을 도와드릴까요?",
    sender: "agent",
    timestamp: new Date(Date.now() - 3600000), // 1시간 전
  },
  {
    id: "2",
    content: "티켓 #1234에 대해 문의하고 싶습니다.",
    sender: "user",
    timestamp: new Date(Date.now() - 1800000), // 30분 전
  },
  {
    id: "3",
    content: "네, 티켓 #1234는 현재 '진행중' 상태입니다. 어떤 정보가 필요하신가요?",
    sender: "agent",
    timestamp: new Date(Date.now() - 1700000), // 28분 전
  },
]

export function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [newMessage, setNewMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // 새 메시지가 추가될 때마다 스크롤을 아래로 이동
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // 메시지 전송 처리
  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    // 새 메시지 추가
    const userMessage: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setNewMessage("")

    // 자동 응답 (실제로는 API 호출 등으로 대체)
    setTimeout(() => {
      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "메시지를 받았습니다. 확인 후 답변 드리겠습니다.",
        sender: "agent",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, agentMessage])
    }, 1000)
  }

  // 엔터 키 처리
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // 시간 포맷 함수
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="flex flex-col h-full border rounded-md overflow-hidden bg-background">
      <div className="p-3 border-b bg-muted/30">
        <h2 className="text-lg font-semibold">고객 지원 채팅</h2>
        <p className="text-sm text-muted-foreground">실시간 지원을 통해 문의사항을 해결하세요</p>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`flex items-start gap-2 max-w-[80%] ${message.sender === "user" ? "flex-row-reverse" : ""}`}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={message.sender === "user" ? "/placeholder.svg?height=32&width=32" : ""} />
                  <AvatarFallback>
                    {message.sender === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div
                    className={`rounded-lg p-3 ${
                      message.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{formatTime(message.timestamp)}</p>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="p-3 border-t">
        <div className="flex gap-2">
          <Input
            placeholder="메시지를 입력하세요..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1"
          />
          <Button size="icon" onClick={handleSendMessage} disabled={!newMessage.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
