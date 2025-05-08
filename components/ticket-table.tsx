"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Filter, PlusCircle } from "lucide-react"
import { useTranslations } from "next-intl"
import { useLocale } from "next-intl"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { EditTicketsSidebar } from "@/components/edit-tickets-sidebar"
import { mockTickets } from "@/data/mock-data"
import type { SelectOption } from "@/db/schema"

export type Ticket = {
  id: string
  name: string
  severity: "낮음" | "중간" | "높음" | "긴급"
  status: "대기중" | "진행중" | "검토중" | "완료"
  assignee: string
  priority: "낮음" | "보통" | "높음" | "최우선"
  dueDate: string
  category: "버그" | "기능개선" | "신규기능" | "문서화" | "유지보수"
  environment: "개발" | "테스트" | "스테이징" | "운영"
  estimatedTime: string
  reporter: string
  createdAt: string
}

export type OptionData = {
  severityOptions: SelectOption[]
  statusOptions: SelectOption[]
  priorityOptions: SelectOption[]
  categoryOptions: SelectOption[]
  environmentOptions: SelectOption[]
  assignees: string[]
  reporters: string[]
}

interface TicketTableProps {
  initialOptions: OptionData
}

export const TicketTable = ({ initialOptions }: TicketTableProps) => {
  const router = useRouter()
  const t = useTranslations()
  const locale = useLocale()
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [isEditSidebarOpen, setIsEditSidebarOpen] = useState(false)

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
        case "낮음":
          return "Low"
        case "중간":
          return "Medium"
        case "높음":
          return "High"
        case "긴급":
          return "Critical"
        case "보통":
          return "Normal"
        case "최우선":
          return "Highest"
        default:
          return status
      }
    }
    return status
  }

  const columns: ColumnDef<Ticket>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label={locale === "ko" ? "모든 행 선택" : "Select all rows"}
          onClick={(e) => {
            // 이벤트 버블링 방지
            e.stopPropagation()
          }}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label={locale === "ko" ? "행 선택" : "Select row"}
          onClick={(e) => {
            // 이벤트 버블링 방지
            e.stopPropagation()
          }}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: t("tickets.ticketName"),
      cell: ({ row }) => <div>{row.getValue("name")}</div>,
    },
    {
      accessorKey: "severity",
      header: t("tickets.severity"),
      cell: ({ row }) => {
        const severity = row.getValue("severity") as string
        return (
          <Badge
            variant={
              severity === "긴급" || severity === "critical"
                ? "destructive"
                : severity === "높음" || severity === "high"
                  ? "outline"
                  : severity === "중간" || severity === "medium"
                    ? "secondary"
                    : "default"
            }
          >
            {translateStatus(severity)}
          </Badge>
        )
      },
    },
    {
      accessorKey: "status",
      header: t("tickets.status"),
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        return (
          <Badge
            variant={
              status === "완료" || status === "completed"
                ? "default"
                : status === "진행중" || status === "inProgress"
                  ? "outline"
                  : status === "검토중" || status === "reviewing"
                    ? "secondary"
                    : "destructive"
            }
          >
            {translateStatus(status)}
          </Badge>
        )
      },
    },
    {
      accessorKey: "assignee",
      header: t("tickets.assignee"),
      cell: ({ row }) => <div>{row.getValue("assignee")}</div>,
    },
    {
      accessorKey: "createdAt",
      header: t("tickets.createdAt"),
      cell: ({ row }) => {
        const createdAt = row.getValue("createdAt") as string
        // ISO 날짜 문자열을 YYYY-MM-DD 형식으로 변환
        const formattedDate = new Date(createdAt).toLocaleDateString(locale === "ko" ? "ko-KR" : "en-US")
        return <div className="text-muted-foreground text-sm">{formattedDate}</div>
      },
    },
  ]

  const table = useReactTable({
    data: mockTickets,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  const selectedTickets = table.getFilteredSelectedRowModel().rows.map((row) => row.original)

  return (
    <div className="space-y-4 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Input
            placeholder={t("tickets.filterByName")}
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
            className="max-w-sm"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="ml-auto h-8 gap-1">
                <Filter className="h-3.5 w-3.5" />
                <span>{t("common.filter")}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  const columnId = column.id
                  let columnLabel = ""

                  switch (columnId) {
                    case "name":
                      columnLabel = t("tickets.ticketName")
                      break
                    case "severity":
                      columnLabel = t("tickets.severity")
                      break
                    case "status":
                      columnLabel = t("tickets.status")
                      break
                    case "assignee":
                      columnLabel = t("tickets.assignee")
                      break
                    case "createdAt":
                      columnLabel = t("tickets.createdAt")
                      break
                    default:
                      columnLabel = columnId
                  }

                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {columnLabel}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditSidebarOpen(true)}
            disabled={table.getFilteredSelectedRowModel().rows.length === 0}
          >
            {t("tickets.editSelected")}
          </Button>
          <Button size="sm" className="gap-1">
            <PlusCircle className="h-3.5 w-3.5" />
            <span>{t("tickets.newTicket")}</span>
          </Button>
        </div>
      </div>
      <div className="rounded-md border flex-1 overflow-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      onClick={(e) => {
                        // 선택 칼럼이 아닌 경우에만 행 클릭 이벤트 처리
                        if (cell.column.id !== "select") {
                          router.push(`/${locale}/tickets/${row.original.id}`)
                        }
                      }}
                      className={cell.column.id !== "select" ? "cursor-pointer" : ""}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  {t("tickets.noResults")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex-1 text-sm text-muted-foreground">
          {t("common.selected", {
            count: table.getFilteredSelectedRowModel().rows.length,
            total: table.getFilteredRowModel().rows.length,
          })}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {t("common.previous")}
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            {t("common.next")}
          </Button>
        </div>
      </div>
      <EditTicketsSidebar
        open={isEditSidebarOpen}
        onOpenChange={setIsEditSidebarOpen}
        tickets={selectedTickets}
        options={initialOptions}
      />
    </div>
  )
}
