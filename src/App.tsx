import { useState } from 'react'
import { heapSort } from './algorithms'
import Controls from './components/Controls'
import SortVisualizer from './components/SortVisualizer'
import { useStepPlayer } from './hooks/useStepPlayer'
import Legend from './components/Legend'
import StatsPanel from './components/StatsPanel'
import PseudoCodePanel from './components/PseudocodePanel'
import AlgoSelector from './components/AlgoSelector'
import type { AlgorithmType, InputSource } from './types'
import InputSourcePicker from './components/inputSourcePicker'

function App() {
  const input = [5, 3, 1, 4]
  const steps = heapSort.run(input)

  const [speed, setSpeed] = useState(500)

  const player = useStepPlayer(input, steps, speed)

  const [selectedAlgorithm, setSelectedAlgorithm] =
  useState<AlgorithmType>('heapSort')
  
  const [selectedInputSource, setSelectedInputSource] = useState<InputSource>('random')
  const [customInput, setCustomInput] = useState('')

  return (
    <div className="min-h-screen bg-slate-950 p-6 text-white">
      <h1 className="mb-4 text-2xl font-bold">Algorithm Visualizer</h1>

      <AlgoSelector
        selectedAlgorithm={selectedAlgorithm}
        onAlgorithmChange={setSelectedAlgorithm}
      />
      <InputSourcePicker
        selectedInputSource={selectedInputSource}
        customInput={customInput}
        onInputSourceChange={setSelectedInputSource}
        onCustomInputChange={setCustomInput}
        onGenerateInput={() => console.log('Generate:', selectedInputSource, customInput)}
      />

      <Controls
        isPlaying={player.isPlaying}
        speed={speed}
        onPlay={player.play}
        onPause={player.pause}
        onReset={player.reset}
        onStepForward={player.stepForward}
        onStepBackward={player.stepBackward}
        onSpeedChange={setSpeed}
      />

      <StatsPanel
        comparisons={player.comparisons}
        swapsOrWrites={player.swapsOrWrites}
        operationLabel="Swaps / Writes"
        currentStepIndex={player.currentStepIndex}
        totalSteps={player.totalSteps}
        currentStepDescription={player.currentStep?.description ?? 'Ready'}
      />
      <PseudoCodePanel 
        lines={heapSort.info.pseudocode} 
        activeLine={player.currentStep?.pseudocodeLine ?? null}
      />

      <p className="mb-2 mt-4">
        Step {player.currentStepIndex + 1} of {player.totalSteps}
      </p>

      <p className="mb-4">{player.currentStep?.description}</p>
      <Legend />
      <SortVisualizer bars={player.bars} />
    </div>
  )
}

export default App
