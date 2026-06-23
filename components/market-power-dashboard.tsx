'use client'

import React, { useState, useEffect } from 'react'
import { Progress } from '@/components/ui/progress'
import { TrendingDown, TrendingUp } from 'lucide-react'

interface PowerMeterProps {
  label: string
  power: number
  icon: React.ReactNode
  color: 'blue' | 'orange'
}

function PowerMeter({ label, power, icon, color }: PowerMeterProps) {
  const getSignalStatus = (power: number) => {
    if (power < 50) return 'Weak'
    if (power < 55) return 'Yellow Zone'
    if (power < 65) return 'Blue Signal'
    if (power < 75) return 'Green Signal'
    return 'Extreme Signal'
  }

  const getGlowColor = (power: number) => {
    if (power < 55) return 'shadow-yellow-500/20'
    if (power < 65) return 'shadow-blue-500/20'
    if (power < 75) return 'shadow-emerald-500/20'
    return 'shadow-emerald-500/40'
  }

  const getProgressColor = (power: number) => {
    if (power < 55) return 'bg-yellow-500'
    if (power < 65) return 'bg-blue-500'
    if (power < 75) return 'bg-emerald-500'
    return 'bg-emerald-400'
  }

  return (
    <div className={`
      px-6 py-5 rounded-xl border border-slate-600/50
      bg-gradient-to-br from-slate-700/30 to-slate-800/30
      shadow-lg ${getGlowColor(power)}
      transition-all duration-300
    `}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="text-slate-400">{icon}</div>
          <span className="font-semibold text-slate-200">{label}</span>
        </div>
        <div className="text-right">
          <p className={`
            text-2xl font-bold
            ${power < 55 ? 'text-yellow-400' : power < 65 ? 'text-blue-400' : 'text-emerald-400'}
          `}>
            {Math.round(power)}%
          </p>
          <p className="text-xs text-slate-500">{getSignalStatus(power)}</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="h-3 bg-slate-700/50 rounded-full overflow-hidden border border-slate-600/30">
          <div
            className={`
              h-full ${getProgressColor(power)} rounded-full transition-all duration-500
              ${power > 65 ? 'shadow-lg shadow-emerald-500/50 animate-pulse' : ''}
            `}
            style={{ width: `${power}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-slate-500">
          <span>Weak</span>
          <span>Strong</span>
          <span>Extreme</span>
        </div>
      </div>
    </div>
  )
}

export default function MarketPowerDashboard() {
  const [overPower, setOverPower] = useState(45)
  const [underPower, setUnderPower] = useState(55)
  const [digitStats, setDigitStats] = useState<Record<number, number>>({
    0: 9, 1: 12, 2: 8, 3: 11, 4: 9, 5: 13, 6: 8, 7: 10, 8: 10, 9: 10
  })

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setOverPower(prev => {
        const change = (Math.random() - 0.5) * 5
        return Math.max(30, Math.min(70, prev + change))
      })
      setUnderPower(prev => 100 - (Math.random() * 40 + 30))

      setDigitStats(prev => {
        const updated = { ...prev }
        const randomDigit = Math.floor(Math.random() * 10)
        updated[randomDigit] = Math.max(5, Math.min(18, updated[randomDigit] + (Math.random() - 0.5) * 2))
        return updated
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const topDigit = Object.entries(digitStats).sort((a, b) => b[1] - a[1])[0]
  const bottomDigit = Object.entries(digitStats).sort((a, b) => a[1] - b[1])[0]

  return (
    <div className="
      glass-card rounded-2xl border border-slate-700/50
      bg-gradient-to-br from-slate-900/50 via-slate-800/50 to-slate-900/50
      backdrop-blur-xl p-6 shadow-2xl
      relative overflow-hidden
    ">
      {/* Background glow */}
      <div className="absolute -inset-full bg-gradient-to-r from-orange-500/10 via-transparent to-yellow-500/10 blur-3xl animate-pulse pointer-events-none" />

      <div className="relative z-10 space-y-6">
        {/* Header */}
        <h3 className="font-bold text-slate-100 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-orange-400 to-yellow-400" />
          Market Power Meter
        </h3>

        {/* Power Meters */}
        <div className="space-y-4">
          <PowerMeter
            label="OVER POWER"
            power={overPower}
            icon={<TrendingUp className="w-5 h-5" />}
            color="orange"
          />
          <PowerMeter
            label="UNDER POWER"
            power={underPower}
            icon={<TrendingDown className="w-5 h-5" />}
            color="blue"
          />
        </div>

        {/* Digit Distribution */}
        <div className="space-y-3">
          <p className="text-xs font-semibold text-slate-400">DIGIT FREQUENCIES</p>
          <div className="grid grid-cols-5 gap-2">
            {Object.entries(digitStats).map(([digit, percentage]) => (
              <div
                key={digit}
                className={`
                  p-3 rounded-lg border text-center transition-all duration-300
                  ${parseInt(digit) === parseInt(topDigit[0])
                    ? 'bg-gradient-to-br from-emerald-500/30 to-teal-500/20 border-emerald-400/50 shadow-lg shadow-emerald-500/20'
                    : parseInt(digit) === parseInt(bottomDigit[0])
                    ? 'bg-gradient-to-br from-red-500/20 to-orange-500/10 border-red-400/30'
                    : 'bg-slate-700/20 border-slate-600/30'
                  }
                `}
              >
                <p className="text-xs font-bold text-slate-300">{digit}</p>
                <p className={`
                  text-lg font-bold mt-1
                  ${parseInt(digit) === parseInt(topDigit[0]) ? 'text-emerald-400' : 'text-slate-400'}
                `}>
                  {percentage.toFixed(0)}%
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Key Insights */}
        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-700/50">
          <div className="p-3 bg-emerald-500/10 rounded-lg border border-emerald-400/30">
            <p className="text-xs text-emerald-400 font-semibold">Hottest Digit</p>
            <p className="text-2xl font-bold text-emerald-300 mt-1">{topDigit[0]}</p>
            <p className="text-xs text-emerald-500 mt-1">{topDigit[1].toFixed(1)}% frequency</p>
          </div>
          <div className="p-3 bg-red-500/10 rounded-lg border border-red-400/30">
            <p className="text-xs text-red-400 font-semibold">Coldest Digit</p>
            <p className="text-2xl font-bold text-red-300 mt-1">{bottomDigit[0]}</p>
            <p className="text-xs text-red-500 mt-1">{bottomDigit[1].toFixed(1)}% frequency</p>
          </div>
        </div>
      </div>
    </div>
  )
}
