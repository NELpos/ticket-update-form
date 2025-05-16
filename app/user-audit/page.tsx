"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Search, X, Filter, Download } from "lucide-react"
import { mockActivityLogs } from "@/lib/mock-activity-logs"
import { mockUsers } from "@/lib/mock-data"
import { type UserActivityLog, ActivityTypes } from "@/lib/types"
import { format } from "date-fns"
import type { DateRange } from "react-day-picker"

export default function UserAuditPage() {
  const [logs, setLogs] = useState<UserActivityLog[]>(mockActivityLogs)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [selectedAction, setSelectedAction] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  // 필터링된 로그
  const filteredLogs = logs.filter((log) => {
    // 검색어 필터
    const matchesSearch =
      searchQuery === "" ||
      log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.details && log.details.toLowerCase().includes(searchQuery.toLowerCase()))

    // 사용자 필터
    const matchesUser = selectedUserId === null || log.userId === selectedUserId

    // 액션 타입 필터
    const matchesAction = selectedAction === null || log.action === selectedAction

    // 날짜 범위 필터
    const logDate = new Date(log.timestamp)
    const matchesStartDate = !dateRange?.from || logDate >= dateRange.from
    const matchesEndDate = !dateRange?.to || logDate <= new Date(new Date(dateRange.to).setHours(23, 59, 59, 999))

    return matchesSearch && matchesUser && matchesAction && matchesStartDate && matchesEndDate
  })

  // 페이지네이션 계산
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentLogs = filteredLogs.slice(indexOfFirstItem, indexOfLastItem)

  // 필터 변경 시 첫 페이지로 이동
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedUserId, selectedAction, dateRange])

  // 모든 필터 초기화
  const clearAllFilters = () => {
    setSearchQuery("")
    setSelectedUserId(null)
    setSelectedAction(null)
    setDateRange(undefined)
  }

  // 액션 타입에 따른 배지 색상 결정
  const getActionBadgeVariant = (action: string) => {
    switch (action) {
      case ActivityTypes.LOGIN:
      case ActivityTypes.LOGOUT:
        return "default"
      case ActivityTypes.USER_CREATE:
        return "success"
      case ActivityTypes.USER_UPDATE:
      case ActivityTypes.SETTINGS_CHANGE:
      case ActivityTypes.ROLE_CHANGE:
        return "warning"
      case ActivityTypes.USER_DELETE:
        return "destructive"
      case ActivityTypes.PASSWORD_RESET:
        return "outline"
      case ActivityTypes.PAGE_ACCESS:
      case ActivityTypes.CHAT_VIEW:
        return "secondary"
      case ActivityTypes.BULK_ACTION:
        return "default"
      default:
        return "default"
    }
  }

  // 페이지 번호 생성
  const getPageNumbers = () => {
    const pageNumbers = []
    const maxPagesToShow = 5

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i)
      }
    } else {
      pageNumbers.push(1)

      let start = Math.max(2, currentPage - 1)
      let end = Math.min(totalPages - 1, currentPage + 1)

      if (currentPage <= 3) {
        end = Math.min(totalPages - 1, maxPagesToShow - 1)
      }

      if (currentPage >= totalPages - 2) {
        start = Math.max(2, totalPages - maxPagesToShow + 2)
      }

      if (start > 2) {
        pageNumbers.push("ellipsis1")
      }

      for (let i = start; i <= end; i++) {
        pageNumbers.push(i)
      }

      if (end < totalPages - 1) {
        pageNumbers.push("ellipsis2")
      }

      if (totalPages > 1) {
        pageNumbers.push(totalPages)
      }
    }

    return pageNumbers
  }

  // CSV 다운로드 함수
  const downloadCSV = () => {
    // CSV 헤더
    const headers = ["ID", "사용자", "역할", "액션", "대상", "대상 유형", "상세 정보", "IP 주소", "타임스탬프"]

    // 로그 데이터를 CSV 형식으로 변환
    const csvData = filteredLogs.map((log) => [
      log.id,
      log.userName,
      log.userRole,
      log.action,
      log.target || "",
      log.targetType || "",
      log.details || "",
      log.ipAddress || "",
      new Date(log.timestamp).toLocaleString(),
    ])

    // CSV 문자열 생성
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...csvData].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n")

    // CSV 파일 다운로드
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `user-activity-logs-${new Date().toISOString().split("T")[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const hasActiveFilters = searchQuery || selectedUserId || selectedAction || dateRange

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">사용자 활동 로그</h1>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>활동 로그</CardTitle>
              <CardDescription>
                시스템 내 사용자 활동을 추적하고 모니터링합니다.
                {hasActiveFilters && (
                  <Button variant="link" className="p-0 h-auto text-xs ml-2" onClick={clearAllFilters}>
                    모든 필터 지우기
                  </Button>
                )}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="검색..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-2 h-4 w-4 p-0"
                    onClick={() => setSearchQuery("")}
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">검색어 지우기</span>
                  </Button>
                )}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowFilters(!showFilters)}
                className={showFilters ? "bg-muted" : ""}
              >
                <Filter className="h-4 w-4" />
                <span className="sr-only">필터 토글</span>
              </Button>

              <Button variant="outline" size="icon" onClick={downloadCSV} title="CSV 다운로드">
                <Download className="h-4 w-4" />
                <span className="sr-only">CSV 다운로드</span>
              </Button>
            </div>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">날짜 범위</p>
                <DateRangePicker dateRange={dateRange} setDateRange={setDateRange} />
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">사용자</p>
                <Select value={selectedUserId || ""} onValueChange={(value) => setSelectedUserId(value || null)}>
                  <SelectTrigger>
                    <SelectValue placeholder="모든 사용자" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">모든 사용자</SelectItem>
                    {mockUsers.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">액션 타입</p>
                <Select value={selectedAction || ""} onValueChange={(value) => setSelectedAction(value || null)}>
                  <SelectTrigger>
                    <SelectValue placeholder="모든 액션" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">모든 액션</SelectItem>
                    {Object.values(ActivityTypes).map((action) => (
                      <SelectItem key={action} value={action}>
                        {action}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground mb-4">
            {filteredLogs.length}개의 로그 항목 중 {indexOfFirstItem + 1}-
            {Math.min(indexOfLastItem, filteredLogs.length)}개 표시
          </div>

          <ScrollArea className="h-[calc(100vh-320px)]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>타임스탬프</TableHead>
                  <TableHead>사용자</TableHead>
                  <TableHead>액션</TableHead>
                  <TableHead>상세 정보</TableHead>
                  <TableHead>IP 주소</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentLogs.length > 0 ? (
                  currentLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="whitespace-nowrap">
                        {format(new Date(log.timestamp), "yyyy-MM-dd HH:mm:ss")}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{log.userName}</span>
                          <Badge variant="outline" className="w-fit mt-1">
                            {log.userRole}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getActionBadgeVariant(log.action)}>{log.action}</Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{log.details}</span>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">{log.ipAddress}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      검색 결과가 없습니다.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>

          {/* Items Per Page Selector */}
          <div className="flex items-center justify-end mt-4 mb-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">페이지당 항목 수:</span>
              <Select
                value={itemsPerPage.toString()}
                onValueChange={(value) => {
                  setItemsPerPage(Number(value))
                  setCurrentPage(1) // 페이지당 항목 수 변경 시 첫 페이지로 이동
                }}
              >
                <SelectTrigger className="w-[80px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Pagination */}
          {filteredLogs.length > 0 && (
            <div className="mt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    />
                  </PaginationItem>

                  {getPageNumbers().map((page, index) => (
                    <PaginationItem key={index}>
                      {page === "ellipsis1" || page === "ellipsis2" ? (
                        <PaginationEllipsis />
                      ) : (
                        <PaginationLink isActive={currentPage === page} onClick={() => setCurrentPage(page as number)}>
                          {page}
                        </PaginationLink>
                      )}
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
