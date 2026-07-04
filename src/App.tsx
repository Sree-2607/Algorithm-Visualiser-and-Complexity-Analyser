import {
  bfs,
  dfs,
  dijkstra,
  astar,
  bellmanFord,
} from './algorithms/graph'
import type { GraphEdge, GraphNode } from './types'

const nodes: GraphNode[] = [
  { id: 'A', x: 100, y: 100, state: 'unvisited' },
  { id: 'B', x: 300, y: 100, state: 'unvisited' },
  { id: 'C', x: 200, y: 220, state: 'unvisited' },
  { id: 'D', x: 420, y: 220, state: 'unvisited' },
]

const edges: GraphEdge[] = [
  { from: 'A', to: 'B', weight: 4 },
  { from: 'A', to: 'C', weight: 1 },
  { from: 'C', to: 'B', weight: 2 },
  { from: 'B', to: 'D', weight: 1 },
  { from: 'C', to: 'D', weight: 5 },
]

function App() {
  console.log('BFS')
  console.log(bfs.run(nodes, edges, 'A'))

  console.log('DFS')
  console.log(dfs.run(nodes, edges, 'A'))

  console.log('Dijkstra')
  console.log(dijkstra.run(nodes, edges, 'A'))

  console.log('A*')
  console.log(
    astar.run(nodes, edges, 'A', {
      goalNodeId: 'D',
    })
  )
  console.log('Bellman-Ford')
  console.log(
  bellmanFord.run(nodes, edges, 'A')
  )

  return (
    <div className="min-h-screen bg-slate-950 p-6 text-white">
      <h1 className="text-2xl font-bold">Graph Algorithm Console Test</h1>
      <p className="mt-2 text-slate-400">
        Open browser console to verify BFS, DFS, Dijkstra, and A* step logs.
      </p>
    </div>
  )
}

export default App