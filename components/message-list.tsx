"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { formatDistanceToNow } from "date-fns"
import { ChevronDown, ChevronUp, User, Bot } from "lucide-react"
import type { Message } from "@/lib/types"

interface MessageListProps {
  messages: Message[]
}

export function MessageList({ messages }: MessageListProps) {
  const [expandedMessages, setExpandedMessages] = useState<Record<string, boolean>>({})

  const toggleExpand = (messageId: string) => {
    setExpandedMessages((prev) => ({
      ...prev,
      [messageId]: !prev[messageId],
    }))
  }

  if (messages.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">No messages found in this conversation</div>
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => {
        const isExpanded = expandedMessages[message.messageId] || false
        const content = typeof message.content === "string" ? JSON.parse(message.content) : message.content

        return (
          <Card key={message.messageId} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <Avatar className="h-10 w-10 mt-1">
                  <div className="flex h-full w-full items-center justify-center bg-muted">
                    {message.role === "user" ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                  </div>
                </Avatar>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={message.role === "user" ? "default" : "secondary"}>
                      {message.role === "user" ? "User" : "AI"}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {message.timestamp && formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
                    </span>
                    <span className="text-xs text-muted-foreground ml-auto">
                      ID: {message.messageId.substring(0, 8)}
                    </span>
                  </div>

                  <Collapsible open={isExpanded} className="w-full">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">
                        {content.type === "text" ? (
                          <div className="mb-2">{content.content}</div>
                        ) : (
                          <div className="mb-2">Non-text content ({content.type})</div>
                        )}
                      </div>
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm" onClick={() => toggleExpand(message.messageId)}>
                          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </Button>
                      </CollapsibleTrigger>
                    </div>

                    <CollapsibleContent>
                      <div className="mt-2 p-3 bg-muted rounded-md overflow-x-auto">
                        <pre className="text-xs">{JSON.stringify(content, null, 2)}</pre>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
