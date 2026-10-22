import type { GraphAlgorithm, GraphNode, StepEvent } from '../../types'
import { buildWeightedAdjacencyList, euclideanDistance } from './graphUtils'
import { hasNegativeWeights } from '../data/graphValidation'

export const astar: GraphAlgorithm = {
  info: {
    id: 'astar',
    name: 'A* Search',
    category: 'graph',
    description:
      'A* searches for the shortest path using the known path cost g(n) and an admissible estimated remaining cost h(n).',
    useCase:
      'Useful for video game pathfinding, robotics, route planning, and spatial navigation.',
    complexity: {
      best: 'O(E)',
      average: 'O(V² + E)',
      worst: 'O(V² + E)',
      space: 'O(V)',
    },
    pseudocode: [
      'create open set',
      'set start gScore to 0',
      'set start fScore to heuristic(start, goal)',
      'while open set is not empty',
      '  pick node with smallest fScore',
      '  if current node is goal, stop',
      '  for each neighbor',
      '    tentativeG = gScore[current] + edgeWeight',
      '    if tentativeG < gScore[neighbor]',
      '      update gScore and fScore',
      '      discover neighbor',
    ],
  },

  run(nodes, edges, startNodeId, options): StepEvent[] {
    const steps: StepEvent[] = []
    const goalNodeId = options?.goalNodeId

    // A* requires non-negative weights in this implementation.
    if (hasNegativeWeights({ nodes, edges })) {
      return [{
        type: 'finalize',
        nodeIds: [],
        pseudocodeLine: 0,
        description:
          'A* cannot process negative edge weights in this implementation. Use a graph with non-negative weights.',
      }]
    }

    if (!goalNodeId) {
      return [{
        type: 'finalize',
        nodeIds: [],
        pseudocodeLine: 5,
        description: 'A* requires a valid goal node.',
      }]
    }

    // Fast node lookup using a Map.
    const nodeMap = new Map<string, GraphNode>(
      nodes.map((node) => [node.id, node])
    )

    const startNode = nodeMap.get(startNodeId)
    const goalNode = nodeMap.get(goalNodeId)

    if (!startNode || !goalNode) {
      return [{
        type: 'finalize',
        nodeIds: [],
        pseudocodeLine: 5,
        description: 'Start or goal node was not found.',
      }]
    }

    const adjacencyList = buildWeightedAdjacencyList(nodes, edges)

    // Find a safe scaling factor for the Euclidean heuristic.
    // This ensures h(n) never overestimates actual path cost.
    let heuristicScale = Infinity

    for (const edge of edges) {
      const fromNode = nodeMap.get(edge.from)
      const toNode = nodeMap.get(edge.to)

      if (!fromNode || !toNode) continue

      const physicalDistance = euclideanDistance(
        fromNode.x,
        fromNode.y,
        toNode.x,
        toNode.y
      )

      if (physicalDistance > 0) {
        const ratio = (edge.weight ?? 1) / physicalDistance
        heuristicScale = Math.min(heuristicScale, ratio)
      }
    }

    if (!Number.isFinite(heuristicScale)) {
      heuristicScale = 0
    }

    const heuristic = (node: GraphNode): number =>
      heuristicScale * euclideanDistance(
        node.x,
        node.y,
        goalNode.x,
        goalNode.y
      )

    const openSet = new Set<string>()
    const closedSet = new Set<string>()

    const cameFrom: Record<string, string> = {}
    const gScore: Record<string, number> = {}
    const fScore: Record<string, number> = {}

    for (const node of nodes) {
      gScore[node.id] = Infinity
      fScore[node.id] = Infinity
    }

    gScore[startNodeId] = 0
    fScore[startNodeId] = heuristic(startNode)
    openSet.add(startNodeId)

    steps.push({
      type: 'discover',
      nodeIds: [startNodeId],
      values: [fScore[startNodeId]],
      pseudocodeLine: 2,
      description:
        `Initialized "${startNodeId}" with f(n) = ${fScore[startNodeId].toFixed(2)}.`,
    })

    while (openSet.size > 0) {
      let currentNodeId: string | null = null
      let smallestFScore = Infinity

      // Array/Set scan: O(V) selection.
      for (const nodeId of openSet) {
        if (fScore[nodeId] < smallestFScore) {
          smallestFScore = fScore[nodeId]
          currentNodeId = nodeId
        }
      }

      if (currentNodeId === null) break

      const currentId: string = currentNodeId

      steps.push({
        type: 'visit',
        nodeIds: [currentId],
        values: [fScore[currentId]],
        pseudocodeLine: 4,
        description:
          `Selected "${currentId}" with f(n) = ${fScore[currentId].toFixed(2)}.`,
      })

      if (currentId === goalNodeId) {
        const path: string[] = []
        let pathNode: string | undefined = goalNodeId

        while (pathNode !== undefined) {
          path.push(pathNode)
          pathNode = cameFrom[pathNode]
        }

        path.reverse()

        steps.push({
          type: 'finalize',
          nodeIds: path,
          pseudocodeLine: 5,
          description:
            `Shortest path found: ${path.join(' → ')}. Total cost: ${gScore[goalNodeId]}.`,
        })

        return steps
      }

      openSet.delete(currentId)
      closedSet.add(currentId)

      const neighbors = adjacencyList[currentId] ?? []

      for (const neighbor of neighbors) {
        if (closedSet.has(neighbor.nodeId)) continue

        const targetId = neighbor.nodeId

        steps.push({
          type: 'compare',
          nodeIds: [currentId, targetId],
          edge: {
            from: currentId,
            to: targetId,
            weight: neighbor.weight,
          },
          pseudocodeLine: 6,
          description:
            `Evaluating edge "${currentId}" → "${targetId}".`,
        })

        const tentativeG =
          gScore[currentId] + neighbor.weight

        steps.push({
          type: 'relax',
          nodeIds: [targetId],
          edge: {
            from: currentId,
            to: targetId,
            weight: neighbor.weight,
          },
          values: [tentativeG],
          pseudocodeLine: 7,
          description:
            `Tentative cost: ${gScore[currentId]} + ${neighbor.weight} = ${tentativeG}.`,
        })

        if (tentativeG < gScore[targetId]) {
          const targetNode = nodeMap.get(targetId)
          if (!targetNode) continue

          cameFrom[targetId] = currentId
          gScore[targetId] = tentativeG

          const h = heuristic(targetNode)
          fScore[targetId] = tentativeG + h

          openSet.add(targetId)

          steps.push({
            type: 'discover',
            nodeIds: [targetId],
            edge: {
              from: currentId,
              to: targetId,
              weight: neighbor.weight,
            },
            values: [fScore[targetId]],
            pseudocodeLine: 9,
            description:
              `Updated "${targetId}": g = ${tentativeG.toFixed(2)}, h = ${h.toFixed(2)}, f = ${fScore[targetId].toFixed(2)}.`,
          })
        }
      }
    }

    steps.push({
      type: 'finalize',
      nodeIds: Array.from(closedSet),
      pseudocodeLine: 5,
      description:
        `No path exists from "${startNodeId}" to "${goalNodeId}".`,
    })

    return steps
  },
}