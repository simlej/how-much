import * as React from "react"
import { cn } from "@/lib/utils"

interface ChartConfig {
  [key: string]: {
    label: string
    color: string
  }
}

interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  config: ChartConfig
}

const ChartContainer = React.forwardRef<HTMLDivElement, ChartContainerProps>(
  ({ className, config, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("w-full h-full", className)}
        {...props}
      />
    )
  }
)
ChartContainer.displayName = "ChartContainer"

interface ChartTooltipProps {
  cursor?: boolean | object
  content?: React.ReactElement
}

const ChartTooltip = (_props: ChartTooltipProps) => {
  // This is just a passthrough component for recharts
  return null
}

interface ChartTooltipContentProps {
  hideLabel?: boolean
  active?: boolean
  payload?: any[]
  label?: string
}

const ChartTooltipContent = React.forwardRef<HTMLDivElement, ChartTooltipContentProps>(
  ({ hideLabel = false, active, payload, label, ...props }, ref) => {
    if (!active || !payload || !payload.length) {
      return null
    }

    return (
      <div
        ref={ref}
        className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg"
        {...props}
      >
        {!hideLabel && label && (
          <p className="font-medium text-gray-900 mb-2">{label}</p>
        )}
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-gray-600">
              {entry.name}: <span className="font-medium">{entry.value}</span>
            </span>
          </div>
        ))}
      </div>
    )
  }
)
ChartTooltipContent.displayName = "ChartTooltipContent"

export { ChartContainer, ChartTooltip, ChartTooltipContent }