'use server'

import { db } from '@/lib/db'
import { tradingSessions, signals, trades, tradeLogs, marketData } from '@/lib/db/schema'
import { eq, and, desc } from 'drizzle-orm'

// Create a new trading session
export async function createTradingSession(userId: string, market: string) {
  const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

  const result = await db
    .insert(tradingSessions)
    .values({
      id: sessionId,
      userId,
      market,
      status: 'active',
      totalTurns: 0,
      maxTurns: 7,
    })
    .returning()

  return result[0]
}

// Save a signal to database
export async function saveSignal(
  userId: string,
  sessionId: string,
  signalData: {
    market: string
    signalType: string
    status: string
    probability: number
    recommendation: string
    entryCondition: string
    confidence: number
    targetDigit?: number
    digitFrequencies?: any
    powerIndex?: any
  }
) {
  const signalId = `signal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

  const result = await db
    .insert(signals)
    .values({
      id: signalId,
      userId,
      sessionId,
      market: signalData.market,
      signalType: signalData.signalType,
      status: signalData.status,
      probability: signalData.probability,
      recommendation: signalData.recommendation,
      entryCondition: signalData.entryCondition,
      confidence: signalData.confidence,
      targetDigit: signalData.targetDigit,
      digitFrequencies: signalData.digitFrequencies,
      powerIndex: signalData.powerIndex,
    })
    .returning()

  return result[0]
}

// Create a new trade
export async function createTrade(
  userId: string,
  sessionId: string,
  tradeData: {
    signalId?: string
    market: string
    tradeType: string
    entryPrice: number
    takeProfit: number
    stopLoss: number
    tpTicks: number
    slTicks: number
    quantity: number
    turnNumber?: number
  }
) {
  const tradeId = `trade_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

  const result = await db
    .insert(trades)
    .values({
      id: tradeId,
      userId,
      sessionId,
      signalId: tradeData.signalId,
      market: tradeData.market,
      tradeType: tradeData.tradeType,
      entryPrice: tradeData.entryPrice.toString(),
      takeProfit: tradeData.takeProfit.toString(),
      stopLoss: tradeData.stopLoss.toString(),
      tpTicks: tradeData.tpTicks,
      slTicks: tradeData.slTicks,
      quantity: tradeData.quantity.toString(),
      status: 'pending',
      turnNumber: tradeData.turnNumber || 1,
      executedAt: new Date(),
    })
    .returning()

  return result[0]
}

// Update trade status and profit
export async function updateTradeStatus(
  tradeId: string,
  userId: string,
  status: 'open' | 'tp_hit' | 'sl_hit' | 'closed',
  profit?: number,
  profitPercentage?: number,
  closeReason?: string
) {
  const result = await db
    .update(trades)
    .set({
      status,
      profit: profit ? profit.toString() : undefined,
      profitPercentage: profitPercentage ? profitPercentage.toString() : undefined,
      closeReason,
      closedAt: status === 'closed' ? new Date() : undefined,
      updatedAt: new Date(),
    })
    .where(and(eq(trades.id, tradeId), eq(trades.userId, userId)))
    .returning()

  return result[0]
}

// Log trade event
export async function logTradeEvent(
  userId: string,
  tradeId: string,
  eventType: string,
  price?: number,
  message?: string,
  metadata?: any
) {
  const logId = `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

  const result = await db
    .insert(tradeLogs)
    .values({
      id: logId,
      userId,
      tradeId,
      eventType,
      price: price ? price.toString() : undefined,
      message,
      metadata,
    })
    .returning()

  return result[0]
}

// Get active trades for session
export async function getActiveTrades(sessionId: string, userId: string) {
  return db
    .select()
    .from(trades)
    .where(and(eq(trades.sessionId, sessionId), eq(trades.userId, userId), eq(trades.status, 'open')))
    .orderBy(desc(trades.executedAt))
}

// Get session trades
export async function getSessionTrades(sessionId: string, userId: string) {
  return db
    .select()
    .from(trades)
    .where(and(eq(trades.sessionId, sessionId), eq(trades.userId, userId)))
    .orderBy(desc(trades.executedAt))
}

// Get signals for session
export async function getSessionSignals(sessionId: string, userId: string) {
  return db
    .select()
    .from(signals)
    .where(and(eq(signals.sessionId, sessionId), eq(signals.userId, userId)))
    .orderBy(desc(signals.analyzedAt))
}

// Update session metrics
export async function updateSessionMetrics(
  sessionId: string,
  userId: string,
  totalProfit: number,
  totalTurns: number,
  status?: string
) {
  const result = await db
    .update(tradingSessions)
    .set({
      totalProfit: totalProfit.toString(),
      totalTurns,
      status: status || 'active',
      updatedAt: new Date(),
    })
    .where(and(eq(tradingSessions.id, sessionId), eq(tradingSessions.userId, userId)))
    .returning()

  return result[0]
}

// Get user's trading sessions
export async function getUserSessions(userId: string, limit: number = 10) {
  return db
    .select()
    .from(tradingSessions)
    .where(eq(tradingSessions.userId, userId))
    .orderBy(desc(tradingSessions.createdAt))
    .limit(limit)
}

// Update market data cache
export async function updateMarketDataCache(
  userId: string,
  market: string,
  lastTick: number,
  bidPrice?: number,
  askPrice?: number
) {
  const marketDataId = `mktdata_${userId}_${market}`

  // Try to insert, if fails due to unique constraint, update instead
  try {
    await db
      .insert(marketData)
      .values({
        id: marketDataId,
        userId,
        market,
        lastTick: lastTick.toString(),
        bidPrice: bidPrice ? bidPrice.toString() : undefined,
        askPrice: askPrice ? askPrice.toString() : undefined,
        lastUpdate: new Date(),
      })
      .onConflictDoUpdate({
        target: [marketData.userId, marketData.market],
        set: {
          lastTick: lastTick.toString(),
          bidPrice: bidPrice ? bidPrice.toString() : undefined,
          askPrice: askPrice ? askPrice.toString() : undefined,
          lastUpdate: new Date(),
        },
      })
  } catch (error) {
    console.error('[v0] Error updating market data:', error)
  }
}

// Get market data
export async function getMarketData(userId: string, market: string) {
  const result = await db
    .select()
    .from(marketData)
    .where(and(eq(marketData.userId, userId), eq(marketData.market, market)))
    .limit(1)

  return result[0] || null
}

// Complete a trading session
export async function completeSession(sessionId: string, userId: string) {
  const result = await db
    .update(tradingSessions)
    .set({
      status: 'completed',
      completedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(and(eq(tradingSessions.id, sessionId), eq(tradingSessions.userId, userId)))
    .returning()

  return result[0]
}

// Pause a trading session
export async function pauseSession(sessionId: string, userId: string) {
  const result = await db
    .update(tradingSessions)
    .set({
      status: 'paused',
      pausedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(and(eq(tradingSessions.id, sessionId), eq(tradingSessions.userId, userId)))
    .returning()

  return result[0]
}
