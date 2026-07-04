import type { GraphEdge, GraphNode } from '../../types'

export function buildAdjacencyList(
  nodes: GraphNode[],
  edges: GraphEdge[],
  options?: { isDirected?: boolean }
): Record<string, string[]> {
  const adjacencyList: Record<string, string[]> = {}
  const isDirected = options?.isDirected ?? false

  nodes.forEach((node) => {
    adjacencyList[node.id] = []
  })

  edges.forEach((edge) => {
    if (adjacencyList[edge.from]) {
      adjacencyList[edge.from].push(edge.to)
    }

    if (!isDirected && adjacencyList[edge.to]) {
      adjacencyList[edge.to].push(edge.from)
    }
  })

  return adjacencyList
}

export function buildWeightedAdjacencyList(
  nodes: GraphNode[],
  edges: GraphEdge[],
  options?: { isDirected?: boolean }
): Record<string, { nodeId: string; weight: number }[]> {
  const adjacencyList: Record<string, { nodeId: string; weight: number }[]> = {}
  const isDirected = options?.isDirected ?? false

  nodes.forEach((node) => {
    adjacencyList[node.id] = []
  })

  edges.forEach((edge) => {
    const weight = edge.weight ?? 1

    if (adjacencyList[edge.from]) {
      adjacencyList[edge.from].push({
        nodeId: edge.to,
        weight,
      })
    }

    if (!isDirected && adjacencyList[edge.to]) {
      adjacencyList[edge.to].push({
        nodeId: edge.from,
        weight,
      })
    }
  })

  return adjacencyList
}

export function euclideanDistance(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
}