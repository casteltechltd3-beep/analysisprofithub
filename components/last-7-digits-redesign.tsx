import React from "react"

interface Last7DigitsCardProps {
  lastDigits: number[]
  theme?: "light" | "dark"
}

// Color palette for each digit position (different colors)
const DIGIT_COLORS = [
  { bg: "bg-gradient-to-br from-cyan-500/20 to-cyan-600/10", border: "border-cyan-400/50", text: "text-cyan-300", glow: "shadow-lg shadow-cyan-500/30" },
  { bg: "bg-gradient-to-br from-blue-500/20 to-blue-600/10", border: "border-blue-400/50", text: "text-blue-300", glow: "shadow-lg shadow-blue-500/30" },
  { bg: "bg-gradient-to-br from-indigo-500/20 to-indigo-600/10", border: "border-indigo-400/50", text: "text-indigo-300", glow: "shadow-lg shadow-indigo-500/30" },
  { bg: "bg-gradient-to-br from-purple-500/20 to-purple-600/10", border: "border-purple-400/50", text: "text-purple-300", glow: "shadow-lg shadow-purple-500/30" },
  { bg: "bg-gradient-to-br from-pink-500/20 to-pink-600/10", border: "border-pink-400/50", text: "text-pink-300", glow: "shadow-lg shadow-pink-500/30" },
  { bg: "bg-gradient-to-br from-rose-500/20 to-rose-600/10", border: "border-rose-400/50", text: "text-rose-300", glow: "shadow-lg shadow-rose-500/30" },
  { bg: "bg-gradient-to-br from-orange-500/20 to-orange-600/10", border: "border-orange-400/50", text: "text-orange-300", glow: "shadow-lg shadow-orange-500/30" },
]

export function Last7DigitsRedesign({ lastDigits, theme = "dark" }: Last7DigitsCardProps) {
  // Get last 7 digits
  const last7 = lastDigits.slice(-7)

  return (
    <div className="w-full space-y-3">
      {/* Title */}
      <div className="flex items-center justify-between px-2">
        <h3 className="text-xs font-black uppercase tracking-widest text-slate-300">Last 7 Digits</h3>
        <span className="text-[10px] font-mono text-slate-500">Recent</span>
      </div>

      {/* Grid of 7 colored cards */}
      <div className="grid grid-cols-7 gap-2">
        {last7.map((digit, index) => {
          const color = DIGIT_COLORS[index]
          return (
            <div
              key={index}
              className={`
                flex flex-col items-center justify-center
                p-3 rounded-lg border
                backdrop-blur-xl transition-all duration-300
                hover:scale-110 hover:shadow-2xl cursor-pointer
                ${color.bg}
                ${color.border}
                ${color.glow}
              `}
            >
              {/* Position indicator (1-7) */}
              <div className="text-[8px] font-bold text-slate-500 mb-1">#{index + 1}</div>
              
              {/* Large digit */}
              <div className={`text-2xl font-black ${color.text}`}>
                {digit}
              </div>
              
              {/* Even/Odd indicator */}
              <div className="text-[8px] font-mono text-slate-500 mt-1">
                {digit % 2 === 0 ? "E" : "O"}
              </div>
            </div>
          )
        })}
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-2 mt-4 px-1">
        {/* Even count */}
        <div className="flex items-center gap-1 p-2 rounded-lg bg-slate-800/50 border border-slate-700/50">
          <span className="text-[10px] font-bold text-slate-400">Even:</span>
          <span className="text-[11px] font-black text-cyan-300">{last7.filter(d => d % 2 === 0).length}</span>
        </div>

        {/* Odd count */}
        <div className="flex items-center gap-1 p-2 rounded-lg bg-slate-800/50 border border-slate-700/50">
          <span className="text-[10px] font-bold text-slate-400">Odd:</span>
          <span className="text-[11px] font-black text-purple-300">{last7.filter(d => d % 2 === 1).length}</span>
        </div>

        {/* Sum */}
        <div className="flex items-center gap-1 p-2 rounded-lg bg-slate-800/50 border border-slate-700/50">
          <span className="text-[10px] font-bold text-slate-400">Sum:</span>
          <span className="text-[11px] font-black text-emerald-300">{last7.reduce((a, b) => a + b, 0)}</span>
        </div>
      </div>
    </div>
  )
}
