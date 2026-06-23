import React, { useMemo } from "react"
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { TrendingUp, TrendingDown, Activity } from "lucide-react"

interface MarketAnalysisProps {
  recentDigits: number[]
  trades?: Array<{ result: "win" | "loss"; profit: number }>
  theme?: "light" | "dark"
}

export function MarketStatisticalAnalysis({
  recentDigits,
  trades = [],
  theme = "dark",
}: MarketAnalysisProps) {
  // Calculate statistics
  const stats = useMemo(() => {
    // Digit frequency
    const frequency = new Array(10).fill(0)
    recentDigits.forEach((d) => {
      if (d >= 0 && d <= 9) frequency[d]++
    })

    // Over/Under
    const under = frequency.slice(0, 5).reduce((a, b) => a + b, 0)
    const over = frequency.slice(5).reduce((a, b) => a + b, 0)
    const total = under + over || 1

    // Even/Odd
    const even = frequency.filter((_, i) => i % 2 === 0).reduce((a, b) => a + b, 0)
    const odd = frequency.filter((_, i) => i % 2 !== 0).reduce((a, b) => a + b, 0)

    // Win rate
    const wins = trades.filter((t) => t.result === "win").length
    const losses = trades.filter((t) => t.result === "loss").length
    const winRate = trades.length > 0 ? (wins / trades.length) * 100 : 0

    // Profit factor
    const winProfit = trades.filter((t) => t.result === "win").reduce((a, b) => a + b.profit, 0)
    const lossProfit = Math.abs(trades.filter((t) => t.result === "loss").reduce((a, b) => a + b.profit, 0))
    const profitFactor = lossProfit > 0 ? winProfit / lossProfit : winProfit > 0 ? 999 : 0

    // Average profit/loss
    const avgProfit = wins > 0 ? winProfit / wins : 0
    const avgLoss = losses > 0 ? lossProfit / losses : 0

    return {
      frequency: frequency.map((f, i) => ({
        digit: i,
        count: f,
        percentage: ((f / total) * 100).toFixed(1),
      })),
      over: ((over / total) * 100).toFixed(1),
      under: ((under / total) * 100).toFixed(1),
      even: ((even / total) * 100).toFixed(1),
      odd: ((odd / total) * 100).toFixed(1),
      winRate: winRate.toFixed(1),
      profitFactor: profitFactor.toFixed(2),
      avgProfit: avgProfit.toFixed(2),
      avgLoss: avgLoss.toFixed(2),
      totalTrades: trades.length,
      wins,
      losses,
    }
  }, [recentDigits, trades])

  const overUnderData = [
    { name: "Over", value: parseFloat(stats.over as string), fill: "#0066FF" },
    { name: "Under", value: parseFloat(stats.under as string), fill: "#00D4AA" },
  ]

  const evenOddData = [
    { name: "Even", value: parseFloat(stats.even as string), fill: "#9F7AEA" },
    { name: "Odd", value: parseFloat(stats.odd as string), fill: "#FF6B35" },
  ]

  const isDark = theme === "dark"

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 px-2">
        <Activity className="w-4 h-4 text-cyan-400" />
        <h3 className="text-sm font-bold text-slate-100">Market Statistical Analysis</h3>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {/* Win Rate */}
        <div className={`p-3 rounded-lg border backdrop-blur-sm ${isDark ? "bg-emerald-500/10 border-emerald-400/30" : "bg-emerald-50 border-emerald-200"}`}>
          <div className="text-[10px] font-bold text-slate-400">Win Rate</div>
          <div className={`text-lg font-black ${isDark ? "text-emerald-300" : "text-emerald-700"}`}>
            {stats.winRate}%
          </div>
          <div className="text-[8px] text-slate-500 mt-1">
            {stats.wins}W / {stats.losses}L
          </div>
        </div>

        {/* Profit Factor */}
        <div className={`p-3 rounded-lg border backdrop-blur-sm ${isDark ? "bg-blue-500/10 border-blue-400/30" : "bg-blue-50 border-blue-200"}`}>
          <div className="text-[10px] font-bold text-slate-400">Profit Factor</div>
          <div className={`text-lg font-black ${isDark ? "text-blue-300" : "text-blue-700"}`}>
            {stats.profitFactor}
          </div>
          <div className="text-[8px] text-slate-500 mt-1">
            Risk/Reward Ratio
          </div>
        </div>

        {/* Avg Win */}
        <div className={`p-3 rounded-lg border backdrop-blur-sm ${isDark ? "bg-green-500/10 border-green-400/30" : "bg-green-50 border-green-200"}`}>
          <div className="text-[10px] font-bold text-slate-400">Avg Win</div>
          <div className={`text-lg font-black ${isDark ? "text-green-300" : "text-green-700"}`}>
            ${stats.avgProfit}
          </div>
          <div className="text-[8px] text-slate-500 mt-1">
            Per winning trade
          </div>
        </div>

        {/* Avg Loss */}
        <div className={`p-3 rounded-lg border backdrop-blur-sm ${isDark ? "bg-red-500/10 border-red-400/30" : "bg-red-50 border-red-200"}`}>
          <div className="text-[10px] font-bold text-slate-400">Avg Loss</div>
          <div className={`text-lg font-black ${isDark ? "text-red-300" : "text-red-700"}`}>
            ${stats.avgLoss}
          </div>
          <div className="text-[8px] text-slate-500 mt-1">
            Per losing trade
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Over/Under Pie */}
        <div className={`p-4 rounded-lg border backdrop-blur-sm ${isDark ? "bg-slate-800/30 border-slate-700/50" : "bg-slate-100 border-slate-300"}`}>
          <div className="text-xs font-bold text-slate-300 mb-3">Over/Under Distribution</div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={overUnderData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={70}
                paddingAngle={2}
                dataKey="value"
              >
                <Cell fill="#0066FF" />
                <Cell fill="#00D4AA" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-between text-[10px] mt-2">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span>Over: {stats.over}%</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>Under: {stats.under}%</span>
            </div>
          </div>
        </div>

        {/* Even/Odd Pie */}
        <div className={`p-4 rounded-lg border backdrop-blur-sm ${isDark ? "bg-slate-800/30 border-slate-700/50" : "bg-slate-100 border-slate-300"}`}>
          <div className="text-xs font-bold text-slate-300 mb-3">Even/Odd Distribution</div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={evenOddData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={70}
                paddingAngle={2}
                dataKey="value"
              >
                <Cell fill="#9F7AEA" />
                <Cell fill="#FF6B35" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-between text-[10px] mt-2">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-purple-500" />
              <span>Even: {stats.even}%</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-orange-500" />
              <span>Odd: {stats.odd}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Digit Frequency Bar Chart */}
      <div className={`p-4 rounded-lg border backdrop-blur-sm ${isDark ? "bg-slate-800/30 border-slate-700/50" : "bg-slate-100 border-slate-300"}`}>
        <div className="text-xs font-bold text-slate-300 mb-3">Digit Frequency Distribution</div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={stats.frequency}>
            <XAxis dataKey="digit" tick={{ fill: isDark ? "#94a3b8" : "#64748b", fontSize: 10 }} />
            <YAxis tick={{ fill: isDark ? "#94a3b8" : "#64748b", fontSize: 10 }} />
            <Bar dataKey="count" fill="#06B6D4" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Strategy Recommendations */}
      <div className={`p-4 rounded-lg border backdrop-blur-sm ${isDark ? "bg-slate-800/30 border-slate-700/50" : "bg-slate-100 border-slate-300"}`}>
        <div className="text-xs font-bold text-slate-300 mb-3">Market Conditions</div>
        <div className="space-y-2 text-xs">
          {parseFloat(stats.over as string) > 60 && (
            <div className="flex items-center gap-2 p-2 rounded bg-blue-500/20 border border-blue-400/30">
              <TrendingUp className="w-3 h-3 text-blue-400" />
              <span className="text-blue-300">Strong OVER bias - Consider Over/Under strategies</span>
            </div>
          )}
          {parseFloat(stats.under as string) > 60 && (
            <div className="flex items-center gap-2 p-2 rounded bg-cyan-500/20 border border-cyan-400/30">
              <TrendingDown className="w-3 h-3 text-cyan-400" />
              <span className="text-cyan-300">Strong UNDER bias - Consider Under/Over strategies</span>
            </div>
          )}
          {parseFloat(stats.winRate as string) > 65 && (
            <div className="flex items-center gap-2 p-2 rounded bg-emerald-500/20 border border-emerald-400/30">
              <TrendingUp className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-300">High win rate - Market is favorable right now</span>
            </div>
          )}
          {stats.totalTrades === 0 && (
            <div className="text-slate-500 italic">No trades yet - Start trading to see market analysis</div>
          )}
        </div>
      </div>
    </div>
  )
}
