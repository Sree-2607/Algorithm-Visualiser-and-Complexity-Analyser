import { useState } from 'react'
import SortingScreen from './screens/SortingScreen'
import GraphScreen from './screens/GraphScreen'
import CompareMode from './components/CompareMode'
type AppMode = 'sorting' | 'graph' | 'compare'

function App() {
  const [activeMode, setActiveMode] =
    useState<AppMode>('sorting')

  const navigation: {
    id: AppMode
    label: string
  }[] = [
    { id: 'sorting', label: 'Sorting' },
    { id: 'graph', label: 'Graph' },
    { id: 'compare', label: 'Compare' },
  ]

  return (
    <main className="min-h-screen bg-slate-800">

      {/* Main application navigation */}
      <nav className="border-b border-slate-700 bg-slate-900 px-6 py-4">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">

          <h1 className="text-lg font-bold text-white">
            Algorithm Visualizer
          </h1>

          <div className="flex flex-wrap gap-2">
            {navigation.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveMode(item.id)}
                aria-current={
                  activeMode === item.id ? 'page' : undefined
                }
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                  activeMode === item.id
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

        </div>
      </nav>

      {/* Render the active screen */}
      {activeMode === 'sorting' && <SortingScreen />}

      {activeMode === 'graph' && <GraphScreen />}

      {activeMode === 'compare' && <CompareMode />}

    </main>
  )
}
export default App