'use client'

import React, { useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'

export default function StrategySelector() {
  const [selectedStrategies, setSelectedStrategies] = useState(['over_under', 'even_odd'])

  const strategies = [
    { id: 'over_under', label: 'Over/Under', description: 'Trade above/below thresholds' },
    { id: 'even_odd', label: 'Even/Odd', description: 'Predict digit parity' },
    { id: 'matches', label: 'Matches', description: 'Trade hottest digit' },
    { id: 'differs', label: 'Differs', description: 'Trade coldest digit' },
    { id: 'rise_fall', label: 'Rise/Fall', description: 'Trend detection' },
    { id: 'high_low', label: 'High/Low', description: 'High/Low strategy' },
  ]

  const toggleStrategy = (id: string) => {
    setSelectedStrategies(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    )
  }

  return (
    <div className="
      glass-card rounded-2xl border border-slate-700/50
      bg-gradient-to-br from-slate-900/50 via-slate-800/50 to-slate-900/50
      backdrop-blur-xl p-6 shadow-2xl
    ">
      <div className="space-y-4">
        <h3 className="font-bold text-slate-100">Strategy Selection</h3>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {strategies.map((strategy) => (
            <div
              key={strategy.id}
              className={`
                p-4 rounded-lg border cursor-pointer transition-all
                ${selectedStrategies.includes(strategy.id)
                  ? 'bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-cyan-400/50 shadow-lg shadow-cyan-500/20'
                  : 'bg-slate-700/20 border-slate-600/30 hover:border-slate-500/50'
                }
              `}
              onClick={() => toggleStrategy(strategy.id)}
            >
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={selectedStrategies.includes(strategy.id)}
                  onCheckedChange={() => toggleStrategy(strategy.id)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-200">{strategy.label}</p>
                  <p className="text-xs text-slate-400 mt-1">{strategy.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
