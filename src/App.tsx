import { heapSort } from './algorithms'

function App() {
 
  console.log('Heap Sort')
  console.log(heapSort.run([5, 3, 1, 4]))

  return <h1>Algorithm Visualizer</h1>
}

export default App