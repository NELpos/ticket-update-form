import { Suspense } from "react"
import { TicketTable } from "@/components/ticket-table"
import { Skeleton } from "@/components/ui/skeleton"
import { getAllOptions } from "@/actions/option-actions"

export default async function Home() {
  // 모든 옵션 데이터를 미리 로드
  const options = await getAllOptions()

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">티켓 관리 시스템</h1>
      <Suspense fallback={<Skeleton className="h-[600px] w-full" />}>
        <TicketTable initialOptions={options} />
      </Suspense>
    </div>
  )
}
