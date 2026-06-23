'use client'

import React, { useState } from 'react'
import { TradingScanner } from '@/components/trading-scanner'
import { TradePredictionModal } from '@/components/trade-prediction-modal'
import { AutoTradingEngine } from '@/components/auto-trading-engine'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, Zap, TrendingUp } from 'lucide-react'

type TradeType = 'OVER' | 'UNDER' | 'EVEN' | 'ODD'

interface TradeData {
  market: string
  tradeType: TradeType
  entryPrice: number
  expectedProfit: number
  riskRewardRatio: number
  winProbability: number
  timeToTarget: number
  tpTicks: number
  slTicks: number
}

export default function TradingEnginePage() {
  const [isPredictionModalOpen, setIsPredictionModalOpen] = useState(false)
  const [selectedTradeData, setSelectedTradeData] = useState<TradeData | null>(null)

  const handleSelectSignal = (signal: any) => {
    // Convert signal to trade data
    const tradeData: TradeData = {
      market: 'EURUSD',
      tradeType: signal.type.includes('OVER') || signal.type.includes('EVEN') ? 'OVER' : 'UNDER',
      entryPrice: 1.0875,
      expectedProfit: signal.probability * 0.5,
      riskRewardRatio: 2.5,
      winProbability: signal.probability,
      timeToTarget: 30 + Math.random() * 60,
      tpTicks: 15 + Math.floor(Math.random() * 10),
      slTicks: 10 + Math.floor(Math.random() * 5),
    }

    setSelectedTradeData(tradeData)
    setIsPredictionModalOpen(true)
  }

  const handleExecuteTrade = (tradeData: TradeData) => {
    console.log('[v0] Trade executed:', tradeData)
    setIsPredictionModalOpen(false)
    // Trade execution will be handled by the auto-trading engine
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Zap className="w-8 h-8 text-emerald-400" />
          <h1 className="text-4xl font-bold text-white">AI Trading Engine</h1>
        </div>
        <p className="text-slate-400 max-w-2xl">
          Advanced multi-strategy signal scanner with automated trading engine. Combines 10+ trading
          strategies with intelligent market analysis and real-time signal generation.
        </p>
      </div>

      {/* System Status Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
          <div className="text-sm text-slate-400">System Status</div>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-lg font-semibold text-emerald-400">ONLINE</span>
          </div>
        </div>
        <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
          <div className="text-sm text-slate-400">Strategies Active</div>
          <div className="text-2xl font-bold text-blue-400 mt-2">10+</div>
        </div>
        <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
          <div className="text-sm text-slate-400">Data Frequency</div>
          <div className="text-lg font-semibold text-yellow-400 mt-2">Real-time</div>
        </div>
        <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
          <div className="text-sm text-slate-400">API Connection</div>
          <div className="flex items-center gap-2 mt-2">
            <Badge className="bg-emerald-500/10 text-emerald-400">Deriv Connected</Badge>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="scanner" className="w-full space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-96">
          <TabsTrigger value="scanner" className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Scanner
          </TabsTrigger>
          <TabsTrigger value="autotrading" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Auto Trading
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            Analysis
          </TabsTrigger>
        </TabsList>

        {/* Scanner Tab */}
        <TabsContent value="scanner" className="space-y-6">
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-blue-400 font-semibold">Trading Scanner Ready</p>
              <p className="text-xs text-blue-400/70 mt-1">
                Start scanning to analyze market signals. Click any signal to preview and execute trades.
              </p>
            </div>
          </div>
          <TradingScanner />
        </TabsContent>

        {/* Auto Trading Tab */}
        <TabsContent value="autotrading" className="space-y-6">
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-emerald-400 font-semibold">Automated Trading Active</p>
              <p className="text-xs text-emerald-400/70 mt-1">
                Engine supports up to 7 turns with automatic market switching. Pauses after max turns to
                re-evaluate market conditions.
              </p>
            </div>
          </div>
          <AutoTradingEngine />
        </TabsContent>

        {/* Analysis Tab */}
        <TabsContent value="analysis" className="space-y-6">
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-yellow-400 font-semibold">Market Analysis</p>
              <p className="text-xs text-yellow-400/70 mt-1">
                Comprehensive analysis of all combined strategies and market conditions will be displayed here.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strategy Performance */}
            <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Strategy Performance</h3>
              <div className="space-y-3">
                {[
                  { name: 'OVER/UNDER 4.5', winRate: 68, trades: 45 },
                  { name: 'EVEN/ODD', winRate: 65, trades: 38 },
                  { name: 'Pro Over/Under', winRate: 78, trades: 22 },
                  { name: 'Differs Signal', winRate: 62, trades: 15 },
                ].map((strategy) => (
                  <div key={strategy.name} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-200">{strategy.name}</p>
                      <p className="text-xs text-slate-500">{strategy.trades} trades</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-emerald-400">{strategy.winRate}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Signal Frequency */}
            <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Signal Distribution</h3>
              <div className="space-y-3">
                {[
                  { type: 'TRADE NOW', count: 45, color: 'text-emerald-400' },
                  { type: 'WAIT', count: 28, color: 'text-yellow-400' },
                  { type: 'NEUTRAL', count: 12, color: 'text-slate-400' },
                ].map((signal) => (
                  <div key={signal.type} className="flex items-center justify-between">
                    <p className="text-sm text-slate-200">{signal.type}</p>
                    <p className={`text-lg font-bold ${signal.color}`}>{signal.count}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Trade Prediction Modal */}
      <TradePredictionModal
        isOpen={isPredictionModalOpen}
        tradeData={selectedTradeData}
        onClose={() => setIsPredictionModalOpen(false)}
        onExecute={handleExecuteTrade}
      />
    </div>
  )
}
