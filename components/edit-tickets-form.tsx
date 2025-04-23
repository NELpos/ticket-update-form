"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Check, ChevronsUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import type { Ticket } from "@/components/ticket-table"
import { assignees, severityOptions, statusOptions } from "@/data/mock-data"

const formSchema = z.object({
  name: z.string().optional(),
  severity: z.string().optional(),
  status: z.string().optional(),
  assignee: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface EditTicketsFormProps {
  tickets: Ticket[]
  onSuccess: () => void
}

export function EditTicketsForm({ tickets, onSuccess }: EditTicketsFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      severity: "",
      status: "",
      assignee: "",
    },
  })

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true)

    // 실제 구현에서는 여기서 API 호출을 통해 티켓을 업데이트합니다
    console.log("업데이트할 티켓:", tickets)
    console.log("업데이트 값:", values)

    // API 호출 시뮬레이션
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsSubmitting(false)
    onSuccess()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>티켓 이름</FormLabel>
              <FormControl>
                <Input placeholder="티켓 이름 (선택사항)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="severity"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>위험도</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn("justify-between", !field.value && "text-muted-foreground")}
                    >
                      {field.value
                        ? severityOptions.find((option) => option.value === field.value)?.label
                        : "위험도 선택 (선택사항)"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                  <Command>
                    <CommandInput placeholder="위험도 검색..." />
                    <CommandList>
                      <CommandEmpty>위험도를 찾을 수 없습니다.</CommandEmpty>
                      <CommandGroup>
                        {severityOptions.map((option) => (
                          <CommandItem
                            key={option.value}
                            value={option.value}
                            onSelect={() => {
                              form.setValue("severity", option.value)
                            }}
                          >
                            <Check
                              className={cn("mr-2 h-4 w-4", option.value === field.value ? "opacity-100" : "opacity-0")}
                            />
                            {option.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>상태</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn("justify-between", !field.value && "text-muted-foreground")}
                    >
                      {field.value
                        ? statusOptions.find((option) => option.value === field.value)?.label
                        : "상태 선택 (선택사항)"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                  <Command>
                    <CommandInput placeholder="상태 검색..." />
                    <CommandList>
                      <CommandEmpty>상태를 찾을 수 없습니다.</CommandEmpty>
                      <CommandGroup>
                        {statusOptions.map((option) => (
                          <CommandItem
                            key={option.value}
                            value={option.value}
                            onSelect={() => {
                              form.setValue("status", option.value)
                            }}
                          >
                            <Check
                              className={cn("mr-2 h-4 w-4", option.value === field.value ? "opacity-100" : "opacity-0")}
                            />
                            {option.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="assignee"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>담당자</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn("justify-between", !field.value && "text-muted-foreground")}
                    >
                      {field.value ? assignees.find((assignee) => assignee === field.value) : "담당자 선택 (선택사항)"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                  <Command>
                    <CommandInput placeholder="담당자 검색..." />
                    <CommandList>
                      <CommandEmpty>담당자를 찾을 수 없습니다.</CommandEmpty>
                      <CommandGroup>
                        {assignees.map((assignee) => (
                          <CommandItem
                            key={assignee}
                            value={assignee}
                            onSelect={() => {
                              form.setValue("assignee", assignee)
                            }}
                          >
                            <Check
                              className={cn("mr-2 h-4 w-4", assignee === field.value ? "opacity-100" : "opacity-0")}
                            />
                            {assignee}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => onSuccess()}>
            취소
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "업데이트 중..." : "티켓 업데이트"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
