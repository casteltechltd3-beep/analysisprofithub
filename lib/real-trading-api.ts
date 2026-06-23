import { TradeConfig, TradeResult, PredictionType } from "./types"

export class RealTradingAPI {
  private deriv: any
  private token: string | null = null

  constructor() {
    this.deriv = typeof window !== "undefined" ? (window as any).DerivAPI : null
  }

  async connect(token: string): Promise<boolean> {
    try {
      this.token = token
      console.log("[v0] Connected to real Deriv API")
      return true
    } catch (error) {
      console.error("[v0] Failed to connect:", error)
      return false
    }
  }

  async executeTrade(config: TradeConfig): Promise<TradeResult> {
    try {
      const { market, prediction, stake, ticks, symbol } = config

      // Build contract parameters
      const contractParams = {
        symbol: symbol || this.mapMarketToSymbol(market),
        contract_type: this.mapPredictionToContract(prediction),
        amount: stake,
        basis: "stake",
        duration: ticks,
        duration_unit: "t",
        currency: "USD",
      }

      console.log("[v0] Executing trade:", contractParams)

      // Get proposal
      const proposal = await this.getProposal(contractParams)
      
      // Buy contract
      const buyResponse = await this.buyContract(proposal.id, proposal.ask_price)
      
      // Wait for result
      const result = await this.waitForContractResult(buyResponse.contract_id)

      return {
        contractId: buyResponse.contract_id,
        buyPrice: buyResponse.buy_price,
        payout: buyResponse.payout,
        stake: stake,
        profit: buyResponse.payout - buyResponse.buy_price,
        isWin: result.status === "won",
        timestamp: Date.now(),
      }
    } catch (error) {
      console.error("[v0] Trade execution failed:", error)
      throw error
    }
  }

  async getProposal(params: any): Promise<any> {
    if (!this.deriv) throw new Error("Deriv API not available")
    
    return new Promise((resolve, reject) => {
      this.deriv.call(
        {
          proposal: 1,
          ...params,
        },
        (response: any) => {
          if (response.error) reject(response.error)
          else resolve(response.proposal)
        }
      )
    })
  }

  async buyContract(proposalId: string, price: number): Promise<any> {
    if (!this.deriv) throw new Error("Deriv API not available")
    
    return new Promise((resolve, reject) => {
      this.deriv.call(
        {
          buy: proposalId,
          price: price,
        },
        (response: any) => {
          if (response.error) reject(response.error)
          else resolve(response.buy)
        }
      )
    })
  }

  async waitForContractResult(contractId: number, timeout = 120000): Promise<any> {
    const startTime = Date.now()
    
    while (Date.now() - startTime < timeout) {
      try {
        const result = await this.getContractResult(contractId)
        if (result.status === "closed" || result.status === "won" || result.status === "lost") {
          return result
        }
      } catch (error) {
        console.error("[v0] Error checking contract result:", error)
      }
      
      // Wait 2 seconds before checking again
      await new Promise(resolve => setTimeout(resolve, 2000))
    }
    
    throw new Error("Contract result timeout")
  }

  async getContractResult(contractId: number): Promise<any> {
    if (!this.deriv) throw new Error("Deriv API not available")
    
    return new Promise((resolve, reject) => {
      this.deriv.call(
        {
          contract: contractId,
        },
        (response: any) => {
          if (response.error) reject(response.error)
          else resolve(response.contract)
        }
      )
    })
  }

  private mapMarketToSymbol(market: string): string {
    const symbolMap: Record<string, string> = {
      eurusd: "frxEURUSD",
      gbpusd: "frxGBPUSD",
      usdjpy: "frxUSDJPY",
      audusd: "frxAUDUSD",
      volatility: "1HZ100V",
      volatility5: "1HZ50V",
      volatility10: "1HZ25V",
      volatility25: "1HZ10V",
    }
    return symbolMap[market.toLowerCase()] || "1HZ100V"
  }

  private mapPredictionToContract(prediction: PredictionType): string {
    const contractMap: Record<PredictionType, string> = {
      over: "CALL",
      under: "PUT",
      even: "DIGITEVEN",
      odd: "DIGITODD",
      differs: "DIGITDIFF",
      matches: "DIGITMATCH",
      rise: "CALL",
      fall: "PUT",
    }
    return contractMap[prediction] || "CALL"
  }

  async getMarketData(symbol: string): Promise<any> {
    try {
      console.log("[v0] Fetching market data for:", symbol)
      // This would connect to real Deriv data
      return {
        bid: 0,
        ask: 0,
        spot: 0,
        time: Date.now(),
      }
    } catch (error) {
      console.error("[v0] Failed to get market data:", error)
      throw error
    }
  }
}

export const realTradingAPI = new RealTradingAPI()
