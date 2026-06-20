import { bubbleSort } from './algorithms'

function App() {
  const steps = bubbleSort.run([5, 2, 8, 1])

  console.log(steps)

  return (
    <div>
      <h1>Algorithm Visualiser</h1>
    </div>
  )
}

export default App
