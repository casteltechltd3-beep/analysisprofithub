# Integration Guide - Connect Engines to UI

## Quick Start

The trading engines are now ready to use. Here's how to integrate them into your components.

---

## 1. SmartAuto24 Tab Integration

### Current Implementation
The SmartAuto24 tab already has the structure, but needs the engine connected.

### Integration Steps

**1. Import the engine:**
```typescript
import { SmartAuto24TradingEngine } from '@/lib/smartauto24-trading-engine'
import type { SmartAuto24Config } from '@/lib/smartauto24-trading-engine'
```

**2. Initialize in component:**
```typescript
const engineRef = useRef<SmartAuto24TradingEngine | null>(null)
const [isRunning, setIsRunning] = useState(false)

useEffect(() => {
  if (!apiClient || !isAuthorized) return
  
  const config: SmartAuto24Config = {
    strategy: selectedStrategy as any,
    stake: Number.parseFloat(stake),
    targetProfit: Number.parseFloat(targetProfit),
    maxTrades: 100,
    stopLossPercent: Number.parseFloat(stopLossPercent),
    symbol: symbol || '1HZ100V',
    autoPilot: isAutoPilotEnabled,
    autoMarketSwitch: isAutoMarketSwitchEnabled,
  }
  
  engineRef.current = new SmartAuto24TradingEngine(apiClient, config)
  
  // Listen to events
  engineRef.current.on('trade-executed', (trade) => {
    console.log('[v0] Trade executed:', trade)
    addToTradeHistory(trade)
  })
  
  engineRef.current.on('trade-closed', (trade) => {
    console.log('[v0] Trade closed:', trade)
    updateStats(trade)
  })
  
  engineRef.current.on('stats-updated', (stats) => {
    updateUIStats(stats)
  })
}, [apiClient, isAuthorized, selectedStrategy, stake, targetProfit])
```

**3. Connect start/stop buttons:**
```typescript
const handleStart = async () => {
  if (!engineRef.current) return
  
  setIsRunning(true)
  setStatus('trading')
  await engineRef.current.start()
}

const handleStop = async () => {
  if (!engineRef.current) return
  
  setIsRunning(false)
  setStatus('idle')
  await engineRef.current.stop()
}
```

**4. Feed signals to engine:**
```typescript
// When analysis produces signals:
useEffect(() => {
  if (!engineRef.current || !isRunning) return
  
  engineRef.current.processSignal({
    type: signal.type,
    confidence: signal.confidence,
    probability: signal.probability,
    entry: signal.entry,
    market: symbol || '1HZ100V',
  })
}, [signal, isRunning])
```

---

## 2. Autonomous Bot Integration

### Current Status
The autonomous bot is already updated with real API calls. Just verify it's working:

**Test Steps:**
```typescript
1. Connect Deriv API token (via DerivAPIContext)
2. Select contracts to trade
3. Set stake, max losses, profit target
4. Click "Start Bot"
5. Check browser console for "[v0]" logs
6. Verify trades are executing via Deriv API
```

**Key Methods Used:**
```typescript
// Inside startBot function:
const proposal = await apiClient.getProposal(proposalRequest)
const buyResponse = await apiClient.buyContract(proposal.id, proposal.ask_price)
const result = await apiClient.getContractResult(buyResponse.contract_id)
```

---

## 3. AutoBot Tab Integration

### Setup
Currently uses mock data. To integrate real trading:

**1. Replace with SignalBasedExecutor:**
```typescript
import { SignalBasedExecutor } from '@/lib/signal-based-executor'

const executorRef = useRef<SignalBasedExecutor | null>(null)

useEffect(() => {
  if (!apiClient || !isAuthorized) return
  executorRef.current = new SignalBasedExecutor(apiClient, 55) // 55% confidence threshold
  
  executorRef.current.on('trade-executed', (trade) => {
    console.log('[v0] Trade executed:', trade)
    updateStats(trade)
  })
  
  executorRef.current.on('trade-closed', (trade) => {
    console.log('[v0] Trade closed:', trade)
    if (trade.status === 'won') {
      setStats(prev => ({ ...prev, wins: prev.wins + 1 }))
    } else {
      setStats(prev => ({ ...prev, losses: prev.losses + 1 }))
    }
  })
}, [apiClient, isAuthorized])
```

**2. Execute signals:**
```typescript
const executeSignal = async (signal: Signal) => {
  if (!executorRef.current) return
  
  const trade = await executorRef.current.executeSignal(
    signal,
    stake,
    symbol
  )
  
  if (trade) {
    console.log('[v0] Trade queued:', trade)
  }
}
```

---

## 4. Money Maker Tab Integration

### Fix UI Layout
```typescript
// Replace cramped layout with proper grid:

<div className="space-y-6">
  {/* Strategy Selection Grid */}
  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
    {strategies.map(strategy => (
      <StrategyCard key={strategy} strategy={strategy} />
    ))}
  </div>
  
  {/* Analysis Results Full Width */}
  <div className="w-full">
    <AnalysisResults data={analysisData} />
  </div>
  
  {/* Charts Grid */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <Chart1 />
    <Chart2 />
  </div>
  
  {/* Stats Grid */}
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    {stats.map(stat => (
      <StatCard key={stat.label} {...stat} />
    ))}
  </div>
  
  {/* History Full Width */}
  <TransactionHistory transactions={transactions} />
</div>
```

### Connect to Real Trading
```typescript
// When a strategy trade is initiated:
const executeTrade = async (strategySignal: Signal) => {
  if (!executorRef.current) return
  
  const trade = await executorRef.current.executeSignal(
    strategySignal,
    stake,
    symbol
  )
  
  if (trade) {
    addToTransactionHistory(trade)
    updateStats(trade)
  }
}
```

---

## 5. Database Integration (Optional)

### Enable Trade Persistence

**After trade closes, save to database:**
```typescript
import { saveTrade, saveSignal } from '@/app/actions/trading'

// In trade-closed event:
engineRef.current.on('trade-closed', async (trade) => {
  const result = await saveTrade({
    userId: session?.user?.id,
    sessionId: currentSession.id,
    signalId: trade.signal.id,
    market: trade.signal.market,
    tradeType: trade.signal.type,
    entryPrice: trade.signal.entry,
    takeProfit: trade.signal.probability,
    stopLoss: 0,
    tpTicks: 5,
    slTicks: 5,
    quantity: trade.stake,
    status: trade.status,
    profit: trade.profit,
  })
  
  console.log('[v0] Trade saved to database:', result)
})
```

**Retrieve trade history:**
```typescript
import { getTradeHistory } from '@/app/actions/trading'

const loadHistory = async () => {
  const trades = await getTradeHistory(sessionId)
  setTradeHistory(trades)
}
```

---

## 6. Event Flow Diagram

```
┌─────────────────────────────────────────┐
│     Market Data (WebSocket Ticks)       │
└──────────────┬──────────────────────────┘
               │
               ↓
┌─────────────────────────────────────────┐
│      Analysis Engine                    │
│   (Generates Signals)                   │
└──────────────┬──────────────────────────┘
               │
               ↓
       ┌───────────────────┐
       │  Signal Analysis  │
       │  Confidence: 55%+ │
       └────────┬──────────┘
                │
         ┌──────┴─────────┐
         │                │
         ↓                ↓
    SmartAuto24     SignalBasedExecutor
    TradingEngine
         │                │
         └──────┬─────────┘
                │
                ↓
    ┌──────────────────────────────┐
    │  Deriv API                   │
    │  - getProposal()             │
    │  - buyContract()             │
    │  - getContractResult()       │
    └──────────┬───────────────────┘
               │
               ↓
    ┌──────────────────────────────┐
    │  Trade Result                │
    │  - Profit/Loss               │
    │  - Win/Lose Status           │
    └──────────┬───────────────────┘
               │
         ┌─────┴─────┐
         │           │
         ↓           ↓
    Update Stats  Save to Database
```

---

## 7. Testing Checklist

- [ ] Autonomous Bot executes real trades
  - [ ] Check "[v0]" console logs for API calls
  - [ ] Verify proposal received
  - [ ] Verify contract bought
  - [ ] Check trade results

- [ ] SmartAuto24 doesn't freeze
  - [ ] Start button responsive
  - [ ] Signals process without lag
  - [ ] Stats update in real-time
  - [ ] Stop button works

- [ ] Money Maker layout clean
  - [ ] All components visible
  - [ ] Proper spacing
  - [ ] No overlaps
  - [ ] Responsive on mobile

- [ ] Signal analysis connected
  - [ ] Signals generate correctly
  - [ ] Confidence scores accurate
  - [ ] Only 55%+ executed

- [ ] Real API calls verified
  - [ ] WebSocket connected
  - [ ] Proposals return valid data
  - [ ] Contracts actually buy
  - [ ] Results accurate

---

## 8. Configuration Reference

### SmartAuto24Config
```typescript
{
  strategy: 'Even/Odd' | 'Over/Under' | 'Differs' | 'Matches'
  stake: number (0.01 - max balance)
  targetProfit: number
  maxTrades: number (1-100)
  stopLossPercent: number (10-90)
  symbol: string (e.g., '1HZ100V')
  autoPilot: boolean
  autoMarketSwitch: boolean
}
```

### Signal Structure
```typescript
{
  type: 'EVEN' | 'ODD' | 'OVER' | 'UNDER' | 'DIFFERS' | 'MATCHES' | 'RISE' | 'FALL'
  confidence: number (0-100)
  probability: number (0-1)
  entry: string
  market: string
}
```

### Trade Result
```typescript
{
  id: string (contract ID)
  signal: Signal
  stake: number
  contractType: string
  status: 'pending' | 'won' | 'lost'
  profit: number
  timestamp: Date
}
```

---

## 9. Debugging

**Check console logs:**
```
[v0] Pattern indicates v0 debug logs
```

**Monitor WebSocket:**
- DevTools → Network → WS filter
- Check "message" frames for tick data

**Verify API connection:**
```typescript
const { isConnected, isAuthorized, balance } = useDerivAPI()
console.log('[v0] API Status:', { isConnected, isAuthorized, balance })
```

**Check signal generation:**
```typescript
// In analysis callback:
console.log('[v0] Generated signals:', signals)
console.log('[v0] Confidence levels:', signals.map(s => `${s.type}:${s.confidence}%`))
```

---

## 10. Support

All engines emit events. Listen to them:

```typescript
// SmartAuto24TradingEngine
engine.on('started', () => {})
engine.on('trade-executed', (trade) => {})
engine.on('trade-closed', (trade) => {})
engine.on('stats-updated', (stats) => {})
engine.on('stopped', () => {})
engine.on('trade-error', (error) => {})

// SignalBasedExecutor
executor.on('trade-executed', (trade) => {})
executor.on('trade-closed', (trade) => {})
executor.on('trade-error', (error) => {})
```

All logged with "[v0]" prefix for easy filtering in console.
