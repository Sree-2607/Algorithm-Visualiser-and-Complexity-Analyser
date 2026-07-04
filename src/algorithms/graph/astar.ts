import type { GraphAlgorithm, GraphNode, StepEvent } from '../../types'
import { buildWeightedAdjacencyList, euclideanDistance } from './graphUtils'

export const astar: GraphAlgorithm = {
  info: {
    id: 'astar',
    name: 'A* Search',
    category: 'graph',
    description:
      'A* Search computes the absolute shortest path between nodes using actual cost values ($g$) plus an estimated distance heuristic ($h$).',
    useCase:
      'Powering real-time video game pathfinding, robotics spatial awareness, logistics mapping, and grid cell routing.',
    complexity: {
      best: 'O(E)',
      average: 'O(E log V)',
      worst: 'O(V²)',
      space: 'O(V)',
    },
    pseudocode: [
      'create open set',                         // Index 0
      'set start gScore to 0',                   // Index 1
      'set start fScore to heuristic(start, goal)', // Index 2
      'while open set is not empty',             // Index 3
      '  pick node with smallest fScore',        // Index 4
      '  if current node is goal, stop',         // Index 5
      '  for each neighbor',                     // Index 6
      '    tentativeG = gScore[current] + edgeWeight', // Index 7
      '    if tentativeG < gScore[neighbor]',   // Index 8
      '      update gScore and fScore',          // Index 9
      '      discover neighbor',                 // Index 10
    ],
  },

  // Note: Extended signature uses options map to safely pass goal coordinates
  run(nodes, edges, startNodeId, options?: { goalNodeId?: string }): StepEvent[] {
    const steps: StepEvent[] = []
    const goalNodeId = options?.goalNodeId

    if (!goalNodeId) {
      steps.push({
        type: 'finalize',
        nodeIds: [],
        pseudocodeLine: 5,
        description: 'A* execution failed: A valid goal node target identifier must be specified.',
      })
      return steps
    }

    // Performance Optimization: Map nodes to a hash index for O(1) lookups
    const nodeMap: Record<string, GraphNode> = {}
    nodes.forEach((node) => {
      nodeMap[node.id] = node
    })

    const startNode = nodeMap[startNodeId]
    const goalNode = nodeMap[goalNodeId]

    if (!startNode || !goalNode) {
      steps.push({
        type: 'finalize',
        nodeIds: [],
        pseudocodeLine: 5,
        description: 'A* execution failed: Start or destination node coordinate could not be mapped.',
      })
      return steps
    }

    const adjacencyList = buildWeightedAdjacencyList(nodes, edges)

    const openSet = new Set<string>()
    const closedSet = new Set<string>()
    const cameFrom: Record<string, string> = {} // Track parents for path reconstruction

    const gScore: Record<string, number> = {}
    const fScore: Record<string, number> = {}

    nodes.forEach((node) => {
      gScore[node.id] = Infinity
      fScore[node.id] = Infinity
    })

    gScore[startNodeId] = 0
    fScore[startNodeId] = euclideanDistance(startNode.x, startNode.y, goalNode.x, goalNode.y)

    openSet.add(startNodeId)

    steps.push({
      type: 'discover',
      nodeIds: [startNodeId],
      values: [fScore[startNodeId]],
      pseudocodeLine: 2,
      description: `Initialized search root at "${startNodeId}" with heuristic cost estimate f(n) = ${fScore[startNodeId].toFixed(2)}.`,
    })

    while (openSet.size > 0) {
      let currentNodeId: string | null = null
      let smallestFScore = Infinity

      openSet.forEach((nodeId) => {
        if (fScore[nodeId] < smallestFScore) {
          smallestFScore = fScore[nodeId]
          currentNodeId = nodeId
        }
      })

      if (currentNodeId === null) break

      steps.push({
        type: 'visit', // UI highlights this node as the 'current' active node
        nodeIds: [currentNodeId],
        values: [fScore[currentNodeId]],
        pseudocodeLine: 4,
        description: `Selected node "${currentNodeId}" from open set with minimal evaluation cost f(n) = ${fScore[currentNodeId].toFixed(2)}.`,
      })

      // Path Reconstruction Trigger
      if (currentNodeId === goalNodeId) {
        const optimalPath: string[] = []
        let currentPathNode: string | undefined = goalNodeId
        
        while (currentPathNode !== undefined) {
          optimalPath.push(currentPathNode)
          currentPathNode = cameFrom[currentPathNode]
        }
        optimalPath.reverse()

        // Step event to animate path reconstruction
        steps.push({
          type: 'finalize',
          nodeIds: optimalPath,
          pseudocodeLine: 5,
          description: `Target reached! Successfully reconstructed shortest path: ${optimalPath.join(' ➔ ')}.`,
        })

        return steps
      }

      openSet.delete(currentNodeId)
      closedSet.add(currentNodeId)

      const neighbors = adjacencyList[currentNodeId] ?? []

      neighbors.forEach((neighbor) => {
        if (closedSet.has(neighbor.nodeId)) return

        steps.push({
          type: 'compare',
          nodeIds: [currentNodeId!, neighbor.nodeId],
          edge: {
            from: currentNodeId!,
            to: neighbor.nodeId,
            weight: neighbor.weight,
          },
          pseudocodeLine: 6,
          description: `Evaluating edge link connection "${currentNodeId}" ➔ "${neighbor.nodeId}".`,
        })

        const tentativeGScore = gScore[currentNodeId!] + neighbor.weight

        steps.push({
          type: 'relax',
          nodeIds: [neighbor.nodeId],
          values: [tentativeGScore],
          pseudocodeLine: 7,
          description: `Tentative path cost g(${neighbor.nodeId}) = ${gScore[currentNodeId!]} + ${neighbor.weight} = ${tentativeGScore}.`,
        })

        if (tentativeGScore < gScore[neighbor.nodeId]) {
          const neighborNode = nodeMap[neighbor.nodeId]
          if (!neighborNode) return

          cameFrom[neighbor.nodeId] = currentNodeId!
          gScore[neighbor.nodeId] = tentativeGScore
          
          const heuristicCost = euclideanDistance(neighborNode.x, neighborNode.y, goalNode.x, goalNode.y)
          fScore[neighbor.nodeId] = tentativeGScore + heuristicCost

          openSet.add(neighbor.nodeId)

          steps.push({
            type: 'discover', // UI flashes node to signal discovery and updates cost label
            nodeIds: [neighbor.nodeId],
            edge: {
              from: currentNodeId!,
              to: neighbor.nodeId,
              weight: neighbor.weight,
            },
            values: [fScore[neighbor.nodeId]],
            pseudocodeLine: 9,
            description: `Path optimized for "${neighbor.nodeId}": g = ${tentativeGScore.toFixed(1)}, h = ${heuristicCost.toFixed(1)} ➔ f = ${fScore[neighbor.nodeId].toFixed(2)}.`,
          })
        }
      })
    }

    steps.push({
      type: 'finalize',
      nodeIds: Array.from(closedSet),
      pseudocodeLine: 5,
      description: `Search exhausted. Target node "${goalNodeId}" is completely cut off from start origin.`,
    })

    return steps
  },
}