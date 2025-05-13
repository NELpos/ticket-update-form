"use client"

import { useState } from "react"
import { Check, ChevronsUpDown, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"

interface Option {
  value: string
  label: string
}

interface MultiSelectFilterProps {
  options: Option[]
  selectedValues: string[]
  onSelectionChange: (values: string[]) => void
  placeholder: string
  emptyMessage: string
  label: string
}

export function MultiSelectFilter({
  options,
  selectedValues,
  onSelectionChange,
  placeholder,
  emptyMessage,
  label,
}: MultiSelectFilterProps) {
  const [open, setOpen] = useState(false)

  const handleSelect = (value: string) => {
    if (selectedValues.includes(value)) {
      onSelectionChange(selectedValues.filter((item) => item !== value))
    } else {
      onSelectionChange([...selectedValues, value])
    }
  }

  const handleClearAll = () => {
    onSelectionChange([])
    setOpen(false)
  }

  const handleRemove = (value: string) => {
    onSelectionChange(selectedValues.filter((item) => item !== value))
  }

  const selectedLabels = options.filter((option) => selectedValues.includes(option.value)).map((option) => option.label)

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
            {selectedValues.length > 0 ? (
              <span className="truncate">
                {selectedLabels.length > 1
                  ? `${selectedLabels[0]} 외 ${selectedLabels.length - 1}개`
                  : selectedLabels[0]}
              </span>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder={`${label} 검색...`} />
            <CommandList>
              <CommandEmpty>{emptyMessage}</CommandEmpty>
              <CommandGroup>
                <div className="p-2 border-b">
                  <Button variant="ghost" size="sm" onClick={handleClearAll} className="w-full justify-start">
                    모두 지우기
                  </Button>
                </div>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.label}
                    onSelect={() => handleSelect(option.value)}
                    className="flex items-center"
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border",
                        selectedValues.includes(option.value)
                          ? "bg-primary border-primary"
                          : "opacity-50 border-muted-foreground",
                      )}
                    >
                      {selectedValues.includes(option.value) && <Check className="h-3 w-3 text-white" />}
                    </div>
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedValues.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {options
            .filter((option) => selectedValues.includes(option.value))
            .map((option) => (
              <Badge key={option.value} variant="secondary" className="gap-1 px-2">
                {option.label}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-3 w-3 p-0 hover:bg-transparent"
                  onClick={() => handleRemove(option.value)}
                >
                  <X className="h-2 w-2" />
                  <span className="sr-only">Remove {option.label}</span>
                </Button>
              </Badge>
            ))}
        </div>
      )}
    </div>
  )
}
