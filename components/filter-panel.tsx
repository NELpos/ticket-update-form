"use client"
import { Button } from "@/components/ui/button"
import { MultiSelectFilter } from "@/components/multi-select-filter"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import { chatRoomTypes, mockUsers } from "@/lib/mock-data"
import { Badge } from "@/components/ui/badge"
import type { DateRange } from "react-day-picker"

interface FilterPanelProps {
  selectedUserIds: string[]
  setSelectedUserIds: (ids: string[]) => void
  selectedTypes: string[]
  setSelectedTypes: (types: string[]) => void
  selectedRoles: string[]
  setSelectedRoles: (roles: string[]) => void
  dateRange: DateRange | undefined
  setDateRange: (dateRange: DateRange | undefined) => void
  onClearAllFilters: () => void
}

export function FilterPanel({
  selectedUserIds,
  setSelectedUserIds,
  selectedTypes,
  setSelectedTypes,
  selectedRoles,
  setSelectedRoles,
  dateRange,
  setDateRange,
  onClearAllFilters,
}: FilterPanelProps) {
  // 사용자 옵션 생성
  const userOptions = mockUsers.map((user) => ({
    value: user.id,
    label: user.name,
  }))

  // 타입 옵션 생성
  const typeOptions = chatRoomTypes.map((type) => ({
    value: type,
    label: type,
  }))

  // 역할 옵션 생성
  const roleOptions = [
    { value: "admin", label: "관리자" },
    { value: "manager", label: "매니저" },
    { value: "user", label: "일반 사용자" },
  ]

  // 활성화된 필터가 있는지 확인
  const hasActiveFilters =
    selectedUserIds.length > 0 || selectedTypes.length > 0 || selectedRoles.length > 0 || dateRange

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <p className="text-sm font-medium">날짜 범위</p>
          <DateRangePicker dateRange={dateRange} setDateRange={setDateRange} />
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">사용자</p>
          <MultiSelectFilter
            options={userOptions}
            selectedValues={selectedUserIds}
            onSelectionChange={setSelectedUserIds}
            placeholder="사용자 선택"
            emptyMessage="사용자를 찾을 수 없습니다"
            label="사용자"
          />
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">채팅방 유형</p>
          <MultiSelectFilter
            options={typeOptions}
            selectedValues={selectedTypes}
            onSelectionChange={setSelectedTypes}
            placeholder="유형 선택"
            emptyMessage="유형을 찾을 수 없습니다"
            label="유형"
          />
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">사용자 역할</p>
          <MultiSelectFilter
            options={roleOptions}
            selectedValues={selectedRoles}
            onSelectionChange={setSelectedRoles}
            placeholder="역할 선택"
            emptyMessage="역할을 찾을 수 없습니다"
            label="역할"
          />
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex justify-between items-center pt-2 border-t">
          <div className="flex flex-wrap gap-1">
            {dateRange?.from && (
              <Badge variant="outline" className="gap-1 px-2">
                {dateRange.to
                  ? `${dateRange.from.toLocaleDateString()} - ${dateRange.to.toLocaleDateString()}`
                  : dateRange.from.toLocaleDateString()}
              </Badge>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={onClearAllFilters}>
            모든 필터 지우기
          </Button>
        </div>
      )}
    </div>
  )
}
