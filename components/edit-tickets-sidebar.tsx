"use client"

import { useState } from "react"
import { ArrowLeft, ChevronDown, ChevronRight, CheckCircle, XCircle, Loader2 } from "lucide-react"

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { EditTicketsForm } from "@/components/edit-tickets-form"
import { TicketDetails } from "@/components/ticket-details"
import type { Ticket, OptionData } from "@/components/ticket-table"

interface EditTicketsSidebarProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tickets: Ticket[]
  options: OptionData
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

// 폼 초기값
const initialFormValues = {
  name: "",
  severity: "",
  status: "",
  assignee: "",
  priority: "",
  dueDate: "",
  category: "",
  environment: "",
  estimatedTime: "",
  reporter: "",
}

// 티켓 업데이트 결과 타입
type TicketUpdateResult = {
  ticketId: string
  name: string
  success: boolean
  message: string
  updatedFields: {
    field: string
    oldValue: string
    newValue: string
  }[]
  timestamp: string
}

export function EditTicketsSidebar({ open, onOpenChange, tickets, options }: EditTicketsSidebarProps) {
  // 사이드바 단계 관리 (0: 편집 폼, 1: 확인 화면, 2: 결과 화면)
  const [step, setStep] = useState(0)
  const [formValues, setFormValues] = useState(initialFormValues)
  const [changes, setChanges] = useState<Record<string, any>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  // 선택된 티켓 ID 추적
  const [expandedTicketId, setExpandedTicketId] = useState<string | null>(null)
  // 결과 화면에서 확장된 티켓 ID 추적
  const [expandedResultId, setExpandedResultId] = useState<string | null>(null)
  // 티켓 업데이트 결과
  const [updateResults, setUpdateResults] = useState<TicketUpdateResult[]>([])

  // 폼 제출 처리
  const handleFormSubmit = (values: Record<string, any>) => {
    // 폼 값 저장
    setFormValues(values)

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

  // 폼 초기화 처리
  const handleFormReset = () => {
    setFormValues(initialFormValues)
  }

  // 랜덤 업데이트 결과 생성 함수
  const generateRandomUpdateResults = (tickets: Ticket[], changes: Record<string, any>): TicketUpdateResult[] => {
    return tickets.map((ticket) => {
      const success = Math.random() > 0.3 // 70% 확률로 성공

      // 변경된 필드 정보 생성
      const updatedFields = Object.entries(changes).map(([field, newValue]) => {
        // 티켓의 현재 값 가져오기 (필드가 존재하지 않으면 '없음'으로 표시)
        const oldValue = ticket[field as keyof Ticket] || "없음"
        return {
          field,
          oldValue: String(oldValue),
          newValue: String(newValue),
        }
      })

      // 현재 시간을 ISO 문자열로 변환
      const timestamp = new Date().toISOString()

      return {
        ticketId: ticket.id,
        name: ticket.name,
        success,
        message: success
          ? "티켓이 성공적으로 업데이트되었습니다."
          : `티켓 업데이트 중 오류가 발생했습니다: ${Math.random() > 0.5 ? "데이터베이스 연결 오류" : "권한 부족"}`,
        updatedFields,
        timestamp,
      }
    })
  }

  // 최종 업데이트 처리
  const handleConfirmUpdate = async () => {
    setIsSubmitting(true)

    // 실제 구현에서는 여기서 API 호출을 통해 티켓을 업데이트합니다
    console.log("업데이트할 티켓:", tickets)
    console.log("업데이트 값:", changes)

    // API 호출 시뮬레이션
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // 랜덤 업데이트 결과 생성
    const results = generateRandomUpdateResults(tickets, changes)
    setUpdateResults(results)

    setIsSubmitting(false)
    setStep(2) // 결과 화면으로 이동
  }

  // 사이드바가 닫힐 때 상태 초기화
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setStep(0)
      setChanges({})
      setExpandedTicketId(null)
      setExpandedResultId(null)
      setFormValues(initialFormValues)
      setUpdateResults([])
    }
    onOpenChange(open)
  }

  // 티켓 확장/축소 토글
  const toggleTicketExpand = (ticketId: string) => {
    setExpandedTicketId(expandedTicketId === ticketId ? null : ticketId)
  }

  // 결과 티켓 확장/축소 토글
  const toggleResultExpand = (ticketId: string) => {
    setExpandedResultId(expandedResultId === ticketId ? null : ticketId)
  }

  // 이전 단계로 돌아가기 (폼 값 유지)
  const handleBackToForm = () => {
    setStep(0)
  }

  // 확인 화면에서 초기화 버튼 클릭 시
  const handleResetFromConfirm = () => {
    setFormValues(initialFormValues)
    setStep(0)
  }

  // 결과 화면에서 완료 버튼 클릭 시
  const handleComplete = () => {
    setStep(0) // 편집 폼으로 초기화
    setFormValues(initialFormValues) // 폼 값 초기화
    onOpenChange(false) // 사이드바 닫기
  }

  // 결과 화면에서 다시 시도 버튼 클릭 시
  const handleRetry = () => {
    setStep(1) // 확인 화면으로 돌아가기
  }

  // 변경된 필드만 필터링
  const changedFields = Object.entries(changes)

  // 성공한 티켓과 실패한 티켓 분리
  const successTickets = updateResults.filter((result) => result.success)
  const failedTickets = updateResults.filter((result) => !result.success)

  // 날짜 포맷 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
  }

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
            <EditTicketsForm
              tickets={tickets}
              options={options}
              onSuccess={() => onOpenChange(false)}
              onSubmit={handleFormSubmit}
              onReset={handleFormReset}
              initialValues={formValues}
            />
          </>
        ) : step === 1 ? (
          // 확인 화면 단계
          <>
            <SheetHeader className="mb-6">
              <div className="flex items-center">
                <Button variant="ghost" size="icon" className="mr-2" onClick={handleBackToForm}>
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
                <ScrollArea className="h-[250px] border rounded-md p-2" orientation="both">
                  <div className="space-y-1 min-w-[400px]">
                    {tickets.map((ticket) => (
                      <div key={ticket.id} className="space-y-1">
                        <div
                          className="flex items-center justify-between text-sm cursor-pointer hover:bg-muted/50 p-1 rounded-sm"
                          onClick={() => toggleTicketExpand(ticket.id)}
                        >
                          <div className="flex items-center space-x-2 min-w-0">
                            {expandedTicketId === ticket.id ? (
                              <ChevronDown className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                            ) : (
                              <ChevronRight className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                            )}
                            <span className="truncate">{ticket.name}</span>
                          </div>
                          <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">{ticket.id}</span>
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
                <Button type="button" variant="outline" onClick={handleBackToForm}>
                  이전으로
                </Button>
                <Button type="button" variant="secondary" onClick={handleResetFromConfirm}>
                  초기화
                </Button>
                <Button onClick={handleConfirmUpdate} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      업데이트 중...
                    </>
                  ) : (
                    "예, 변경합니다"
                  )}
                </Button>
              </div>
            </div>
          </>
        ) : (
          // 결과 화면 단계
          <>
            <SheetHeader className="mb-6">
              <SheetTitle>티켓 업데이트 결과</SheetTitle>
              <SheetDescription>
                {tickets.length}개의 티켓 중 {successTickets.length}개 성공, {failedTickets.length}개 실패
              </SheetDescription>
            </SheetHeader>

            <div className="space-y-6">
              {successTickets.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium mb-2 text-green-600 flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    성공 ({successTickets.length}개)
                  </h3>
                  <ScrollArea
                    className="h-[150px] border border-green-200 rounded-md p-2 bg-green-50"
                    orientation="both"
                  >
                    <div className="space-y-1 min-w-[400px]">
                      {successTickets.map((result) => (
                        <div key={result.ticketId} className="text-sm p-1 rounded-sm">
                          <div
                            className="flex items-center justify-between cursor-pointer hover:bg-green-100 p-1 rounded-sm"
                            onClick={() => toggleResultExpand(result.ticketId)}
                          >
                            <div className="flex items-center space-x-2">
                              {expandedResultId === result.ticketId ? (
                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                              )}
                              <span className="truncate">{result.name}</span>
                            </div>
                            <span className="text-xs text-muted-foreground ml-2">{result.ticketId}</span>
                          </div>

                          {expandedResultId === result.ticketId && (
                            <div className="pl-6 pr-2 py-2 bg-green-100/50 rounded-md mt-1 space-y-2">
                              <div className="text-xs text-muted-foreground">
                                업데이트 시간: {formatDate(result.timestamp)}
                              </div>
                              <div className="text-xs font-medium">변경 내역:</div>
                              <div className="overflow-x-auto">
                                <table className="text-xs w-full min-w-[400px]">
                                  <thead>
                                    <tr className="border-b border-green-200">
                                      <th className="text-left py-1 px-2">필드</th>
                                      <th className="text-left py-1 px-2">이전 값</th>
                                      <th className="text-left py-1 px-2">새 값</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {result.updatedFields.map((field, idx) => (
                                      <tr key={idx} className="border-b border-green-200/50">
                                        <td className="py-1 px-2 font-medium">
                                          {fieldLabels[field.field] || field.field}
                                        </td>
                                        <td className="py-1 px-2">{field.oldValue}</td>
                                        <td className="py-1 px-2 font-medium">{field.newValue}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}

              {failedTickets.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium mb-2 text-red-600 flex items-center">
                    <XCircle className="h-4 w-4 mr-2" />
                    실패 ({failedTickets.length}개)
                  </h3>
                  <ScrollArea className="h-[150px] border border-red-200 rounded-md p-2 bg-red-50" orientation="both">
                    <div className="space-y-1 min-w-[400px]">
                      {failedTickets.map((result) => (
                        <div key={result.ticketId} className="text-sm p-1 rounded-sm">
                          <div
                            className="flex items-center justify-between cursor-pointer hover:bg-red-100 p-1 rounded-sm"
                            onClick={() => toggleResultExpand(result.ticketId)}
                          >
                            <div className="flex items-center space-x-2">
                              {expandedResultId === result.ticketId ? (
                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                              )}
                              <span className="truncate">{result.name}</span>
                            </div>
                            <span className="text-xs text-muted-foreground ml-2">{result.ticketId}</span>
                          </div>

                          <div className="pl-2 text-xs text-red-600 mt-1">{result.message}</div>

                          {expandedResultId === result.ticketId && (
                            <div className="pl-6 pr-2 py-2 bg-red-100/50 rounded-md mt-1 space-y-2">
                              <div className="text-xs text-muted-foreground">
                                시도 시간: {formatDate(result.timestamp)}
                              </div>
                              <div className="text-xs font-medium">시도한 변경 내역:</div>
                              <div className="overflow-x-auto">
                                <table className="text-xs w-full min-w-[400px]">
                                  <thead>
                                    <tr className="border-b border-red-200">
                                      <th className="text-left py-1 px-2">필드</th>
                                      <th className="text-left py-1 px-2">이전 값</th>
                                      <th className="text-left py-1 px-2">새 값</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {result.updatedFields.map((field, idx) => (
                                      <tr key={idx} className="border-b border-red-200/50">
                                        <td className="py-1 px-2 font-medium">
                                          {fieldLabels[field.field] || field.field}
                                        </td>
                                        <td className="py-1 px-2">{field.oldValue}</td>
                                        <td className="py-1 px-2 font-medium">{field.newValue}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4 border-t">
                {failedTickets.length > 0 && (
                  <Button type="button" variant="outline" onClick={handleRetry}>
                    다시 시도
                  </Button>
                )}
                <Button onClick={handleComplete}>완료</Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
