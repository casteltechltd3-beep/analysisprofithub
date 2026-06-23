import { EventEmitter } from 'events'
import type { DerivAPIClient } from './deriv-api'

export interface Signal {
  type: 'EVEN' | 'ODD' | 'OVER' | 'UNDER' | 'DIFFERS' | 'MATCHES' | 'RISE' | 'FALL'
  confidence: number // 0-100
  probability: number // 0-1
  entry: string
  market: string
}

export interface Trade {
  id: string
  signal: Signal
  stake: number
  contractType: string
  status: 'pending' | 'won' | 'lost'
  profit: number
  timestamp: Date
}

export class SignalBasedExecutor extends EventEmitter {
  private apiClient: DerivAPIClient
  private activeTrades: Map<string, Trade> = new Map()
  private tradeHistory: Trade[] = []
  private stats = { wins: 0, losses: 0, profit: 0 }
  private minConfidence: number

  constructor(apiClient: DerivAPIClient, minConfidence: number = 55) {
    super()
    this.apiClient = apiClient
    this.minConfidence = minConfidence
  }

  async executeSignal(signal: Signal, stake: number, symbol: string): Promise<Trade | null> {
    try {
      // Only execute if confidence meets threshold
      if (signal.confidence < this.minConfidence) {
        console.log(`[v0] Signal confidence ${signal.confidence}% below threshold ${this.minConfidence}%`)
        return null
      }

      console.log(`[v0] Executing signal: ${signal.type} with ${signal.confidence}% confidence`)

      // Map signal type to contract type
      const contractMap: Record<string, string> = {
        'EVEN': 'DIGITEVEN',
        'ODD': 'DIGITODD',
        'OVER': 'DIGITOVER',
        'UNDER': 'DIGITUNDER',
        'DIFFERS': 'DIGITDIFF',
        'MATCHES': 'DIGITMAT',
        'RISE': 'CALL',
        'FALL': 'PUT',
      }

      const contractType = contractMap[signal.type]
      if (!contractType) {
        console.error(`[v0] Unknown signal type: ${signal.type}`)
        return null
      }

      // Get proposal
      const proposal = await this.apiClient.getProposal({
        symbol,
        contract_type: contractType,
        amount: stake,
        basis: 'stake',
        duration: 5,
        duration_unit: 't',
        currency: 'USD',
      })

      console.log(`[v0] Proposal received: ${proposal.id}, Ask: $${proposal.ask_price}`)

      // Buy contract
      const buyResponse = await this.apiClient.buyContract(proposal.id, proposal.ask_price)
      console.log(`[v0] Contract bought: ID ${buyResponse.contract_id}`)

      // Create trade record
      const trade: Trade = {
        id: buyResponse.contract_id.toString(),
        signal,
        stake,
        contractType,
        status: 'pending',
        profit: 0,
        timestamp: new Date(),
      }

      this.activeTrades.set(trade.id, trade)
      this.emit('trade-executed', trade)

      // Monitor contract
      this.monitorContract(buyResponse.contract_id, buyResponse.buy_price, buyResponse.payout)

      return trade
    } catch (error) {
      console.error('[v0] Trade execution error:', error)
      this.emit('trade-error', error)
      return null
    }
  }

  private async monitorContract(contractId: number, buyPrice: number, payout: number): Promise<void> {
    // Poll for contract result
    let attempts = 0
    const maxAttempts = 60

    const checkResult = async () => {
      try {
        const result = await this.apiClient.getContractResult(contractId)

        if (result.status === 'won') {
          const profit = result.payout - buyPrice
          this.updateTrade(contractId, 'won', profit)
          this.stats.wins++
          this.stats.profit += profit
        } else if (result.status === 'lost') {
          const profit = -buyPrice
          this.updateTrade(contractId, 'lost', profit)
          this.stats.losses++
          this.stats.profit += profit
        } else if (result.status === 'pending' && attempts < maxAttempts) {
          attempts++
          setTimeout(checkResult, 500)
        }
      } catch (error) {
        console.error('[v0] Error checking contract result:', error)
      }
    }

    checkResult()
  }

  private updateTrade(contractId: number, status: 'won' | 'lost', profit: number): void {
    const tradeId = contractId.toString()
    const trade = this.activeTrades.get(tradeId)

    if (trade) {
      trade.status = status
      trade.profit = profit
      this.tradeHistory.push(trade)
      this.activeTrades.delete(tradeId)
      this.emit('trade-closed', trade)
    }
  }

  getStats() {
    return {
      ...this.stats,
      winRate: this.stats.wins + this.stats.losses > 0 
        ? (this.stats.wins / (this.stats.wins + this.stats.losses)) * 100 
        : 0,
      totalTrades: this.stats.wins + this.stats.losses,
    }
  }

  getTradeHistory() {
    return this.tradeHistory
  }
}
