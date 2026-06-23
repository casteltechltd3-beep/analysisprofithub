'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Radar, Play, Square, RefreshCw } from 'lucide-react'

interface AIScannerProps {
  isScanning: boolean
  onStartScan: () => void
  onStopScan: () => void
}

interface MarketScan {
  market: string
  volatility: number
  signal: number
  confidence: number
  status: 'scanning' | 'ready' | 'idle'
}

export default function AIScanner({ isScanning, onStartScan, onStopScan }: AIScannerProps) {
  const [markets, setMarkets] = useState<MarketScan[]>([
    { market: 'Volatility 10', volatility: 10, signal: 0, confidence: 0, status: 'idle' },
    { market: 'Volatility 25', volatility: 25, signal: 0, confidence: 0, status: 'idle' },
    { market: 'Volatility 50', volatility: 50, signal: 0, confidence: 0, status: 'idle' },
    { market: 'Volatility 75', volatility: 75, signal: 0, confidence: 0, status: 'idle' },
    { market: 'Volatility 100', volatility: 100, signal: 0, confidence: 0, status: 'idle' },
  ])
  const [scanProgress, setScanProgress] = useState(0)
  const [tickCount, setTickCount] = useState(0)
  const [bestOpportunity, setBestOpportunity] = useState({ market: 'None', signal: 0 })

  useEffect(() => {
    if (!isScanning) {
      setScanProgress(0)
      return
    }

    const scanInterval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) return 0
        return prev + 10
      })

      setTickCount(prev => prev + Math.floor(Math.random() * 5))

      // Update markets with random signals
      setMarkets(prev => prev.map(market => ({
        ...market,
        status: 'scanning',
        signal: Math.random() * 100,
        confidence: Math.random() * 100,
      })))

      // Find best opportunity
      const best = Math.max(...markets.map(m => m.signal))
      const bestMarket = markets.find(m => m.signal === best)
      if (bestMarket) {
        setBestOpportunity({ market: bestMarket.market, signal: best })
      }
    }, 500)

    return () => clearInterval(scanInterval)
  }, [isScanning, markets])

  return (
    <div className="
      glass-card rounded-2xl border border-slate-700/50
      bg-gradient-to-br from-slate-900/50 via-slate-800/50 to-slate-900/50
      backdrop-blur-xl p-6 shadow-2xl
      relative overflow-hidden
    ">
      {/* Animated background glow */}
      <div className="absolute -inset-full bg-gradient-to-r from-cyan-500/10 via-transparent to-purple-500/10 blur-3xl animate-pulse pointer-events-none" />

      <div className="relative z-10 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8">
              {isScanning && (
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full animate-spin" style={{ animationDuration: '2s' }} />
              )}
              <div className="absolute inset-1 bg-slate-900 rounded-full flex items-center justify-center">
                <Radar className="w-4 h-4 text-cyan-400" />
              </div>
            </div>
            <div>
              <h3 className="font-bold text-slate-100">AI Trading Scanner</h3>
              <p className="text-xs text-slate-400">
                {isScanning ? 'SCANNING ALL VOLATILITY MARKETS' : 'Ready to scan'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isScanning ? (
              <Button
                onClick={onStopScan}
                size="sm"
                className="bg-red-600/80 hover:bg-red-700 text-white gap-2 rounded-lg"
              >
                <Square className="w-4 h-4" />
                Stop
              </Button>
            ) : (
              <Button
                onClick={onStartScan}
                size="sm"
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white gap-2 rounded-lg shadow-lg shadow-cyan-500/50"
              >
                <Play className="w-4 h-4" />
                Start Scan
              </Button>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        {isScanning && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-400">
              <span>Scan Progress</span>
              <span>{Math.round(scanProgress)}%</span>
            </div>
            <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden border border-slate-600/50">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full transition-all duration-300 shadow-lg shadow-cyan-500/50"
                style={{ width: `${scanProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="px-3 py-2 bg-slate-700/20 rounded-lg border border-slate-600/30">
            <p className="text-xs text-slate-400">Markets Scanning</p>
            <p className="text-lg font-bold text-cyan-400">{isScanning ? 5 : 0}</p>
          </div>
          <div className="px-3 py-2 bg-slate-700/20 rounded-lg border border-slate-600/30">
            <p className="text-xs text-slate-400">Ticks Processed</p>
            <p className="text-lg font-bold text-emerald-400">{tickCount}</p>
          </div>
          <div className="px-3 py-2 bg-slate-700/20 rounded-lg border border-slate-600/30">
            <p className="text-xs text-slate-400">Best Signal</p>
            <p className="text-lg font-bold text-purple-400">{Math.round(bestOpportunity.signal)}</p>
          </div>
        </div>

        {/* Markets Grid */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-slate-400">MARKET STATUS</p>
          <div className="grid grid-cols-1 gap-2">
            {markets.map((market, idx) => (
              <div
                key={market.market}
                className={`
                  px-4 py-3 rounded-lg border transition-all duration-300
                  ${isScanning && market.status === 'scanning'
                    ? 'bg-gradient-to-r from-slate-700/50 to-transparent border-slate-600 shadow-lg shadow-cyan-500/20'
                    : 'bg-slate-700/20 border-slate-600/30'
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-2 h-2 rounded-full bg-slate-500" />
                    <span className="text-sm font-medium text-slate-300">{market.market}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <p className="text-xs text-slate-400">Signal: {Math.round(market.signal)}/100</p>
                      <p className="text-xs text-slate-500">Conf: {Math.round(market.confidence)}%</p>
                    </div>
                    <Badge className={`
                      ${market.confidence > 70 ? 'bg-emerald-500/30 text-emerald-300' : 'bg-slate-600/30 text-slate-400'}
                    `}>
                      {Math.round(market.confidence)}%
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Best Opportunity */}
        {isScanning && bestOpportunity.signal > 0 && (
          <div className="p-4 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-lg border border-emerald-500/30 shadow-lg shadow-emerald-500/20">
            <p className="text-xs text-emerald-400 font-semibold">BEST DETECTED OPPORTUNITY</p>
            <p className="text-lg font-bold text-emerald-300 mt-1">{bestOpportunity.market}</p>
            <p className="text-xs text-emerald-400 mt-1">Signal Strength: {Math.round(bestOpportunity.signal)}/100</p>
          </div>
        )}
      </div>
    </div>
  )
}
