"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send, User, Bot } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useTranslations } from "next-intl"

// 메시지 타입 정의
type Message = {
  id: string
  content: string
  sender: "user" | "agent"
  timestamp: Date
}

// 샘플 메시지 데이터 - 로케일에 따라 컴포넌트에서 동적으로 생성할 것입니다

export function ChatPanel() {
  const t = useTranslations("chat")
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [messageHistory, setMessageHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // 초기 메시지 생성
  useEffect(() => {
    const initialMessages: Message[] = [
      {
        id: "1",
        content: t("description"),
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
    setMessages(initialMessages)
  }, [t])

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

    // 메시지 히스토리에 추가
    setMessageHistory((prev) => [newMessage, ...prev.slice(0, 19)]) // 최대 20개 저장

    setNewMessage("")
    setHistoryIndex(-1) // 히스토리 인덱스 초기화

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

  // 키보드 이벤트 처리
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // 엔터 키로 메시지 전송
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }

    // 오른쪽 화살표 키로 이전 메시지 불러오기 (입력 필드가 비어있을 때만)
    if (e.key === "ArrowRight" && !newMessage && messageHistory.length > 0) {
      const nextIndex = (historyIndex + 1) % messageHistory.length
      setHistoryIndex(nextIndex)
      setNewMessage(messageHistory[nextIndex])
    }

    // 위쪽 화살표 키로 이전 메시지 탐색
    if (e.key === "ArrowUp" && messageHistory.length > 0) {
      e.preventDefault()
      const nextIndex = historyIndex >= 0 ? (historyIndex + 1) % messageHistory.length : 0
      setHistoryIndex(nextIndex)
      setNewMessage(messageHistory[nextIndex])
    }

    // 아래쪽 화살표 키로 다음 메시지 탐색
    if (e.key === "ArrowDown" && messageHistory.length > 0 && historyIndex >= 0) {
      e.preventDefault()
      const nextIndex = (historyIndex - 1 + messageHistory.length) % messageHistory.length
      setHistoryIndex(nextIndex)
      setNewMessage(messageHistory[nextIndex])
    }

    // ESC 키로 입력 필드 초기화
    if (e.key === "Escape") {
      setNewMessage("")
      setHistoryIndex(-1)
    }
  }

  // 시간 포맷 함수
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="flex flex-col h-full border rounded-md overflow-hidden bg-background">
      <div className="p-3 border-b bg-muted/30">
        <h2 className="text-lg font-semibold">{t("title")}</h2>
        <p className="text-sm text-muted-foreground">{t("description")}</p>
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
            placeholder={t("inputPlaceholder")}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1"
          />
          <Button size="icon" onClick={handleSendMessage} disabled={!newMessage.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
        {historyIndex >= 0 && (
          <p className="text-xs text-muted-foreground mt-1">
            {t("history", { current: historyIndex + 1, total: messageHistory.length })}
          </p>
        )}
      </div>
    </div>
  )
}
