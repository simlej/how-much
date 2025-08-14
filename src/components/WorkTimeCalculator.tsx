import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Calculator, Clock, Euro, Timer, TrendingUp, History, Trash2, RotateCcw, Settings } from 'lucide-react'
import { HistoryComparisonChart } from '@/components/charts/HistoryComparisonChart'

interface CalculationResult {
  days: number
  hours: number
  minutes: number
  workingDays: number
  workingHours: number
  workingMinutes: number
  hourlyRate: number
}

interface HistoryEntry {
  id: string
  timestamp: Date
  monthlyIncome: string
  itemPrice: string
  hoursPerDay: string
  daysPerWeek: string
  result: CalculationResult
}

// localStorage utilities
const STORAGE_KEY = 'work-time-calculator-history'

const saveHistoryToStorage = (history: HistoryEntry[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
  } catch (error) {
    console.error('Failed to save history to localStorage:', error)
  }
}

const loadHistoryFromStorage = (): HistoryEntry[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    const parsed = JSON.parse(stored)
    // Convert timestamp strings back to Date objects
    return parsed.map((entry: any) => ({
      ...entry,
      timestamp: new Date(entry.timestamp)
    }))
  } catch (error) {
    console.error('Failed to load history from localStorage:', error)
    return []
  }
}

export function WorkTimeCalculator() {
  const [monthlyIncome, setMonthlyIncome] = useState<string>('')
  const [itemPrice, setItemPrice] = useState<string>('')
  const [hoursPerDay, setHoursPerDay] = useState<string>('8')
  const [daysPerWeek, setDaysPerWeek] = useState<string>('5')
  const [result, setResult] = useState<CalculationResult | null>(null)
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [showConfetti, setShowConfetti] = useState(false)
  const [isCalculating, setIsCalculating] = useState(false)

  // Load history from localStorage on component mount and auto-load last calculation
  useEffect(() => {
    const loadedHistory = loadHistoryFromStorage()
    setHistory(loadedHistory)
    
    // Auto-load the most recent calculation if available
    if (loadedHistory.length > 0) {
      const lastEntry = loadedHistory[0] // First item is the most recent
      setMonthlyIncome(lastEntry.monthlyIncome)
      setItemPrice(lastEntry.itemPrice)
      setHoursPerDay(lastEntry.hoursPerDay)
      setDaysPerWeek(lastEntry.daysPerWeek)
      setResult(lastEntry.result)
    }
  }, [])

  const calculateWorkTime = () => {
    // Prevent multiple clicks during animation
    if (isCalculating) {
      return
    }

    const income = parseFloat(monthlyIncome)
    const price = parseFloat(itemPrice)
    const dailyHours = parseFloat(hoursPerDay)
    const weeklyDays = parseFloat(daysPerWeek)

    if (!income || !price || income <= 0 || price <= 0) {
      return
    }

    // Set calculating state
    setIsCalculating(true)

    // Trigger confetti animation
    setShowConfetti(true)
    setTimeout(() => {
      setShowConfetti(false)
      setIsCalculating(false) // Re-enable button after animation
    }, 4000)

    // Calculate hourly rate
    const workingDaysPerMonth = (weeklyDays * 52) / 12
    const monthlyHours = workingDaysPerMonth * dailyHours
    const hourlyRate = income / monthlyHours

    // Calculate time needed to earn item price
    const hoursNeeded = price / hourlyRate

    // Convert to days, hours, minutes
    const days = Math.floor(hoursNeeded / 24)
    const remainingHours = hoursNeeded % 24
    const hours = Math.floor(remainingHours)
    const minutes = Math.round((remainingHours - hours) * 60)

    // Calculate working time (only during work hours)
    const workingDays = Math.floor(hoursNeeded / dailyHours)
    const remainingWorkHours = hoursNeeded % dailyHours
    const workingHours = Math.floor(remainingWorkHours)
    const workingMinutes = Math.round((remainingWorkHours - workingHours) * 60)

    const calculationResult = {
      days,
      hours,
      minutes,
      workingDays,
      workingHours,
      workingMinutes,
      hourlyRate
    }

    setResult(calculationResult)

    // Check if this calculation is the same as the previous one
    const isDuplicate = history.length > 0 && 
      history[0].monthlyIncome === monthlyIncome &&
      history[0].itemPrice === itemPrice &&
      history[0].hoursPerDay === hoursPerDay &&
      history[0].daysPerWeek === daysPerWeek

    // Only save to history if it's not a duplicate
    if (!isDuplicate) {
      const historyEntry: HistoryEntry = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        timestamp: new Date(),
        monthlyIncome,
        itemPrice,
        hoursPerDay,
        daysPerWeek,
        result: calculationResult
      }

      const newHistory = [historyEntry, ...history].slice(0, 10) // Keep only last 10 entries
      setHistory(newHistory)
      saveHistoryToStorage(newHistory)
    }

    // Scroll to results after a short delay to allow state update
    setTimeout(() => {
      const resultsElement = document.getElementById('results-section')
      if (resultsElement) {
        resultsElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 100)
  }

  const loadFromHistory = (entry: HistoryEntry) => {
    setMonthlyIncome(entry.monthlyIncome)
    setItemPrice(entry.itemPrice)
    setHoursPerDay(entry.hoursPerDay)
    setDaysPerWeek(entry.daysPerWeek)
    setResult(entry.result)
  }

  const clearHistory = () => {
    setHistory([])
    saveHistoryToStorage([])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-100 relative overflow-hidden" 
         style={{ minHeight: '100vh', paddingBottom: '100px' }}>
      {/* Money Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 animate-in fade-in duration-300 animate-out fade-out duration-1000">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-10%`,
                animationDelay: `${Math.random() * 1}s`,
                fontSize: `${1.5 + Math.random() * 1.5}rem`,
                transform: `rotate(${Math.random() * 360}deg)`,
                animation: `fall ${2 + Math.random() * 2}s linear forwards, spin ${1 + Math.random() * 2}s linear infinite, fadeOut 1s ease-in 3s forwards`,
              }}
            >
              {['💰', '💵', '💸', '💶', '💳'][Math.floor(Math.random() * 5)]}
            </div>
          ))}
        </div>
      )}
      
      <style>{`
        @keyframes fall {
          to {
            transform: translateY(120vh) rotate(360deg);
          }
        }
        
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        
        @keyframes fadeOut {
          0% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }
      `}</style>
      
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-10 left-10 w-32 h-32 bg-purple-200 rounded-full blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-indigo-200 rounded-full blur-3xl opacity-20 animate-pulse delay-1000"></div>
      
      {/* Money Emoji Pattern Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Large emojis */}
        <div className="absolute top-20 left-16 text-6xl opacity-10 text-yellow-600">💰</div>
        <div className="absolute top-40 right-20 text-5xl opacity-10 text-green-600">💸</div>
        <div className="absolute top-96 left-32 text-7xl opacity-10 text-yellow-500">💵</div>
        <div className="absolute bottom-40 right-32 text-6xl opacity-10 text-green-500">💳</div>
        <div className="absolute bottom-20 left-20 text-5xl opacity-10 text-yellow-600">💶</div>
        
        {/* Center area large emojis */}
        <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 text-6xl opacity-10 text-green-500">💰</div>
        <div className="absolute top-1/3 right-1/3 text-5xl opacity-10 text-yellow-600">💸</div>
        <div className="absolute top-2/3 left-1/3 text-7xl opacity-10 text-green-600">💸</div>
        <div className="absolute bottom-1/3 right-1/2 text-6xl opacity-10 text-yellow-500">💶</div>
        <div className="absolute top-1/2 left-1/4 text-5xl opacity-10 text-green-500">💵</div>
        <div className="absolute top-1/2 right-1/4 text-6xl opacity-10 text-yellow-600">💳</div>
        
        {/* Medium emojis */}
        <div className="absolute top-32 left-1/2 text-4xl opacity-10 text-green-600">💳</div>
        <div className="absolute top-72 right-16 text-3xl opacity-10 text-yellow-500">💰</div>
        <div className="absolute bottom-60 left-1/4 text-4xl opacity-10 text-green-600">💵</div>
        <div className="absolute top-80 right-1/3 text-3xl opacity-10 text-yellow-600">💶</div>
        <div className="absolute bottom-32 right-1/4 text-4xl opacity-10 text-green-500">💸</div>
        
        {/* Center area medium emojis */}
        <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 text-4xl opacity-10 text-purple-600">💰</div>
        <div className="absolute top-2/3 right-1/2 transform translate-x-1/2 text-3xl opacity-10 text-indigo-600">💵</div>
        <div className="absolute top-1/2 left-2/3 text-4xl opacity-10 text-green-600">💶</div>
        <div className="absolute bottom-1/4 left-1/2 transform -translate-x-1/2 text-3xl opacity-10 text-yellow-500">💳</div>
        
        {/* Small emojis */}
        <div className="absolute top-24 left-1/4 text-2xl opacity-10 text-yellow-500">💰</div>
        <div className="absolute top-56 right-1/2 text-xl opacity-10 text-green-600">💸</div>
        <div className="absolute top-88 left-3/4 text-2xl opacity-10 text-yellow-600">💵</div>
        <div className="absolute bottom-72 right-1/5 text-xl opacity-10 text-green-500">💶</div>
        <div className="absolute bottom-48 left-1/3 text-2xl opacity-10 text-yellow-500">💵</div>
        <div className="absolute top-48 left-2/3 text-xl opacity-10 text-green-600">💳</div>
        
        {/* Center area small emojis */}
        <div className="absolute top-1/4 right-2/3 text-2xl opacity-10 text-yellow-500">💰</div>
        <div className="absolute top-3/4 left-2/3 text-xl opacity-10 text-green-600">💸</div>
        <div className="absolute top-1/2 left-1/3 text-2xl opacity-10 text-yellow-600">💳</div>
        <div className="absolute top-2/3 right-1/3 text-xl opacity-10 text-green-500">💶</div>
        <div className="absolute bottom-1/3 left-2/3 text-2xl opacity-10 text-yellow-500">💵</div>
        <div className="absolute top-3/4 right-2/3 text-xl opacity-10 text-green-600">💳</div>
        
        {/* Extra small scattered emojis */}
        <div className="absolute top-36 right-1/4 text-sm opacity-10 text-yellow-600">💰</div>
        <div className="absolute top-64 left-1/5 text-sm opacity-10 text-green-500">💸</div>
        <div className="absolute bottom-84 right-2/3 text-sm opacity-10 text-yellow-500">💶</div>
        <div className="absolute bottom-56 left-2/3 text-sm opacity-10 text-green-600">💶</div>
        <div className="absolute top-72 right-3/4 text-sm opacity-10 text-yellow-600">💵</div>
        
        {/* Center area extra small emojis */}
        <div className="absolute top-1/3 left-3/4 text-sm opacity-10 text-yellow-600">💰</div>
        <div className="absolute top-2/3 left-1/4 text-sm opacity-10 text-green-500">💸</div>
        <div className="absolute bottom-1/4 right-2/3 text-sm opacity-10 text-yellow-500">💵</div>
        <div className="absolute top-3/4 left-1/2 transform -translate-x-1/2 text-sm opacity-10 text-green-600">💶</div>
        <div className="absolute top-1/4 left-1/3 text-sm opacity-10 text-yellow-600">💵</div>
        <div className="absolute bottom-2/3 right-1/2 transform translate-x-1/2 text-sm opacity-10 text-green-500">💳</div>
        
        {/* Corner accents */}
        <div className="absolute top-8 right-8 text-3xl opacity-10 text-yellow-500">💰</div>
        <div className="absolute bottom-8 left-8 text-3xl opacity-10 text-green-600">💸</div>
        <div className="absolute top-16 left-1/2 text-2xl opacity-10 text-purple-600">💵</div>
        <div className="absolute bottom-16 right-1/2 text-2xl opacity-10 text-indigo-600">💳</div>
      </div>
      
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12 relative">
          
          {/* Centered main content */}
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl mb-6 shadow-lg">
            <Calculator className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-700 bg-clip-text text-transparent mb-4">
            Work Time Calculator
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Discover the true cost of your desires — transform prices into time and make informed financial decisions
          </p>
        </div>

        {/* Input Card */}
        <Card className="mb-8 border-0 shadow-xl bg-white/70 backdrop-blur-sm">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl font-semibold flex items-center gap-3 text-slate-800">
              <div className="p-2 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-lg">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
              Calculate Your Work Time
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Main Input - Item Price */}
            <div className="text-center">
              <label className="flex items-center justify-center gap-3 text-lg font-bold text-emerald-700 mb-4">
                <div className="p-2 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-xl">
                  <Euro className="h-6 w-6 text-emerald-600" />
                </div>
                How much does it cost?
              </label>
              <div className="relative max-w-md mx-auto">
                <Input
                  type="number"
                  placeholder="120"
                  value={itemPrice}
                  onChange={(e) => setItemPrice(e.target.value)}
                  className="h-16 text-3xl font-bold text-center border-2 border-emerald-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200 hover:border-emerald-400 bg-white shadow-lg rounded-xl pr-12"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                  <span className="text-2xl font-bold text-emerald-600">€</span>
                </div>
              </div>
              
              {/* Submit Button */}
              <div className="mt-6">
                <Button 
                  onClick={calculateWorkTime} 
                  className="h-12 px-8 text-lg font-semibold bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  disabled={!monthlyIncome || !itemPrice || isCalculating}
                >
                  <Calculator className="mr-2 h-5 w-5" />
                  Calculate Work Time
                </Button>
              </div>
            </div>

            {/* Settings Inputs */}
            <div className="border-t border-slate-200 pt-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 bg-slate-100 rounded-lg">
                  <Settings className="h-4 w-4 text-slate-600" />
                </div>
                <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Settings</h3>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="group">
                  <label className="flex items-center gap-2 text-xs font-medium text-slate-600 mb-2">
                    <Euro className="h-3 w-3 text-slate-500" />
                    Monthly Income (€)
                  </label>
                  <Input
                    type="number"
                    placeholder="4300"
                    value={monthlyIncome}
                    onChange={(e) => setMonthlyIncome(e.target.value)}
                    className="h-10 text-sm border border-slate-300 focus:border-slate-400 transition-all duration-200 bg-slate-50 hover:bg-white"
                  />
                </div>
                
                <div className="group">
                  <label className="flex items-center gap-2 text-xs font-medium text-slate-600 mb-2">
                    <Timer className="h-3 w-3 text-slate-500" />
                    Hours per Day
                  </label>
                  <Input
                    type="number"
                    placeholder="8"
                    value={hoursPerDay}
                    onChange={(e) => setHoursPerDay(e.target.value)}
                    className="h-10 text-sm border border-slate-300 focus:border-slate-400 transition-all duration-200 bg-slate-50 hover:bg-white"
                  />
                </div>
                
                <div className="group">
                  <label className="flex items-center gap-2 text-xs font-medium text-slate-600 mb-2">
                    <TrendingUp className="h-3 w-3 text-slate-500" />
                    Days per Week
                  </label>
                  <Input
                    type="number"
                    placeholder="5"
                    value={daysPerWeek}
                    onChange={(e) => setDaysPerWeek(e.target.value)}
                    className="h-10 text-sm border border-slate-300 focus:border-slate-400 transition-all duration-200 bg-slate-50 hover:bg-white"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>


        {/* Results */}
        {result && (
          <div id="results-section" className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Your Results</h2>
              <p className="text-slate-600">Here's how much work time you need</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {/* Working Time Card */}
              <Card className="border-0 shadow-xl bg-gradient-to-br from-emerald-50 to-green-100 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-emerald-500 rounded-xl shadow-lg">
                      <Clock className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-emerald-700">Work Time</p>
                      <p className="text-xs text-emerald-600">Actual working hours</p>
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-emerald-800 mb-2">
                    {result.workingDays > 0 && <span>{result.workingDays}d </span>}
                    {result.workingHours > 0 && <span>{result.workingHours}h </span>}
                    {result.workingMinutes > 0 && <span>{result.workingMinutes}m</span>}
                  </div>
                  <p className="text-sm text-emerald-600">
                    Time you need to work
                  </p>
                </CardContent>
              </Card>

              {/* Total Time Card */}
              <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-indigo-100 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-blue-500 rounded-xl shadow-lg">
                      <Timer className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-blue-700">Total Time</p>
                      <p className="text-xs text-blue-600">Continuous duration</p>
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-blue-800 mb-2">
                    {result.days > 0 && <span>{result.days}d </span>}
                    {result.hours > 0 && <span>{result.hours}h </span>}
                    {result.minutes > 0 && <span>{result.minutes}m</span>}
                  </div>
                  <p className="text-sm text-blue-600">
                    If working 24/7
                  </p>
                </CardContent>
              </Card>

              {/* Hourly Rate Card */}
              <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-50 to-violet-100 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 md:col-span-2 xl:col-span-1">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-purple-500 rounded-xl shadow-lg">
                      <Euro className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-purple-700">Hourly Rate</p>
                      <p className="text-xs text-purple-600">Your time value</p>
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-purple-800 mb-2">
                    €{result.hourlyRate.toFixed(2)}
                  </div>
                  <p className="text-sm text-purple-600">
                    Per hour worked
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Summary Card */}
            <Card className="border-0 shadow-xl bg-gradient-to-r from-slate-50 to-slate-100">
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-lg text-slate-700 mb-2">
                    <strong className="text-purple-600">Summary:</strong> To afford a <strong className="text-indigo-600">€{itemPrice}</strong> item, 
                    you need to work for <strong className="text-emerald-600">
                      {result.workingDays > 0 && `${result.workingDays} days, `}
                      {result.workingHours > 0 && `${result.workingHours} hours, and `}
                      {result.workingMinutes} minutes
                    </strong>
                  </p>
                  <p className="text-sm text-slate-500">
                    Based on {hoursPerDay} hours/day, {daysPerWeek} days/week schedule
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Charts Section */}
            <div className="space-y-6 mt-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Visual Analytics</h2>
                <p className="text-slate-600">Interactive charts to better understand your work time</p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* History Panel */}
                <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-semibold flex items-center justify-between text-slate-800">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-lg">
                          <History className="h-5 w-5 text-emerald-600" />
                        </div>
                        Calculation History
                      </div>
                      {history.length > 0 && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={clearHistory}
                          className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                          Clear All
                        </Button>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {history.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="text-slate-400 mb-2">
                          <History className="h-12 w-12 mx-auto mb-4" />
                        </div>
                        <p className="text-slate-500">No calculations yet</p>
                        <p className="text-sm text-slate-400">Your calculation history will appear here</p>
                      </div>
                    ) : (
                      <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                        {history.map((entry) => (
                          <div
                            key={entry.id}
                            className="p-5 bg-white/50 border border-slate-100 rounded-xl hover:border-emerald-200 hover:bg-emerald-50/30 hover:shadow-md cursor-pointer transition-all duration-300 group"
                            onClick={() => loadFromHistory(entry)}
                          >
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-lg group-hover:from-emerald-200 group-hover:to-teal-200 transition-all duration-300">
                                  <RotateCcw className="h-4 w-4 text-emerald-600" />
                                </div>
                                <div>
                                  <div className="text-base mb-1">
                                    <span className="text-slate-600 font-medium">€{entry.monthlyIncome} →</span>
                                    <span className="text-emerald-700 font-bold text-xl ml-2 bg-emerald-50 px-2 py-1 rounded-lg">
                                      €{entry.itemPrice}
                                    </span>
                                  </div>
                                  <div className="text-sm text-slate-500 mt-1">
                                    {entry.timestamp.toLocaleDateString()} at {entry.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="bg-emerald-50/70 rounded-lg p-3">
                                <div className="text-xs font-medium text-emerald-700 uppercase tracking-wide mb-1">Work Time</div>
                                <div className="text-lg font-bold text-emerald-800">
                                  {entry.result.workingDays > 0 && `${entry.result.workingDays}d `}
                                  {entry.result.workingHours > 0 && `${entry.result.workingHours}h `}
                                  {entry.result.workingMinutes}m
                                </div>
                              </div>
                              <div className="bg-purple-50/70 rounded-lg p-3">
                                <div className="text-xs font-medium text-purple-700 uppercase tracking-wide mb-1">Hourly Rate</div>
                                <div className="text-lg font-bold text-purple-800">
                                  €{entry.result.hourlyRate.toFixed(2)}/hr
                                </div>
                              </div>
                            </div>
                            <div className="mt-3 text-center">
                              <span className="text-xs text-emerald-600 font-medium opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                                Click to load this calculation
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <HistoryComparisonChart history={history} />
              </div>
              
            </div>
          </div>
        )}
      </div>
    </div>
  )
}