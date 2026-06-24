import { heapSort } from './algorithms'
import SortVisualizer from './components/SortVisualizer'
import { useStepPlayer } from './hooks/useStepPlayer'

function App() {
  const input = [5, 3, 1, 4]
  const steps = heapSort.run(input)

  const player = useStepPlayer(input, steps, 500)

  return (
    <div className="min-h-screen bg-slate-950 p-6 text-white">
      <h1 className="mb-4 text-2xl font-bold">Algorithm Visualizer</h1>

      <div className="mb-4 flex gap-2">
        <button onClick={player.stepBackward}>Back</button>
        <button onClick={player.stepForward}>Next</button>
        <button onClick={player.play}>Play</button>
        <button onClick={player.pause}>Pause</button>
        <button onClick={player.reset}>Reset</button>
      </div>

      <p className="mb-2">
        Step {player.currentStepIndex + 1} of {player.totalSteps}
      </p>

      <p className="mb-4">{player.currentStep?.description}</p>

      <SortVisualizer bars={player.bars} />
    </div>
  )
}

export default App