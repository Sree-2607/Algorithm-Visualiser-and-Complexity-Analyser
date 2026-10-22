
import type { GraphAlgorithm, StepEvent } from '../../types'
import { buildAdjacencyList } from './graphUtils'

export const dfs: GraphAlgorithm = {
  info: {
    id: 'dfs',
    name: 'Depth First Search',
    category: 'graph',
    description:
      'DFS explores one branch as deeply as possible before backtracking.',
    useCase:
      'Useful for maze solving, cycle detection, topological sorting, and connected components.',
    complexity: {
      best: 'O(V + E)',
      average: 'O(V + E)',
      worst: 'O(V + E)',
      space: 'O(V)',
    },
    pseudocode: [
      'create visited set',
      'visit(start node)',
      '  mark current node visited',
      '  for each neighbor',
      '    if neighbor not visited',
      '      visit(neighbor)',
    ],
  },

  run(nodes, edges, startNodeId): StepEvent[] {
    const steps: StepEvent[] = []
    const adjacencyList = buildAdjacencyList(nodes, edges)
    const visited = new Set<string>()

    function dfsVisit(currentNodeId: string): void {
      visited.add(currentNodeId)

      steps.push({
        type: 'visit',
        nodeIds: [currentNodeId],
        pseudocodeLine: 2,
        description: `Entering node "${currentNodeId}". Marking it as visited.`,
      })

      const neighbors = adjacencyList[currentNodeId] ?? []

      neighbors.forEach((neighborId) => {
        // Highlight the edge under examination.
        steps.push({
          type: 'compare',
          nodeIds: [currentNodeId, neighborId],
          edge: {
            from: currentNodeId,
            to: neighborId,
          },
          pseudocodeLine: 3,
          description: `Checking edge from "${currentNodeId}" to "${neighborId}".`,
        })

        steps.push({
          type: 'compare',
          nodeIds: [neighborId],
          edge: {
            from: currentNodeId,
            to: neighborId,
          },
          pseudocodeLine: 4,
          description: `Checking whether "${neighborId}" has already been visited.`,
        })

        if (!visited.has(neighborId)) {
          // Highlight the edge used for recursive descent.
          steps.push({
            type: 'discover',
            nodeIds: [neighborId],
            edge: {
              from: currentNodeId,
              to: neighborId,
            },
            pseudocodeLine: 5,
            description: `Discovered new node "${neighborId}". Descending recursively.`,
          })

          dfsVisit(neighborId)

          // The recursive call has returned to its parent.
          steps.push({
            type: 'visit',
            nodeIds: [currentNodeId],
            pseudocodeLine: 3,
            description: `Backtracked to "${currentNodeId}" to continue exploring remaining neighbors.`,
          })
        } else {
          steps.push({
            type: 'compare',
            nodeIds: [neighborId],
            edge: {
              from: currentNodeId,
              to: neighborId,
            },
            pseudocodeLine: 4,
            description: `Node "${neighborId}" was already visited. Skipping.`,
          })
        }
      })
    }

    steps.push({
      type: 'visit',
      nodeIds: [startNodeId],
      pseudocodeLine: 1,
      description: `Starting DFS from node "${startNodeId}".`,
    })

    dfsVisit(startNodeId)

    return steps
  },
}