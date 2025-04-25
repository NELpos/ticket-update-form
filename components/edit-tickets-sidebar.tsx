"use client"

import { useState } from "react"
import { ArrowLeft, ChevronDown, ChevronRight } from "lucide-react"

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { EditTicketsForm } from "@/components/edit-tickets-form"
import { TicketDetails } from "@/components/ticket-details"
import type { Ticket } from "@/components/ticket-table"

interface EditTicketsSidebarProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tickets: Ticket[]
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

export function EditTicketsSidebar({ open, onOpenChange, tickets }: EditTicketsSidebarProps) {
  // 사이드바 단계 관리 (0: 편집 폼, 1: 확인 화면)
  const [step, setStep] = useState(0)
  const [changes, setChanges] = useState<Record<string, any>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  // 선택된 티켓 ID 추적
  const [expandedTicketId, setExpandedTicketId] = useState<string | null>(null)

  // 폼 제출 처리
  const handleFormSubmit = (values: Record<string, any>) => {
    // 빈 값을 제외한 변경 사항만 저장
    const changedValues = Object.fromEntries(Object.entries(values).filter(([_, value]) => value !== ""))

    // 변경 사항이 없으면 바로 종료
    if (Object.keys(changedValues).length === 0) {
      onOpenChange(false)
      return
    }

    // 변경 사항이 있으면 확인 화면으로 이동
    setChanges(changedValues)
    setStep(1)
  }

  // 최종 업데이트 처리
  const handleConfirmUpdate = async () => {
    setIsSubmitting(true)

    // 실제 구현에서는 여기서 API 호출을 통해 티켓을 업데이트합니다
    console.log("업데이트할 티켓:", tickets)
    console.log("업데이트 값:", changes)

    // API 호출 시뮬레이션
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsSubmitting(false)
    setStep(0) // 편집 폼으로 초기화
    onOpenChange(false) // 사이드바 닫기
  }

  // 사이드바가 닫힐 때 상태 초기화
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setStep(0)
      setChanges({})
      setExpandedTicketId(null)
    }
    onOpenChange(open)
  }

  // 티켓 확장/축소 토글
  const toggleTicketExpand = (ticketId: string) => {
    setExpandedTicketId(expandedTicketId === ticketId ? null : ticketId)
  }

  // 변경된 필드만 필터링
  const changedFields = Object.entries(changes)

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        {step === 0 ? (
          // 편집 폼 단계
          <>
            <SheetHeader className="mb-6">
              <SheetTitle>티켓 일괄 편집</SheetTitle>
              <SheetDescription>
                선택된 {tickets.length}개의 티켓을 일괄 편집합니다. 변경하지 않을 필드는 비워두세요.
              </SheetDescription>
            </SheetHeader>
            <EditTicketsForm tickets={tickets} onSuccess={() => onOpenChange(false)} onSubmit={handleFormSubmit} />
          </>
        ) : (
          // 확인 화면 단계
          <>
            <SheetHeader className="mb-6">
              <div className="flex items-center">
                <Button variant="ghost" size="icon" className="mr-2" onClick={() => setStep(0)}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <SheetTitle>티켓 업데이트 확인</SheetTitle>
                  <SheetDescription>
                    선택한 {tickets.length}개의 티켓에 대해 다음 변경사항을 적용하시겠습니까?
                  </SheetDescription>
                </div>
              </div>
            </SheetHeader>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-2">선택된 티켓 ({tickets.length}개)</h3>
                <ScrollArea className="h-[250px] border rounded-md p-2">
                  <div className="space-y-1">
                    {tickets.map((ticket) => (
                      <div key={ticket.id} className="space-y-1">
                        <div
                          className="flex items-center justify-between text-sm cursor-pointer hover:bg-muted/50 p-1 rounded-sm"
                          onClick={() => toggleTicketExpand(ticket.id)}
                        >
                          <div className="flex items-center space-x-2">
                            {expandedTicketId === ticket.id ? (
                              <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            )}
                            <span className="truncate">{ticket.name}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">{ticket.id}</span>
                        </div>
                        {expandedTicketId === ticket.id && <TicketDetails ticket={ticket} />}
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

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => setStep(0)}>
                  이전으로
                </Button>
                <Button onClick={handleConfirmUpdate} disabled={isSubmitting}>
                  {isSubmitting ? "업데이트 중..." : "예, 변경합니다"}
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
