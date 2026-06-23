'use client'

import React from 'react'
import { BarChart3, TrendingUp, PieChart, LineChart } from 'lucide-react'

export default function AnalyticsCenter() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Win Rate Analysis */}
        <div className="
          glass-card rounded-2xl border border-slate-700/50
          bg-gradient-to-br from-slate-900/50 via-slate-800/50 to-slate-900/50
          backdrop-blur-xl p-6 shadow-2xl
        ">
          <h3 className="font-bold text-slate-100 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            Win Rate by Strategy
          </h3>
          <div className="mt-4 space-y-3">
            {[
              { name: 'Over/Under', rate: 68, color: 'from-blue-500 to-cyan-500' },
              { name: 'Even/Odd', rate: 62, color: 'from-purple-500 to-pink-500' },
              { name: 'Matches', rate: 71, color: 'from-emerald-500 to-teal-500' },
              { name: 'Rise/Fall', rate: 65, color: 'from-orange-500 to-yellow-500' },
            ].map((strategy) => (
              <div key={strategy.name}>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-slate-400">{strategy.name}</span>
                  <span className="text-sm font-semibold text-slate-200">{strategy.rate}%</span>
                </div>
                <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${strategy.color}`}
                    style={{ width: `${strategy.rate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="
          glass-card rounded-2xl border border-slate-700/50
          bg-gradient-to-br from-slate-900/50 via-slate-800/50 to-slate-900/50
          backdrop-blur-xl p-6 shadow-2xl
        ">
          <h3 className="font-bold text-slate-100 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            Performance Metrics
          </h3>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {[
              { label: 'Total Trades', value: '1,247', color: 'text-cyan-400' },
              { label: 'Total Wins', value: '847', color: 'text-emerald-400' },
              { label: 'Total Losses', value: '400', color: 'text-red-400' },
              { label: 'Total Profit', value: '$3,425', color: 'text-emerald-400' },
            ].map((metric) => (
              <div key={metric.label} className="p-3 bg-slate-700/20 rounded-lg border border-slate-600/30">
                <p className="text-xs text-slate-400">{metric.label}</p>
                <p className={`text-lg font-bold mt-1 ${metric.color}`}>{metric.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Profit Distribution */}
      <div className="
        glass-card rounded-2xl border border-slate-700/50
        bg-gradient-to-br from-slate-900/50 via-slate-800/50 to-slate-900/50
        backdrop-blur-xl p-6 shadow-2xl
      ">
        <h3 className="font-bold text-slate-100 flex items-center gap-2">
          <PieChart className="w-5 h-5 text-purple-400" />
          Profit Distribution by Market
        </h3>
        <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { market: 'EURUSD', profit: 1200, percentage: 35 },
            { market: 'GBPUSD', profit: 850, percentage: 25 },
            { market: 'USDJPY', profit: 950, percentage: 28 },
            { market: 'AUDUSD', profit: 425, percentage: 12 },
          ].map((item) => (
            <div key={item.market} className="p-3 bg-slate-700/20 rounded-lg border border-slate-600/30">
              <p className="text-xs text-slate-400">{item.market}</p>
              <p className="text-lg font-bold text-emerald-400 mt-1">${item.profit}</p>
              <p className="text-xs text-slate-500 mt-1">{item.percentage}% of total</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
