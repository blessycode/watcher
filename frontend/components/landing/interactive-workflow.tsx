"use client"

import React, { useState, useEffect } from "react"
import { Send, Cpu, Bell, Globe, ChevronRight } from "lucide-react"

const workflowSteps = [
  {
    id: "step-1",
    title: "1. Register Endpoint",
    description: "Submit your API endpoint and configure probe regions, schedules, and response thresholds.",
    icon: Send,
    codeTitle: "register-payload.json",
    code: `{
  "monitor": {
    "name": "Checkout API",
    "url": "https://api.acme.com/v2/pay",
    "method": "POST",
    "interval": "30s",
    "regions": ["us-east-1", "eu-west-1", "ap-south-1"],
    "assertions": [
      { "type": "statusCode", "op": "equals", "value": 200 },
      { "type": "responseTime", "op": "lessThan", "value": 500 }
    ]
  }
}`,
  },
  {
    id: "step-2",
    title: "2. Continuous Probing",
    description: "Regional Edge Workers dispatch parallel probes. Watcher calculates exact metrics.",
    icon: Globe,
    codeTitle: "probe-metrics.log",
    code: `[14:32:00] PROBE US-East-1 -> 200 OK (84ms)
[14:32:00] PROBE EU-West-1 -> 200 OK (112ms)
[14:32:00] PROBE AP-South-1 -> 503 SERVICE UNAVAILABLE (timeout)
[14:32:30] PROBE US-East-1 -> 503 SERVICE UNAVAILABLE (timeout)
[14:32:30] PROBE EU-West-1 -> 503 SERVICE UNAVAILABLE (timeout)
[14:32:30] PROBE AP-South-1 -> 503 SERVICE UNAVAILABLE (timeout)
>> CRITICAL: 3/3 regions failed check.`,
  },
  {
    id: "step-3",
    title: "3. Incident Engine",
    description: "The core rule engine evaluates thresholds. Repeated failures trigger automatic incidents.",
    icon: Cpu,
    codeTitle: "incident-rules.yaml",
    code: `incident_rules:
  consecutive_failures_threshold: 3
  re-check_interval: 10s
  auto_escalate: true
status:
  incident_id: "INC-9482"
  title: "Checkout API Outage"
  severity: "CRITICAL"
  state: "INVESTIGATING"`,
  },
  {
    id: "step-4",
    title: "4. Alert & Sync",
    description: "Teams are instantly notified via channels, and public status pages update automatically.",
    icon: Bell,
    codeTitle: "dispatch-alerts.json",
    code: `{
  "incident_id": "INC-9482",
  "dispatched_alerts": [
    { "channel": "Slack", "target": "#oncall-alerts", "delivered": true },
    { "channel": "Discord", "target": "webhook-finance", "delivered": true },
    { "channel": "Email", "target": "ops-team@acme.com", "delivered": true }
  ],
  "status_page_sync": {
    "page": "acme-status",
    "updated_component": "Payments Gateway",
    "status": "degraded_performance"
  }
}`,
  },
]

export function InteractiveWorkflow() {
  const [activeStep, setActiveStep] = useState(0)

  return (
    <div className="grid gap-6 lg:grid-cols-12 items-stretch mt-8">
      {/* Workflow Diagram Left */}
      <div className="lg:col-span-7 flex flex-col justify-between rounded border border-white/5 bg-[#090A0B] p-6 relative">
        <div className="relative z-10 space-y-4">
          <div className="text-[10px] font-mono font-bold text-[#4F8CFF] uppercase tracking-wider mb-2 select-none">
            Click nodes to trace request lifecycle
          </div>
          
          <div className="grid gap-3 relative">
            {workflowSteps.map((step, idx) => {
              const Icon = step.icon
              const isActive = activeStep === idx

              return (
                <div key={step.id} className="relative">
                  {/* Connective Line (SVG style) */}
                  {idx < workflowSteps.length - 1 && (
                    <div className="absolute left-8 top-16 bottom-[-16px] w-0.5 bg-white/5 z-0">
                      {isActive && (
                        <div className="absolute top-0 bottom-0 left-0 right-0 bg-[#4F8CFF] transition-all" />
                      )}
                    </div>
                  )}

                  <button
                    onClick={() => setActiveStep(idx)}
                    className={`relative z-10 w-full text-left flex items-start gap-4 p-4 rounded border transition cursor-pointer select-none ${
                      isActive
                        ? "bg-[#1E2024] border-[#4F8CFF]"
                        : "bg-[#151618] border-white/5 hover:border-white/10 hover:bg-[#1E2024]/50"
                    }`}
                  >
                    <div className={`grid h-10 w-10 shrink-0 place-items-center rounded font-semibold border transition ${
                      isActive
                        ? "bg-[#4F8CFF] text-white border-[#4F8CFF]"
                        : "bg-[#1E2024] text-[#9CA3AF] border-white/5"
                    }`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className={`text-sm font-semibold tracking-tight ${isActive ? "text-[#F3F4F6]" : "text-[#9CA3AF]"}`}>
                        {step.title}
                      </h3>
                      <p className="mt-1 text-xs text-[#9CA3AF] leading-5">
                        {step.description}
                      </p>
                    </div>
                    <ChevronRight className={`ml-auto h-4 w-4 text-[#9CA3AF] self-center transition-transform ${isActive ? "rotate-90 text-[#4F8CFF]" : ""}`} />
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Code Inspector Right */}
      <div className="lg:col-span-5 rounded border border-white/5 bg-[#0B0F19] text-[#E2E8F0] p-5 flex flex-col justify-between h-full relative overflow-hidden min-h-[350px]">
        <div>
          <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4 select-none">
            <span className="font-mono text-xs text-slate-400">
              {workflowSteps[activeStep].codeTitle}
            </span>
            <div className="flex gap-1.5">
              <span className="h-2 w-2 rounded-full bg-slate-800" />
              <span className="h-2 w-2 rounded-full bg-slate-800" />
              <span className="h-2 w-2 rounded-full bg-slate-800" />
            </div>
          </div>
          <pre className="font-mono text-[10.5px] leading-5 text-slate-300 overflow-x-auto whitespace-pre-wrap">
            <code>{workflowSteps[activeStep].code}</code>
          </pre>
        </div>
        <div className="mt-6 border-t border-white/5 pt-3 flex items-center justify-between text-[10px] font-mono text-slate-500 select-none">
          <span>PIPELINE INSPECTOR</span>
          <span>STEP {activeStep + 1} OF 4</span>
        </div>
      </div>
    </div>
  )
}
