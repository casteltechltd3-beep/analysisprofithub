export type PredictionType = "over" | "under" | "even" | "odd" | "differs" | "matches" | "rise" | "fall"

export interface TradeConfig {
  market: string
  prediction: PredictionType
  stake: number
  profit?: number
  stopLoss?: number
  ticks: number
  martingale?: boolean
  martingaleMultiplier?: number
  maxMartingaleLevels?: number
  symbol?: string
  entryPoint?: number
  autoPredict?: boolean
}

export interface TradeResult {
  contractId: number
  buyPrice: number
  payout: number
  stake: number
  profit: number
  isWin: boolean
  timestamp: number
}

export interface MarketAnalysis {
  market: string
  over1Percent: number
  over2Percent: number
  over3Percent: number
  under6Percent: number
  under7Percent: number
  under8Percent: number
  highestOverDigit: number
  highestUnderDigit: number
  evenPercent: number
  oddPercent: number
  consecutiveOdds: number
  consecutiveEvens: number
  highestMatchesDigit: number
  rareDigits: number[]
}

export interface PredictionInput {
  type: PredictionType
  entryDigit: number
  confidence: number
  lastN: number
}

export interface StatisticalAnalysis {
  winRate: number
  profitFactor: number
  averageProfit: number
  averageLoss: number
  sharpeRatio: number
  maxDrawdown: number
  payoutRatio: number
  recommendedStake: number
}
