"use server"

import { sql } from "@/db"
import { cache } from "react"
import type { SelectOption } from "@/db/schema"

// 위험도 옵션 가져오기
export const getSeverityOptions = cache(async (): Promise<SelectOption[]> => {
  try {
    const result = await sql<SelectOption[]>`SELECT value, label FROM severity ORDER BY id`
    return result
  } catch (error) {
    console.error("Failed to fetch severity options:", error)
    // 오류 발생 시 기본 옵션 반환
    return [
      { value: "낮음", label: "낮음" },
      { value: "중간", label: "중간" },
      { value: "높음", label: "높음" },
      { value: "긴급", label: "긴급" },
    ]
  }
})

// 상태 옵션 가져오기
export const getStatusOptions = cache(async (): Promise<SelectOption[]> => {
  try {
    const result = await sql<SelectOption[]>`SELECT value, label FROM status ORDER BY id`
    return result
  } catch (error) {
    console.error("Failed to fetch status options:", error)
    // 오류 발생 시 기본 옵션 반환
    return [
      { value: "대기중", label: "대기중" },
      { value: "진행중", label: "진행중" },
      { value: "검토중", label: "검토중" },
      { value: "완료", label: "완료" },
    ]
  }
})

// 우선순위 옵션 가져오기
export const getPriorityOptions = cache(async (): Promise<SelectOption[]> => {
  try {
    const result = await sql<SelectOption[]>`SELECT value, label FROM priority ORDER BY id`
    return result
  } catch (error) {
    console.error("Failed to fetch priority options:", error)
    // 오류 발생 시 기본 옵션 반환
    return [
      { value: "낮음", label: "낮음" },
      { value: "보통", label: "보통" },
      { value: "높음", label: "높음" },
      { value: "최우선", label: "최우선" },
    ]
  }
})

// 카테고리 옵션 가져오기
export const getCategoryOptions = cache(async (): Promise<SelectOption[]> => {
  try {
    const result = await sql<SelectOption[]>`SELECT value, label FROM category ORDER BY id`
    return result
  } catch (error) {
    console.error("Failed to fetch category options:", error)
    // 오류 발생 시 기본 옵션 반환
    return [
      { value: "버그", label: "버그" },
      { value: "기능개선", label: "기능개선" },
      { value: "신규기능", label: "신규기능" },
      { value: "문서화", label: "문서화" },
      { value: "유지보수", label: "유지보수" },
    ]
  }
})

// 환경 옵션 가져오기
export const getEnvironmentOptions = cache(async (): Promise<SelectOption[]> => {
  try {
    const result = await sql<SelectOption[]>`SELECT value, label FROM environment ORDER BY id`
    return result
  } catch (error) {
    console.error("Failed to fetch environment options:", error)
    // 오류 발생 시 기본 옵션 반환
    return [
      { value: "개발", label: "개발" },
      { value: "테스트", label: "테스트" },
      { value: "스테이징", label: "스테이징" },
      { value: "운영", label: "운영" },
    ]
  }
})

// 담당자 목록 가져오기
export const getAssignees = cache(async (): Promise<string[]> => {
  try {
    const result = await sql<{ name: string }[]>`SELECT name FROM assignee ORDER BY id`
    return result.map((item) => item.name)
  } catch (error) {
    console.error("Failed to fetch assignees:", error)
    // 오류 발생 시 기본 담당자 목록 반환
    return ["김철수", "이영희", "박지민", "정민준", "최수진", "강동원", "윤서연", "한지훈", "송미나", "조현우"]
  }
})

// 보고자 목록 가져오기
export const getReporters = cache(async (): Promise<string[]> => {
  try {
    const result = await sql<{ name: string }[]>`SELECT name FROM reporter ORDER BY id`
    return result.map((item) => item.name)
  } catch (error) {
    console.error("Failed to fetch reporters:", error)
    // 오류 발생 시 기본 보고자 목록 반환
    return ["김보고", "이슈진", "박문제", "정버그", "최오류", "강개선", "윤기능", "한테스트", "송품질", "조개발"]
  }
})

// 모든 옵션 데이터를 한 번에 가져오기
export const getAllOptions = cache(async () => {
  const [severityOptions, statusOptions, priorityOptions, categoryOptions, environmentOptions, assignees, reporters] =
    await Promise.all([
      getSeverityOptions(),
      getStatusOptions(),
      getPriorityOptions(),
      getCategoryOptions(),
      getEnvironmentOptions(),
      getAssignees(),
      getReporters(),
    ])

  return {
    severityOptions,
    statusOptions,
    priorityOptions,
    categoryOptions,
    environmentOptions,
    assignees,
    reporters,
  }
})
