import * as React from "react"
import { Check, ChevronDown, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface MultiSelectOption {
  id: number
  label: string
}

interface MultiSelectProps {
  options: MultiSelectOption[]
  selected: number[]
  onChange: (values: number[]) => void
  placeholder?: string
  className?: string
  error?: boolean
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select items...",
  className,
  error = false,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open])

  const handleSelect = (optionId: number) => {
    const newSelected = selected.includes(optionId)
      ? selected.filter((id) => id !== optionId)
      : [...selected, optionId]
    onChange(newSelected)
  }

  const handleRemove = (optionId: number, e: React.MouseEvent) => {
    e.stopPropagation()
    onChange(selected.filter((id) => id !== optionId))
  }

  const selectedOptions = options.filter((option) =>
    selected.includes(option.id)
  )

  return (
    <div className={cn("relative", className)} ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "border-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive flex w-full min-h-10 h-auto items-center justify-between rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-destructive",
        )}
      >
        <div className="flex flex-wrap gap-1 flex-1 items-center">
          {selectedOptions.length === 0 ? (
            <span className="text-muted-foreground">{placeholder}</span>
          ) : (
            selectedOptions.map((option) => (
              <Badge
                key={option.id}
                variant="secondary"
                className="mr-1"
              >
                {option.label}
                <span
                  role="button"
                  tabIndex={0}
                  className="ml-1 rounded-full outline-none hover:bg-muted cursor-pointer inline-flex"
                  onClick={(e) => handleRemove(option.id, e)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      handleRemove(option.id, e as any)
                    }
                  }}
                >
                  <X className="h-3 w-3" />
                </span>
              </Badge>
            ))
          )}
        </div>
        <ChevronDown className="h-4 w-4 opacity-50 shrink-0 ml-2" />
      </button>

      {open && (
        <div className="absolute z-50 w-full mt-1 rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95">
          <div className="max-h-64 overflow-auto p-1">
            {options.map((option) => {
              const isSelected = selected.includes(option.id)
              return (
                <div
                  key={option.id}
                  onClick={() => handleSelect(option.id)}
                  className={cn(
                    "relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                    isSelected && "bg-accent"
                  )}
                >
                  <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                    {isSelected && <Check className="h-4 w-4" />}
                  </span>
                  {option.label}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

