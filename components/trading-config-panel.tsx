import React, { useState } from "react"
import { Settings, TrendingUp, AlertCircle, Zap, Repeat2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"

interface TradingConfigPanelProps {
  onConfigChange?: (config: TradingConfig) => void
  initialConfig?: TradingConfig
}

export interface TradingConfig {
  stake: number
  profitTarget: number
  stopLoss: number
  ticks: number
  useMartingale: boolean
  martingaleMultiplier: number
  maxMartingaleLevels: number
  market: string
}

const DEFAULT_CONFIG: TradingConfig = {
  stake: 10,
  profitTarget: 20,
  stopLoss: 50,
  ticks: 5,
  useMartingale: false,
  martingaleMultiplier: 2,
  maxMartingaleLevels: 3,
  market: "volatility",
}

export function TradingConfigPanel({
  onConfigChange,
  initialConfig = DEFAULT_CONFIG,
}: TradingConfigPanelProps) {
  const [config, setConfig] = useState<TradingConfig>(initialConfig)
  const [showAdvanced, setShowAdvanced] = useState(false)

  const handleChange = (field: keyof TradingConfig, value: any) => {
    const newConfig = { ...config, [field]: value }
    setConfig(newConfig)
    onConfigChange?.(newConfig)
  }

  return (
    <div className="space-y-4 p-4 rounded-xl bg-slate-900/50 border border-slate-800/50 backdrop-blur-xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-slate-100">Trading Configuration</h3>
        </div>
        <span className="text-xs text-slate-500">Live</span>
      </div>

      {/* Main Config Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Stake */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Zap className="w-3 h-3 text-cyan-400" />
            <Label className="text-xs font-bold text-slate-300">Stake (USD)</Label>
          </div>
          <Input
            type="number"
            min="1"
            value={config.stake}
            onChange={(e) => handleChange("stake", parseFloat(e.target.value) || 10)}
            className="bg-slate-800/30 border-slate-700/50 text-slate-100 text-sm h-9"
          />
          <div className="text-[10px] text-slate-500">Current stake per trade</div>
        </div>

        {/* Profit Target */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-3 h-3 text-emerald-400" />
            <Label className="text-xs font-bold text-slate-300">Profit Target (USD)</Label>
          </div>
          <Input
            type="number"
            min="1"
            value={config.profitTarget}
            onChange={(e) => handleChange("profitTarget", parseFloat(e.target.value) || 20)}
            className="bg-slate-800/30 border-slate-700/50 text-slate-100 text-sm h-9"
          />
          <div className="text-[10px] text-slate-500">Stop trading when reached</div>
        </div>

        {/* Stop Loss */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-3 h-3 text-red-400" />
            <Label className="text-xs font-bold text-slate-300">Stop Loss (USD)</Label>
          </div>
          <Input
            type="number"
            min="1"
            value={config.stopLoss}
            onChange={(e) => handleChange("stopLoss", parseFloat(e.target.value) || 50)}
            className="bg-slate-800/30 border-slate-700/50 text-slate-100 text-sm h-9"
          />
          <div className="text-[10px] text-slate-500">Max loss limit</div>
        </div>

        {/* Ticks */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Zap className="w-3 h-3 text-yellow-400" />
            <Label className="text-xs font-bold text-slate-300">Ticks (Contract Duration)</Label>
          </div>
          <Input
            type="number"
            min="1"
            max="60"
            value={config.ticks}
            onChange={(e) => handleChange("ticks", parseInt(e.target.value) || 5)}
            className="bg-slate-800/30 border-slate-700/50 text-slate-100 text-sm h-9"
          />
          <div className="text-[10px] text-slate-500">1-60 ticks</div>
        </div>
      </div>

      {/* Martingale Section */}
      <div className="space-y-3 p-3 rounded-lg bg-slate-800/30 border border-slate-700/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Repeat2 className="w-3 h-3 text-orange-400" />
            <Label className="text-xs font-bold text-slate-300">Martingale Strategy</Label>
          </div>
          <Switch
            checked={config.useMartingale}
            onCheckedChange={(checked) => handleChange("useMartingale", checked)}
          />
        </div>

        {config.useMartingale && (
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-700/30">
            {/* Multiplier */}
            <div className="space-y-2">
              <Label className="text-[10px] font-bold text-slate-400">Multiplier</Label>
              <Input
                type="number"
                min="1.5"
                step="0.5"
                value={config.martingaleMultiplier}
                onChange={(e) => handleChange("martingaleMultiplier", parseFloat(e.target.value) || 2)}
                className="bg-slate-800/30 border-slate-700/50 text-slate-100 text-xs h-8"
              />
            </div>

            {/* Max Levels */}
            <div className="space-y-2">
              <Label className="text-[10px] font-bold text-slate-400">Max Levels</Label>
              <Input
                type="number"
                min="1"
                max="10"
                value={config.maxMartingaleLevels}
                onChange={(e) => handleChange("maxMartingaleLevels", parseInt(e.target.value) || 3)}
                className="bg-slate-800/30 border-slate-700/50 text-slate-100 text-xs h-8"
              />
            </div>

            {/* Info */}
            <div className="col-span-2 text-[9px] text-slate-500 p-2 rounded bg-slate-800/50">
              Stake increases by {config.martingaleMultiplier}x after each loss, up to {config.maxMartingaleLevels} levels.
              <br />
              Level 3 will be: ${(config.stake * Math.pow(config.martingaleMultiplier, 2)).toFixed(2)}
            </div>
          </div>
        )}
      </div>

      {/* Advanced Options Toggle */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="text-[11px] text-slate-400 hover:text-slate-200 w-full"
      >
        {showAdvanced ? "Hide" : "Show"} Advanced Options
      </Button>

      {/* Advanced Options */}
      {showAdvanced && (
        <div className="space-y-3 p-3 rounded-lg bg-slate-800/20 border border-slate-700/30">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Market Selection</div>
          <div className="grid grid-cols-2 gap-2">
            {["volatility", "eurusd", "gbpusd", "usdjpy"].map((market) => (
              <Button
                key={market}
                variant={config.market === market ? "default" : "outline"}
                size="sm"
                onClick={() => handleChange("market", market)}
                className="text-xs h-8 capitalize"
              >
                {market}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-700/50">
        <div className="text-center p-2 rounded bg-slate-800/30">
          <div className="text-[9px] text-slate-500">Risk/Trade</div>
          <div className="text-sm font-bold text-cyan-300">${config.stake}</div>
        </div>
        <div className="text-center p-2 rounded bg-slate-800/30">
          <div className="text-[9px] text-slate-500">Profit Goal</div>
          <div className="text-sm font-bold text-emerald-300">${config.profitTarget}</div>
        </div>
        <div className="text-center p-2 rounded bg-slate-800/30">
          <div className="text-[9px] text-slate-500">Max Loss</div>
          <div className="text-sm font-bold text-red-300">${config.stopLoss}</div>
        </div>
      </div>
    </div>
  )
}
