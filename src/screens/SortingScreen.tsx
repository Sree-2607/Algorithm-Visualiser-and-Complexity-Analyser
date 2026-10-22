import { useMemo, useState } from 'react'
import type {
  Algorithm,
  AlgorithmType,
  InputSource,
} from '../types'
import {
  bubbleSort,
  selectionSort,
  insertionSort,
  mergeSort,
  quickSort,
  heapSort,
} from '../algorithms/sorting'
import AlgoSelector from '../components/AlgoSelector'
import InputSourcePicker from '../components/inputSourcePicker'
import SortVisualizer from '../components/SortVisualizer'
import PseudoCodePanel from '../components/PseudocodePanel'
import Controls from '../components/Controls'
import StatsPanel from '../components/StatsPanel'
import Legend from '../components/Legend'
import InformationPanel from '../components/InformationPanel'

import { useStepPlayer } from '../hooks/useStepPlayer'

// Sorting-only algorithm IDs
type SortingAlgorithmId =
  | 'bubbleSort'
  | 'selectionSort'
  | 'insertionSort'
  | 'mergeSort'
  | 'quickSort'
  | 'heapSort'

// Registry of the six sorting engines
const sortingAlgorithms: Record<SortingAlgorithmId, Algorithm> = {
  bubbleSort,
  selectionSort,
  insertionSort,
  mergeSort,
  quickSort,
  heapSort,
}

const DEFAULT_ARRAY = [42, 17, 8, 65, 23, 91, 34, 56]

// Random integer between min and max, inclusive
function randomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// Fisher-Yates shuffle
function shuffleArray(values: number[]): number[] {
  const result = [...values]

  for (let i = result.length - 1; i > 0; i--) {
    const j = randomNumber(0, i)

    ;[result[i], result[j]] = [result[j], result[i]]
  }

  return result
}

// Generate an input array from a preset
function generateDataset(source: InputSource): number[] {
  const size = 8

  const randomValues = () =>
    Array.from(
      { length: size },
      () => randomNumber(5, 100)
    )

  switch (source) {
    case 'random':
      return randomValues()

    case 'sorted':
      return randomValues().sort((a, b) => a - b)

    case 'reverse':
      return randomValues().sort((a, b) => b - a)

    case 'nearlySorted': {
      const values = randomValues().sort((a, b) => a - b)
      const index = randomNumber(0, size - 2)

      ;[values[index], values[index + 1]] = [
        values[index + 1],
        values[index],
      ]

      return values
    }

    case 'fewUnique': {
      const uniqueValues = Array.from(
        { length: 3 },
        () => randomNumber(5, 100)
      )

      const values = Array.from(
        { length: size },
        () => uniqueValues[randomNumber(0, 2)]
      )

      return shuffleArray(values)
    }

    case 'custom':
      return [...DEFAULT_ARRAY]

    default:
      return [...DEFAULT_ARRAY]
  }
}

// Validate custom input before applying it
function parseCustomArray(input: string): {
  values: number[]
  error: string | null
} {
  if (!input.trim()) {
    return {
      values: [],
      error: 'Please enter comma-separated numbers.',
    }
  }

  const parts = input.split(',')

  if (parts.length < 2 || parts.length > 30) {
    return {
      values: [],
      error: 'Enter between 2 and 30 numbers.',
    }
  }

  const values: number[] = []

  for (const part of parts) {
    const text = part.trim()

    if (!/^\d+$/.test(text)) {
      return {
        values: [],
        error: 'Only whole numbers separated by commas are supported.',
      }
    }

    const value = Number(text)

    if (
      !Number.isSafeInteger(value) ||
      value < 5 ||
      value > 100
    ) {
      return {
        values: [],
        error: 'Each number must be between 5 and 100.',
      }
    }

    values.push(value)
  }

  return { values, error: null }
}

// Narrow project-wide AlgorithmType to sorting IDs
function isSortingAlgorithm(
  id: AlgorithmType
): id is SortingAlgorithmId {
  return Object.prototype.hasOwnProperty.call(
    sortingAlgorithms,
    id
  )
}

// Choose the appropriate operation label
function getOperationLabel(id: SortingAlgorithmId): string {
  if (id === 'mergeSort') {
    return 'Writes'
  }

  if (id === 'insertionSort') {
    return 'Shifts / Writes'
  }

  return 'Swaps / Writes'
}

// Props for the actual sorting playback component
interface SortingPlaybackProps {
  algorithmId: SortingAlgorithmId
  inputArray: number[]
}

// Playback component owns its own execution state
function SortingPlayback({
  algorithmId,
  inputArray,
}: SortingPlaybackProps) {
  const algorithm = sortingAlgorithms[algorithmId]

  // Generate steps when the algorithm or input changes
  const steps = useMemo(
    () => algorithm.run([...inputArray]),
    [algorithm, inputArray]
  )

  // Playback speed in milliseconds
  const [speed, setSpeed] = useState(500)

  // Existing shared sorting playback hook
  const player = useStepPlayer(inputArray, steps, speed)

  const isFinished =
    player.totalSteps > 0 &&
    player.currentStepIndex >= player.totalSteps - 1

  const handlePlay = () => {
    if (player.totalSteps === 0) return

    // Restart if already finished
    if (isFinished) {
      player.reset()
    }

    player.play()
  }

  const handlePause = () => {
    player.pause()
  }

  const handleReset = () => {
    player.reset()
  }

  // Manual navigation always pauses playback first
  const handleNext = () => {
    player.pause()

    if (!isFinished) {
      player.stepForward()
    }
  }

  const handleBack = () => {
    player.pause()
    player.stepBackward()
  }

  return (
    <div className="flex flex-col gap-6">

      {/* Sorting visualization and pseudocode */}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">

        <div className="min-w-0 lg:col-span-2">
          <SortVisualizer bars={player.bars} />
        </div>

        <div className="min-w-0">
          <PseudoCodePanel
            lines={algorithm.info.pseudocode}
            activeLine={
              player.currentStep?.pseudocodeLine ?? -1
            }
          />
        </div>

      </div>

      {/* Playback controls */}
      <Controls
        isPlaying={player.isPlaying}
        speed={speed}
        onPlay={handlePlay}
        onPause={handlePause}
        onReset={handleReset}
        onStepForward={handleNext}
        onStepBackward={handleBack}
        onSpeedChange={setSpeed}
      />

      {/* Visual state legend */}
      <Legend category="sorting" />

      {/* Execution statistics */}
      <StatsPanel
        comparisons={player.comparisons}
        swapsOrWrites={player.swapsOrWrites}
        operationLabel={getOperationLabel(algorithmId)}
        currentStepIndex={player.currentStepIndex}
        totalSteps={player.totalSteps}
        currentStepDescription={
          player.currentStep?.description ?? ''
        }
      />

      {/* Execution status */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-white">
              Execution Status
            </h3>

            <p className="mt-1 text-xs text-slate-400">
              {isFinished
                ? 'Sorting completed successfully.'
                : player.isPlaying
                  ? 'Algorithm is executing.'
                  : 'Ready for playback.'}
            </p>
          </div>

          <span className="font-mono text-xs text-amber-400">
            {player.totalSteps === 0
              ? 0
              : player.currentStepIndex + 1}
            {' / '}
            {player.totalSteps}
          </span>
        </div>

      </div>

    </div>
  )
}

export default function SortingScreen() {
  // Selected sorting algorithm
  const [selectedAlgorithmId, setSelectedAlgorithmId] =
    useState<SortingAlgorithmId>('bubbleSort')

  // Shared input data for the active algorithm
  const [inputArray, setInputArray] = useState<number[]>(
    () => [...DEFAULT_ARRAY]
  )

  // Input source configuration
  const [selectedInputSource, setSelectedInputSource] =
    useState<InputSource>('random')

  const [customInput, setCustomInput] = useState('')
  const [inputError, setInputError] = useState<string | null>(null)

  // Changes when a new execution should be initialized
  const [executionVersion, setExecutionVersion] = useState(0)

  // Change selected sorting algorithm
  const handleAlgorithmChange = (id: AlgorithmType) => {
    if (!isSortingAlgorithm(id)) return

    setSelectedAlgorithmId(id)
  }

  // Change input configuration
  const handleInputSourceChange = (source: InputSource) => {
    setSelectedInputSource(source)
    setInputError(null)
  }

  // Generate or parse an input array
  const handleGenerateInput = () => {
    if (selectedInputSource === 'custom') {
      const result = parseCustomArray(customInput)

      if (result.error) {
        setInputError(result.error)
        return
      }

      setInputArray(result.values)
      setExecutionVersion((previous) => previous + 1)
      setInputError(null)

      return
    }

    const values = generateDataset(selectedInputSource)

    setInputArray(values)
    setExecutionVersion((previous) => previous + 1)
    setInputError(null)
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 p-6 text-slate-100">

      {/* Header and algorithm selector */}
      <header className="flex flex-col gap-4 rounded-xl border border-slate-800 bg-slate-900 p-5 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-2xl font-bold text-white">
            Sorting Visualizer
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            Explore sorting algorithms through animated
            comparisons, swaps, writes, and pseudocode.
          </p>
        </div>

        <AlgoSelector
          category="sorting"
          selectedAlgorithm={selectedAlgorithmId}
          onAlgorithmChange={handleAlgorithmChange}
        />

      </header>

      {/* Input configuration */}
      <section>
        <InputSourcePicker
          selectedInputSource={selectedInputSource}
          customInput={customInput}
          onInputSourceChange={handleInputSourceChange}
          onCustomInputChange={setCustomInput}
          onGenerateInput={handleGenerateInput}
        />

        {inputError && (
          <p
            role="alert"
            className="mt-2 rounded-lg border border-red-800 bg-red-950/40 p-3 text-sm text-red-300"
          >
            {inputError}
          </p>
        )}
      </section>

      {/* Current input array */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
        <p className="text-xs font-bold uppercase text-slate-400">
          Current Input Array
        </p>

        <p className="mt-2 break-words font-mono text-sm text-amber-400">
          [{inputArray.join(', ')}]
        </p>
      </div>

      {/* Active sorting execution */}
      <SortingPlayback
        key={`${selectedAlgorithmId}-${executionVersion}`}
        algorithmId={selectedAlgorithmId}
        inputArray={inputArray}
      />

      {/* Algorithm educational information */}
      <InformationPanel
        algorithmId={selectedAlgorithmId}
      />

    </div>
  )
}