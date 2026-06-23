# Premium AI Trading Engine - Developer Reference

## Quick Start

### Access the Dashboard
```
Route: /trading-engine
URL: http://localhost:3000/trading-engine
```

### File Structure
```
components/
├── premium-trading-dashboard.tsx    # Main dashboard container
├── premium-header.tsx               # Header with status indicators
├── ai-scanner-premium.tsx           # AI Scanner with animations
├── market-power-dashboard.tsx       # Market power meters
├── strategy-selector.tsx            # Strategy selection UI
├── trade-console-panel.tsx          # Trade console interface
├── auto-trading-panel.tsx           # Auto trading display
├── recovery-engine.tsx              # Recovery settings
├── long-session-trader.tsx          # 24-hour trader
├── analytics-center.tsx             # Analytics dashboard
└── transaction-history.tsx          # Trade history table

app/
├── trading-engine/
│   └── page.tsx                     # Main page (uses premium dashboard)
└── actions/
    └── trading.ts                   # Server actions (database ready)

lib/
├── db/
│   ├── index.ts                     # Drizzle ORM client
│   └── schema.ts                    # Database schema
└── auth.ts                          # Better Auth config

styles/
├── globals.css                      # Tailwind + design tokens
└── premium-design-system.css        # Additional premium styles
```

---

## Component Props & Interfaces

### PremiumHeader
```typescript
interface PremiumHeaderProps {
  connectionStatus: 'connected' | 'connecting' | 'disconnected'
  accountBalance: number
  autoTradingActive: boolean
  scannerActive: boolean
  onMenuClick: () => void
}
```

### AIScanner
```typescript
interface AIScannerProps {
  isScanning: boolean
  onStartScan: () => void
  onStopScan: () => void
}

interface MarketScan {
  market: string
  volatility: number
  signal: number
  confidence: number
  status: 'scanning' | 'ready' | 'idle'
}
```

### TransactionHistory
```typescript
interface Transaction {
  id: string
  market: string
  contract: string
  stake: number
  profit: number
  result: 'win' | 'loss'
  time: string
}
```

---

## Key Features Implementation

### 1. Real-Time Updates
```typescript
useEffect(() => {
  const interval = setInterval(() => {
    // Update state with new data
    setOverPower(prev => {
      const change = (Math.random() - 0.5) * 5
      return Math.max(30, Math.min(70, prev + change))
    })
  }, 2000)
  
  return () => clearInterval(interval)
}, [])
```

### 2. Animation Classes
```typescript
// Pulse effect
className="animate-pulse"

// Rotating scanner
style={{ animationDuration: '2s' }}

// Smooth transitions
className="transition-all duration-300"
```

### 3. Conditional Styling
```typescript
// Color based on value
className={`${power > 65 ? 'shadow-lg shadow-emerald-500/50' : ''}`}

// Signal status colors
const getProgressColor = (power: number) => {
  if (power < 55) return 'bg-yellow-500'
  if (power < 65) return 'bg-blue-500'
  return 'bg-emerald-500'
}
```

---

## Database Integration Ready

### Connect to Real Database

#### Step 1: Set Environment Variables
```bash
DATABASE_URL=postgresql://...
BETTER_AUTH_SECRET=generated-secret
```

#### Step 2: Replace Simulated Data with Database Calls
```typescript
// Before: Simulated
const [markets, setMarkets] = useState<MarketScan[]>([...])

// After: Database
import { getMarketAnalysis } from '@/app/actions/trading'
const markets = await getMarketAnalysis(userId)
```

#### Step 3: Use Server Actions
```typescript
import { saveTradingSession, logSignal, createTrade } from '@/app/actions/trading'

// Save session
const sessionId = await saveTradingSession({
  userId,
  market: 'EURUSD',
  status: 'active'
})

// Log trade
await createTrade({
  sessionId,
  market: 'EURUSD',
  tradeType: 'OVER',
  entryPrice: 1.0875,
  // ...
})
```

---

## Color System

### Primary Colors
```css
/* Neon Cyan */
--primary: oklch(0.55 0.25 260)  /* Vibrant Blue */

/* Emerald Green (Success) */
#10b981  /* Wins, positive signals */

/* Orange/Yellow (Warning) */
#f59e0b  /* Caution levels */

/* Red (Danger) */
#ef4444  /* Losses, stop signals */
```

### Background
```css
/* Dark Gradient */
from-slate-950 via-slate-900 to-slate-950

/* Card/Glass */
from-slate-900/50 via-slate-800/50 to-slate-900/50
```

---

## Common Customizations

### 1. Change Update Frequency
```typescript
// Scanner updates (currently 500ms)
setInterval(() => { ... }, 500)  // Change 500 to desired ms

// Market power updates (currently 2000ms)
setInterval(() => { ... }, 2000)  // Change 2000 to desired ms
```

### 2. Adjust Signal Thresholds
```typescript
// In market-power-dashboard.tsx
const getSignalStatus = (power: number) => {
  if (power < 50) return 'Weak'          // Change 50
  if (power < 55) return 'Yellow Zone'   // Change 55
  if (power < 65) return 'Blue Signal'   // Change 65
  if (power < 75) return 'Green Signal'  // Change 75
  return 'Extreme Signal'
}
```

### 3. Add New Markets
```typescript
// In ai-scanner-premium.tsx
const [markets] = useState<MarketScan[]>([
  { market: 'Volatility 10', volatility: 10, ... },
  { market: 'Volatility 25', volatility: 25, ... },
  // Add new:
  { market: 'Crypto Index', volatility: 50, ... },
])
```

### 4. Modify Trading Pairs
```typescript
// In trade-console-panel.tsx
<SelectContent>
  <SelectItem value="eurusd">EURUSD</SelectItem>
  <SelectItem value="btcusd">BTCUSD</SelectItem>  {/* New */}
  <SelectItem value="ethusd">ETHUSD</SelectItem>  {/* New */}
</SelectContent>
```

---

## Testing Checklist

### Functional Testing
- [ ] Dashboard loads without errors
- [ ] Sidebar navigation works (all 7 modules)
- [ ] Scanner starts and stops correctly
- [ ] Market power meters update in real-time
- [ ] Auto Trading panel shows correct stats
- [ ] Recovery Engine settings save
- [ ] Long Session Trader calculates durations
- [ ] Analytics display correct data
- [ ] Transaction history shows recent trades

### UI/UX Testing
- [ ] Header status indicators update
- [ ] Animations are smooth (60fps)
- [ ] Colors are correct on all states
- [ ] Responsive layout works mobile to desktop
- [ ] Hover effects work on buttons
- [ ] Scan progress bar fills smoothly
- [ ] Profit/Loss colors change correctly
- [ ] Glassmorphism blur is visible

### Performance Testing
- [ ] Initial load < 3s
- [ ] Sidebar toggle < 300ms
- [ ] Tab switches < 200ms
- [ ] Updates are smooth (no jank)
- [ ] No memory leaks on long sessions
- [ ] CPU usage is reasonable during scan

---

## Debugging Tips

### Check Component State
```typescript
console.log('[v0] Market data:', markets)
console.log('[v0] Scanning state:', isScanning)
console.log('[v0] Current profit:', totalProfit)
```

### Verify Animations
```typescript
// Disable animations for debugging
className="transition-none"  // Instead of transition-all duration-300
```

### Network Requests (Future)
```typescript
// Will help debug API calls
fetch('...')
  .then(res => {
    console.log('[v0] API response:', res)
    return res.json()
  })
```

---

## Common Issues & Solutions

### Issue: Sidebar won't toggle
**Solution**: Check `sidebarOpen` state and `setSidebarOpen` function

### Issue: Scanner won't start
**Solution**: Verify `onStartScan` callback is properly connected

### Issue: Animations lag
**Solution**: Reduce animation duration or simplify animations

### Issue: Colors not showing
**Solution**: Verify Tailwind CSS is properly imported in globals.css

### Issue: Database not connecting
**Solution**: Check `DATABASE_URL` environment variable

---

## Optimization Tips

1. **Memoize Expensive Components**
   ```typescript
   const MemoizedChart = React.memo(AnalyticsChart)
   ```

2. **Lazy Load Modules**
   ```typescript
   const LongSessionTrader = lazy(() => import('...'))
   ```

3. **Virtual Scrolling for Long Lists**
   ```typescript
   // For transaction history with 1000+ items
   import { FixedSizeList } from 'react-window'
   ```

4. **Debounce Real-Time Updates**
   ```typescript
   const debouncedUpdate = debounce(() => { ... }, 300)
   ```

---

## Resources

- **Tailwind CSS**: https://tailwindcss.com
- **React**: https://react.dev
- **Drizzle ORM**: https://orm.drizzle.team
- **Better Auth**: https://authjs.dev
- **Next.js**: https://nextjs.org

---

## Support Contact

For issues or questions:
1. Check this documentation
2. Review code comments
3. Check console for errors
4. Open GitHub issue with reproduction steps

---

**Last Updated**: June 23, 2024  
**Version**: 1.0.0

