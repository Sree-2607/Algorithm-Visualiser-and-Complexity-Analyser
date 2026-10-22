import type { GraphAlgorithm, GraphEdge, StepEvent } from '../../types'
export const bellmanFord: GraphAlgorithm = {
  info: {
    id: 'bellman-ford',
    name: 'Bellman-Ford',
    category: 'graph',
    description:
      'Bellman-Ford computes single-source shortest paths and detects reachable negative-weight cycles.',
    useCase:
      'Useful for weighted graph analysis, negative-cost path problems, routing concepts, and cycle detection.',
    complexity: {
      best: 'O(E)',
      average: 'O(VE)',
      worst: 'O(VE)',
      space: 'O(V)',
    },
    pseudocode: [
      'create distance map',
      'set start distance to 0',
      'repeat V-1 times',
      '  for each edge',
      '    relax edge',
      'repeat once more',
      '  if edge still relaxes',
      '    negative cycle detected',
    ],
  },

  run(nodes, edges, startNodeId, options): StepEvent[] {
    const steps: StepEvent[] = []

    const nodeIds = new Set(nodes.map((node) => node.id))

    if (!nodeIds.has(startNodeId)) {
      return [{
        type: 'finalize',
        nodeIds: [],
        pseudocodeLine: 0,
        description: 'Invalid start node.',
      }]
    }

    const isDirected = options?.isDirected ?? false

    // Convert graph edges into directed relaxation edges.
    // For undirected graphs, each edge is traversable both ways.
    const relaxationEdges: GraphEdge[] = []

    for (const edge of edges) {
      relaxationEdges.push(edge)

      if (!isDirected) {
        relaxationEdges.push({
          from: edge.to,
          to: edge.from,
          weight: edge.weight,
        })
      }
    }

    const distances: Record<string, number> = {}

    for (const node of nodes) {
      distances[node.id] = Infinity
    }

    distances[startNodeId] = 0

    steps.push({
      type: 'discover',
      nodeIds: [startNodeId],
      values: [0],
      pseudocodeLine: 1,
      description:
        `Initialized start node "${startNodeId}" with distance 0.`,
    })

    // Phase 1: Relax all edges at most V-1 times.
    for (let pass = 0; pass < nodes.length - 1; pass++) {
      let updated = false

      for (const edge of relaxationEdges) {
        const weight = edge.weight ?? 1

        steps.push({
          type: 'compare',
          nodeIds: [edge.from, edge.to],
          edge,
          pseudocodeLine: 3,
          description:
            `Pass ${pass + 1}: Checking "${edge.from}" → "${edge.to}".`,
        })

        if (distances[edge.from] === Infinity) {
          continue
        }

        const newDistance = distances[edge.from] + weight

        steps.push({
          type: 'relax',
          nodeIds: [edge.to],
          edge,
          values: [newDistance],
          pseudocodeLine: 4,
          description:
            `Testing ${distances[edge.from]} + ${weight} = ${newDistance}.`,
        })

        if (newDistance < distances[edge.to]) {
          distances[edge.to] = newDistance
          updated = true

          steps.push({
            type: 'discover',
            nodeIds: [edge.to],
            edge,
            values: [newDistance],
            pseudocodeLine: 4,
            description:
              `Updated distance to "${edge.to}" = ${newDistance}.`,
          })
        }
      }

      // Stop early when a complete pass produces no updates.
      if (!updated) break
    }

    // Phase 2: An additional relaxation identifies
    // reachable negative-weight cycles.
    for (const edge of relaxationEdges) {
      if (distances[edge.from] === Infinity) continue

      const weight = edge.weight ?? 1

      if (distances[edge.from] + weight < distances[edge.to]) {
        steps.push({
          type: 'negativeCycle',
          nodeIds: [edge.from, edge.to],
          edge,
          pseudocodeLine: 7,
          description:
            `Negative-weight cycle detected through "${edge.from}" → "${edge.to}". Finite shortest-path costs are not defined for nodes affected by this cycle.`,
        })

        return steps
      }
    }

    // Phase 3: Successful completion.
    const reachableNodes = nodes
      .filter((node) => distances[node.id] !== Infinity)
      .map((node) => node.id)

    const unreachableCount = nodes.length - reachableNodes.length

    steps.push({
      type: 'finalize',
      nodeIds: reachableNodes,
      pseudocodeLine: 5,
      description:
        unreachableCount > 0
          ? `Bellman-Ford completed. ${unreachableCount} node(s) are unreachable from "${startNodeId}".`
          : 'Bellman-Ford completed. All nodes have finite shortest-path distances.',
    })

    return steps
  },
}