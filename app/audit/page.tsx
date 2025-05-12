"use client"

import { useState } from "react"
import { mockChatRooms, mockMessages, mockUsers } from "@/lib/mock-data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import { MessageList } from "@/components/message-list"
import { Search, Filter, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { UserFilter } from "@/components/user-filter"

export default function AuditPage() {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  // Apply both search and user filters
  const filteredChatRooms = mockChatRooms.filter((chat) => {
    const matchesSearch = chat.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesUser = selectedUserId ? chat.userId === selectedUserId : true
    return matchesSearch && matchesUser
  })

  const selectedChatMessages = selectedChatId ? mockMessages.filter((message) => message.chatId === selectedChatId) : []

  // Get user info for the selected chat
  const selectedChatRoom = selectedChatId ? mockChatRooms.find((chat) => chat.id === selectedChatId) : null
  const selectedChatUser = selectedChatRoom ? mockUsers.find((user) => user.id === selectedChatRoom.userId) : null

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedUserId(null)
  }

  const hasActiveFilters = searchQuery || selectedUserId

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
                <Button variant="link" className="p-0 h-auto text-xs ml-2" onClick={clearFilters}>
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
                <UserFilter users={mockUsers} selectedUserId={selectedUserId} onSelectUser={setSelectedUserId} />
              )}
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[calc(100vh-320px)]">
              {filteredChatRooms.length > 0 ? (
                <div className="space-y-2">
                  {filteredChatRooms.map((chat) => {
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
                    <Button variant="link" onClick={clearFilters}>
                      Clear filters
                    </Button>
                  )}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>
                  {selectedChatId
                    ? mockChatRooms.find((chat) => chat.id === selectedChatId)?.title || "Chat Messages"
                    : "Select a chat room"}
                </CardTitle>
                <CardDescription>
                  {selectedChatId ? (
                    <div className="flex items-center gap-1">
                      <span>{selectedChatUser?.name}</span>
                      <span>•</span>
                      <span>{selectedChatMessages.length} messages</span>
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
                    <p className="text-xs text-muted-foreground">{selectedChatUser.email}</p>
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
