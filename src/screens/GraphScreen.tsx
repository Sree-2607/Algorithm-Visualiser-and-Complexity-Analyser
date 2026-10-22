import { useEffect, useMemo, useState } from 'react'
import type { AlgorithmType, StepEvent } from '../types'
import { graphAlgorithms } from '../algorithms/graph'
import { createDefaultGraph } from '../algorithms/data/graphPresets'
import AlgoSelector from '../components/AlgoSelector'
import GraphVisualizer from '../components/GraphVisualizer'
import InformationPanel from '../components/InformationPanel'
import PseudoCodePanel from '../components/PseudocodePanel'
import Controls from '../components/Controls'
import Legend from '../components/Legend'

export default function GraphScreen() {
  // 1. Selected algorithm
  const [selectedAlgorithmId, setSelectedAlgorithmId] =
    useState<AlgorithmType>('dijkstra')

  // 2. Graph data
  const [graphData] = useState(createDefaultGraph)

  const startNodeId = 'A'
  const goalNodeId = 'E'

  // 3. Playback state
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(500)

  // 4. Selected algorithm engine
  const currentAlgorithm = graphAlgorithms[selectedAlgorithmId]

  // 5. Generate events
  const execution = useMemo(() => {
    if (!currentAlgorithm) {
      return {
        steps: [] as StepEvent[],
        error: `Algorithm "${selectedAlgorithmId}" was not found.`,
      }
    }

    try {
      const steps = currentAlgorithm.run(
        graphData.nodes,
        graphData.edges,
        startNodeId,
        { goalNodeId }
      )

      return {
        steps,
        error:
          steps.length === 0
            ? 'The selected algorithm returned no execution events.'
            : null,
      }
    } catch (error) {
      return {
        steps: [] as StepEvent[],
        error:
          error instanceof Error
            ? error.message
            : 'Unknown algorithm execution error.',
      }
    }
  }, [currentAlgorithm, selectedAlgorithmId, graphData])

  // 6. Derived execution values
  const stepEvents = execution.steps
  const totalSteps = stepEvents.length
  const activeStep = stepEvents[currentStepIndex] ?? null

  // 7. Automatic playback
  useEffect(() => {
    if (!isPlaying || totalSteps <= 1) return

    if (currentStepIndex >= totalSteps - 1) return

    const timeoutId = window.setTimeout(() => {
      const nextIndex = currentStepIndex + 1
      setCurrentStepIndex(nextIndex)

      if (nextIndex >= totalSteps - 1) {
        setIsPlaying(false)
      }
    }, speed)

    return () => window.clearTimeout(timeoutId)
  }, [isPlaying, currentStepIndex, totalSteps, speed])

  // 8. Event handlers
  const handleAlgorithmChange = (algorithmId: AlgorithmType) => {
    setIsPlaying(false)
    setCurrentStepIndex(0)
    setSelectedAlgorithmId(algorithmId)
  }

  const handlePlay = () => {
    if (totalSteps <= 1) return

    if (currentStepIndex >= totalSteps - 1) {
      setCurrentStepIndex(0)
    }

    setIsPlaying(true)
  }

  const handlePause = () => {
    setIsPlaying(false)
  }

  const handleReset = () => {
    setIsPlaying(false)
    setCurrentStepIndex(0)
  }

  const handleStepForward = () => {
    setIsPlaying(false)
    setCurrentStepIndex((previous) =>
      Math.min(previous + 1, Math.max(0, totalSteps - 1))
    )
  }

  const handleStepBackward = () => {
    setIsPlaying(false)
    setCurrentStepIndex((previous) =>
      Math.max(previous - 1, 0)
    )
  }

  // 9. Derived progress value
  const progress =
    totalSteps === 0
      ? 0
      : ((currentStepIndex + 1) / totalSteps) * 100

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 p-6 text-slate-100">

      {/* Header and algorithm selector */}
      <header className="flex flex-col gap-4 rounded-xl border border-slate-800 bg-slate-900 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Graph Visualizer
          </h1>

          <p className="text-sm text-slate-400">
            Explore graph algorithms and their applications.
          </p>
        </div>

        <AlgoSelector
          category="graph"
          selectedAlgorithm={selectedAlgorithmId}
          onAlgorithmChange={handleAlgorithmChange}
        />
      </header>

      {/* Execution error */}
      {execution.error && (
        <div
          role="alert"
          className="rounded-xl border border-red-800 bg-red-950/40 p-4 text-sm text-red-300"
        >
          {execution.error}
        </div>
      )}

      {/* Main visualization area */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

        {/* Graph + matching legend */}
        <div className="flex min-w-0 flex-col gap-4 lg:col-span-2">
          <GraphVisualizer
            graph={graphData}
            activeStep={activeStep}
          />

          <Legend category="graph" />
        </div>

        {/* Pseudocode */}
        <div className="min-w-0">
          {currentAlgorithm && (
            <PseudoCodePanel
              lines={currentAlgorithm.info.pseudocode}
              activeLine={activeStep?.pseudocodeLine ?? -1}
            />
          )}
        </div>

      </div>

      {/* Reused playback controls */}
      <Controls
        isPlaying={isPlaying}
        speed={speed}
        onPlay={handlePlay}
        onPause={handlePause}
        onReset={handleReset}
        onStepForward={handleStepForward}
        onStepBackward={handleStepBackward}
        onSpeedChange={setSpeed}
      />

      {/* Execution progress */}
      <section className="rounded-xl border border-slate-800 bg-slate-900 p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">
            Execution Progress
          </h2>

          <span className="font-mono text-xs text-amber-400">
            {totalSteps === 0 ? 0 : currentStepIndex + 1}
            {' / '}
            {totalSteps}
          </span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-slate-700">
          <div
            className="h-full rounded-full bg-amber-500 transition-all duration-150"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="mt-3 text-sm text-slate-400">
          {activeStep?.description ?? 'No execution step available.'}
        </p>
      </section>

      {/* Educational information */}
      <InformationPanel algorithmId={selectedAlgorithmId} />

    </div>
  )
}