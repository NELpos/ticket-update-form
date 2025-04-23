"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { EditTicketsForm } from "@/components/edit-tickets-form"
import type { Ticket } from "@/components/ticket-table"

interface EditTicketsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tickets: Ticket[]
}

export function EditTicketsDialog({ open, onOpenChange, tickets }: EditTicketsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>티켓 일괄 편집</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground mb-4">
            선택된 {tickets.length}개의 티켓을 일괄 편집합니다. 변경하지 않을 필드는 비워두세요.
          </p>
          <EditTicketsForm tickets={tickets} onSuccess={() => onOpenChange(false)} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
