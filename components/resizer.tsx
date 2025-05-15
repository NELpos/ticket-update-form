"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useLayout } from "@/context/layout-context"

interface ResizerProps {
  className?: string
}

export function Resizer({ className }: ResizerProps) {
  const { leftWidth, setLeftWidth, isInitialLoad } = useLayout()
  const [isDragging, setIsDragging] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [prevWidth, setPrevWidth] = useState(leftWidth)
  const resizerRef = useRef<HTMLDivElement>(null)

  const minLeftWidth = 250
  const maxLeftWidth = typeof window !== "undefined" ? window.innerWidth * 0.8 : 600

  // 드래그 시작 처리
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  // 드래그 중 처리
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return

      // 마우스 위치에 따라 왼쪽 패널 너비 계산
      let newWidth = e.clientX

      // 최소/최대 너비 제한
      newWidth = Math.max(minLeftWidth, Math.min(maxLeftWidth, newWidth))

      setLeftWidth(newWidth)
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, setLeftWidth])

  // 접기/펼치기 토글
  const toggleCollapse = () => {
    if (isCollapsed) {
      // 펼치기
      setLeftWidth(prevWidth)
    } else {
      // 접기 전에 현재 너비 저장
      setPrevWidth(leftWidth)
      setLeftWidth(0)
    }
    setIsCollapsed(!isCollapsed)
  }

  return (
    <div
      ref={resizerRef}
      className={cn(
        "relative flex items-center justify-center w-4 cursor-col-resize bg-muted/30 hover:bg-muted/50 active:bg-muted/70 transition-colors",
        isDragging && "bg-muted/70",
        className,
      )}
      onMouseDown={handleMouseDown}
    >
      <div className="absolute -right-3 top-1/2 -translate-y-1/2 z-10">
        <button
          type="button"
          onClick={toggleCollapse}
          className="flex items-center justify-center h-6 w-6 rounded-full bg-primary text-primary-foreground shadow-md hover:bg-primary/90"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>
      <div className="h-full w-[1px] bg-border" />
    </div>
  )
}
