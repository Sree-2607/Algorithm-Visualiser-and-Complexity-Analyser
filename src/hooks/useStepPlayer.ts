import { useEffect, useMemo, useState } from 'react'
import type { ArrayBar, StepEvent, UseStepPlayerResult } from '../types'

export function useStepPlayer(
  initialArray: number[],
  steps: StepEvent[],
  speed: number
): UseStepPlayerResult {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const totalSteps = steps.length
  const currentStep = steps[currentStepIndex] ?? null

  const { bars, comparisons, swapsOrWrites } = useMemo(() => {
    // 1. Rebuild the base tracking values on frame change
    const workingArray = [...initialArray]
    const bars: ArrayBar[] = workingArray.map((value) => ({
      value,
      state: 'default',
    }))

    let comparisons = 0
    let swapsOrWrites = 0

    // 2. Compute state by incrementally playing back mutations from frame 0 to current
    for (let stepIndex = 0; stepIndex <= currentStepIndex; stepIndex++) {
      const step = steps[stepIndex]
      if (!step) continue

      // Reset transient visual highlight tags unless locked by finalize
      bars.forEach((bar) => {
        if (bar.state !== 'sorted') {
          bar.state = 'default'
        }
      })

      switch (step.type) {
        case 'compare':
          comparisons++
          step.indices.forEach((idx) => {
            if (bars[idx]) bars[idx].state = 'comparing'
          })
          break

        case 'pivot':
          step.indices.forEach((idx) => {
            if (bars[idx]) bars[idx].state = 'pivot'
          })
          break

        case 'swap':
          const [s1, s2] = step.indices
          if (s1 !== undefined && s2 !== undefined && bars[s1] && bars[s2]) {
            ;[workingArray[s1], workingArray[s2]] = [workingArray[s2], workingArray[s1]]
            ;[bars[s1].value, bars[s2].value] = [bars[s2].value, bars[s1].value]
            bars[s1].state = 'swapping'
            bars[s2].state = 'swapping'
            swapsOrWrites++
          }
          break

        case 'shift':
          const [fromIdx, toIdx] = step.indices
          if (fromIdx !== undefined && toIdx !== undefined && bars[toIdx]) {
            workingArray[toIdx] = workingArray[fromIdx]
            bars[toIdx].value = workingArray[fromIdx]
            bars[toIdx].state = 'swapping'
            swapsOrWrites++
          }
          break

        case 'overwrite':
          const targetIdx = step.indices[0]
          const newVal = step.values?.[0]
          if (targetIdx !== undefined && newVal !== undefined && bars[targetIdx]) {
            workingArray[targetIdx] = newVal
            bars[targetIdx].value = newVal
            bars[targetIdx].state = 'swapping'
            swapsOrWrites++
          }
          break

        case 'divide':
        case 'merge':
          // Highlight active subsets or ranges using matching styles
          step.indices.forEach((idx) => {
            if (bars[idx]) bars[idx].state = 'comparing'
          })
          break

        case 'baseCase':
        case 'partition':
        case 'finalize':
          step.indices.forEach((idx) => {
            if (bars[idx]) bars[idx].state = 'sorted'
          })
          break
      }
    }

    return { bars, comparisons, swapsOrWrites }
  }, [initialArray, steps, currentStepIndex])

  // Interval execution control
  useEffect(() => {
    if (!isPlaying) return

    if (currentStepIndex >= totalSteps - 1) {
      setIsPlaying(false)
      return
    }

    const intervalId = window.setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev >= totalSteps - 1) {
          setIsPlaying(false)
          return prev
        }
        return prev + 1
      })
    }, speed)

    return () => window.clearInterval(intervalId)
  }, [isPlaying, currentStepIndex, totalSteps, speed])

  return {
    bars,
    currentStep,
    currentStepIndex,
    totalSteps,
    isPlaying,
    comparisons,
    swapsOrWrites,
    play: () => setIsPlaying(true),
    pause: () => setIsPlaying(false),
    reset: () => { setIsPlaying(false); setCurrentStepIndex(0); },
    stepForward: () => setCurrentStepIndex((p) => Math.min(p + 1, totalSteps - 1)),
    stepBackward: () => setCurrentStepIndex((p) => Math.max(p - 1, 0)),
  }
}
