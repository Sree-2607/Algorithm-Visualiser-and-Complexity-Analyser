import { useState } from 'react'
import { algorithmDescriptions } from '../algorithms/data/algorithmDescriptions'
import type { TabType } from '../types'

interface InformationPanelProps {
  algorithmId: string
}

export default function InformationPanel({ algorithmId }: InformationPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview')

  const info = algorithmDescriptions[algorithmId]

  if (!info) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 text-center text-slate-400">
        Select an algorithm to view detailed educational insights.
      </div>
    )
  }

  return (
    <div className="flex flex-col rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl backdrop-blur-md">
      {/* Header & Tabs Bar */}
      <div className="flex flex-col gap-4 border-b border-slate-800 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-xl font-bold text-white">{info.name}</h3>
          <p className="text-sm text-slate-400">{info.summary}</p>
        </div>

        {/* Tab Buttons */}
        <div className="flex rounded-lg bg-slate-950 p-1 border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              activeTab === 'overview'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('howItWorks')}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              activeTab === 'howItWorks'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            How it Works
          </button>
          <button
            onClick={() => setActiveTab('useCases')}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              activeTab === 'useCases'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Applications
          </button>
        </div>
      </div>

      {/* Tab Content Panes */}
      <div className="pt-4">
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {info.keyProperties.map((prop, idx) => (
              <div
                key={idx}
                className="rounded-lg border border-slate-800 bg-slate-950/60 p-3.5"
              >
                <span className="text-xs font-medium text-slate-400">{prop.label}</span>
                <p className="mt-1 text-sm font-semibold text-slate-100">{prop.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: HOW IT WORKS */}
        {activeTab === 'howItWorks' && (
          <ol className="space-y-2.5 pl-4 text-sm text-slate-300 list-decimal marker:text-blue-500 marker:font-bold">
            {info.howItWorks.map((step, idx) => (
              <li key={idx} className="pl-1 leading-relaxed">
                {step}
              </li>
            ))}
          </ol>
        )}

        {/* TAB 3: USE CASES & LIMITATIONS */}
        {activeTab === 'useCases' && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* When to Use */}
            <div className="rounded-lg border border-emerald-950/50 bg-emerald-950/10 p-4">
              <h4 className="mb-2.5 text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <span className="text-sm">✓</span> When to Use
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {info.whenToUse.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Limitations */}
            <div className="rounded-lg border border-rose-950/50 bg-rose-950/10 p-4">
              <h4 className="mb-2.5 text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                <span className="text-sm">✗</span> Limitations
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {info.limitations.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-rose-500 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}