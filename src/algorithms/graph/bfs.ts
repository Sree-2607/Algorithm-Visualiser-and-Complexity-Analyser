import type { GraphAlgorithm, StepEvent } from '../../types'
import { buildAdjacencyList } from './graphUtils'

export const bfs: GraphAlgorithm = {
  info: {
    id: 'bfs',
    name: 'Breadth First Search',
    category: 'graph',
    description:
      'BFS visits nodes level by level, starting from a selected source node.',
    useCase:
      'Useful for finding the shortest path in an unweighted graph and exploring nodes layer by layer.',
    complexity: {
      best: 'O(V + E)',
      average: 'O(V + E)',
      worst: 'O(V + E)',
      space: 'O(V)',
    },
    pseudocode: [
      'create visited set',
      'create queue',
      'mark start node as discovered',
      'enqueue start node',
      'while queue is not empty',
      '  dequeue current node',
      '  visit current node',
      '  for each neighbor of current node',
      '    if neighbor is not visited',
      '      mark neighbor as discovered',
      '      enqueue neighbor',
    ],
  },

  run(nodes, edges, startNodeId): StepEvent[] {
    const steps: StepEvent[] = []
    const adjacencyList = buildAdjacencyList(nodes, edges)

    const visited = new Set<string>()
    const queue: string[] = []

    visited.add(startNodeId)

    steps.push({
      type: 'discover',
      nodeIds: [startNodeId],
      pseudocodeLine: 2,
      description: `Start node "${startNodeId}" is discovered`,
    })

    queue.push(startNodeId)

    steps.push({
      type: 'enqueue',
      nodeIds: [startNodeId],
      pseudocodeLine: 3,
      description: `Adding start node "${startNodeId}" to the queue`,
    })

    while (queue.length > 0) {
      const currentNodeId = queue.shift()

      if (currentNodeId === undefined) continue

      steps.push({
        type: 'visit',
        nodeIds: [currentNodeId],
        pseudocodeLine: 6,
        description: `Visiting current node "${currentNodeId}"`,
      })

      const neighbors = adjacencyList[currentNodeId] ?? []

      neighbors.forEach((neighborId) => {
        steps.push({
          type: 'compare',
          nodeIds: [currentNodeId, neighborId],
          pseudocodeLine: 7,
          description: `Checking neighbor "${neighborId}" of node "${currentNodeId}"`,
        })

        if (!visited.has(neighborId)) {
          visited.add(neighborId)

          steps.push({
            type: 'discover',
            nodeIds: [neighborId],
            pseudocodeLine: 9,
            description: `Neighbor "${neighborId}" is discovered`,
          })

          queue.push(neighborId)

          steps.push({
            type: 'enqueue',
            nodeIds: [neighborId],
            pseudocodeLine: 10,
            description: `Adding neighbor "${neighborId}" to the queue`,
          })
        }
      })
    }

    return steps
  },
}