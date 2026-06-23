'use client'

import React, { useState, useEffect, useRef } from 'react'
import {
  AlertCircle,
  Play,
  Pause,
  RotateCcw,
  TrendingUp,
  TrendingDown,
  Target,
  Shield,
  Zap,
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface ActiveTrade {
  id: string
  market: string
  tradeType: string
  entryPrice: number
  currentPrice: number
  takeProfit: number
  stopLoss: number
  profit: number
  profitPercentage: number
  status: 'pending' | 'open' | 'tp_hit' | 'sl_hit' | 'closed'
  turnNumber: number
  executedAt: string
  currentDrawdown: number
}

interface AutoTradingState {
  isRunning: boolean
  totalTurns: number
  maxTurns: number
  currentTurn: number
  activeTrades: ActiveTrade[]
  totalProfit: number
  winRate: number
  lastUpdate: string
  isPaused: boolean
  selectedMarket: string
}

export function AutoTradingEngine() {
  const [state, setState] = useState<AutoTradingState>({
    isRunning: false,
    totalTurns: 0,
    maxTurns: 7,
    currentTurn: 0,
    activeTrades: [],
    totalProfit: 0,
    winRate: 65,
    lastUpdate: '',
    isPaused: false,
    selectedMarket: 'EURUSD',
  })

  const updateIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const mockTradeRef = useRef<ActiveTrade | null>(null)

  const startAutoTrading = () => {
    setState((prev) => ({
      ...prev,
      isRunning: true,
      isPaused: false,
      currentTurn: prev.currentTurn + 1,
    }))

    // Create initial trade
    const trade: ActiveTrade = {
      id: `trade_${Date.now()}`,
      market: state.selectedMarket,
      tradeType: Math.random() > 0.5 ? 'OVER' : 'UNDER',
      entryPrice: 1.0875 + Math.random() * 0.005,
      currentPrice: 1.0875 + Math.random() * 0.005,
      takeProfit: 1.0925,
      stopLoss: 1.0825,
      profit: 0,
      profitPercentage: 0,
      status: 'pending',
      turnNumber: state.currentTurn + 1,
      executedAt: new Date().toISOString(),
      currentDrawdown: 0,
    }

    setState((prev) => ({
      ...prev,
      activeTrades: [trade, ...prev.activeTrades].slice(0, 5), // Keep last 5 trades
    }))

    mockTradeRef.current = trade

    // Simulate trade progression
    let updateCount = 0
    updateIntervalRef.current = setInterval(() => {
      updateCount++

      setState((prev) => {
        if (!mockTradeRef.current) return prev

        const updatedTrade = { ...mockTradeRef.current }
        const random = Math.random()

        // Simulate price movement
        updatedTrade.currentPrice += (random - 0.5) * 0.0002

        // Calculate profit
        const priceDiff = updatedTrade.currentPrice - updatedTrade.entryPrice
        updatedTrade.profit = priceDiff * 100 // Simplified calculation
        updatedTrade.profitPercentage = (priceDiff / updatedTrade.entryPrice) * 100

        // Check TP/SL
        if (updatedTrade.currentPrice >= updatedTrade.takeProfit) {
          updatedTrade.status = 'tp_hit'
          updatedTrade.profit = 50 // TP hit profit
          updatedTrade.profitPercentage = 0.5
          clearInterval(updateIntervalRef.current!)
        } else if (updatedTrade.currentPrice <= updatedTrade.stopLoss) {
          updatedTrade.status = 'sl_hit'
          updatedTrade.profit = -25 // SL hit loss
          updatedTrade.profitPercentage = -0.25
          clearInterval(updateIntervalRef.current!)
        }

        if (updatedTrade.status !== 'pending' && updatedTrade.status !== 'open') {
          updatedTrade.status = 'closed'
        } else if (updateCount === 1) {
          updatedTrade.status = 'open'
        }

        mockTradeRef.current = updatedTrade

        // Update trades in state
        const updatedTrades = prev.activeTrades.map((t) =>
          t.id === updatedTrade.id ? updatedTrade : t
        )

        const closedTrades = updatedTrades.filter((t) => t.status === 'closed')
        const profitableTrades = closedTrades.filter((t) => t.profit > 0)

        return {
          ...prev,
          activeTrades: updatedTrades,
          totalProfit: prev.totalProfit + updatedTrade.profit,
          winRate:
            closedTrades.length > 0
              ? Math.round((profitableTrades.length / closedTrades.length) * 100)
              : prev.winRate,
          lastUpdate: new Date().toLocaleTimeString(),
        }
      })
    }, 500)
  }

  const pauseAutoTrading = () => {
    setState((prev) => ({ ...prev, isPaused: !prev.isPaused }))
    if (updateIntervalRef.current && state.isPaused) {
      // Resume
      startAutoTrading()
    }
  }

  const stopAutoTrading = () => {
    if (updateIntervalRef.current) {
      clearInterval(updateIntervalRef.current)
    }

    setState((prev) => ({
      ...prev,
      isRunning: false,
      isPaused: false,
      activeTrades: prev.activeTrades.map((t) => ({ ...t, status: 'closed' })),
    }))
  }

  const switchMarket = (newMarket: string) => {
    if (state.isRunning) {
      stopAutoTrading()
    }
    setState((prev) => ({
      ...prev,
      selectedMarket: newMarket,
      currentTurn: 0,
      activeTrades: [],
      totalProfit: 0,
    }))
  }

  const resetSession = () => {
    stopAutoTrading()
    setState({
      isRunning: false,
      totalTurns: 0,
      maxTurns: 7,
      currentTurn: 0,
      activeTrades: [],
      totalProfit: 0,
      winRate: 65,
      lastUpdate: '',
      isPaused: false,
      selectedMarket: 'EURUSD',
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'tp_hit':
        return <CheckCircle className="w-4 h-4 text-emerald-400" />
      case 'sl_hit':
        return <XCircle className="w-4 h-4 text-red-400" />
      case 'open':
        return <Loader2 className="w-4 h-4 text-yellow-400 animate-spin" />
      case 'pending':
        return <Clock className="w-4 h-4 text-slate-400" />
      default:
        return <CheckCircle className="w-4 h-4 text-slate-400" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Engine Controls */}
      <Card className="border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-transparent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-400" />
            Auto Trading Engine
          </CardTitle>
          <CardDescription>Automated multi-turn trading with turn management</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Control Panel */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
              <div className="text-sm text-slate-400">Engine Status</div>
              <div className="text-2xl font-bold mt-1">
                <Badge
                  className={
                    state.isRunning
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : 'bg-slate-700 text-slate-300'
                  }
                >
                  {state.isRunning ? 'ACTIVE' : 'INACTIVE'}
                </Badge>
              </div>
            </div>
            <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
              <div className="text-sm text-slate-400">Turn Progress</div>
              <div className="text-2xl font-bold text-blue-400 mt-1">
                {state.currentTurn}/{state.maxTurns}
              </div>
            </div>
            <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
              <div className="text-sm text-slate-400">Total Profit/Loss</div>
              <div
                className={`text-2xl font-bold mt-1 ${
                  state.totalProfit >= 0 ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                ${state.totalProfit.toFixed(2)}
              </div>
            </div>
            <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
              <div className="text-sm text-slate-400">Win Rate</div>
              <div className="text-2xl font-bold text-yellow-400 mt-1">{state.winRate}%</div>
            </div>
          </div>

          {/* Turn Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-300">Turn Progress</span>
              <span className="text-blue-400">
                {Math.round((state.currentTurn / state.maxTurns) * 100)}%
              </span>
            </div>
            <Progress
              value={(state.currentTurn / state.maxTurns) * 100}
              className="h-2 bg-slate-800"
            />
          </div>

          {/* Market Selection */}
          <div>
            <label className="text-sm text-slate-400 mb-2 block">Select Market</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {['EURUSD', 'GBPUSD', 'USDJPY', 'AUDUSD'].map((market) => (
                <Button
                  key={market}
                  onClick={() => switchMarket(market)}
                  variant={state.selectedMarket === market ? 'default' : 'outline'}
                  disabled={state.isRunning}
                  className="text-sm"
                >
                  {market}
                </Button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={startAutoTrading}
              disabled={state.isRunning || state.currentTurn >= state.maxTurns}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700"
            >
              <Play className="w-4 h-4 mr-2" />
              {state.currentTurn >= state.maxTurns ? 'Max Turns Reached' : 'Start Trading'}
            </Button>
            <Button
              onClick={pauseAutoTrading}
              disabled={!state.isRunning}
              variant="outline"
              className="flex-1"
            >
              <Pause className="w-4 h-4 mr-2" />
              {state.isPaused ? 'Resume' : 'Pause'}
            </Button>
            <Button onClick={stopAutoTrading} disabled={!state.isRunning} variant="outline" className="flex-1">
              <XCircle className="w-4 h-4 mr-2" />
              Stop
            </Button>
            <Button onClick={resetSession} variant="outline" className="flex-1">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>

          {state.currentTurn >= state.maxTurns && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-yellow-400 font-semibold">Maximum Turns Reached</p>
                <p className="text-xs text-yellow-400/70 mt-1">
                  Session has completed all {state.maxTurns} turns. Review results or reset to continue.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Active Trades */}
      {state.activeTrades.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Trade History (Last 5)</h3>

          <Tabs defaultValue="active" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="active">
                Active ({state.activeTrades.filter((t) => t.status === 'open').length})
              </TabsTrigger>
              <TabsTrigger value="closed">
                Closed ({state.activeTrades.filter((t) => t.status === 'closed').length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="space-y-3 mt-4">
              {state.activeTrades
                .filter((t) => t.status !== 'closed')
                .map((trade) => (
                  <TradeCard key={trade.id} trade={trade} />
                ))}
              {state.activeTrades.filter((t) => t.status !== 'closed').length === 0 && (
                <div className="text-center py-8 text-slate-400">
                  No active trades
                </div>
              )}
            </TabsContent>

            <TabsContent value="closed" className="space-y-3 mt-4">
              {state.activeTrades
                .filter((t) => t.status === 'closed')
                .map((trade) => (
                  <TradeCard key={trade.id} trade={trade} />
                ))}
              {state.activeTrades.filter((t) => t.status === 'closed').length === 0 && (
                <div className="text-center py-8 text-slate-400">
                  No closed trades
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  )
}

function TradeCard({ trade }: { trade: ActiveTrade }) {
  const isProfitable = trade.profit > 0
  const isClosing = trade.status === 'tp_hit' || trade.status === 'sl_hit'

  return (
    <Card className={`border-slate-700 ${trade.status === 'tp_hit' ? 'border-emerald-500/30' : trade.status === 'sl_hit' ? 'border-red-500/30' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            {trade.tradeType === 'OVER' ? (
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            ) : (
              <TrendingDown className="w-5 h-5 text-red-400" />
            )}
            <div>
              <h4 className="font-semibold text-white">
                {trade.tradeType} - {trade.market}
              </h4>
              <p className="text-xs text-slate-400">Turn {trade.turnNumber}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getStatusIcon(trade.status)}
            <Badge
              className={
                trade.status === 'tp_hit'
                  ? 'bg-emerald-500/10 text-emerald-400'
                  : trade.status === 'sl_hit'
                    ? 'bg-red-500/10 text-red-400'
                    : trade.status === 'open'
                      ? 'bg-yellow-500/10 text-yellow-400'
                      : 'bg-slate-700 text-slate-300'
              }
            >
              {trade.status.toUpperCase()}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3 text-sm">
          <div>
            <div className="text-xs text-slate-500">Entry</div>
            <div className="font-mono text-slate-200">${trade.entryPrice.toFixed(4)}</div>
          </div>
          <div>
            <div className="text-xs text-slate-500">Current</div>
            <div className="font-mono text-slate-200">${trade.currentPrice.toFixed(4)}</div>
          </div>
          <div>
            <div className="text-xs text-slate-500">TP Target</div>
            <div className="font-mono text-emerald-400">${trade.takeProfit.toFixed(4)}</div>
          </div>
          <div>
            <div className="text-xs text-slate-500">SL Level</div>
            <div className="font-mono text-red-400">${trade.stopLoss.toFixed(4)}</div>
          </div>
        </div>

        <div className="bg-slate-900/50 rounded p-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Profit/Loss</span>
            <span className={`font-mono font-semibold ${isProfitable ? 'text-emerald-400' : 'text-red-400'}`}>
              {isProfitable ? '+' : ''}${trade.profit.toFixed(2)} ({trade.profitPercentage.toFixed(2)}%)
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function getStatusIcon(status: string) {
  switch (status) {
    case 'tp_hit':
      return <CheckCircle className="w-4 h-4 text-emerald-400" />
    case 'sl_hit':
      return <XCircle className="w-4 h-4 text-red-400" />
    case 'open':
      return <Loader2 className="w-4 h-4 text-yellow-400 animate-spin" />
    case 'pending':
      return <Clock className="w-4 h-4 text-slate-400" />
    default:
      return <CheckCircle className="w-4 h-4 text-slate-400" />
  }
}
