import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer } from '@/components/ui/chart'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'
import { BarChart3, TrendingUp } from 'lucide-react'

interface HistoryEntry {
  id: string
  timestamp: Date
  monthlyIncome: string
  itemPrice: string
  hoursPerDay: string
  daysPerWeek: string
  result: {
    workingDays: number
    workingHours: number
    workingMinutes: number
    hourlyRate: number
  }
}

interface HistoryComparisonChartProps {
  history: HistoryEntry[]
}

export function HistoryComparisonChart({ history }: HistoryComparisonChartProps) {
  if (history.length === 0) {
    return (
      <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold flex items-center gap-3 text-slate-800">
            <div className="p-2 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-lg">
              <BarChart3 className="h-5 w-5 text-emerald-600" />
            </div>
            History Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-slate-400 mb-2">
              <BarChart3 className="h-12 w-12 mx-auto mb-4" />
            </div>
            <p className="text-slate-500">No history data yet</p>
            <p className="text-sm text-slate-400">Make some calculations to see comparisons</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Take the last 5 calculations for the chart
  const chartData = history.slice(0, 5).reverse().map((entry) => {
    const totalWorkingMinutes = entry.result.workingDays * 24 * 60 + 
                               entry.result.workingHours * 60 + 
                               entry.result.workingMinutes
    
    const totalWorkingHours = totalWorkingMinutes / 60
    
    return {
      name: `€${entry.itemPrice}`,
      item: `€${entry.itemPrice} item`,
      workHours: Number(totalWorkingHours.toFixed(1)),
      hourlyRate: Number(entry.result.hourlyRate.toFixed(2)),
      income: Number(entry.monthlyIncome),
      timestamp: entry.timestamp.toLocaleDateString()
    }
  })

  const chartConfig = {
    workHours: {
      label: 'Work Hours',
      color: '#10b981'
    },
    hourlyRate: {
      label: 'Hourly Rate (€)',
      color: '#0ea5e9'
    }
  }

  const maxWorkHours = Math.max(...chartData.map(d => d.workHours))
  const avgHourlyRate = chartData.reduce((sum, d) => sum + d.hourlyRate, 0) / chartData.length

  return (
    <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold flex items-center justify-between text-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-lg">
              <BarChart3 className="h-5 w-5 text-emerald-600" />
            </div>
            History Comparison
          </div>
          <div className="flex items-center gap-2 text-sm font-normal text-slate-600">
            <TrendingUp className="h-4 w-4" />
            Avg €{avgHourlyRate.toFixed(2)}/hr
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#64748b' }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#64748b' }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as {
                      item: string
                      workHours: number
                      hourlyRate: number
                      timestamp: string
                    }
                    return (
                      <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
                        <p className="font-semibold text-slate-900 mb-2">{data.item}</p>
                        <p className="text-sm text-slate-600">
                          <span className="font-medium text-emerald-600">
                            {data.workHours} hours
                          </span> of work needed
                        </p>
                        <p className="text-sm text-slate-600">
                          Hourly rate: <span className="font-medium">€{data.hourlyRate}</span>
                        </p>
                        <p className="text-xs text-slate-500 mt-1">{data.timestamp}</p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Bar 
                dataKey="workHours" 
                fill="#10b981"
                radius={[4, 4, 0, 0]}
                opacity={0.8}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
        
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-emerald-50 rounded-lg">
            <div className="text-sm text-emerald-700 mb-1">Max Work Time</div>
            <div className="text-lg font-bold text-emerald-800">
              {maxWorkHours.toFixed(1)}h
            </div>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-sm text-blue-700 mb-1">Recent Calculations</div>
            <div className="text-lg font-bold text-blue-800">
              {chartData.length}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}