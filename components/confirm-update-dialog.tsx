"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import type { Ticket } from "@/components/ticket-table"

interface ConfirmUpdateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tickets: Ticket[]
  changes: Record<string, any>
  onConfirm: () => void
}

// 필드 레이블 매핑
const fieldLabels: Record<string, string> = {
  name: "티켓 이름",
  severity: "위험도",
  status: "상태",
  assignee: "담당자",
  priority: "우선순위",
  dueDate: "마감일",
  category: "카테고리",
  environment: "환경",
  estimatedTime: "예상 소요 시간",
  reporter: "보고자",
}

export function ConfirmUpdateDialog({ open, onOpenChange, tickets, changes, onConfirm }: ConfirmUpdateDialogProps) {
  // 변경된 필드만 필터링
  const changedFields = Object.entries(changes).filter(([_, value]) => value !== "")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>티켓 업데이트 확인</DialogTitle>
          <DialogDescription>
            선택한 {tickets.length}개의 티켓에 대해 다음 변경사항을 적용하시겠습니까?
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2">선택된 티켓 ({tickets.length}개)</h3>
            <ScrollArea className="h-[100px] border rounded-md p-2">
              <div className="space-y-1">
                {tickets.map((ticket) => (
                  <div key={ticket.id} className="flex items-center justify-between text-sm">
                    <span className="truncate">{ticket.name}</span>
                    <span className="text-xs text-muted-foreground">{ticket.id}</span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">변경될 필드 ({changedFields.length}개)</h3>
            {changedFields.length > 0 ? (
              <div className="space-y-2 border rounded-md p-3">
                {changedFields.map(([field, value]) => (
                  <div key={field} className="flex items-center justify-between">
                    <span className="font-medium">{fieldLabels[field] || field}</span>
                    <Badge variant="outline">{value}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">변경된 필드가 없습니다.</p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            아니요
          </Button>
          <Button onClick={onConfirm}>예, 변경합니다</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
