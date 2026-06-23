'use client'

import React, { useState, useEffect } from 'react'
import {
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Target,
  Shield,
  Zap,
  X,
  Check,
  Clock,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export interface TradeData {
  market: string
  tradeType: 'OVER' | 'UNDER' | 'EVEN' | 'ODD'
  entryPrice: number
  expectedProfit: number
  riskRewardRatio: number
  winProbability: number
  timeToTarget: number
  tpTicks: number
  slTicks: number
}

interface TradePredictionModalProps {
  isOpen: boolean
  tradeData: TradeData | null
  onClose: () => void
  onExecute: (tradeData: TradeData) => void
}

export function TradePredictionModal({
  isOpen,
  tradeData,
  onClose,
  onExecute,
}: TradePredictionModalProps) {
  const [selectedTrade, setSelectedTrade] = useState<TradeData | null>(tradeData)
  const [executionStep, setExecutionStep] = useState(0)

  useEffect(() => {
    setSelectedTrade(tradeData)
    setExecutionStep(0)
  }, [tradeData])

  if (!selectedTrade) return null

  const profitToLoss = selectedTrade.expectedProfit / 25 // Assuming 1:1 ratio base
  const riskAmount = 10
  const potentialProfit = riskAmount * selectedTrade.riskRewardRatio

  const executionSteps = [
    { label: 'Prepare', status: 'complete' },
    { label: 'Calculate', status: executionStep >= 1 ? 'complete' : 'pending' },
    { label: 'Confirm', status: executionStep >= 2 ? 'complete' : 'pending' },
    { label: 'Execute', status: executionStep >= 3 ? 'complete' : 'pending' },
  ]

  const handleExecuteTrade = () => {
    setExecutionStep(1)
    setTimeout(() => setExecutionStep(2), 500)
    setTimeout(() => setExecutionStep(3), 1000)
    setTimeout(() => setExecutionStep(4), 1500)
    setTimeout(() => {
      onExecute(selectedTrade)
      onClose()
    }, 2000)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-gradient-to-br from-slate-950 to-slate-900 border-emerald-500/20">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-emerald-400">
            <Zap className="w-5 h-5" />
            Trade Prediction & Execution
          </DialogTitle>
          <DialogDescription>Analyze and execute trade with auto-calculated TP/SL</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="prediction" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="prediction">Prediction</TabsTrigger>
            <TabsTrigger value="execution">Execution</TabsTrigger>
          </TabsList>

          {/* Prediction Tab */}
          <TabsContent value="prediction" className="space-y-4 mt-4">
            {/* Trade Type & Market */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="border-slate-700 bg-slate-900/50">
                <CardContent className="p-4">
                  <div className="text-sm text-slate-400 mb-1">Market Type</div>
                  <div className="text-2xl font-bold text-blue-400">{selectedTrade.market}</div>
                </CardContent>
              </Card>
              <Card className="border-slate-700 bg-slate-900/50">
                <CardContent className="p-4">
                  <div className="text-sm text-slate-400 mb-1">Trade Type</div>
                  <div className="flex items-center gap-2">
                    {selectedTrade.tradeType.startsWith('O') ? (
                      <TrendingUp className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-red-400" />
                    )}
                    <span className="text-2xl font-bold text-slate-200">{selectedTrade.tradeType}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Entry Logic */}
            <Card className="border-slate-700 bg-slate-900/50">
              <CardContent className="p-4">
                <h4 className="font-semibold text-white mb-2">Entry Logic</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Entry Point</span>
                    <span className="text-blue-400 font-mono">${selectedTrade.entryPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Trade Direction</span>
                    <Badge className={selectedTrade.tradeType === 'OVER' || selectedTrade.tradeType === 'ODD' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}>
                      {selectedTrade.tradeType === 'OVER' || selectedTrade.tradeType === 'ODD' ? 'Bullish' : 'Bearish'}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Confidence Level</span>
                    <Badge className="bg-emerald-500/10 text-emerald-400">{selectedTrade.winProbability}% Probability</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* TP & SL Configuration */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="border-emerald-500/30 bg-emerald-500/5">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-emerald-400" />
                    <h4 className="font-semibold text-emerald-400">Take Profit</h4>
                  </div>
                  <div className="text-sm text-slate-400 mb-1">Auto-Calculated</div>
                  <div className="text-2xl font-bold text-emerald-400">${(selectedTrade.entryPrice + 0.05).toFixed(2)}</div>
                  <div className="text-xs text-slate-500 mt-1">{selectedTrade.tpTicks} ticks away</div>
                </CardContent>
              </Card>

              <Card className="border-red-500/30 bg-red-500/5">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-red-400" />
                    <h4 className="font-semibold text-red-400">Stop Loss</h4>
                  </div>
                  <div className="text-sm text-slate-400 mb-1">Auto-Calculated</div>
                  <div className="text-2xl font-bold text-red-400">${(selectedTrade.entryPrice - 0.03).toFixed(2)}</div>
                  <div className="text-xs text-slate-500 mt-1">{selectedTrade.slTicks} ticks away</div>
                </CardContent>
              </Card>
            </div>

            {/* Risk/Reward Analysis */}
            <Card className="border-slate-700 bg-slate-900/50">
              <CardContent className="p-4">
                <h4 className="font-semibold text-white mb-3">Risk/Reward Analysis</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Risk Amount</span>
                    <span className="text-red-400 font-mono">-${riskAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Potential Profit</span>
                    <span className="text-emerald-400 font-mono">+${potentialProfit.toFixed(2)}</span>
                  </div>
                  <div className="h-px bg-slate-700 my-2" />
                  <div className="flex justify-between font-semibold">
                    <span className="text-slate-300">Risk/Reward Ratio</span>
                    <span className="text-blue-400">{selectedTrade.riskRewardRatio.toFixed(2)}:1</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Execution Tab */}
          <TabsContent value="execution" className="space-y-4 mt-4">
            {/* Execution Steps */}
            <Card className="border-slate-700 bg-slate-900/50">
              <CardContent className="p-4">
                <h4 className="font-semibold text-white mb-4">Execution Progress</h4>
                <div className="space-y-3">
                  {executionSteps.map((step, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                          step.status === 'complete'
                            ? 'bg-emerald-500 text-white'
                            : step.status === 'pending'
                              ? 'bg-yellow-500 text-white'
                              : 'bg-slate-700 text-slate-400'
                        }`}
                      >
                        {step.status === 'complete' ? <Check className="w-4 h-4" /> : idx + 1}
                      </div>
                      <span className={step.status === 'complete' ? 'text-emerald-400 font-semibold' : 'text-slate-300'}>
                        {step.label}
                      </span>
                      {step.status === 'complete' && <Check className="w-4 h-4 text-emerald-400 ml-auto" />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Auto-Inputs Display */}
            <Card className="border-emerald-500/20 bg-emerald-500/5">
              <CardContent className="p-4">
                <h4 className="font-semibold text-emerald-400 mb-3 flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Auto-Populated Inputs
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center p-2 bg-slate-900/50 rounded">
                    <span className="text-slate-400">Market Type</span>
                    <span className="text-emerald-400 font-mono font-semibold">{selectedTrade.market}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-slate-900/50 rounded">
                    <span className="text-slate-400">Trade Type</span>
                    <span className="text-blue-400 font-mono font-semibold">{selectedTrade.tradeType}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-slate-900/50 rounded">
                    <span className="text-slate-400">Entry Price</span>
                    <span className="text-yellow-400 font-mono font-semibold">${selectedTrade.entryPrice.toFixed(4)}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-slate-900/50 rounded">
                    <span className="text-slate-400">Take Profit (Ticks)</span>
                    <span className="text-emerald-400 font-mono font-semibold">{selectedTrade.tpTicks}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-slate-900/50 rounded">
                    <span className="text-slate-400">Stop Loss (Ticks)</span>
                    <span className="text-red-400 font-mono font-semibold">{selectedTrade.slTicks}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Trade Summary */}
            <Card className="border-slate-700 bg-slate-900/50">
              <CardContent className="p-4">
                <h4 className="font-semibold text-white mb-3">Trade Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Win Probability</span>
                    <Badge className="bg-emerald-500/10 text-emerald-400">{selectedTrade.winProbability}%</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Time to Target</span>
                    <span className="text-blue-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {selectedTrade.timeToTarget}s
                    </span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span className="text-slate-300">Ready to Execute</span>
                    <Badge className="bg-emerald-500 text-white">✓ All Set</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-slate-700">
          <Button variant="outline" onClick={onClose} className="flex-1">
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button
            onClick={handleExecuteTrade}
            disabled={executionStep >= 4}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700"
          >
            {executionStep >= 4 ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Trade Executed
              </>
            ) : (
              <>
                <TrendingUp className="w-4 h-4 mr-2" />
                Execute Trade
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
