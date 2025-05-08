"use client"

import { useState, useEffect } from "react"
import { notFound, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { mockTickets } from "@/data/mock-data"
import { ChatPanel } from "@/components/chat-panel"
import { Resizer } from "@/components/resizer"
import { Skeleton } from "@/components/ui/skeleton"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useLocale } from "next-intl"

export default function TicketPage({ params }: { params: { id: string } }) {
  const t = useTranslations()
  const locale = useLocale()
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
      case "critical":
        return "destructive"
      case "높음":
      case "high":
        return "outline"
      case "중간":
      case "medium":
        return "secondary"
      default:
        return "default"
    }
  }

  // 상태에 따른 배지 스타일 결정
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "완료":
      case "completed":
        return "default"
      case "진행중":
      case "inProgress":
        return "outline"
      case "검토중":
      case "reviewing":
        return "secondary"
      default:
        return "destructive"
    }
  }

  // 우선순위에 따른 배지 스타일 결정
  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case "최우선":
      case "highest":
        return "destructive"
      case "높음":
      case "high":
        return "outline"
      case "보통":
      case "normal":
        return "secondary"
      default:
        return "default"
    }
  }

  // 날짜 포맷 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(locale === "ko" ? "ko-KR" : "en-US")
  }

  if (!ticket) return null

  // 현재 언어에 맞게 상태 값 번역
  const translateStatus = (status: string) => {
    if (locale === "en") {
      switch (status) {
        case "대기중":
          return "Waiting"
        case "진행중":
          return "In Progress"
        case "검토중":
          return "Reviewing"
        case "완료":
          return "Completed"
        default:
          return status
      }
    }
    return status
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
        <div className="flex justify-between items-center mb-6">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/${locale}`} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              {t("ticketDetails.backToList")}
            </Link>
          </Button>
          <LanguageSwitcher />
        </div>

        {isLoading ? (
          <Skeleton className="h-[600px] w-full" />
        ) : ticket ? (
          <Card className="max-w-3xl mx-auto">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">{ticket.name}</CardTitle>
                  <CardDescription>{t("ticketDetails.ticketId", { id: ticket.id })}</CardDescription>
                  <CardDescription className="mt-1">
                    {t("tickets.createdAt")}: {formatDate(ticket.createdAt)}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge variant={getSeverityBadgeVariant(ticket.severity)}>{translateStatus(ticket.severity)}</Badge>
                  <Badge variant={getStatusBadgeVariant(ticket.status)}>{translateStatus(ticket.status)}</Badge>
                  <Badge variant={getPriorityBadgeVariant(ticket.priority)}>{translateStatus(ticket.priority)}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">{t("tickets.assignee")}</h3>
                  <p>{ticket.assignee}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">{t("tickets.reporter")}</h3>
                  <p>{ticket.reporter}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">{t("tickets.dueDate")}</h3>
                  <p>{ticket.dueDate}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">{t("tickets.estimatedTime")}</h3>
                  <p>{ticket.estimatedTime}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">{t("tickets.category")}</h3>
                  <p>{translateStatus(ticket.category)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">{t("tickets.environment")}</h3>
                  <p>{translateStatus(ticket.environment)}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">{t("ticketDetails.description")}</h3>
                <p className="text-sm">
                  {locale === "ko"
                    ? `이 티켓은 ${ticket.name.toLowerCase()}에 관한 작업입니다. 담당자 ${ticket.assignee}님이 현재 ${ticket.status} 상태로 처리 중입니다. 위험도는 ${ticket.severity}이며, 우선순위는 ${ticket.priority}입니다. ${ticket.environment} 환경에서 ${ticket.category} 작업으로 분류되었으며, ${ticket.dueDate}까지 완료되어야 합니다. 예상 소요 시간은 ${ticket.estimatedTime}입니다.`
                    : `This ticket is about ${ticket.name.toLowerCase()}. It is currently being processed by ${ticket.assignee} with the status of ${translateStatus(ticket.status)}. The severity is ${translateStatus(ticket.severity)} and the priority is ${translateStatus(ticket.priority)}. It has been classified as ${translateStatus(ticket.category)} work in the ${translateStatus(ticket.environment)} environment, and must be completed by ${ticket.dueDate}. The estimated time is ${ticket.estimatedTime}.`}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">{t("ticketDetails.activity")}</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-2 text-sm">
                    <div className="w-24 flex-shrink-0 text-muted-foreground">{t("ticketDetails.today")}</div>
                    <div>
                      <p className="font-medium">
                        {t("ticketDetails.statusChanged", {
                          name: ticket.assignee,
                          status: translateStatus(ticket.status),
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <div className="w-24 flex-shrink-0 text-muted-foreground">{t("ticketDetails.yesterday")}</div>
                    <div>
                      <p className="font-medium">{t("ticketDetails.assignedTo", { name: ticket.assignee })}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <div className="w-24 flex-shrink-0 text-muted-foreground">{formatDate(ticket.createdAt)}</div>
                    <div>
                      <p className="font-medium">{t("ticketDetails.createdBy", { name: ticket.reporter })}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">{t("ticketDetails.editTicket")}</Button>
              <Button>{t("ticketDetails.changeStatus")}</Button>
            </CardFooter>
          </Card>
        ) : null}
      </div>
    </div>
  )
}
