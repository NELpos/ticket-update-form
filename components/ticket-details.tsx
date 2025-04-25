import { Badge } from "@/components/ui/badge"
import type { Ticket } from "@/components/ticket-table"

interface TicketDetailsProps {
  ticket: Ticket
}

export function TicketDetails({ ticket }: TicketDetailsProps) {
  return (
    <div className="pl-4 pr-2 py-2 bg-muted/30 rounded-md mt-1 space-y-2 text-sm">
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 min-w-[380px]">
        <div>
          <span className="text-xs font-medium text-muted-foreground">위험도</span>
          <div>
            <Badge
              variant={
                ticket.severity === "긴급"
                  ? "destructive"
                  : ticket.severity === "높음"
                    ? "outline"
                    : ticket.severity === "중간"
                      ? "secondary"
                      : "default"
              }
              className="mt-1"
            >
              {ticket.severity}
            </Badge>
          </div>
        </div>
        <div>
          <span className="text-xs font-medium text-muted-foreground">상태</span>
          <div>
            <Badge
              variant={
                ticket.status === "완료"
                  ? "default"
                  : ticket.status === "진행중"
                    ? "outline"
                    : ticket.status === "검토중"
                      ? "secondary"
                      : "destructive"
              }
              className="mt-1"
            >
              {ticket.status}
            </Badge>
          </div>
        </div>
        <div>
          <span className="text-xs font-medium text-muted-foreground">담당자</span>
          <p>{ticket.assignee}</p>
        </div>
        <div>
          <span className="text-xs font-medium text-muted-foreground">보고자</span>
          <p>{ticket.reporter}</p>
        </div>
        <div>
          <span className="text-xs font-medium text-muted-foreground">우선순위</span>
          <p>{ticket.priority}</p>
        </div>
        <div>
          <span className="text-xs font-medium text-muted-foreground">카테고리</span>
          <p>{ticket.category}</p>
        </div>
        <div>
          <span className="text-xs font-medium text-muted-foreground">환경</span>
          <p>{ticket.environment}</p>
        </div>
        <div>
          <span className="text-xs font-medium text-muted-foreground">예상 소요 시간</span>
          <p>{ticket.estimatedTime}</p>
        </div>
        <div className="col-span-2">
          <span className="text-xs font-medium text-muted-foreground">마감일</span>
          <p>{ticket.dueDate}</p>
        </div>
      </div>
    </div>
  )
}
