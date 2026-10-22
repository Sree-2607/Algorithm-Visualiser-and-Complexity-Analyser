
import type { GraphAlgorithm } from '../../types'

import { bfs } from './bfs'
import { dfs } from './dfs'
import { dijkstra as dijkstraAlgorithm } from './djikstra'
import { astar } from './astar'
import { bellmanFord } from './bellmanFord'

// Preserve named exports for other modules.
export {
  bfs,
  dfs,
  dijkstraAlgorithm as dijkstra,
  astar,
  bellmanFord,
}

// Central graph algorithm registry.
export const graphAlgorithms: Record<string, GraphAlgorithm> = {
  bfs: bfs,
  dfs: dfs,
  dijkstra: dijkstraAlgorithm,
  astar: astar,
  'bellman-ford': bellmanFord,
}
