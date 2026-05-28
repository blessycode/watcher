"use client"

import React, { useState, useEffect, useRef } from "react"
import { Play, RotateCcw, ShieldCheck, Terminal, AlertTriangle, XCircle, Globe, ChevronDown, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

const presetEndpoints = [
  {
    name: "Stripe Charges API",
    url: "https://api.stripe.com/v1/charges",
    method: "POST",
    expectedStatus: 200,
    type: "success",
  },
  {
    name: "GitHub Octocat API",
    url: "https://api.github.com/users/octocat",
    method: "GET",
    expectedStatus: 200,
    type: "success",
  },
  {
    name: "Acme Billing PDF (Degraded)",
    url: "https://billing.acme.io/v2/invoice/pdf",
    method: "GET",
    expectedStatus: 200,
    type: "degraded",
  },
  {
    name: "Legacy Database (Down)",
    url: "https://db.internal.net/v1/query",
    method: "POST",
    expectedStatus: 200,
    type: "down",
  },
]

interface LogLine {
  text: string
  type: "info" | "success" | "warning" | "error" | "header"
}

export function ApiPlayground() {
  const [url, setUrl] = useState(presetEndpoints[0].url)
  const [method, setMethod] = useState(presetEndpoints[0].method)
  const [activePreset, setActivePreset] = useState<number>(0)
  const [isRunning, setIsRunning] = useState(false)
  const [logs, setLogs] = useState<LogLine[]>([])
  const [showPresetsDropdown, setShowPresetsDropdown] = useState(false)
  
  const terminalEndRef = useRef<HTMLDivElement>(null)

  const handleSelectPreset = (idx: number) => {
    setActivePreset(idx)
    setUrl(presetEndpoints[idx].url)
    setMethod(presetEndpoints[idx].method)
    setShowPresetsDropdown(false)
    setLogs([])
  }

  // Auto scroll terminal logs
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [logs])

  const runMonitorCheck = async () => {
    if (isRunning) return
    setIsRunning(true)
    setLogs([])

    const addLog = (text: string, type: LogLine["type"] = "info", delay: number) => {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          setLogs((prev) => [...prev, { text, type }])
          resolve()
        }, delay)
      })
    }

    // Step 1: Initialize
    await addLog(`[watcher-worker-01] Initializing edge monitor check...`, "info", 100)
    await addLog(`[watcher-worker-01] Method: ${method} | Target: ${url}`, "header", 300)
    
    // Step 2: DNS Lookup
    const host = new URL(url).hostname || "localhost"
    await addLog(`[dns] Resolving host: ${host}...`, "info", 400)
    const resolvedIp = host === "localhost" ? "127.0.0.1" : `104.18.2${Math.floor(Math.random() * 9)}.${Math.floor(Math.random() * 254)}`
    await addLog(`[dns] Resolved ${host} to IP ${resolvedIp} in 14ms`, "success", 400)

    // Step 3: SSL Validation
    await addLog(`[ssl] Checking SSL/TLS handshake...`, "info", 300)
    if (url.startsWith("https://")) {
      await addLog(`[ssl] SSL verified. Authority: Let's Encrypt. Expiry: 82 days remaining`, "success", 300)
    } else {
      await addLog(`[ssl] WARNING: Secure connection (HTTPS) not detected.`, "warning", 300)
    }

    // Step 4: Dispatch global probes
    await addLog(`[probe] Dispatching regional checks from 3 global nodes...`, "info", 500)

    let usResult: LogLine, euResult: LogLine, apResult: LogLine
    let finalStatus = "success"

    // Simulate different behaviors based on URL/Preset
    const isCustom = !presetEndpoints.some(p => p.url === url)
    const preset = isCustom ? null : presetEndpoints[activePreset]
    const testType = preset ? preset.type : "success"

    if (testType === "success") {
      usResult = { text: `[us-east-1] HTTP 200 OK - Response in 42ms`, type: "success" }
      euResult = { text: `[eu-west-1] HTTP 200 OK - Response in 108ms`, type: "success" }
      apResult = { text: `[ap-south-1] HTTP 200 OK - Response in 214ms`, type: "success" }
      finalStatus = "operational"
    } else if (testType === "degraded") {
      usResult = { text: `[us-east-1] HTTP 200 OK - Response in 452ms (Warning: High latency)`, type: "warning" }
      euResult = { text: `[eu-west-1] HTTP 200 OK - Response in 512ms (Warning: High latency)`, type: "warning" }
      apResult = { text: `[ap-south-1] HTTP 200 OK - Response in 890ms (Warning: High latency)`, type: "warning" }
      finalStatus = "degraded"
    } else {
      usResult = { text: `[us-east-1] HTTP 503 Service Unavailable (DNS Timeout)`, type: "error" }
      euResult = { text: `[eu-west-1] HTTP 503 Service Unavailable (Gateway Failure)`, type: "error" }
      apResult = { text: `[ap-south-1] HTTP 503 Service Unavailable (Connection Refused)`, type: "error" }
      finalStatus = "down"
    }

    await addLog(usResult.text, usResult.type, 400)
    await addLog(euResult.text, euResult.type, 500)
    await addLog(apResult.text, apResult.type, 600)

    // Step 5: Final output and synthesis
    await addLog(`[watcher-worker-01] Check completed. Synthesizing health report...`, "info", 500)

    if (finalStatus === "operational") {
      await addLog(`RESULT: Operational. Service is healthy.`, "success", 400)
    } else if (finalStatus === "degraded") {
      await addLog(`RESULT: Degraded. Uptime is stable, but latency is above threshold (P95 > 400ms).`, "warning", 400)
    } else {
      await addLog(`CRITICAL: Service is down. Incident created automatically. Slack #oncall alerted.`, "error", 400)
    }

    setIsRunning(false)
  }

  return (
    <div className="w-full rounded border border-white/5 bg-[#151618] overflow-hidden shadow-2xl">
      {/* Interactive Form */}
      <div className="p-4 border-b border-white/5 bg-[#090A0B] flex flex-col md:flex-row gap-3">
        <div className="flex gap-2">
          {/* Preset Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowPresetsDropdown(!showPresetsDropdown)}
              disabled={isRunning}
              className="flex items-center justify-between gap-1.5 px-3 py-2 text-xs font-medium border border-white/5 rounded bg-[#151618] hover:bg-[#1E2024] text-[#F3F4F6] cursor-pointer disabled:opacity-50 select-none"
            >
              <span>Presets</span>
              <ChevronDown className="h-3 w-3 text-[#9CA3AF]" />
            </button>
            {showPresetsDropdown && (
              <div className="absolute left-0 mt-1.5 w-52 rounded border border-white/5 bg-[#151618] p-1 shadow-2xl z-50">
                {presetEndpoints.map((preset, idx) => (
                  <button
                    key={preset.name}
                    onClick={() => handleSelectPreset(idx)}
                    className="w-full flex items-center justify-between px-3 py-1.5 text-left text-xs rounded hover:bg-[#1E2024] transition-colors"
                  >
                    <span className="text-[#F3F4F6] font-medium">{preset.name}</span>
                    {activePreset === idx && <Check className="h-3.5 w-3.5 text-[#4F8CFF]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* HTTP Method selector */}
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            disabled={isRunning}
            className="px-3 py-2 text-xs font-mono font-bold border border-white/5 rounded bg-[#151618] hover:bg-[#1E2024] text-[#F3F4F6] cursor-pointer focus:outline-none disabled:opacity-50"
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
          </select>
        </div>

        {/* URL Input */}
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={isRunning}
            placeholder="https://api.yourdomain.com/health"
            className="flex-1 px-3 py-2 text-xs font-mono border border-white/5 rounded bg-[#090A0B] text-[#F3F4F6] focus:outline-none focus:border-[#4F8CFF] disabled:opacity-70"
          />

          <Button
            onClick={runMonitorCheck}
            disabled={isRunning}
            size="sm"
            className="rounded bg-[#4F8CFF] hover:bg-[#3B7BE6] text-white px-4 font-semibold shrink-0 shadow-md shadow-[#4F8CFF]/15 border-0 h-8 text-[12px]"
          >
            {isRunning ? (
              <>
                <Loader2 className="mr-1.5 h-3 w-3 animate-spin" />
                Checking
              </>
            ) : (
              <>
                <Play className="mr-1.5 h-3 w-3 fill-current" />
                Run Check
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Terminal View */}
      <div className="bg-[#0B0F19] text-[#E2E8F0] font-mono text-[11px] p-5 h-72 overflow-y-auto relative">
        {logs.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-2 select-none">
            <Terminal className="h-7 w-7 text-[#4F8CFF] opacity-60" />
            <p className="text-center max-w-xs leading-5 text-[11px]">
              Enter an endpoint above and click <strong className="text-slate-400">Run Check</strong> to simulate a Watcher health monitoring sequence.
            </p>
          </div>
        ) : (
          <div className="space-y-1.5">
            {logs.map((log, idx) => {
              let textClass = "text-slate-300"
              if (log.type === "success") textClass = "text-[#22C55E]"
              if (log.type === "warning") textClass = "text-[#F59E0B]"
              if (log.type === "error") textClass = "text-[#EF4444] font-bold"
              if (log.type === "header") textClass = "text-[#4F8CFF] font-bold"

              return (
                <div key={idx} className={`flex items-start gap-1 leading-5 ${textClass}`}>
                  <span className="text-slate-600 select-none">&gt;</span>
                  <span>{log.text}</span>
                </div>
              )
            })}
            
            {isRunning && (
              <div className="flex items-center gap-1.5 text-slate-500 mt-1 select-none">
                <span>&gt;</span>
                <span className="h-3 w-1.5 bg-slate-400 animate-cursor" />
              </div>
            )}
            <div ref={terminalEndRef} />
          </div>
        )}
      </div>
    </div>
  )
}
