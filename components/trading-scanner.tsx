'use client'

import React, { useState, useEffect, useRef } from 'react'
import { AlertCircle, Zap, TrendingUp, Play, Pause, RotateCcw } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

interface Signal {
  id: string
  type: string
  status: string
  probability: number
  confidence: number
  recommendation: string
  entryCondition: string
  timestamp: string
}

interface ScannerState {
  isScanning: boolean
  signals: Signal[]
  scanProgress: number
  lastScanTime: string | null
  marketCount: number
  activeSignals: number
}

export function TradingScanner() {
  const [state, setState] = useState<ScannerState>({
    isScanning: false,
    signals: [],
    scanProgress: 0,
    lastScanTime: null,
    marketCount: 0,
    activeSignals: 0,
  })

  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const progressRef = useRef(0)

  // Simulate scanning process
  const startScan = () => {
    setState((prev) => ({ ...prev, isScanning: true, scanProgress: 0 }))
    progressRef.current = 0

    // Simulate progressive scanning
    const progressInterval = setInterval(() => {
      progressRef.current += Math.random() * 15
      if (progressRef.current >= 100) {
        progressRef.current = 100
        clearInterval(progressInterval)
        completeScan()
      } else {
        setState((prev) => ({ ...prev, scanProgress: Math.min(progressRef.current, 99) }))
      }
    }, 300)
  }

  const completeScan = () => {
    // Generate mock signals for demonstration
    const mockSignals: Signal[] = [
      {
        id: '1',
        type: 'OVER_4.5',
        status: 'TRADE NOW',
        probability: 78,
        confidence: 9,
        recommendation: 'Strong OVER 4.5 bias detected - 78% probability',
        entryCondition: 'Wait for confirmation on next tick',
        timestamp: new Date().toISOString(),
      },
      {
        id: '2',
        type: 'EVEN_ODD',
        status: 'TRADE NOW',
        probability: 72,
        confidence: 8,
        recommendation: 'Strong EVEN bias - 72% probability',
        entryCondition: 'Enter after 2 consecutive ODD digits',
        timestamp: new Date().toISOString(),
      },
      {
        id: '3',
        type: 'PRO_OVER_1',
        status: 'TRADE NOW',
        probability: 85,
        confidence: 9,
        recommendation: 'Extreme OVER 1 signal detected',
        entryCondition: 'Enter immediately on trigger',
        timestamp: new Date().toISOString(),
      },
      {
        id: '4',
        type: 'UNDER_8',
        status: 'WAIT',
        probability: 65,
        confidence: 7,
        recommendation: 'UNDER 8 conditions met - monitoring',
        entryCondition: 'Wait for stronger confirmation',
        timestamp: new Date().toISOString(),
      },
      {
        id: '5',
        type: 'DIFFERS',
        status: 'WAIT',
        probability: 58,
        confidence: 6,
        recommendation: 'Weak differs signal',
        entryCondition: 'Monitor for improvement',
        timestamp: new Date().toISOString(),
      },
    ]

    const highConfidenceSignals = mockSignals.filter((s) => s.confidence >= 7)

    setState((prev) => ({
      ...prev,
      signals: mockSignals.sort((a, b) => b.confidence - a.confidence),
      scanProgress: 100,
      lastScanTime: new Date().toLocaleTimeString(),
      marketCount: 12,
      activeSignals: highConfidenceSignals.length,
      isScanning: false,
    }))
  }

  const stopScan = () => {
    setState((prev) => ({ ...prev, isScanning: false }))
  }

  const resetScanner = () => {
    setState({
      isScanning: false,
      signals: [],
      scanProgress: 0,
      lastScanTime: null,
      marketCount: 0,
      activeSignals: 0,
    })
  }

  const getConfidenceBadgeColor = (confidence: number) => {
    if (confidence >= 8) return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
    if (confidence >= 7) return 'bg-blue-500/10 text-blue-400 border-blue-500/30'
    if (confidence >= 6) return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
    return 'bg-gray-500/10 text-gray-400 border-gray-500/30'
  }

  const getStatusColor = (status: string) => {
    if (status === 'TRADE NOW') return 'bg-emerald-500/10 text-emerald-400'
    if (status === 'WAIT') return 'bg-yellow-500/10 text-yellow-400'
    return 'bg-gray-500/10 text-gray-400'
  }

  return (
    <div className="space-y-6">
      {/* Scanner Controls */}
      <Card className="border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-transparent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-emerald-400" />
            AI Trading Scanner
          </CardTitle>
          <CardDescription>Real-time signal analysis across all markets</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Scanner Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
              <div className="text-sm text-slate-400">Status</div>
              <div className="text-2xl font-bold text-emerald-400 mt-1">
                {state.isScanning ? 'SCANNING' : 'READY'}
              </div>
            </div>
            <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
              <div className="text-sm text-slate-400">Markets Scanned</div>
              <div className="text-2xl font-bold text-blue-400 mt-1">{state.marketCount}</div>
            </div>
            <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
              <div className="text-sm text-slate-400">Active Signals</div>
              <div className="text-2xl font-bold text-yellow-400 mt-1">{state.activeSignals}</div>
            </div>
            <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
              <div className="text-sm text-slate-400">Last Scan</div>
              <div className="text-lg font-bold text-slate-200 mt-1">
                {state.lastScanTime || 'Never'}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          {state.isScanning && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-300">Scanning Progress</span>
                <span className="text-emerald-400">{Math.round(state.scanProgress)}%</span>
              </div>
              <Progress value={state.scanProgress} className="h-2 bg-slate-800" />
            </div>
          )}

          {/* Controls */}
          <div className="flex gap-3">
            <Button
              onClick={startScan}
              disabled={state.isScanning}
              className="bg-emerald-600 hover:bg-emerald-700 text-white flex-1"
            >
              <Play className="w-4 h-4 mr-2" />
              Start Scan
            </Button>
            <Button
              onClick={stopScan}
              disabled={!state.isScanning}
              variant="outline"
              className="flex-1"
            >
              <Pause className="w-4 h-4 mr-2" />
              Pause
            </Button>
            <Button onClick={resetScanner} variant="outline" className="flex-1">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Signals Display */}
      {state.signals.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Trade Signals ({state.signals.length})</h3>
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400">
              {state.signals.filter((s) => s.status === 'TRADE NOW').length} Ready to Trade
            </Badge>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All Signals</TabsTrigger>
              <TabsTrigger value="ready">Ready to Trade</TabsTrigger>
              <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-3 mt-4">
              {state.signals.map((signal) => (
                <SignalCard key={signal.id} signal={signal} onSelectSignal={() => {}} />
              ))}
            </TabsContent>

            <TabsContent value="ready" className="space-y-3 mt-4">
              {state.signals
                .filter((s) => s.status === 'TRADE NOW')
                .map((signal) => (
                  <SignalCard key={signal.id} signal={signal} onSelectSignal={() => {}} />
                ))}
            </TabsContent>

            <TabsContent value="monitoring" className="space-y-3 mt-4">
              {state.signals
                .filter((s) => s.status === 'WAIT')
                .map((signal) => (
                  <SignalCard key={signal.id} signal={signal} onSelectSignal={() => {}} />
                ))}
            </TabsContent>
          </Tabs>
        </div>
      )}

      {/* Empty State */}
      {!state.isScanning && state.signals.length === 0 && state.lastScanTime && (
        <Card className="border-slate-700 bg-slate-900/30">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="w-12 h-12 text-slate-500 mb-4" />
            <p className="text-slate-400">No signals found in last scan</p>
            <p className="text-sm text-slate-500 mt-1">Run another scan or adjust parameters</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function SignalCard({
  signal,
  onSelectSignal,
}: {
  signal: Signal
  onSelectSignal: (signal: Signal) => void
}) {
  const getConfidenceBadgeColor = (confidence: number) => {
    if (confidence >= 8) return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
    if (confidence >= 7) return 'bg-blue-500/10 text-blue-400 border-blue-500/30'
    if (confidence >= 6) return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
    return 'bg-gray-500/10 text-gray-400 border-gray-500/30'
  }

  return (
    <Card className="border-slate-700 hover:border-emerald-500/50 transition-colors cursor-pointer">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <h4 className="font-semibold text-white">{signal.type}</h4>
              <p className="text-sm text-slate-400">{signal.recommendation}</p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Badge className={getConfidenceBadgeColor(signal.confidence)}>
              Confidence: {signal.confidence}/9
            </Badge>
            <Badge className={signal.status === 'TRADE NOW' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-yellow-500/10 text-yellow-400'}>
              {signal.status}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-3">
          <div>
            <div className="text-xs text-slate-500">Probability</div>
            <div className="text-lg font-semibold text-blue-400">{signal.probability}%</div>
          </div>
          <div>
            <div className="text-xs text-slate-500">Type</div>
            <div className="text-sm text-slate-300">{signal.type}</div>
          </div>
          <div>
            <div className="text-xs text-slate-500">Time</div>
            <div className="text-sm text-slate-300">{new Date(signal.timestamp).toLocaleTimeString()}</div>
          </div>
        </div>

        <div className="bg-slate-900/50 rounded p-2 mb-3">
          <p className="text-xs text-slate-300">
            <span className="text-slate-400">Entry Condition:</span> {signal.entryCondition}
          </p>
        </div>

        <Button onClick={() => onSelectSignal(signal)} className="w-full bg-emerald-600 hover:bg-emerald-700">
          <TrendingUp className="w-4 h-4 mr-2" />
          Trade This Signal
        </Button>
      </CardContent>
    </Card>
  )
}
