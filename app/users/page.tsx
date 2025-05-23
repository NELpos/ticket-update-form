"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
// lucide-react 아이콘 import 부분에 KeyRound, Copy 추가
import { Search, X, UserPlus, Trash2, KeyRound, Check } from "lucide-react"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useToast } from "@/hooks/use-toast"

// 사용자 타입 정의
interface User {
  id: string
  role: "user" | "admin"
  auth: "local" | "sso"
  email: string
  name: string
  password: string
  createdAt: string
  updatedAt: string
}

// 목업 데이터에 password 필드 추가
const mockUsers: User[] = Array.from({ length: 50 }, (_, i) => ({
  id: `user-${i + 1}`,
  role: i % 5 === 0 ? "admin" : "user",
  auth: i % 3 === 0 ? "sso" : "local",
  email: `user${i + 1}@example.com`,
  name: `사용자 ${i + 1}`,
  password: generateSecurePassword(), // 초기 비밀번호 생성
  createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
  updatedAt: new Date(Date.now() - Math.random() * 5000000000).toISOString(),
}))

// Zod 스키마에 password 필드 추가
const userFormSchema = z.object({
  name: z.string().min(2, { message: "이름은 2글자 이상이어야 합니다." }),
  email: z.string().email({ message: "올바른 이메일 형식이 아닙니다." }),
  role: z.enum(["user", "admin"], {
    required_error: "역할을 선택해주세요.",
  }),
  password: z.string().min(8, { message: "비밀번호는 8자 이상이어야 합니다." }),
})

// 안전한 비밀번호 생성 함수 추가
function generateSecurePassword(length = 12) {
  const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  const lowercaseChars = "abcdefghijklmnopqrstuvwxyz"
  const numberChars = "0123456789"
  const specialChars = "!@#$%^&*()_+~`|}{[]:;?><,./-="

  const allChars = uppercaseChars + lowercaseChars + numberChars + specialChars

  // 각 문자 유형에서 최소 1개 이상 포함되도록 함
  let password =
    uppercaseChars.charAt(Math.floor(Math.random() * uppercaseChars.length)) +
    lowercaseChars.charAt(Math.floor(Math.random() * lowercaseChars.length)) +
    numberChars.charAt(Math.floor(Math.random() * numberChars.length)) +
    specialChars.charAt(Math.floor(Math.random() * specialChars.length))

  // 나머지 문자 랜덤 생성
  for (let i = 4; i < length; i++) {
    password += allChars.charAt(Math.floor(Math.random() * allChars.length))
  }

  // 문자열 섞기
  return password
    .split("")
    .sort(() => 0.5 - Math.random())
    .join("")
}

// 클립보드에 텍스트 복사 함수
async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (err) {
    console.error("클립보드 복사 실패:", err)
    return false
  }
}

type UserFormValues = z.infer<typeof userFormSchema>

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [selectAll, setSelectAll] = useState(false)
  const [bulkRole, setBulkRole] = useState<"user" | "admin" | "">("")
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [copySuccess, setCopySuccess] = useState<Record<string, boolean>>({})
  const { toast } = useToast()

  // react-hook-form 설정
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "user",
      password: "",
    },
  })

  // 검색 필터링된 사용자
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // 페이지네이션 계산
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem)

  // 페이지 변경 시 선택된 사용자 초기화
  useEffect(() => {
    setSelectedUsers([])
    setSelectAll(false)
  }, [currentPage])

  // 현재 페이지의 모든 사용자 선택/해제
  useEffect(() => {
    if (selectAll) {
      setSelectedUsers(currentUsers.map((user) => user.id))
    } else {
      setSelectedUsers([])
    }
  }, [selectAll, currentPage])

  // 개별 사용자 선택/해제
  const toggleUserSelection = (userId: string) => {
    setSelectedUsers((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]))
  }

  // 일괄 역할 변경
  const applyBulkRoleChange = () => {
    if (!bulkRole) return

    setUsers((prev) =>
      prev.map((user) =>
        selectedUsers.includes(user.id) ? { ...user, role: bulkRole, updatedAt: new Date().toISOString() } : user,
      ),
    )

    // 역할 변경 후 선택 초기화
    setSelectedUsers([])
    setSelectAll(false)
    setBulkRole("")
  }

  // 선택된 사용자 삭제
  const deleteSelectedUsers = () => {
    // 사용자 목록에서 선택된 사용자 제거
    setUsers((prev) => prev.filter((user) => !selectedUsers.includes(user.id)))

    // 선택 초기화
    setSelectedUsers([])
    setSelectAll(false)

    // 다이얼로그 닫기
    setIsDeleteDialogOpen(false)

    // 현재 페이지에 표시할 항목이 없는 경우 이전 페이지로 이동
    const remainingUsers = filteredUsers.filter((user) => !selectedUsers.includes(user.id))
    const newTotalPages = Math.ceil(remainingUsers.length / itemsPerPage)
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(newTotalPages)
    }
  }

  // 비밀번호 생성 및 클립보드 복사
  const generateAndCopyPassword = async () => {
    const password = generateSecurePassword()
    form.setValue("password", password)

    const success = await copyToClipboard(password)
    if (success) {
      toast({
        title: "비밀번호가 클립보드에 복사되었습니다.",
        description: "안전한 곳에 보관하세요.",
      })
    }
  }

  // 새 사용자 추가 (react-hook-form 사용) - password 필드 추가
  const onSubmit = async (data: UserFormValues) => {
    // 새 사용자 생성
    const newUserData: User = {
      id: `user-${Date.now()}`,
      name: data.name,
      email: data.email,
      role: data.role,
      password: data.password,
      auth: "local", // 로컬 사용자만 추가 가능
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // 사용자 목록에 추가
    setUsers((prev) => [newUserData, ...prev])

    // 비밀번호 클립보드에 복사
    await copyToClipboard(data.password)
    toast({
      title: "사용자가 추가되었습니다.",
      description: "비밀번호가 클립보드에 복사되었습니다.",
    })

    // 폼 초기화
    form.reset()

    // 다이얼로그 닫기
    setIsDialogOpen(false)

    // 첫 페이지로 이동
    setCurrentPage(1)
  }

  // 비밀번호 초기화 함수 추가
  const resetPassword = async (userId: string) => {
    const newPassword = generateSecurePassword()

    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId ? { ...user, password: newPassword, updatedAt: new Date().toISOString() } : user,
      ),
    )

    // 비밀번호 클립보드에 복사
    const success = await copyToClipboard(newPassword)

    if (success) {
      // 복사 성공 상태 업데이트
      setCopySuccess((prev) => ({ ...prev, [userId]: true }))

      // 3초 후 복사 성공 상태 초기화
      setTimeout(() => {
        setCopySuccess((prev) => ({ ...prev, [userId]: false }))
      }, 3000)

      toast({
        title: "비밀번호가 초기화되었습니다.",
        description: "새 비밀번호가 클립보드에 복사되었습니다.",
      })
    }
  }

  // 다이얼로그 닫힐 때 폼 초기화
  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open)
    if (!open) {
      form.reset()
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

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">사용자 관리</h1>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>사용자 목록</CardTitle>
              <CardDescription>시스템에 등록된 사용자를 관리하고 역할을 할당합니다.</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="이름 또는 이메일로 검색..."
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

              <Button className="flex items-center gap-2" onClick={() => setIsDialogOpen(true)}>
                <UserPlus className="h-4 w-4" />
                <span>사용자 추가</span>
              </Button>

              <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>새 사용자 추가</DialogTitle>
                    <DialogDescription>
                      로컬 계정으로 새 사용자를 추가합니다. 모든 필드를 입력해주세요.
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>이름</FormLabel>
                            <FormControl>
                              <Input placeholder="이름을 입력하세요" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>이메일</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="이메일을 입력하세요" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>역할</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="역할을 선택하세요" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="user">일반 사용자</SelectItem>
                                <SelectItem value="admin">관리자</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>비밀번호</FormLabel>
                            <div className="flex gap-2">
                              <FormControl>
                                <Input type="password" placeholder="비밀번호를 입력하세요" {...field} />
                              </FormControl>
                              <Button
                                type="button"
                                variant="outline"
                                onClick={generateAndCopyPassword}
                                title="안전한 비밀번호 생성 및 복사"
                              >
                                생성
                              </Button>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <DialogFooter>
                        <Button type="submit">추가하기</Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {selectedUsers.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-4 p-2 bg-muted rounded-md">
              <span className="text-sm">{selectedUsers.length}명의 사용자 선택됨</span>
              <div className="flex flex-wrap gap-2">
                <Select value={bulkRole} onValueChange={(value) => setBulkRole(value as "user" | "admin" | "")}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="일괄 역할 변경" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">일반 사용자</SelectItem>
                    <SelectItem value="admin">관리자</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="default" size="sm" onClick={applyBulkRoleChange} disabled={!bulkRole}>
                  적용
                </Button>

                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setIsDeleteDialogOpen(true)}
                  className="flex items-center gap-1"
                >
                  <Trash2 className="h-4 w-4" />
                  삭제
                </Button>

                <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>사용자 삭제</AlertDialogTitle>
                      <AlertDialogDescription>
                        선택한 {selectedUsers.length}명의 사용자를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>취소</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={deleteSelectedUsers}
                        className="bg-destructive text-destructive-foreground"
                      >
                        삭제
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedUsers([])
                    setSelectAll(false)
                  }}
                >
                  선택 취소
                </Button>
              </div>
            </div>
          )}

          <ScrollArea className="h-[calc(100vh-280px)]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={selectAll}
                      onCheckedChange={(checked) => {
                        setSelectAll(!!checked)
                      }}
                      aria-label="모든 사용자 선택"
                    />
                  </TableHead>
                  <TableHead>이름</TableHead>
                  <TableHead>이메일</TableHead>
                  <TableHead>인증 방식</TableHead>
                  <TableHead>가입일</TableHead>
                  <TableHead>역할</TableHead>
                  <TableHead className="w-[100px] text-right">액션</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedUsers.includes(user.id)}
                        onCheckedChange={() => toggleUserSelection(user.id)}
                        aria-label={`${user.name} 선택`}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={user.auth === "sso" ? "outline" : "secondary"}>
                        {user.auth === "sso" ? "SSO" : "Local"}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant={user.role === "admin" ? "destructive" : "default"}>
                        {user.role === "admin" ? "관리자" : "일반 사용자"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => resetPassword(user.id)}
                        title="비밀번호 초기화 및 복사"
                      >
                        {copySuccess[user.id] ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <KeyRound className="h-4 w-4" />
                        )}
                        <span className="sr-only">비밀번호 초기화</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
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
          {filteredUsers.length > 0 && (
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

              <div className="text-xs text-center text-muted-foreground mt-2">
                {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredUsers.length)} / {filteredUsers.length}명의
                사용자 (페이지당 {itemsPerPage}명)
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
