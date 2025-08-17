import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer } from '@/components/ui/chart'
import { XAxis, YAxis, ResponsiveContainer, Area, AreaChart, Tooltip } from 'recharts'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

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

interface HourlyRateTrendChartProps {
  history: HistoryEntry[]
}

export function HourlyRateTrendChart({ history }: HourlyRateTrendChartProps) {
  if (history.length < 2) {
    return (
      <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold flex items-center gap-3 text-slate-800">
            <div className="p-2 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-emerald-600" />
            </div>
            Hourly Rate Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-slate-400 mb-2">
              <TrendingUp className="h-12 w-12 mx-auto mb-4" />
            </div>
            <p className="text-slate-500">Need more calculations</p>
            <p className="text-sm text-slate-400">Make at least 2 calculations to see trends</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Take the last 10 calculations and reverse to show chronological order
  const chartData = history.slice(0, 10).reverse().map((entry, index) => ({
    calculation: `#${index + 1}`,
    hourlyRate: Number(entry.result.hourlyRate.toFixed(2)),
    date: entry.timestamp.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    fullDate: entry.timestamp.toLocaleDateString(),
    itemPrice: Number(entry.itemPrice),
    income: Number(entry.monthlyIncome)
  }))

  const chartConfig = {
    hourlyRate: {
      label: 'Hourly Rate (€)',
      color: '#0ea5e9'
    }
  }

  const firstRate = chartData[0]?.hourlyRate || 0
  const lastRate = chartData[chartData.length - 1]?.hourlyRate || 0
  const trend = lastRate - firstRate
  const trendPercentage = firstRate > 0 ? ((trend / firstRate) * 100) : 0
  
  const maxRate = Math.max(...chartData.map(d => d.hourlyRate))
  const minRate = Math.min(...chartData.map(d => d.hourlyRate))
  const avgRate = chartData.reduce((sum, d) => sum + d.hourlyRate, 0) / chartData.length

  const getTrendIcon = () => {
    if (Math.abs(trendPercentage) < 1) return <Minus className="h-4 w-4 text-gray-500" />
    return trendPercentage > 0 
      ? <TrendingUp className="h-4 w-4 text-emerald-500" />
      : <TrendingDown className="h-4 w-4 text-red-500" />
  }

  const getTrendColor = () => {
    if (Math.abs(trendPercentage) < 1) return 'text-gray-500'
    return trendPercentage > 0 ? 'text-emerald-500' : 'text-red-500'
  }

  return (
    <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold flex items-center justify-between text-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-emerald-600" />
            </div>
            Hourly Rate Trend
          </div>
          <div className={`flex items-center gap-2 text-sm font-normal ${getTrendColor()}`}>
            {getTrendIcon()}
            {Math.abs(trendPercentage) < 1 ? 'Stable' : `${trendPercentage > 0 ? '+' : ''}${trendPercentage.toFixed(1)}%`}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="hourlyRateGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="date" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#64748b' }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#64748b' }}
                domain={['dataMin - 1', 'dataMax + 1']}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as {
                      calculation: string
                      hourlyRate: number
                      itemPrice: number
                      income: number
                      fullDate: string
                    }
                    return (
                      <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
                        <p className="font-semibold text-slate-900 mb-2">{data.calculation}</p>
                        <p className="text-sm text-slate-600">
                          Hourly Rate: <span className="font-medium text-blue-600">€{data.hourlyRate}</span>
                        </p>
                        <p className="text-sm text-slate-600">
                          Item: <span className="font-medium">€{data.itemPrice}</span>
                        </p>
                        <p className="text-sm text-slate-600">
                          Income: <span className="font-medium">€{data.income}</span>
                        </p>
                        <p className="text-xs text-slate-500 mt-1">{data.fullDate}</p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Area
                type="monotone"
                dataKey="hourlyRate"
                stroke="#0ea5e9"
                fillOpacity={1}
                fill="url(#hourlyRateGradient)"
                strokeWidth={2}
                dot={{ r: 4, fill: "#0ea5e9" }}
                activeDot={{ r: 6, fill: "#0ea5e9" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
        
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-sm text-blue-700 mb-1">Average</div>
            <div className="text-lg font-bold text-blue-800">
              €{avgRate.toFixed(2)}
            </div>
          </div>
          <div className="text-center p-3 bg-emerald-50 rounded-lg">
            <div className="text-sm text-emerald-700 mb-1">Highest</div>
            <div className="text-lg font-bold text-emerald-800">
              €{maxRate.toFixed(2)}
            </div>
          </div>
          <div className="text-center p-3 bg-red-50 rounded-lg">
            <div className="text-sm text-red-700 mb-1">Lowest</div>
            <div className="text-lg font-bold text-red-800">
              €{minRate.toFixed(2)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}