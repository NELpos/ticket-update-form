import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { mockTickets } from "@/data/mock-data"

export default function TicketPage({ params }: { params: { id: string } }) {
  const ticket = mockTickets.find((ticket) => ticket.id === params.id)

  if (!ticket) {
    notFound()
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

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <Button variant="outline" size="sm" asChild>
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            티켓 목록으로 돌아가기
          </Link>
        </Button>
      </div>

      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{ticket.name}</CardTitle>
              <CardDescription>티켓 ID: {ticket.id}</CardDescription>
            </div>
            <div className="flex gap-2">
              <Badge variant={getSeverityBadgeVariant(ticket.severity)}>{ticket.severity}</Badge>
              <Badge variant={getStatusBadgeVariant(ticket.status)}>{ticket.status}</Badge>
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
              <h3 className="text-sm font-medium text-muted-foreground mb-1">생성일</h3>
              <p>{new Date().toLocaleDateString()}</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">설명</h3>
            <p className="text-sm">
              이 티켓은 {ticket.name.toLowerCase()}에 관한 작업입니다. 담당자 {ticket.assignee}님이 현재 {ticket.status}{" "}
              상태로 처리 중입니다. 위험도는 {ticket.severity}이며, 우선순위에 맞게 처리되어야 합니다.
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
                <div className="w-24 flex-shrink-0 text-muted-foreground">3일 전</div>
                <div>
                  <p className="font-medium">티켓이 생성되었습니다.</p>
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
    </div>
  )
}
