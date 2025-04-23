import { Suspense } from "react"
import { TicketTable } from "@/components/ticket-table"
import { Skeleton } from "@/components/ui/skeleton"

export default function Home() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">티켓 관리 시스템</h1>
      <Suspense fallback={<Skeleton className="h-[600px] w-full" />}>
        <TicketTable />
      </Suspense>
    </div>
  )
}
