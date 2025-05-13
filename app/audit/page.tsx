"use client"

import { useState, useEffect } from "react"
import { extendedChatRooms, mockMessages, mockUsers } from "@/lib/mock-data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import { MessageList } from "@/components/message-list"
import { Search, Filter, X, ChevronLeft, ChevronRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { FilterPanel } from "@/components/filter-panel"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination"
import type { DateRange } from "react-day-picker"

export default function AuditPage() {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  // 다중 선택 필터 상태
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([])
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [selectedRoles, setSelectedRoles] = useState<string[]>([])
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  // 모든 필터 초기화
  const clearAllFilters = () => {
    setSearchQuery("")
    setSelectedUserIds([])
    setSelectedTypes([])
    setSelectedRoles([])
    setDateRange(undefined)
  }

  // Apply all filters
  const filteredChatRooms = extendedChatRooms.filter((chat) => {
    // 검색어 필터
    const matchesSearch = chat.title.toLowerCase().includes(searchQuery.toLowerCase())

    // 사용자 필터
    const matchesUser = selectedUserIds.length === 0 || selectedUserIds.includes(chat.userId)

    // 타입 필터
    const matchesType = selectedTypes.length === 0 || selectedTypes.includes(chat.type)

    // 역할 필터
    const matchesRole =
      selectedRoles.length === 0 ||
      (() => {
        const user = mockUsers.find((u) => u.id === chat.userId)
        return user ? selectedRoles.includes(user.role) : false
      })()

    // 날짜 필터
    const chatDate = new Date(chat.lastActivity)
    const matchesStartDate = !dateRange?.from || chatDate >= dateRange.from
    const matchesEndDate = !dateRange?.to || chatDate <= new Date(new Date(dateRange.to).setHours(23, 59, 59, 999))

    return matchesSearch && matchesUser && matchesType && matchesRole && matchesStartDate && matchesEndDate
  })

  // Calculate pagination
  const totalPages = Math.ceil(filteredChatRooms.length / itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentChatRooms = filteredChatRooms.slice(indexOfFirstItem, indexOfLastItem)

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedUserIds, selectedTypes, selectedRoles, dateRange])

  const selectedChatMessages = selectedChatId ? mockMessages.filter((message) => message.chatId === selectedChatId) : []

  // Get user info for the selected chat
  const selectedChatRoom = selectedChatId ? extendedChatRooms.find((chat) => chat.id === selectedChatId) : null
  const selectedChatUser = selectedChatRoom ? mockUsers.find((user) => user.id === selectedChatRoom.userId) : null

  const hasActiveFilters =
    searchQuery || selectedUserIds.length > 0 || selectedTypes.length > 0 || selectedRoles.length > 0 || dateRange

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = []
    const maxPagesToShow = 5 // Show at most 5 page numbers

    if (totalPages <= maxPagesToShow) {
      // If we have fewer pages than the max, show all pages
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i)
      }
    } else {
      // Always include first page
      pageNumbers.push(1)

      // Calculate start and end of page numbers to show
      let start = Math.max(2, currentPage - 1)
      let end = Math.min(totalPages - 1, currentPage + 1)

      // Adjust if we're near the beginning
      if (currentPage <= 3) {
        end = Math.min(totalPages - 1, maxPagesToShow - 1)
      }

      // Adjust if we're near the end
      if (currentPage >= totalPages - 2) {
        start = Math.max(2, totalPages - maxPagesToShow + 2)
      }

      // Add ellipsis if needed
      if (start > 2) {
        pageNumbers.push("ellipsis1")
      }

      // Add middle pages
      for (let i = start; i <= end; i++) {
        pageNumbers.push(i)
      }

      // Add ellipsis if needed
      if (end < totalPages - 1) {
        pageNumbers.push("ellipsis2")
      }

      // Always include last page
      if (totalPages > 1) {
        pageNumbers.push(totalPages)
      }
    }

    return pageNumbers
  }

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return
    setCurrentPage(page)

    // If the selected chat is not in the current page, deselect it
    const chatIdsInCurrentPage = currentChatRooms.map((chat) => chat.id)
    if (selectedChatId && !chatIdsInCurrentPage.includes(selectedChatId)) {
      setSelectedChatId(null)
    }
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Chat Audit System</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Chat Rooms</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowFilters(!showFilters)} className="h-8 w-8 p-0">
                <Filter className="h-4 w-4" />
                <span className="sr-only">Toggle filters</span>
              </Button>
            </div>
            <CardDescription>
              {filteredChatRooms.length} chat rooms found
              {hasActiveFilters && (
                <Button variant="link" className="p-0 h-auto text-xs ml-2" onClick={clearAllFilters}>
                  Clear all filters
                </Button>
              )}
            </CardDescription>

            <div className="space-y-3 mt-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search chat rooms..."
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
                    <span className="sr-only">Clear search</span>
                  </Button>
                )}
              </div>

              {showFilters && (
                <FilterPanel
                  selectedUserIds={selectedUserIds}
                  setSelectedUserIds={setSelectedUserIds}
                  selectedTypes={selectedTypes}
                  setSelectedTypes={setSelectedTypes}
                  selectedRoles={selectedRoles}
                  setSelectedRoles={setSelectedRoles}
                  dateRange={dateRange}
                  setDateRange={setDateRange}
                  onClearAllFilters={clearAllFilters}
                />
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ScrollArea className="h-[calc(100vh-380px)]">
              {currentChatRooms.length > 0 ? (
                <div className="space-y-2">
                  {currentChatRooms.map((chat) => {
                    const user = mockUsers.find((u) => u.id === chat.userId)

                    return (
                      <div
                        key={chat.id}
                        className={`p-3 rounded-md cursor-pointer transition-colors ${
                          selectedChatId === chat.id ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                        }`}
                        onClick={() => setSelectedChatId(chat.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <div className="flex h-full w-full items-center justify-center bg-muted">
                                {user?.avatar || chat.title.charAt(0)}
                              </div>
                            </Avatar>
                            <div>
                              <p className="font-medium">{chat.title}</p>
                              <div className="flex items-center gap-1">
                                <p className="text-xs opacity-70">{user?.name}</p>
                                <span className="text-xs opacity-70">•</span>
                                <p className="text-xs opacity-70">
                                  {formatDistanceToNow(new Date(chat.lastActivity), { addSuffix: true })}
                                </p>
                              </div>
                              <div className="flex items-center gap-1 mt-1">
                                <Badge variant="outline" className="text-xs h-5 px-1">
                                  {chat.type}
                                </Badge>
                                <Badge variant="outline" className="text-xs h-5 px-1">
                                  {user?.role}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <Badge
                            variant={selectedChatId === chat.id ? "default" : "outline"}
                            className={selectedChatId === chat.id ? "bg-white text-primary" : ""}
                          >
                            {chat.messageCount}
                          </Badge>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                  <p>No chat rooms found</p>
                  {hasActiveFilters && (
                    <Button variant="link" onClick={clearAllFilters}>
                      Clear filters
                    </Button>
                  )}
                </div>
              )}
            </ScrollArea>

            {/* Pagination */}
            {filteredChatRooms.length > 0 && (
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={currentPage === 1}
                      onClick={() => handlePageChange(currentPage - 1)}
                      className="h-8 w-8"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span className="sr-only">Previous page</span>
                    </Button>
                  </PaginationItem>

                  {getPageNumbers().map((page, index) => (
                    <PaginationItem key={index}>
                      {page === "ellipsis1" || page === "ellipsis2" ? (
                        <PaginationEllipsis />
                      ) : (
                        <PaginationLink
                          isActive={currentPage === page}
                          onClick={() => handlePageChange(page as number)}
                          className="h-8 w-8"
                        >
                          {page}
                        </PaginationLink>
                      )}
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={currentPage === totalPages}
                      onClick={() => handlePageChange(currentPage + 1)}
                      className="h-8 w-8"
                    >
                      <ChevronRight className="h-4 w-4" />
                      <span className="sr-only">Next page</span>
                    </Button>
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}

            {/* Page info */}
            {filteredChatRooms.length > 0 && (
              <div className="text-xs text-center text-muted-foreground">
                {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredChatRooms.length)} of{" "}
                {filteredChatRooms.length} chat rooms
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>
                  {selectedChatId
                    ? extendedChatRooms.find((chat) => chat.id === selectedChatId)?.title || "Chat Messages"
                    : "Select a chat room"}
                </CardTitle>
                <CardDescription>
                  {selectedChatId ? (
                    <div className="flex items-center gap-1">
                      <span>{selectedChatUser?.name}</span>
                      <span>•</span>
                      <span>{selectedChatMessages.length} messages</span>
                      {selectedChatRoom && (
                        <>
                          <span>•</span>
                          <Badge variant="outline" className="text-xs h-5 px-1">
                            {selectedChatRoom.type}
                          </Badge>
                        </>
                      )}
                    </div>
                  ) : (
                    "Click on a chat room to view messages"
                  )}
                </CardDescription>
              </div>

              {selectedChatUser && (
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <div className="flex h-full w-full items-center justify-center bg-primary/10 text-primary">
                      {selectedChatUser.avatar}
                    </div>
                  </Avatar>
                  <div className="text-sm">
                    <p className="font-medium">{selectedChatUser.name}</p>
                    <div className="flex items-center gap-1">
                      <p className="text-xs text-muted-foreground">{selectedChatUser.email}</p>
                      <Badge variant="outline" className="text-xs h-5 px-1">
                        {selectedChatUser.role}
                      </Badge>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {selectedChatId ? (
              <Tabs defaultValue="messages">
                <TabsList className="mb-4">
                  <TabsTrigger value="messages">Messages</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>
                <TabsContent value="messages">
                  <ScrollArea className="h-[calc(100vh-250px)]">
                    <MessageList messages={selectedChatMessages} />
                  </ScrollArea>
                </TabsContent>
                <TabsContent value="analytics">
                  <div className="flex items-center justify-center h-[calc(100vh-250px)] text-muted-foreground">
                    Analytics features coming soon
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="flex items-center justify-center h-[calc(100vh-250px)] text-muted-foreground">
                Select a chat room to view messages
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
