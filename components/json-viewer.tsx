"use client"

import { useState } from "react"
import { ChevronRight, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface JsonViewerProps {
  data: any
  initialExpanded?: boolean
  level?: number
  isLast?: boolean
}

export function JsonViewer({ data, initialExpanded = true, level = 0, isLast = true }: JsonViewerProps) {
  const [isExpanded, setIsExpanded] = useState(initialExpanded)
  const type = Array.isArray(data) ? "array" : typeof data
  const isExpandable = type === "object" || type === "array"

  // Format value based on type
  const formatValue = (value: any): JSX.Element | string => {
    if (value === null) return <span className="text-red-500">null</span>
    if (value === undefined) return <span className="text-gray-500">undefined</span>

    switch (typeof value) {
      case "boolean":
        return <span className="text-purple-500">{value.toString()}</span>
      case "number":
        return <span className="text-blue-500">{value}</span>
      case "string":
        return <span className="text-green-500">"{value}"</span>
      default:
        return ""
    }
  }

  // Handle toggle expansion
  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  // Render expandable content (objects and arrays)
  if (isExpandable) {
    const isEmpty = Object.keys(data).length === 0
    const isArray = Array.isArray(data)
    const bracketOpen = isArray ? "[" : "{"
    const bracketClose = isArray ? "]" : "}"

    return (
      <div className={cn("pl-4", level > 0 ? "border-l border-gray-200 dark:border-gray-700" : "")}>
        <div className="flex items-start">
          {!isEmpty && (
            <button
              onClick={toggleExpand}
              className="mr-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none"
              aria-label={isExpanded ? "Collapse" : "Expand"}
            >
              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>
          )}
          <span className="text-gray-800 dark:text-gray-200">
            {isArray ? <span className="text-yellow-500">Array</span> : <span className="text-yellow-500">Object</span>}{" "}
            {bracketOpen}
          </span>
          {isEmpty && <span className="text-gray-500">{bracketClose}</span>}
          {!isEmpty && !isExpanded && <span className="text-gray-500">...{bracketClose}</span>}
        </div>

        {!isEmpty && isExpanded && (
          <div className="ml-2">
            {Object.entries(data).map(([key, value], index, arr) => (
              <div key={key} className="my-1">
                <div className="flex items-start">
                  <span className="text-red-400 mr-1">{isArray ? index : `"${key}"`}</span>
                  <span className="text-gray-500 mr-1">:</span>
                  {typeof value === "object" && value !== null ? (
                    <JsonViewer
                      data={value}
                      initialExpanded={level < 1}
                      level={level + 1}
                      isLast={index === arr.length - 1}
                    />
                  ) : (
                    <div className="break-all">{formatValue(value)}</div>
                  )}
                </div>
              </div>
            ))}
            <div className="text-gray-500">
              {bracketClose}
              {!isLast && ","}
            </div>
          </div>
        )}
      </div>
    )
  }

  // Render primitive values
  return <div className="break-all">{formatValue(data)}</div>
}
