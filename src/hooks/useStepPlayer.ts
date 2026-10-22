import { useEffect, useMemo, useState } from 'react'
import type {
  ArrayBar,
  StepEvent,
  UseStepPlayerResult,
} from '../types'

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
    const workingArray = [...initialArray]

    const bars: ArrayBar[] = workingArray.map((value) => ({
      value,
      state: 'default',
    }))

    let comparisons = 0
    let swapsOrWrites = 0

    // Rebuild the visible state by replaying events
    // from the beginning through the current step.
    for (
      let stepIndex = 0;
      stepIndex <= currentStepIndex;
      stepIndex++
    ) {
      const step = steps[stepIndex]
      if (!step) continue

      // Reset temporary highlights while preserving
      // finalized elements.
      bars.forEach((bar) => {
        if (bar.state !== 'sorted') {
          bar.state = 'default'
        }
      })

      switch (step.type) {
        case 'compare': {
          comparisons++

          step.indices?.forEach((idx) => {
            if (bars[idx]) {
              bars[idx].state = 'comparing'
            }
          })

          break
        }

        case 'pivot': {
          step.indices?.forEach((idx) => {
            if (bars[idx]) {
              bars[idx].state = 'pivot'
            }
          })

          break
        }

        case 'swap': {
          const [s1, s2] = step.indices ?? []

          if (
            s1 !== undefined &&
            s2 !== undefined &&
            bars[s1] &&
            bars[s2]
          ) {
            ;[workingArray[s1], workingArray[s2]] = [
              workingArray[s2],
              workingArray[s1],
            ]

            ;[bars[s1].value, bars[s2].value] = [
              bars[s2].value,
              bars[s1].value,
            ]

            bars[s1].state = 'swapping'
            bars[s2].state = 'swapping'

            swapsOrWrites++
          }

          break
        }

        case 'shift': {
          const [fromIdx, toIdx] = step.indices ?? []

          if (
            fromIdx !== undefined &&
            toIdx !== undefined &&
            bars[toIdx]
          ) {
            workingArray[toIdx] = workingArray[fromIdx]
            bars[toIdx].value = workingArray[fromIdx]
            bars[toIdx].state = 'swapping'

            swapsOrWrites++
          }

          break
        }

        case 'overwrite': {
          const targetIdx = step.indices?.[0]
          const newVal = step.values?.[0]

          if (
            targetIdx !== undefined &&
            newVal !== undefined &&
            bars[targetIdx]
          ) {
            workingArray[targetIdx] = newVal
            bars[targetIdx].value = newVal
            bars[targetIdx].state = 'swapping'

            swapsOrWrites++
          }

          break
        }

        case 'divide':
        case 'merge': {
          step.indices?.forEach((idx) => {
            if (bars[idx]) {
              bars[idx].state = 'comparing'
            }
          })

          break
        }

        case 'baseCase': {
          step.indices?.forEach((idx) => {
            if (
              bars[idx] &&
              bars[idx].state !== 'sorted'
            ) {
              bars[idx].state = 'comparing'
            }
          })

          break
        }

        case 'partition':
        case 'finalize': {
          step.indices?.forEach((idx) => {
            if (bars[idx]) {
              bars[idx].state = 'sorted'
            }
          })

          break
        }
      }
    }

    return {
      bars,
      comparisons,
      swapsOrWrites,
    }
  }, [initialArray, steps, currentStepIndex])

  // Automatically advance the playback position
  // while the player is running.
  useEffect(() => {
    if (!isPlaying) return

    if (currentStepIndex >= totalSteps - 1) {
      setIsPlaying(false)
      return
    }

    const intervalId = window.setInterval(() => {
      setCurrentStepIndex((previous) => {
        if (previous >= totalSteps - 1) {
          setIsPlaying(false)
          return previous
        }

        return previous + 1
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

    reset: () => {
      setIsPlaying(false)
      setCurrentStepIndex(0)
    },

    stepForward: () =>
      setCurrentStepIndex((previous) =>
        Math.min(previous + 1, totalSteps - 1)
      ),

    stepBackward: () =>
      setCurrentStepIndex((previous) =>
        Math.max(previous - 1, 0)
      ),
  }
}