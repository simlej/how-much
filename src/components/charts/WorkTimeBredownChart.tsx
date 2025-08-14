import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer } from '@/components/ui/chart'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { Clock } from 'lucide-react'

interface WorkTimeBreakdownChartProps {
  workingDays: number
  workingHours: number
  workingMinutes: number
  totalDays: number
  totalHours: number
  totalMinutes: number
}

export function WorkTimeBreakdownChart({
  workingDays,
  workingHours,
  workingMinutes,
  totalDays,
  totalHours,
  totalMinutes
}: WorkTimeBreakdownChartProps) {
  // Convert everything to minutes for comparison
  const totalWorkingMinutes = workingDays * 24 * 60 + workingHours * 60 + workingMinutes
  const totalTimeMinutes = totalDays * 24 * 60 + totalHours * 60 + totalMinutes
  const nonWorkingMinutes = totalTimeMinutes - totalWorkingMinutes

  const data = [
    {
      name: 'Work Time',
      value: totalWorkingMinutes,
      color: '#10b981' // emerald-500
    },
    {
      name: 'Non-Work Time',
      value: nonWorkingMinutes,
      color: '#6b7280' // gray-500
    }
  ]

  const formatTime = (minutes: number) => {
    const days = Math.floor(minutes / (24 * 60))
    const hours = Math.floor((minutes % (24 * 60)) / 60)
    const mins = Math.floor(minutes % 60)
    
    const parts = []
    if (days > 0) parts.push(`${days}d`)
    if (hours > 0) parts.push(`${hours}h`)
    if (mins > 0 || parts.length === 0) parts.push(`${mins}m`)
    
    return parts.join(' ')
  }

  const chartConfig = {
    workTime: {
      label: 'Work Time',
      color: '#10b981'
    },
    nonWorkTime: {
      label: 'Non-Work Time', 
      color: '#6b7280'
    }
  }

  return (
    <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-3 text-slate-800">
          <div className="p-2 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-lg">
            <Clock className="h-5 w-5 text-emerald-600" />
          </div>
          Time Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                cursor={false}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload
                    return (
                      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-sm"
                            style={{ backgroundColor: data.color }}
                          />
                          <span className="text-sm text-gray-600">
                            {data.name}: <span className="font-medium">{formatTime(data.value)}</span>
                          </span>
                        </div>
                      </div>
                    )
                  }
                  return null
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
        
        <div className="mt-6 space-y-3">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="font-medium text-slate-700">{item.name}</span>
              </div>
              <div className="text-right">
                <div className="font-semibold text-slate-900">
                  {formatTime(item.value)}
                </div>
                <div className="text-xs text-slate-500">
                  {((item.value / totalTimeMinutes) * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}