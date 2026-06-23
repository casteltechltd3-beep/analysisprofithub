'use client'

import React from 'react'
import { Menu, Zap, Radar, Wifi, TrendingUp, DollarSign } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface PremiumHeaderProps {
  connectionStatus: 'connected' | 'connecting' | 'disconnected'
  accountBalance: number
  autoTradingActive: boolean
  scannerActive: boolean
  onMenuClick: () => void
}

export default function PremiumHeader({
  connectionStatus,
  accountBalance,
  autoTradingActive,
  scannerActive,
  onMenuClick,
}: PremiumHeaderProps) {
  return (
    <header className="
      relative h-20 border-b border-slate-700/50
      bg-gradient-to-r from-slate-900/80 via-slate-800/80 to-slate-900/80
      backdrop-blur-xl shadow-2xl
      flex items-center justify-between px-6
    ">
      {/* Left Section - Menu & Logo */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
        >
          <Menu className="w-5 h-5 text-slate-400" />
        </button>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg blur opacity-75 animate-pulse" />
            <div className="relative bg-slate-900 px-3 py-1.5 rounded-lg">
              <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                AI Pro
              </span>
            </div>
          </div>
          <span className="text-sm font-semibold text-slate-300">Trading Engine Pro</span>
        </div>
      </div>

      {/* Center Section - Status Indicators */}
      <div className="flex items-center gap-6">
        {/* Connection Status */}
        <div className="flex items-center gap-2">
          <div className={`
            relative w-3 h-3 rounded-full
            ${connectionStatus === 'connected' ? 'bg-emerald-500' : 'bg-orange-500'}
          `}>
            <div className={`
              absolute inset-0 rounded-full
              ${connectionStatus === 'connected' ? 'bg-emerald-400 animate-pulse' : 'bg-orange-400'}
            `} />
          </div>
          <span className="text-xs font-medium text-slate-400">
            {connectionStatus === 'connected' ? 'Live Connected' : 'Connecting...'}
          </span>
        </div>

        {/* Account Balance */}
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-700/30 rounded-lg border border-slate-600/50">
          <DollarSign className="w-4 h-4 text-emerald-400" />
          <span className="text-sm font-semibold text-slate-200">
            ${accountBalance.toLocaleString()}
          </span>
        </div>

        {/* Market Status */}
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-700/30 rounded-lg border border-slate-600/50">
          <TrendingUp className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-medium text-slate-400">Markets Live</span>
        </div>
      </div>

      {/* Right Section - Active Status Badges */}
      <div className="flex items-center gap-3">
        {/* Scanner Status */}
        {scannerActive && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-violet-500/20 to-purple-500/20 rounded-full border border-violet-400/50 animate-pulse">
            <div className="w-2 h-2 bg-violet-400 rounded-full animate-pulse" />
            <span className="text-xs font-semibold text-violet-300">Scanner Active</span>
          </div>
        )}

        {/* Auto Trading Status */}
        {autoTradingActive && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-full border border-emerald-400/50 animate-pulse">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-xs font-semibold text-emerald-300">Auto Trading</span>
          </div>
        )}

        {/* AI Status */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full border border-cyan-400/50">
          <Zap className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span className="text-xs font-semibold text-cyan-300">AI Online</span>
        </div>
      </div>
    </header>
  )
}
