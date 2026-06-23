'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Shield, AlertTriangle } from 'lucide-react'

export default function RecoveryEngine() {
  const [lossThreshold, setLossThreshold] = useState('3')

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="
        glass-card rounded-2xl border border-orange-600/50
        bg-gradient-to-br from-orange-950/50 via-slate-800/50 to-slate-900/50
        backdrop-blur-xl p-6 shadow-2xl
      ">
        <div className="space-y-4">
          <h3 className="font-bold text-slate-100 flex items-center gap-2">
            <Shield className="w-5 h-5 text-orange-400" />
            Recovery Engine Settings
          </h3>

          <div className="space-y-2">
            <Label className="text-slate-300">Trigger After Consecutive Losses</Label>
            <Select value={lossThreshold} onValueChange={setLossThreshold}>
              <SelectTrigger className="bg-slate-700/30 border-slate-600/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">3 Losses</SelectItem>
                <SelectItem value="4">4 Losses</SelectItem>
                <SelectItem value="5">5 Losses</SelectItem>
                <SelectItem value="6">6 Losses</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="p-4 bg-orange-500/10 rounded-lg border border-orange-400/30">
            <p className="text-sm text-orange-300">Recovery strategies will activate after {lossThreshold} consecutive losses</p>
          </div>
        </div>
      </div>

      <div className="
        glass-card rounded-2xl border border-slate-700/50
        bg-gradient-to-br from-slate-900/50 via-slate-800/50 to-slate-900/50
        backdrop-blur-xl p-6 shadow-2xl
      ">
        <div className="space-y-4">
          <h3 className="font-bold text-slate-100 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            Recovery Strategies
          </h3>

          <div className="space-y-2">
            {['Over 0', 'Over 1', 'Even', 'Rise'].map((strategy) => (
              <div key={strategy} className="p-3 bg-slate-700/20 rounded-lg border border-slate-600/30 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-sm text-slate-300">{strategy}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
