import { useEffect, useMemo, useState } from 'react'
import type {
  AlgorithmType,
  GraphData,
  StepEvent,
} from '../types'
import { graphAlgorithms } from '../algorithms/graph'
import {
  createDefaultGraph,
  generateRandomGraph,
  parseCustomGraph,
} from '../algorithms/data/graphPresets'
import AlgoSelector from '../components/AlgoSelector'
import GraphVisualizer from '../components/GraphVisualizer'
import GraphInputPicker from '../components/GraphInputPicker'
import type { GraphInputSource } from '../components/GraphInputPicker'
import InformationPanel from '../components/InformationPanel'
import PseudoCodePanel from '../components/PseudocodePanel'
import Controls from '../components/Controls'
import Legend from '../components/Legend'

// Validate input before calling the graph parser.
function validateGraphInput(input: string): string | null {
  if (!input.trim()) {
    return 'Please enter at least one edge.'
  }

  const pairs = input.split(',')
  const nodeIds = new Set<string>()
  const edgeKeys = new Set<string>()

  if (pairs.length > 30) {
    return 'Please enter no more than 30 edges.'
  }

  for (const pair of pairs) {
    const match = pair.trim().match(
      /^([a-zA-Z0-9]+)-([a-zA-Z0-9]+)(?::(-?\d+))?$/
    )

    if (!match) {
      return `Invalid edge: "${pair.trim()}". Use A-B:4 format.`
    }

    const from = match[1]
    const to = match[2]
    const weight = match[3] === undefined
      ? 1
      : Number(match[3])

    if (from === to) {
      return 'Self-loops are not supported in this input mode.'
    }

    if (
      !Number.isSafeInteger(weight) ||
      weight < -99 ||
      weight > 99
    ) {
      return 'Edge weights must be integers between -99 and 99.'
    }

    // An undirected edge has the same identity in either order.
    const edgeKey = [from, to].sort().join('::')

    if (edgeKeys.has(edgeKey)) {
      return `Duplicate edge detected: ${from}-${to}.`
    }

    edgeKeys.add(edgeKey)
    nodeIds.add(from)
    nodeIds.add(to)
  }

  if (nodeIds.size < 2 || nodeIds.size > 12) {
    return 'Enter a graph containing 2 to 12 distinct nodes.'
  }

  return null
}

export default function GraphScreen() {
  // Algorithm selection
  const [selectedAlgorithmId, setSelectedAlgorithmId] =
    useState<AlgorithmType>('dijkstra')

  // Graph source and data
  const [graphData, setGraphData] =
    useState<GraphData>(createDefaultGraph)

  const [selectedSource, setSelectedSource] =
    useState<GraphInputSource>('default')

  const [customInput, setCustomInput] = useState('')
  const [inputError, setInputError] = useState<string | null>(null)

  // Start and destination nodes
  const [startNodeId, setStartNodeId] = useState('A')
  const [goalNodeId, setGoalNodeId] = useState('E')

  // Playback state
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(500)

  const currentAlgorithm = graphAlgorithms[selectedAlgorithmId]

  // Generate all step events for current configuration
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
        { goalNodeId, isDirected: false }
      )

      return {
        steps,
        error:
          steps.length === 0
            ? 'The algorithm returned no execution events.'
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
  }, [
    currentAlgorithm,
    selectedAlgorithmId,
    graphData,
    startNodeId,
    goalNodeId,
  ])

  const stepEvents = execution.steps
  const totalSteps = stepEvents.length
  const activeStep = stepEvents[currentStepIndex] ?? null

  // Automatic playback
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

  // Common playback reset
  const resetPlayback = () => {
    setIsPlaying(false)
    setCurrentStepIndex(0)
  }

  // Change algorithm
  const handleAlgorithmChange = (algorithmId: AlgorithmType) => {
    resetPlayback()
    setSelectedAlgorithmId(algorithmId)
  }

  // Apply a new graph and choose valid endpoints
  const applyGraph = (nextGraph: GraphData) => {
    resetPlayback()
    setGraphData(nextGraph)

    setStartNodeId(nextGraph.nodes[0]?.id ?? '')
    setGoalNodeId(
      nextGraph.nodes[nextGraph.nodes.length - 1]?.id ?? ''
    )

    setInputError(null)
  }

  // Graph source selection
  const handleSourceChange = (source: GraphInputSource) => {
    setSelectedSource(source)
    setInputError(null)
  }

  // Generate or parse graph data
  const handleApplyGraph = () => {
    if (selectedSource === 'default') {
      applyGraph(createDefaultGraph())
      return
    }

    if (selectedSource === 'random') {
      applyGraph(generateRandomGraph(6, 500, 400))
      return
    }

    const validationError = validateGraphInput(customInput)

    if (validationError) {
      setInputError(validationError)
      return
    }

    try {
      // The existing parser returns GraphData.
      const parsedGraph = parseCustomGraph(customInput)

      if (parsedGraph.nodes.length < 2) {
        setInputError('Graph must contain at least two nodes.')
        return
      }

      applyGraph(parsedGraph)
    } catch (error) {
      setInputError(
        error instanceof Error
          ? error.message
          : 'Unable to parse the custom graph.'
      )
    }
  }

  const handleStartNodeChange = (nodeId: string) => {
    resetPlayback()
    setStartNodeId(nodeId)
  }

  const handleGoalNodeChange = (nodeId: string) => {
    resetPlayback()
    setGoalNodeId(nodeId)
  }

  const handlePlay = () => {
    if (totalSteps <= 1) return

    if (currentStepIndex >= totalSteps - 1) {
      setCurrentStepIndex(0)
    }

    setIsPlaying(true)
  }

  const handlePause = () => setIsPlaying(false)

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

  const progress =
    totalSteps === 0
      ? 0
      : ((currentStepIndex + 1) / totalSteps) * 100

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 p-6 text-slate-100">

      {/* Header */}
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

      {/* Graph input controls */}
      <GraphInputPicker
        selectedSource={selectedSource}
        customInput={customInput}
        onSourceChange={handleSourceChange}
        onCustomInputChange={setCustomInput}
        onApply={handleApplyGraph}
      />

      {/* Validation message */}
      {inputError && (
        <div
          role="alert"
          className="rounded-xl border border-red-800 bg-red-950/40 p-4 text-sm text-red-300"
        >
          {inputError}
        </div>
      )}

      {/* Node configuration */}
      <section className="flex flex-wrap items-end gap-4 rounded-xl border border-slate-800 bg-slate-900 p-4">

        <div className="flex flex-col gap-2">
          <label
            htmlFor="graph-start-node"
            className="text-xs font-bold uppercase text-slate-400"
          >
            Start Node
          </label>

          <select
            id="graph-start-node"
            value={startNodeId}
            onChange={(event) =>
              handleStartNodeChange(event.target.value)
            }
            className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-white"
          >
            {graphData.nodes.map((node) => (
              <option key={node.id} value={node.id}>
                {node.id}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="graph-goal-node"
            className="text-xs font-bold uppercase text-slate-400"
          >
            Goal Node (A*)
          </label>

          <select
            id="graph-goal-node"
            value={goalNodeId}
            onChange={(event) =>
              handleGoalNodeChange(event.target.value)
            }
            className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-white"
          >
            {graphData.nodes.map((node) => (
              <option key={node.id} value={node.id}>
                {node.id}
              </option>
            ))}
          </select>
        </div>

        <span className="pb-2 text-xs text-slate-400">
          Undirected graph · {graphData.nodes.length} nodes ·{' '}
          {graphData.edges.length} edges
        </span>
      </section>

      {/* Algorithm execution error */}
      {execution.error && (
        <div
          role="alert"
          className="rounded-xl border border-red-800 bg-red-950/40 p-4 text-sm text-red-300"
        >
          {execution.error}
        </div>
      )}

      {/* Graph and pseudocode */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

        <div className="flex min-w-0 flex-col gap-4 lg:col-span-2">
          <GraphVisualizer
            graph={graphData}
            activeStep={activeStep}
            isDirected={false}
          />

          <Legend category="graph" />
        </div>

        <div className="min-w-0">
          {currentAlgorithm && (
            <PseudoCodePanel
              lines={currentAlgorithm.info.pseudocode}
              activeLine={activeStep?.pseudocodeLine ?? -1}
            />
          )}
        </div>

      </div>

      {/* Playback controls */}
      <Controls
        isPlaying={isPlaying}
        speed={speed}
        onPlay={handlePlay}
        onPause={handlePause}
        onReset={resetPlayback}
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
          {activeStep?.description ??
            'No execution step available.'}
        </p>

      </section>

      {/* Dynamic algorithm information */}
      <InformationPanel algorithmId={selectedAlgorithmId} />

    </div>
  )
}