'use client'

import React, { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { 
  Radar, 
  TrendingUp, 
  Activity, 
  Settings, 
  BarChart3, 
  Zap,
  Shield,
  Clock,
  MoreVertical,
  Menu
} from 'lucide-react'
import PremiumHeader from '@/components/premium-header'
import AIScanner from '@/components/ai-scanner-premium'
import MarketPowerDashboard from '@/components/market-power-dashboard'
import StrategySelector from '@/components/strategy-selector'
import TradeConsolePanel from '@/components/trade-console-panel'
import AutoTradingPanel from '@/components/auto-trading-panel'
import RecoveryEngine from '@/components/recovery-engine'
import LongSessionTrader from '@/components/long-session-trader'
import AnalyticsCenter from '@/components/analytics-center'
import TransactionHistory from '@/components/transaction-history'

interface SidebarItem {
  id: string
  label: string
  icon: React.ReactNode
  badge?: string
}

const sidebarItems: SidebarItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 className="w-5 h-5" /> },
  { id: 'scanner', label: 'AI Scanner', icon: <Radar className="w-5 h-5" /> },
  { id: 'trader', label: 'Auto Trader', icon: <Zap className="w-5 h-5" /> },
  { id: 'recovery', label: 'Recovery Engine', icon: <Shield className="w-5 h-5" /> },
  { id: 'analytics', label: 'Analytics Center', icon: <Activity className="w-5 h-5" /> },
  { id: 'session', label: 'Long Session Trader', icon: <Clock className="w-5 h-5" /> },
  { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
]

export default function PremiumTradingDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isScanning, setIsScanning] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState('connected')
  const [accountBalance, setAccountBalance] = useState(10000)
  const [autoTradingActive, setAutoTradingActive] = useState(false)
  const [scannerActive, setScannerActive] = useState(false)

  useEffect(() => {
    // Simulate real-time connection status
    const interval = setInterval(() => {
      setConnectionStatus(prev => prev === 'connected' ? 'connected' : 'connected')
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleStartScan = () => {
    setIsScanning(true)
    setScannerActive(true)
    // Simulate scan completion
    setTimeout(() => setIsScanning(false), 5000)
  }

  const handleStopScanning = () => {
    setScannerActive(false)
    setIsScanning(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-foreground overflow-hidden">
      {/* Animated background grid */}
      <div className="fixed inset-0 z-0 opacity-5">
        <div className="absolute inset-0 bg-grid-slate-700/50 [background-image:linear-gradient(0deg,transparent_24%,rgba(124,58,237,.05)_25%,rgba(124,58,237,.05)_26%,transparent_27%,transparent_74%,rgba(124,58,237,.05)_75%,rgba(124,58,237,.05)_76%,transparent_77%,transparent),linear-gradient(90deg,transparent_24%,rgba(124,58,237,.05)_25%,rgba(124,58,237,.05)_26%,transparent_27%,transparent_74%,rgba(124,58,237,.05)_75%,rgba(124,58,237,.05)_76%,transparent_77%,transparent)]" />
      </div>

      {/* Main Container */}
      <div className="relative z-10 flex h-screen flex-col">
        {/* Premium Header */}
        <PremiumHeader 
          connectionStatus={connectionStatus}
          accountBalance={accountBalance}
          autoTradingActive={autoTradingActive}
          scannerActive={scannerActive}
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* Main Content Area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Animated Sidebar Navigation */}
          <div className={`
            ${sidebarOpen ? 'w-64' : 'w-20'} 
            bg-gradient-to-b from-slate-900/80 via-slate-800/80 to-slate-900/80 
            backdrop-blur-lg border-r border-slate-700/50
            transition-all duration-300 ease-in-out
            flex flex-col
            shadow-2xl
          `}>
            {/* Sidebar Content */}
            <div className="flex-1 overflow-y-auto pt-4">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`
                    w-full px-4 py-3 flex items-center gap-3 text-sm font-medium
                    transition-all duration-200
                    ${activeTab === item.id
                      ? 'text-primary bg-gradient-to-r from-primary/20 to-transparent border-l-2 border-primary'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/30'
                    }
                  `}
                >
                  {item.icon}
                  {sidebarOpen && (
                    <>
                      <span className="flex-1 text-left">{item.label}</span>
                      {item.badge && (
                        <span className="px-2 py-0.5 text-xs bg-primary/30 text-primary rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Main Content Panel */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Dashboard Tab */}
              {activeTab === 'dashboard' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <AIScanner 
                      isScanning={isScanning}
                      onStartScan={handleStartScan}
                      onStopScan={handleStopScanning}
                    />
                    <MarketPowerDashboard />
                  </div>
                  <div className="grid grid-cols-1 gap-6">
                    <StrategySelector />
                  </div>
                  <TransactionHistory />
                </div>
              )}

              {/* AI Scanner Tab */}
              {activeTab === 'scanner' && (
                <div className="space-y-6">
                  <AIScanner 
                    isScanning={isScanning}
                    onStartScan={handleStartScan}
                    onStopScan={handleStopScanning}
                  />
                  <MarketPowerDashboard />
                  <StrategySelector />
                </div>
              )}

              {/* Auto Trader Tab */}
              {activeTab === 'trader' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <TradeConsolePanel />
                    <AutoTradingPanel />
                  </div>
                  <TransactionHistory />
                </div>
              )}

              {/* Recovery Engine Tab */}
              {activeTab === 'recovery' && (
                <RecoveryEngine />
              )}

              {/* Analytics Tab */}
              {activeTab === 'analytics' && (
                <AnalyticsCenter />
              )}

              {/* Long Session Trader Tab */}
              {activeTab === 'session' && (
                <LongSessionTrader />
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div className="glass-card p-8 rounded-2xl border border-slate-700/50">
                  <h2 className="text-2xl font-bold mb-6">Settings</h2>
                  <p className="text-slate-400">Settings panel coming soon...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
