'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Clock, Zap } from 'lucide-react'
import { Progress } from '@/components/ui/progress'

export default function LongSessionTrader() {
  const [duration, setDuration] = useState('1')
  const [riskPercent, setRiskPercent] = useState('2')
  const [sessionProgress, setSessionProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setSessionProgress(prev => (prev + Math.random() * 5) % 100)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const durationMinutes = parseInt(duration) * 60

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Settings */}
        <div className="
          glass-card rounded-2xl border border-slate-700/50
          bg-gradient-to-br from-slate-900/50 via-slate-800/50 to-slate-900/50
          backdrop-blur-xl p-6 shadow-2xl
        ">
          <div className="space-y-4">
            <h3 className="font-bold text-slate-100 flex items-center gap-2">
              <Clock className="w-5 h-5 text-cyan-400" />
              24-Hour Smart Trader Settings
            </h3>

            <div className="space-y-2">
              <Label className="text-slate-300">Trading Duration</Label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger className="bg-slate-700/30 border-slate-600/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Hour</SelectItem>
                  <SelectItem value="2">2 Hours</SelectItem>
                  <SelectItem value="4">4 Hours</SelectItem>
                  <SelectItem value="8">8 Hours</SelectItem>
                  <SelectItem value="12">12 Hours</SelectItem>
                  <SelectItem value="24">24 Hours</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Risk Allocation</Label>
              <Select value={riskPercent} onValueChange={setRiskPercent}>
                <SelectTrigger className="bg-slate-700/30 border-slate-600/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1% of Balance</SelectItem>
                  <SelectItem value="2">2% of Balance</SelectItem>
                  <SelectItem value="3">3% of Balance</SelectItem>
                  <SelectItem value="4">4% of Balance</SelectItem>
                  <SelectItem value="5">5% of Balance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-lg font-semibold shadow-lg shadow-cyan-500/50">
              <Zap className="w-4 h-4 mr-2" />
              Start Long Session
            </Button>
          </div>
        </div>

        {/* Session Stats */}
        <div className="
          glass-card rounded-2xl border border-slate-700/50
          bg-gradient-to-br from-slate-900/50 via-slate-800/50 to-slate-900/50
          backdrop-blur-xl p-6 shadow-2xl
        ">
          <div className="space-y-4">
            <h3 className="font-bold text-slate-100">Session Statistics</h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-700/20 rounded-lg border border-slate-600/30">
                <p className="text-xs text-slate-400">Duration</p>
                <p className="text-lg font-bold text-cyan-400 mt-1">{duration}H</p>
              </div>
              <div className="p-3 bg-slate-700/20 rounded-lg border border-slate-600/30">
                <p className="text-xs text-slate-400">Risk</p>
                <p className="text-lg font-bold text-orange-400 mt-1">{riskPercent}%</p>
              </div>
              <div className="p-3 bg-slate-700/20 rounded-lg border border-slate-600/30">
                <p className="text-xs text-slate-400">Est. Trades</p>
                <p className="text-lg font-bold text-blue-400 mt-1">{Math.floor(parseInt(duration) * 12)}</p>
              </div>
              <div className="p-3 bg-slate-700/20 rounded-lg border border-slate-600/30">
                <p className="text-xs text-slate-400">Max Exposure</p>
                <p className="text-lg font-bold text-emerald-400 mt-1">5%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Session */}
      <div className="
        glass-card rounded-2xl border border-emerald-600/50
        bg-gradient-to-br from-emerald-950/50 via-slate-800/50 to-slate-900/50
        backdrop-blur-xl p-6 shadow-2xl
      ">
        <div className="space-y-4">
          <h3 className="font-bold text-slate-100">Active Session</h3>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Session Progress</span>
              <span className="font-semibold text-emerald-400">{Math.round(sessionProgress)}%</span>
            </div>
            <Progress value={sessionProgress} className="h-2" />
          </div>

          <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-700/50">
            <div className="text-center">
              <p className="text-xs text-slate-400">Trades Done</p>
              <p className="text-xl font-bold text-cyan-400 mt-1">42</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-slate-400">Win Rate</p>
              <p className="text-xl font-bold text-emerald-400 mt-1">68%</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-slate-400">Profit</p>
              <p className="text-xl font-bold text-emerald-400 mt-1">$520</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
