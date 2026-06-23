import { EventEmitter } from 'events'
import type { DerivAPIClient } from './deriv-api'
import { SignalBasedExecutor } from './signal-based-executor'
import type { Signal } from './signal-based-executor'

export interface SmartAuto24Config {
  strategy: 'Even/Odd' | 'Over/Under' | 'Differs' | 'Matches'
  stake: number
  targetProfit: number
  maxTrades: number
  stopLossPercent: number
  symbol: string
  autoPilot: boolean
  autoMarketSwitch: boolean
}

export interface SmartAuto24Stats {
  totalTrades: number
  wins: number
  losses: number
  profit: number
  winRate: number
  currentRun: number
  maxRuns: number
}

export class SmartAuto24TradingEngine extends EventEmitter {
  private config: SmartAuto24Config
  private executor: SignalBasedExecutor
  private stats: SmartAuto24Stats
  private isRunning = false
  private signalBuffer: Signal[] = []
  private tradeQueue: Signal[] = []

  constructor(apiClient: DerivAPIClient, config: SmartAuto24Config) {
    super()
    this.config = config
    this.executor = new SignalBasedExecutor(apiClient, 55)
    this.stats = {
      totalTrades: 0,
      wins: 0,
      losses: 0,
      profit: 0,
      winRate: 0,
      currentRun: 0,
      maxRuns: config.maxTrades || 100,
    }

    this.executor.on('trade-executed', (trade) => {
      console.log(`[v0] SmartAuto24: Trade executed - ${trade.signal.type}`)
      this.emit('trade-executed', trade)
    })

    this.executor.on('trade-closed', (trade) => {
      this.updateStats(trade)
      this.emit('trade-closed', trade)
      this.processNextTrade()
    })

    this.executor.on('trade-error', (error) => {
      console.error('[v0] SmartAuto24: Trade error:', error)
      this.emit('trade-error', error)
    })
  }

  async start(): Promise<void> {
    if (this.isRunning) {
      console.log('[v0] SmartAuto24: Already running')
      return
    }

    this.isRunning = true
    this.stats.currentRun = 0
    console.log(`[v0] SmartAuto24: Starting ${this.config.strategy} trading engine`)
    this.emit('started')
  }

  async stop(): Promise<void> {
    this.isRunning = false
    this.tradeQueue = []
    console.log('[v0] SmartAuto24: Stopped')
    this.emit('stopped')
  }

  async processSignal(signal: Signal): Promise<void> {
    if (!this.isRunning) return

    console.log(`[v0] SmartAuto24: Processing signal - ${signal.type} (${signal.confidence}% confidence)`)

    // Only queue if confidence is sufficient
    if (signal.confidence >= 55) {
      this.tradeQueue.push(signal)
      this.processNextTrade()
    }
  }

  private async processNextTrade(): Promise<void> {
    if (!this.isRunning || this.tradeQueue.length === 0) return
    if (this.stats.currentRun >= this.stats.maxRuns) {
      console.log('[v0] SmartAuto24: Max trades reached')
      this.stop()
      return
    }

    const signal = this.tradeQueue.shift()
    if (!signal) return

    try {
      const trade = await this.executor.executeSignal(
        signal,
        this.config.stake,
        this.config.symbol
      )

      if (trade) {
        this.stats.currentRun++
        this.emit('trade-queued', { currentRun: this.stats.currentRun, trade })
      }
    } catch (error) {
      console.error('[v0] SmartAuto24: Error executing trade:', error)
    }
  }

  private updateStats(trade: any): void {
    if (trade.status === 'won') {
      this.stats.wins++
      this.stats.profit += trade.profit
    } else {
      this.stats.losses++
      this.stats.profit -= trade.stake
    }

    this.stats.totalTrades++
    this.stats.winRate = this.stats.totalTrades > 0
      ? (this.stats.wins / this.stats.totalTrades) * 100
      : 0

    this.emit('stats-updated', this.stats)
  }

  getStats(): SmartAuto24Stats {
    return { ...this.stats }
  }

  getConfig(): SmartAuto24Config {
    return { ...this.config }
  }

  isActive(): boolean {
    return this.isRunning
  }

  queuedTradesCount(): number {
    return this.tradeQueue.length
  }
}
