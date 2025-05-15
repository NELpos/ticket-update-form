"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Check, ChevronsUpDown, Search, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import type { Ticket, OptionData } from "@/components/ticket-table"

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
  options: OptionData
  onSuccess: () => void
  onSubmit: (values: FormValues) => void
  onReset: () => void
  initialValues: FormValues
}

export function EditTicketsForm({
  tickets,
  options,
  onSuccess,
  onSubmit,
  onReset,
  initialValues,
}: EditTicketsFormProps) {
  const [fieldSearch, setFieldSearch] = useState("")
  const [filteredFields, setFilteredFields] = useState<any[]>([])

  // 필드 정의 - 데이터베이스에서 가져온 옵션 사용
  const fields = [
    { id: "name", label: "티켓 이름", type: "input" },
    { id: "severity", label: "위험도", type: "select", options: options.severityOptions },
    { id: "status", label: "상태", type: "select", options: options.statusOptions },
    {
      id: "assignee",
      label: "담당자",
      type: "select",
      options: options.assignees.map((a) => ({ value: a, label: a })),
    },
    { id: "priority", label: "우선순위", type: "select", options: options.priorityOptions },
    { id: "dueDate", label: "마감일", type: "date" },
    { id: "category", label: "카테고리", type: "select", options: options.categoryOptions },
    { id: "environment", label: "환경", type: "select", options: options.environmentOptions },
    { id: "estimatedTime", label: "예상 소요 시간", type: "input" },
    {
      id: "reporter",
      label: "보고자",
      type: "select",
      options: options.reporters.map((r) => ({ value: r, label: r })),
    },
  ]

  // 컴포넌트 마운트 시 필드 초기화
  useEffect(() => {
    setFilteredFields(fields)
  }, [])

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  })

  // initialValues가 변경되면 폼 값을 업데이트
  useEffect(() => {
    form.reset(initialValues)
  }, [form, initialValues])

  function handleFormSubmit(values: FormValues) {
    onSubmit(values)
  }

  function handleFormReset() {
    form.reset({
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
    })
    onReset()
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
                        <PopoverContent className="p-0 z-[9999]" align="start" sideOffset={4}>
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
                                      // 값 설정 후 Popover를 닫기 위해 추가
                                      ;(document.activeElement as HTMLElement)?.blur()
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
          <Button type="button" variant="secondary" onClick={handleFormReset}>
            <RefreshCw className="h-4 w-4 mr-2" />
            초기화
          </Button>
          <Button type="submit">티켓 업데이트</Button>
        </div>
      </form>
    </Form>
  )
}
