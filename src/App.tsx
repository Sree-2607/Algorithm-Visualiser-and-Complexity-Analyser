import { heapSort } from './algorithms'
import { useStepPlayer } from './hooks/useStepPlayer'

function App() {
  const input = [5, 3, 1, 4]
  const steps = heapSort.run(input)

  const player = useStepPlayer(input, steps, 500)

  console.log('Current bars:', player.bars)
  console.log('Current step:', player.currentStep)
  console.log('Comparisons:', player.comparisons)
  console.log('Swaps/Writes:', player.swapsOrWrites)

  return (
    <div>
      <h1>Algorithm Visualizer</h1>

      <button onClick={player.stepBackward}>Back</button>
      <button onClick={player.stepForward}>Next</button>
      <button onClick={player.play}>Play</button>
      <button onClick={player.pause}>Pause</button>
      <button onClick={player.reset}>Reset</button>

      <p>
        Step {player.currentStepIndex + 1} of {player.totalSteps}
      </p>

      <p>{player.currentStep?.description}</p>

      <div style={{ display: 'flex', gap: '8px', alignItems: 'end' }}>
        {player.bars.map((bar, index) => (
          <div
            key={index}
            style={{
              height: `${bar.value * 30}px`,
              width: '30px',
              backgroundColor:
                bar.state === 'comparing'
                  ? 'blue'
                  : bar.state === 'swapping'
                    ? 'red'
                    : bar.state === 'pivot'
                      ? 'purple'
                      : bar.state === 'sorted'
                        ? 'green'
                        : 'gray',
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default App