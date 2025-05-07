"use client"

import { useState, useEffect } from "react"
import { notFound, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { mockTickets } from "@/data/mock-data"
import { ChatPanel } from "@/components/chat-panel"
import { Resizer } from "@/components/resizer"
import { Skeleton } from "@/components/ui/skeleton"

export default function TicketPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [leftWidth, setLeftWidth] = useState(350) // 초기 왼쪽 패널 너비
  const [ticket, setTicket] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 티켓 데이터 로드 (실제로는 API 호출)
    const foundTicket = mockTickets.find((t) => t.id === params.id)

    if (foundTicket) {
      setTicket(foundTicket)
    }

    setIsLoading(false)
  }, [params.id])

  // 티켓을 찾지 못한 경우
  if (!isLoading && !ticket) {
    notFound()
  }

  // 리사이저 핸들러
  const handleResize = (newLeftWidth: number) => {
    setLeftWidth(newLeftWidth)
  }

  // 위험도에 따른 배지 스타일 결정
  const getSeverityBadgeVariant = (severity: string) => {
    switch (severity) {
      case "긴급":
        return "destructive"
      case "높음":
        return "outline"
      case "중간":
        return "secondary"
      default:
        return "default"
    }
  }

  // 상태에 따른 배지 스타일 결정
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "완료":
        return "default"
      case "진행중":
        return "outline"
      case "검토중":
        return "secondary"
      default:
        return "destructive"
    }
  }

  // 우선순위에 따른 배지 스타일 결정
  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case "최우선":
        return "destructive"
      case "높음":
        return "outline"
      case "보통":
        return "secondary"
      default:
        return "default"
    }
  }

  // 날짜 포맷 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* 왼쪽 채팅 패널 */}
      <div
        className="h-full overflow-hidden transition-all duration-300"
        style={{ width: leftWidth, minWidth: leftWidth === 0 ? 0 : "250px" }}
      >
        {leftWidth > 0 && <ChatPanel />}
      </div>

      {/* 리사이저 */}
      <Resizer onResize={handleResize} initialLeftWidth={leftWidth} />

      {/* 오른쪽 티켓 상세 패널 */}
      <div className="flex-1 h-full overflow-auto p-6">
        <div className="mb-6">
          <Button variant="outline" size="sm" asChild>
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              티켓 목록으로 돌아가기
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <Skeleton className="h-[600px] w-full" />
        ) : ticket ? (
          <Card className="max-w-3xl mx-auto">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">{ticket.name}</CardTitle>
                  <CardDescription>티켓 ID: {ticket.id}</CardDescription>
                  <CardDescription className="mt-1">생성 날짜: {formatDate(ticket.createdAt)}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge variant={getSeverityBadgeVariant(ticket.severity)}>{ticket.severity}</Badge>
                  <Badge variant={getStatusBadgeVariant(ticket.status)}>{ticket.status}</Badge>
                  <Badge variant={getPriorityBadgeVariant(ticket.priority)}>{ticket.priority}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">담당자</h3>
                  <p>{ticket.assignee}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">보고자</h3>
                  <p>{ticket.reporter}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">마감일</h3>
                  <p>{ticket.dueDate}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">예상 소요 시간</h3>
                  <p>{ticket.estimatedTime}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">카테고리</h3>
                  <p>{ticket.category}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">환경</h3>
                  <p>{ticket.environment}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">설명</h3>
                <p className="text-sm">
                  이 티켓은 {ticket.name.toLowerCase()}에 관한 작업입니다. 담당자 {ticket.assignee}님이 현재{" "}
                  {ticket.status} 상태로 처리 중입니다. 위험도는 {ticket.severity}이며, 우선순위는 {ticket.priority}
                  입니다. {ticket.environment} 환경에서 {ticket.category} 작업으로 분류되었으며, {ticket.dueDate}까지
                  완료되어야 합니다. 예상 소요 시간은 {ticket.estimatedTime}입니다.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">활동 내역</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-2 text-sm">
                    <div className="w-24 flex-shrink-0 text-muted-foreground">오늘</div>
                    <div>
                      <p className="font-medium">
                        {ticket.assignee}님이 티켓을 {ticket.status}(으)로 변경했습니다.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <div className="w-24 flex-shrink-0 text-muted-foreground">어제</div>
                    <div>
                      <p className="font-medium">{ticket.assignee}님이 티켓을 할당받았습니다.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <div className="w-24 flex-shrink-0 text-muted-foreground">{formatDate(ticket.createdAt)}</div>
                    <div>
                      <p className="font-medium">{ticket.reporter}님이 티켓을 생성했습니다.</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">티켓 편집</Button>
              <Button>상태 변경</Button>
            </CardFooter>
          </Card>
        ) : null}
      </div>
    </div>
  )
}
