import GraphVisualizer from './components/graphVisualizer'
import { createDefaultGraph } from './algorithms/data/graphPresets'

function App() {

  const graph = createDefaultGraph()

  return (
    <div className="min-h-screen bg-slate-800 p-8">

      <h1 className="mb-6 text-3xl font-bold text-white">
        Algorithm Visualizer
      </h1>

      <GraphVisualizer
        graph={graph}
      />

    </div>
  )
}

export default App