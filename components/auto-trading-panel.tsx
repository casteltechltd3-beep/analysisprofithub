'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Activity, TrendingUp, BarChart3 } from 'lucide-react'

export default function AutoTradingPanel() {
  const [tradeCount, setTradeCount] = useState(5)
  const [winCount, setWinCount] = useState(3)
  const [totalProfit, setTotalProfit] = useState(250.50)

  useEffect(() => {
    const interval = setInterval(() => {
      setTotalProfit(prev => prev + (Math.random() - 0.5) * 50)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="
      glass-card rounded-2xl border border-slate-700/50
      bg-gradient-to-br from-slate-900/50 via-slate-800/50 to-slate-900/50
      backdrop-blur-xl p-6 shadow-2xl
    ">
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-100 flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400 animate-pulse" />
            Auto Trading
          </h3>
          <Badge className="bg-emerald-500/30 text-emerald-300">Active</Badge>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 bg-slate-700/20 rounded-lg border border-slate-600/30">
            <p className="text-xs text-slate-400">Total Trades</p>
            <p className="text-2xl font-bold text-cyan-400 mt-2">{tradeCount}</p>
          </div>
          <div className="p-4 bg-slate-700/20 rounded-lg border border-slate-600/30">
            <p className="text-xs text-slate-400">Wins</p>
            <p className="text-2xl font-bold text-emerald-400 mt-2">{winCount}</p>
          </div>
          <div className="p-4 bg-slate-700/20 rounded-lg border border-slate-600/30">
            <p className="text-xs text-slate-400">Win Rate</p>
            <p className="text-2xl font-bold text-blue-400 mt-2">{Math.round((winCount/tradeCount)*100)}%</p>
          </div>
          <div className="p-4 bg-slate-700/20 rounded-lg border border-slate-600/30">
            <p className="text-xs text-slate-400">Profit/Loss</p>
            <p className={`text-2xl font-bold mt-2 ${totalProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              ${totalProfit.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Current Trade */}
        <div className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-400/30">
          <p className="text-xs text-purple-400 font-semibold">Current Trade</p>
          <div className="mt-3 space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-slate-400">Market</span>
              <span className="text-sm font-semibold text-slate-200">EURUSD</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-400">Turn Number</span>
              <span className="text-sm font-semibold text-slate-200">3/7</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-400">Entry Price</span>
              <span className="text-sm font-semibold text-slate-200">1.0875</span>
            </div>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button className="bg-yellow-600/80 hover:bg-yellow-700 text-white rounded-lg" size="sm">
            Pause
          </Button>
          <Button className="bg-red-600/80 hover:bg-red-700 text-white rounded-lg" size="sm">
            Stop
          </Button>
        </div>
      </div>
    </div>
  )
}
