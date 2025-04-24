"use client"

import type React from "react"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Check, ChevronsUpDown, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { ConfirmUpdateDialog } from "@/components/confirm-update-dialog"
import type { Ticket } from "@/components/ticket-table"
import {
  assignees,
  severityOptions,
  statusOptions,
  priorityOptions,
  categoryOptions,
  environmentOptions,
  reporters,
} from "@/data/mock-data"

const formSchema = z.object({
  name: z.string().optional(),
  severity: z.string().optional(),
  status: z.string().optional(),
  assignee: z.string().optional(),
  priority: z.string().optional(),
  dueDate: z.string().optional(),
  category: z.string().optional(),
  environment: z.string().optional(),
  estimatedTime: z.string().optional(),
  reporter: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface EditTicketsFormProps {
  tickets: Ticket[]
  onSuccess: () => void
}

// 필드 정의
const fields = [
  { id: "name", label: "티켓 이름", type: "input" },
  { id: "severity", label: "위험도", type: "select", options: severityOptions },
  { id: "status", label: "상태", type: "select", options: statusOptions },
  { id: "assignee", label: "담당자", type: "select", options: assignees.map((a) => ({ value: a, label: a })) },
  { id: "priority", label: "우선순위", type: "select", options: priorityOptions },
  { id: "dueDate", label: "마감일", type: "date" },
  { id: "category", label: "카테고리", type: "select", options: categoryOptions },
  { id: "environment", label: "환경", type: "select", options: environmentOptions },
  { id: "estimatedTime", label: "예상 소요 시간", type: "input" },
  { id: "reporter", label: "보고자", type: "select", options: reporters.map((r) => ({ value: r, label: r })) },
]

export function EditTicketsForm({ tickets, onSuccess }: EditTicketsFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [fieldSearch, setFieldSearch] = useState("")
  const [filteredFields, setFilteredFields] = useState(fields)
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
  const [formValues, setFormValues] = useState<FormValues>({})

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      severity: "",
      status: "",
      assignee: "",
      priority: "",
      dueDate: "",
      category: "",
      environment: "",
      estimatedTime: "",
      reporter: "",
    },
  })

  async function handleFormSubmit(values: FormValues) {
    // 빈 값을 제외한 변경 사항만 저장
    const changedValues = Object.fromEntries(Object.entries(values).filter(([_, value]) => value !== ""))

    // 변경 사항이 없으면 바로 종료
    if (Object.keys(changedValues).length === 0) {
      onSuccess()
      return
    }

    // 변경 사항이 있으면 확인 다이얼로그 표시
    setFormValues(changedValues)
    setIsConfirmDialogOpen(true)
  }

  async function handleConfirmUpdate() {
    setIsSubmitting(true)

    // 실제 구현에서는 여기서 API 호출을 통해 티켓을 업데이트합니다
    console.log("업데이트할 티켓:", tickets)
    console.log("업데이트 값:", formValues)

    // API 호출 시뮬레이션
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsSubmitting(false)
    setIsConfirmDialogOpen(false)
    onSuccess()
  }

  // 필드 검색 처리
  const handleFieldSearch = () => {
    if (!fieldSearch.trim()) {
      setFilteredFields(fields)
      return
    }

    const filtered = fields.filter((field) => field.label.toLowerCase().includes(fieldSearch.toLowerCase()))
    setFilteredFields(filtered)
  }

  // 엔터 키 처리
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleFieldSearch()
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <Input
              placeholder="필드 검색..."
              value={fieldSearch}
              onChange={(e) => setFieldSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1"
            />
            <Button type="button" onClick={handleFieldSearch} size="sm">
              <Search className="h-4 w-4 mr-2" />
              검색
            </Button>
          </div>

          <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2">
            {filteredFields.map((field) => {
              if (field.type === "input") {
                return (
                  <FormField
                    key={field.id}
                    control={form.control}
                    name={field.id as any}
                    render={({ field: formField }) => (
                      <FormItem>
                        <FormLabel>{field.label}</FormLabel>
                        <FormControl>
                          <Input placeholder={`${field.label} (선택사항)`} {...formField} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )
              } else if (field.type === "date") {
                return (
                  <FormField
                    key={field.id}
                    control={form.control}
                    name={field.id as any}
                    render={({ field: formField }) => (
                      <FormItem>
                        <FormLabel>{field.label}</FormLabel>
                        <FormControl>
                          <Input type="date" {...formField} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )
              } else if (field.type === "select") {
                return (
                  <FormField
                    key={field.id}
                    control={form.control}
                    name={field.id as any}
                    render={({ field: formField }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>{field.label}</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn("justify-between", !formField.value && "text-muted-foreground")}
                              >
                                {formField.value
                                  ? field.options.find((option) => option.value === formField.value)?.label ||
                                    formField.value
                                  : `${field.label} 선택 (선택사항)`}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="p-0">
                            <Command>
                              <CommandInput placeholder={`${field.label} 검색...`} />
                              <CommandList>
                                <CommandEmpty>{field.label}을(를) 찾을 수 없습니다.</CommandEmpty>
                                <CommandGroup>
                                  {field.options.map((option) => (
                                    <CommandItem
                                      key={option.value}
                                      value={option.value}
                                      onSelect={() => {
                                        form.setValue(field.id as any, option.value)
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          option.value === formField.value ? "opacity-100" : "opacity-0",
                                        )}
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
                )
              }
              return null
            })}
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onSuccess()}>
              취소
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "업데이트 중..." : "티켓 업데이트"}
            </Button>
          </div>
        </form>
      </Form>

      <ConfirmUpdateDialog
        open={isConfirmDialogOpen}
        onOpenChange={setIsConfirmDialogOpen}
        tickets={tickets}
        changes={formValues}
        onConfirm={handleConfirmUpdate}
      />
    </>
  )
}
