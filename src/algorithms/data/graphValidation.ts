import type { GraphData } from '../../types'

export function hasNegativeWeights(
  graph: GraphData
): boolean {
  return graph.edges.some(
    (edge) => edge.weight !== undefined && edge.weight < 0
  )
}