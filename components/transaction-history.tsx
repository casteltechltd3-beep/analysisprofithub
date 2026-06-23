'use client'

import React from 'react'
import { Badge } from '@/components/ui/badge'
import { History, TrendingUp, TrendingDown } from 'lucide-react'

interface Transaction {
  id: string
  market: string
  contract: string
  stake: number
  profit: number
  result: 'win' | 'loss'
  time: string
}

export default function TransactionHistory() {
  const transactions: Transaction[] = [
    { id: '1', market: 'EURUSD', contract: 'Higher', stake: 100, profit: 150, result: 'win', time: '14:32:45' },
    { id: '2', market: 'GBPUSD', contract: 'Lower', stake: 150, profit: -150, result: 'loss', time: '14:31:10' },
    { id: '3', market: 'USDJPY', contract: 'Even', stake: 100, profit: 200, result: 'win', time: '14:30:22' },
    { id: '4', market: 'AUDUSD', contract: 'Odd', stake: 80, profit: 160, result: 'win', time: '14:29:15' },
    { id: '5', market: 'EURUSD', contract: 'Higher', stake: 120, profit: -120, result: 'loss', time: '14:28:30' },
  ]

  return (
    <div className="
      glass-card rounded-2xl border border-slate-700/50
      bg-gradient-to-br from-slate-900/50 via-slate-800/50 to-slate-900/50
      backdrop-blur-xl p-6 shadow-2xl
    ">
      <div className="space-y-4">
        <h3 className="font-bold text-slate-100 flex items-center gap-2">
          <History className="w-5 h-5 text-slate-400" />
          Recent Transactions
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400">Time</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400">Market</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400">Contract</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400">Stake</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400">Result</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400">P/L</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr
                  key={tx.id}
                  className={`
                    border-b border-slate-700/30 transition-colors
                    ${tx.result === 'win'
                      ? 'hover:bg-emerald-500/5'
                      : 'hover:bg-red-500/5'
                    }
                  `}
                >
                  <td className="px-4 py-3 text-slate-300 font-mono">{tx.time}</td>
                  <td className="px-4 py-3 text-slate-300 font-semibold">{tx.market}</td>
                  <td className="px-4 py-3 text-slate-400">{tx.contract}</td>
                  <td className="px-4 py-3 text-slate-300">${tx.stake}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {tx.result === 'win' ? (
                        <>
                          <TrendingUp className="w-4 h-4 text-emerald-400" />
                          <Badge className="bg-emerald-500/30 text-emerald-300">Win</Badge>
                        </>
                      ) : (
                        <>
                          <TrendingDown className="w-4 h-4 text-red-400" />
                          <Badge className="bg-red-500/30 text-red-300">Loss</Badge>
                        </>
                      )}
                    </div>
                  </td>
                  <td className={`px-4 py-3 text-right font-bold ${
                    tx.profit > 0 ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {tx.profit > 0 ? '+' : ''}{tx.profit}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
