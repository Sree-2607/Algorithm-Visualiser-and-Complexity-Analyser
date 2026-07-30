import type { GraphAlgorithm, StepEvent } from '../../types'
import { buildWeightedAdjacencyList } from './graphUtils'
import { hasNegativeWeights } from '../data/graphValidation'

export const dijkstra: GraphAlgorithm = {
  info: {
    id: 'dijkstra',
    name: "Dijkstra's Algorithm",
    category: 'graph',
    description:
      "Dijkstra's Algorithm computes the absolute single-source shortest path pathways across a weighted network with non-negative edge costs.",
    useCase:
      'Powering network topography models, GPS maps, digital travel routing, and minimum resource expenditure pathfinding.',
    complexity: {
      best: 'O(V²)',
      average: 'O(V²)',
      worst: 'O(V²)',
      space: 'O(V)',
    },
    pseudocode: [
      'create distance map and visited set', // Index 0
      'set start distance to 0',             // Index 1
      'set all other distances to Infinity',  // Index 2
      'while unvisited nodes remain',        // Index 3
      '  pick unvisited node with smallest distance', // Index 4
      '  visit current node',                // Index 5
      '  for each neighbor of current node',  // Index 6
      '    newDistance = currentDistance + edgeWeight', // Index 7
      '    if newDistance < oldDistance',    // Index 8
      '      update distance',               // Index 9
      '      relax edge',                    // Index 10
    ],
  },

  run(nodes, edges, startNodeId): StepEvent[] {
    const steps: StepEvent[] = []
      if (hasNegativeWeights({nodes, edges})) {
        return [
            {
                type:'finalize',
                nodeIds:[],
                pseudocodeLine:0,
                description:
                'Dijkstra cannot process graphs with negative edge weights.'
            }
        ]
    }
    const adjacencyList = buildWeightedAdjacencyList(nodes, edges)

    const distances: Record<string, number> = {}
    const visited = new Set<string>()

    // Phase 1: Initialize the tracking table maps
    nodes.forEach((node) => {
      distances[node.id] = Infinity
    })
    distances[startNodeId] = 0

    steps.push({
      type: 'discover',
      nodeIds: [startNodeId],
      pseudocodeLine: 1,
      description: `Initialized target single-source root distance tracker. Setting node "${startNodeId}" weight value to 0.`,
    })

    // Phase 2: Compute relaxation sequences
    while (visited.size < nodes.length) {
      let currentNodeIdCandidate: string | null = null
      let smallestDistance = Infinity

      nodes.forEach((node) => {
        if (!visited.has(node.id) && distances[node.id] < smallestDistance) {
          smallestDistance = distances[node.id]
          currentNodeIdCandidate = node.id
        }
      })

      // Safety Guard: Handle remaining island components gracefully
      if (currentNodeIdCandidate === null) {
        steps.push({
          type: 'finalize',
          nodeIds: nodes.filter((n) => !visited.has(n.id)).map((n) => n.id),
          pseudocodeLine: 3,
          description: 'Remaining unvisited network nodes are mathematically isolated or unreachable from source origin.',
        })
        break
      }

      const currentNodeId = currentNodeIdCandidate!
      visited.add(currentNodeId)
      const currentDistance = distances[currentNodeId]

      steps.push({
        type: 'visit', // Highlights node as active 'current' cursor frame
        nodeIds: [currentNodeId],
        pseudocodeLine: 5,
        description: `Selected node "${currentNodeId}" with minimal path distance of ${currentDistance}. Marking as settled.`,
      })

      const neighbors = adjacencyList[currentNodeId] ?? []

      neighbors.forEach((neighbor) => {
        if (visited.has(neighbor.nodeId)) return

        steps.push({
          type: 'compare',
          nodeIds: [currentNodeId, neighbor.nodeId],
          edge: {
            from: currentNodeId,
            to: neighbor.nodeId,
            weight: neighbor.weight,
          },
          pseudocodeLine: 6,
          description: `Evaluating edge link connection "${currentNodeId}" → "${neighbor.nodeId}" (Edge Weight: ${neighbor.weight}).`,
        })

        const newDistance = currentDistance + neighbor.weight
        const oldDistance = distances[neighbor.nodeId]

        steps.push({
          type: 'relax',
          nodeIds: [neighbor.nodeId],
          edge: {
            from: currentNodeId,
            to: neighbor.nodeId,
            weight: neighbor.weight,
          },
          values: [newDistance],
          pseudocodeLine: 7,
          description: `Calculating prospective path weight: ${currentDistance} (current) + ${neighbor.weight} (edge) = ${newDistance}.`,
        })

        steps.push({
          type: 'compare',
          nodeIds: [neighbor.nodeId],
          pseudocodeLine: 8,
          description: `Comparing incoming path cost ${newDistance} against existing recorded cost ${oldDistance === Infinity ? 'Infinity' : oldDistance}.`,
        })

        if (newDistance < oldDistance) {
          distances[neighbor.nodeId] = newDistance

          steps.push({
            type: 'discover', // Triggers the visual layout node discovery flash
            nodeIds: [neighbor.nodeId],
            edge: {
              from: currentNodeId,
              to: neighbor.nodeId,
              weight: neighbor.weight,
            },
            values: [newDistance],
            pseudocodeLine: 9,
            description: `Relaxation successful! Lower path weight found. Optimizing node "${neighbor.nodeId}" path length to ${newDistance}.`,
          })
        }
      })
    }

    steps.push({
      type: 'finalize',
      nodeIds: Array.from(visited),
      pseudocodeLine: 10,
      description: 'Dijkstra processing loop complete! Shortest path cost metrics are now locked across the target graph.',
    })

    return steps
  },
}