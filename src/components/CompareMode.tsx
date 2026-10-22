import { useEffect, useMemo, useState } from 'react'
import type { Algorithm, InputSource } from '../types'
import {
  bubbleSort,
  selectionSort,
  insertionSort,
  mergeSort,
  quickSort,
  heapSort,
} from '../algorithms/sorting'
import SortVisualizer from './SortVisualizer'
import StatsPanel from './StatsPanel'
import PseudoCodePanel from './PseudocodePanel'
import Controls from './Controls'
import InputSourcePicker from './inputSourcePicker'
import Legend from './Legend'
import ResultsSummary from './ResultSummary'
import { useStepPlayer } from '../hooks/useStepPlayer'

type SortingAlgorithmId =
  | 'bubbleSort'
  | 'selectionSort'
  | 'insertionSort'
  | 'mergeSort'
  | 'quickSort'
  | 'heapSort'

const sortingAlgorithms: Record<SortingAlgorithmId, Algorithm> = {
  bubbleSort,
  selectionSort,
  insertionSort,
  mergeSort,
  quickSort,
  heapSort,
}

const algorithmOptions: {
  id: SortingAlgorithmId
  label: string
}[] = [
  { id: 'bubbleSort', label: 'Bubble Sort' },
  { id: 'selectionSort', label: 'Selection Sort' },
  { id: 'insertionSort', label: 'Insertion Sort' },
  { id: 'mergeSort', label: 'Merge Sort' },
  { id: 'quickSort', label: 'Quick Sort' },
  { id: 'heapSort', label: 'Heap Sort' },
]

const DEFAULT_ARRAY = [42, 17, 8, 65, 23, 91, 34, 56]

function randomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function shuffleArray(values: number[]): number[] {
  const result = [...values]

  for (let i = result.length - 1; i > 0; i--) {
    const j = randomNumber(0, i)

    ;[result[i], result[j]] = [result[j], result[i]]
  }

  return result
}

function generateDataset(source: InputSource): number[] {
  const size = 8

  switch (source) {
    case 'random':
      return Array.from(
        { length: size },
        () => randomNumber(5, 100)
      )

    case 'sorted':
      return Array.from(
        { length: size },
        () => randomNumber(5, 100)
      ).sort((a, b) => a - b)

    case 'reverse':
      return Array.from(
        { length: size },
        () => randomNumber(5, 100)
      ).sort((a, b) => b - a)

    case 'nearlySorted': {
      const values = Array.from(
        { length: size },
        () => randomNumber(5, 100)
      ).sort((a, b) => a - b)

      const index = randomNumber(0, size - 2)

      ;[values[index], values[index + 1]] = [
        values[index + 1],
        values[index],
      ]

      return values
    }

    case 'fewUnique': {
      const values = Array.from(
        { length: 3 },
        () => randomNumber(5, 100)
      )

      const dataset = Array.from(
        { length: size },
        () => values[randomNumber(0, values.length - 1)]
      )

      return shuffleArray(dataset)
    }

    case 'custom':
      return [...DEFAULT_ARRAY]

    default:
      return [...DEFAULT_ARRAY]
  }
}

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

function getOperationLabel(id: SortingAlgorithmId): string {
  return id === 'mergeSort' || id === 'insertionSort'
    ? 'Writes / Shifts'
    : 'Swaps / Writes'
}

export default function CompareMode() {
  const [inputArray, setInputArray] = useState<number[]>(
    () => [...DEFAULT_ARRAY]
  )

  const [selectedInputSource, setSelectedInputSource] =
    useState<InputSource>('random')

  const [customInput, setCustomInput] = useState('')
  const [inputError, setInputError] = useState<string | null>(null)

  const [leftAlgorithmId, setLeftAlgorithmId] =
    useState<SortingAlgorithmId>('quickSort')

  const [rightAlgorithmId, setRightAlgorithmId] =
    useState<SortingAlgorithmId>('mergeSort')

  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(500)

  const leftAlgorithm = sortingAlgorithms[leftAlgorithmId]
  const rightAlgorithm = sortingAlgorithms[rightAlgorithmId]

  // Each algorithm receives its own copy of the same input.
  const leftSteps = useMemo(
    () => leftAlgorithm.run([...inputArray]),
    [leftAlgorithm, inputArray]
  )

  const rightSteps = useMemo(
    () => rightAlgorithm.run([...inputArray]),
    [rightAlgorithm, inputArray]
  )

  // Independent playback timelines.
  const leftPlayer = useStepPlayer(inputArray, leftSteps, speed)
  const rightPlayer = useStepPlayer(inputArray, rightSteps, speed)

  // Read the callbacks directly so effect dependencies
  // match the functions actually used by the scheduler.
  const advanceLeft = leftPlayer.stepForward
  const advanceRight = rightPlayer.stepForward

  const leftFinished =
    leftPlayer.totalSteps > 0 &&
    leftPlayer.currentStepIndex >= leftPlayer.totalSteps - 1

  const rightFinished =
    rightPlayer.totalSteps > 0 &&
    rightPlayer.currentStepIndex >= rightPlayer.totalSteps - 1

  const bothFinished = leftFinished && rightFinished

  // One shared scheduler advances both timelines.
  useEffect(() => {
    if (!isPlaying || bothFinished) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      if (!leftFinished) {
        advanceLeft()
      }

      if (!rightFinished) {
        advanceRight()
      }
    }, speed)

    return () => window.clearTimeout(timeoutId)
  }, [
    isPlaying,
    speed,
    bothFinished,
    leftFinished,
    rightFinished,
    leftPlayer.currentStepIndex,
    rightPlayer.currentStepIndex,
    advanceLeft,
    advanceRight,
  ])

  const resetBoth = () => {
    setIsPlaying(false)
    leftPlayer.reset()
    rightPlayer.reset()
  }

  const handlePlay = () => {
    if (
      leftPlayer.totalSteps === 0 ||
      rightPlayer.totalSteps === 0
    ) {
      return
    }

    if (bothFinished) {
      leftPlayer.reset()
      rightPlayer.reset()
    }

    setIsPlaying(true)
  }

  const handlePause = () => {
    setIsPlaying(false)
  }

  const handleReset = () => {
    resetBoth()
  }

  const handleNext = () => {
    setIsPlaying(false)

    if (!leftFinished) {
      leftPlayer.stepForward()
    }

    if (!rightFinished) {
      rightPlayer.stepForward()
    }
  }

  const handleBack = () => {
    setIsPlaying(false)
    leftPlayer.stepBackward()
    rightPlayer.stepBackward()
  }

  const handleLeftAlgorithmChange = (id: SortingAlgorithmId) => {
    resetBoth()
    setLeftAlgorithmId(id)
  }

  const handleRightAlgorithmChange = (id: SortingAlgorithmId) => {
    resetBoth()
    setRightAlgorithmId(id)
  }

  const handleInputSourceChange = (source: InputSource) => {
    setIsPlaying(false)
    setSelectedInputSource(source)
    setInputError(null)
  }

  const handleGenerateInput = () => {
    if (selectedInputSource === 'custom') {
      const result = parseCustomArray(customInput)

      if (result.error) {
        setInputError(result.error)
        return
      }

      resetBoth()
      setInputArray(result.values)
      setInputError(null)
      return
    }

    const newArray = generateDataset(selectedInputSource)

    resetBoth()
    setInputArray(newArray)
    setInputError(null)
  }

  // Derive the summary from both current player states.
  const leftResult = {
    info: leftAlgorithm.info,
    comparisons: leftPlayer.comparisons,
    swapsOrWrites: leftPlayer.swapsOrWrites,
    totalSteps: leftPlayer.totalSteps,
  }

  const rightResult = {
    info: rightAlgorithm.info,
    comparisons: rightPlayer.comparisons,
    swapsOrWrites: rightPlayer.swapsOrWrites,
    totalSteps: rightPlayer.totalSteps,
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 p-6 text-slate-100">
      {/* Header */}
      <header className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <h1 className="text-2xl font-bold text-white">
          Algorithm Compare Mode
        </h1>

        <p className="mt-2 text-sm text-slate-400">
          Compare two sorting algorithms using the same input
          and a shared playback timeline.
        </p>

        <p className="mt-3 break-words font-mono text-sm text-amber-400">
          Input: [{inputArray.join(', ')}]
        </p>
      </header>

      {/* Shared input configuration */}
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

      {/* Side-by-side visualizers */}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
        {/* Algorithm A */}
        <section className="flex min-w-0 flex-col gap-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
            <label
              htmlFor="compare-left-algorithm"
              className="mb-2 block text-xs font-bold uppercase text-slate-400"
            >
              Algorithm A
            </label>

            <select
              id="compare-left-algorithm"
              value={leftAlgorithmId}
              onChange={(event) =>
                handleLeftAlgorithmChange(
                  event.target.value as SortingAlgorithmId
                )
              }
              className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white"
            >
              {algorithmOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <SortVisualizer bars={leftPlayer.bars} />

          <StatsPanel
            comparisons={leftPlayer.comparisons}
            swapsOrWrites={leftPlayer.swapsOrWrites}
            operationLabel={getOperationLabel(leftAlgorithmId)}
            currentStepIndex={leftPlayer.currentStepIndex}
            totalSteps={leftPlayer.totalSteps}
            currentStepDescription={
              leftPlayer.currentStep?.description ?? ''
            }
          />

          <PseudoCodePanel
            lines={leftAlgorithm.info.pseudocode}
            activeLine={
              leftPlayer.currentStep?.pseudocodeLine ?? -1
            }
          />
        </section>

        {/* Algorithm B */}
        <section className="flex min-w-0 flex-col gap-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
            <label
              htmlFor="compare-right-algorithm"
              className="mb-2 block text-xs font-bold uppercase text-slate-400"
            >
              Algorithm B
            </label>

            <select
              id="compare-right-algorithm"
              value={rightAlgorithmId}
              onChange={(event) =>
                handleRightAlgorithmChange(
                  event.target.value as SortingAlgorithmId
                )
              }
              className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white"
            >
              {algorithmOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <SortVisualizer bars={rightPlayer.bars} />

          <StatsPanel
            comparisons={rightPlayer.comparisons}
            swapsOrWrites={rightPlayer.swapsOrWrites}
            operationLabel={getOperationLabel(rightAlgorithmId)}
            currentStepIndex={rightPlayer.currentStepIndex}
            totalSteps={rightPlayer.totalSteps}
            currentStepDescription={
              rightPlayer.currentStep?.description ?? ''
            }
          />

          <PseudoCodePanel
            lines={rightAlgorithm.info.pseudocode}
            activeLine={
              rightPlayer.currentStep?.pseudocodeLine ?? -1
            }
          />
        </section>
      </div>

      {/* Shared playback controls */}
      <Controls
        isPlaying={isPlaying && !bothFinished}
        speed={speed}
        onPlay={handlePlay}
        onPause={handlePause}
        onReset={handleReset}
        onStepForward={handleNext}
        onStepBackward={handleBack}
        onSpeedChange={setSpeed}
      />

      {/* Shared sorting legend */}
      <Legend category="sorting" />

      {/* Execution status */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
          <p className="text-sm font-semibold">
            {leftAlgorithm.info.name}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {leftFinished
              ? 'Execution finished'
              : 'Execution in progress'}
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
          <p className="text-sm font-semibold">
            {rightAlgorithm.info.name}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {rightFinished
              ? 'Execution finished'
              : 'Execution in progress'}
          </p>
        </div>
      </div>

      {/* Display final results after both algorithms finish */}
      {bothFinished && (
        <ResultsSummary
          left={leftResult}
          right={rightResult}
        />
      )}
    </div>
  )
}