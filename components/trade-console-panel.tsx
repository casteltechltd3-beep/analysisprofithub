'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Zap } from 'lucide-react'

export default function TradeConsolePanel() {
  const [market, setMarket] = useState('eurusd')
  const [contractType, setContractType] = useState('higher')
  const [stake, setStake] = useState('100')
  const [ticks, setTicks] = useState('5')

  return (
    <div className="
      glass-card rounded-2xl border border-slate-700/50
      bg-gradient-to-br from-slate-900/50 via-slate-800/50 to-slate-900/50
      backdrop-blur-xl p-6 shadow-2xl
    ">
      <div className="space-y-5">
        <h3 className="font-bold text-slate-100 flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-400" />
          Trade Console
        </h3>

        {/* Market Selection */}
        <div className="space-y-2">
          <Label className="text-slate-300">Market</Label>
          <Select value={market} onValueChange={setMarket}>
            <SelectTrigger className="bg-slate-700/30 border-slate-600/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="eurusd">EURUSD</SelectItem>
              <SelectItem value="gbpusd">GBPUSD</SelectItem>
              <SelectItem value="usdjpy">USDJPY</SelectItem>
              <SelectItem value="audusd">AUDUSD</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Contract Type */}
        <div className="space-y-2">
          <Label className="text-slate-300">Prediction</Label>
          <Select value={contractType} onValueChange={setContractType}>
            <SelectTrigger className="bg-slate-700/30 border-slate-600/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="higher">Higher</SelectItem>
              <SelectItem value="lower">Lower</SelectItem>
              <SelectItem value="even">Even</SelectItem>
              <SelectItem value="odd">Odd</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stake */}
        <div className="space-y-2">
          <Label className="text-slate-300">Stake ($)</Label>
          <Input
            value={stake}
            onChange={(e) => setStake(e.target.value)}
            className="bg-slate-700/30 border-slate-600/50"
            type="number"
          />
        </div>

        {/* Ticks */}
        <div className="space-y-2">
          <Label className="text-slate-300">Duration (Ticks)</Label>
          <Input
            value={ticks}
            onChange={(e) => setTicks(e.target.value)}
            className="bg-slate-700/30 border-slate-600/50"
            type="number"
          />
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-4">
          <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-lg font-semibold shadow-lg shadow-emerald-500/50">
            Buy Contract
          </Button>
          <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-lg font-semibold shadow-lg shadow-cyan-500/50">
            Start Auto
          </Button>
        </div>
      </div>
    </div>
  )
}
