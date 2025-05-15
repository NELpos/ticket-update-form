"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { createTables, seedDatabase } from "@/actions/db-init-actions"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"

export default function DbInitPage() {
  const [createStatus, setCreateStatus] = useState<{ success?: boolean; message?: string }>({})
  const [seedStatus, setSeedStatus] = useState<{ success?: boolean; message?: string }>({})
  const [isCreating, setIsCreating] = useState(false)
  const [isSeeding, setIsSeeding] = useState(false)

  const handleCreateTables = async () => {
    setIsCreating(true)
    try {
      const result = await createTables()
      setCreateStatus(result)
    } catch (error) {
      setCreateStatus({ success: false, message: `Error: ${error}` })
    } finally {
      setIsCreating(false)
    }
  }

  const handleSeedDatabase = async () => {
    setIsSeeding(true)
    try {
      const result = await seedDatabase()
      setSeedStatus(result)
    } catch (error) {
      setSeedStatus({ success: false, message: `Error: ${error}` })
    } finally {
      setIsSeeding(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">데이터베이스 초기화</h1>
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>테이블 생성</CardTitle>
            <CardDescription>필요한 모든 데이터베이스 테이블을 생성합니다.</CardDescription>
          </CardHeader>
          <CardContent>
            {createStatus.message && (
              <Alert className={`mb-4 ${createStatus.success ? "bg-green-50" : "bg-red-50"}`}>
                {createStatus.success ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
                <AlertTitle>{createStatus.success ? "성공" : "오류"}</AlertTitle>
                <AlertDescription>{createStatus.message}</AlertDescription>
              </Alert>
            )}
            <p className="text-sm text-muted-foreground">
              이 작업은 severity, status, priority, category, environment, assignee, reporter, ticket 테이블을
              생성합니다.
            </p>
          </CardContent>
          <CardFooter>
            <Button onClick={handleCreateTables} disabled={isCreating}>
              {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isCreating ? "테이블 생성 중..." : "테이블 생성"}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>데이터 시드</CardTitle>
            <CardDescription>기본 옵션 데이터를 데이터베이스에 추가합니다.</CardDescription>
          </CardHeader>
          <CardContent>
            {seedStatus.message && (
              <Alert className={`mb-4 ${seedStatus.success ? "bg-green-50" : "bg-red-50"}`}>
                {seedStatus.success ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
                <AlertTitle>{seedStatus.success ? "성공" : "오류"}</AlertTitle>
                <AlertDescription>{seedStatus.message}</AlertDescription>
              </Alert>
            )}
            <p className="text-sm text-muted-foreground">
              이 작업은 위험도, 상태, 우선순위, 카테고리, 환경, 담당자, 보고자 테이블에 기본 데이터를 추가합니다.
            </p>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSeedDatabase} disabled={isSeeding}>
              {isSeeding && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSeeding ? "데이터 시드 중..." : "데이터 시드"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
