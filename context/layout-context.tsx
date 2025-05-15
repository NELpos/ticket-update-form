"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type LayoutContextType = {
  leftWidth: number
  setLeftWidth: (width: number) => void
  isTicketView: boolean
  setIsTicketView: (isView: boolean) => void
  activeTicketId: string | null
  setActiveTicketId: (id: string | null) => void
  isInitialLoad: boolean
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined)

export function LayoutProvider({ children }: { children: ReactNode }) {
  // 초기 상태: 채팅 패널이 최대화된 상태 (화면의 80%)
  const [leftWidth, setLeftWidth] = useState(0) // 초기값은 0으로 설정하고 useEffect에서 계산
  const [isTicketView, setIsTicketView] = useState(false)
  const [activeTicketId, setActiveTicketId] = useState<string | null>(null)
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  // 컴포넌트 마운트 시 초기 너비 설정
  useEffect(() => {
    if (typeof window !== "undefined") {
      // 초기 로드 시 채팅 패널이 화면의 80%를 차지하도록 설정
      const initialWidth = Math.floor(window.innerWidth * 0.8)
      setLeftWidth(initialWidth)

      // 창 크기 변경 시 비율 유지
      const handleResize = () => {
        if (isInitialLoad) {
          // 초기 로드 상태일 때만 80% 유지
          setLeftWidth(Math.floor(window.innerWidth * 0.8))
        }
      }

      window.addEventListener("resize", handleResize)
      return () => window.removeEventListener("resize", handleResize)
    }
  }, [isInitialLoad])

  // 티켓 뷰 상태가 변경될 때 레이아웃 조정
  useEffect(() => {
    if (isTicketView && isInitialLoad) {
      // 티켓 뷰로 전환되면 초기 로드 상태 해제
      setIsInitialLoad(false)

      // 채팅 패널을 30%로 축소
      if (typeof window !== "undefined") {
        const newWidth = Math.floor(window.innerWidth * 0.3)
        setLeftWidth(newWidth)
      }
    }
  }, [isTicketView, isInitialLoad])

  return (
    <LayoutContext.Provider
      value={{
        leftWidth,
        setLeftWidth,
        isTicketView,
        setIsTicketView,
        activeTicketId,
        setActiveTicketId,
        isInitialLoad,
      }}
    >
      {children}
    </LayoutContext.Provider>
  )
}

export function useLayout() {
  const context = useContext(LayoutContext)
  if (context === undefined) {
    throw new Error("useLayout must be used within a LayoutProvider")
  }
  return context
}
