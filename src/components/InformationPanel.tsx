import { useState } from 'react'
import { algorithmDescriptions } from '../algorithms/data/algorithmDescriptions'
import type { TabType } from '../types'

interface InformationPanelProps {
  algorithmId: string
}

export default function InformationPanel({
  algorithmId,
}: InformationPanelProps) {
  const [activeTab, setActiveTab] =
    useState<TabType>('overview')

  const info = algorithmDescriptions[algorithmId]

  if (!info) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 text-center text-slate-400">
        Select an algorithm to view detailed educational insights.
      </div>
    )
  }

  const tabs: {
    id: TabType
    label: string
  }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'howItWorks', label: 'How it Works' },
    { id: 'useCases', label: 'Applications' },
  ]

  return (
    <section className="flex flex-col rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-xl">
      <div className="flex flex-col gap-4 border-b border-slate-800 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-xl font-bold text-white">
            {info.name}
          </h3>
          <p className="mt-1 text-sm text-slate-400">
            {info.summary}
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Algorithm information"
          className="theme-info-tabbar flex self-start rounded-lg border p-1 sm:self-auto"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                activeTab === tab.id
                  ? 'theme-info-tab-active shadow'
                  : 'theme-info-tab-inactive'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-4">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {info.keyProperties.map((prop, idx) => (
              <div
                key={idx}
                className="theme-property-card rounded-lg border p-3.5"
              >
                <span className="theme-property-label text-xs font-medium">
                  {prop.label}
                </span>
                <p className="theme-property-value mt-1 text-sm font-semibold">
                  {prop.value}
                </p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'howItWorks' && (
          <ol className="theme-info-body list-decimal space-y-2.5 pl-4 text-sm marker:font-bold marker:text-blue-500">
            {info.howItWorks.map((step, idx) => (
              <li
                key={idx}
                className="pl-1 leading-relaxed"
              >
                {step}
              </li>
            ))}
          </ol>
        )}

        {activeTab === 'useCases' && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="theme-info-success rounded-lg border p-4">
              <h4 className="theme-info-success-title mb-2.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider">
                <span className="text-sm">✓</span>
                When to Use
              </h4>

              <ul className="theme-info-body space-y-1.5 text-xs">
                {info.whenToUse.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2"
                  >
                    <span className="font-bold text-emerald-500">
                      •
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="theme-info-danger rounded-lg border p-4">
              <h4 className="theme-info-danger-title mb-2.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider">
                <span className="text-sm">✗</span>
                Limitations
              </h4>

              <ul className="theme-info-body space-y-1.5 text-xs">
                {info.limitations.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2"
                  >
                    <span className="font-bold text-rose-500">
                      •
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}