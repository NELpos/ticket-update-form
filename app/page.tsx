"use client"

import { Suspense } from "react"
import { TicketTable } from "@/components/ticket-table"
import { Skeleton } from "@/components/ui/skeleton"
import { ChatPanel } from "@/components/chat-panel"
import { Resizer } from "@/components/resizer"
import { LayoutProvider, useLayout } from "@/context/layout-context"
import { useEffect, useState } from "react"
import { getAllOptions } from "@/actions/option-actions"

function MainContent() {
  const { leftWidth, activeTicketId, isTicketView } = useLayout()
  const [options, setOptions] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  // 옵션 데이터 로드
  useEffect(() => {
    const loadOptions = async () => {
      try {
        const data = await getAllOptions()
        setOptions(data)
      } catch (error) {
        console.error("Failed to load options:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadOptions()
  }, [])

  // 티켓 ID가 변경되면 해당 티켓 페이지로 이동
  useEffect(() => {
    if (activeTicketId) {
      // 실제 구현에서는 여기서 라우터를 사용하여 티켓 상세 페이지로 이동할 수 있습니다
      console.log(`Navigate to ticket: ${activeTicketId}`)
    }
  }, [activeTicketId])

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
      <Resizer />

      {/* 오른쪽 티켓 관리 패널 */}
      <div className="flex-1 h-full overflow-auto p-6">
        <h1 className="text-3xl font-bold mb-6">티켓 관리 시스템</h1>
        {isLoading ? (
          <Skeleton className="h-[600px] w-full" />
        ) : (
          <Suspense fallback={<Skeleton className="h-[600px] w-full" />}>
            <TicketTable initialOptions={options} />
          </Suspense>
        )}
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <LayoutProvider>
      <MainContent />
    </LayoutProvider>
  )
}
