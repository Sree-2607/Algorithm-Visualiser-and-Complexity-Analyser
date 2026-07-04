import type { GraphAlgorithm, StepEvent } from '../../types'

export const bellmanFord: GraphAlgorithm = {
  info: {
    id: 'bellmanFord' as any,
    name: 'Bellman-Ford',
    category: 'graph',
    description:
      'Bellman-Ford computes shortest paths even when graphs contain negative edge weights.',
    useCase:
      'Useful for network routing tables (RIP), financial arbitrage detection in forex grids, and graphs containing negative edge costs.',
    complexity: {
      best: 'O(E)',
      average: 'O(VE)',
      worst: 'O(VE)',
      space: 'O(V)',
    },
    pseudocode: [
      'create distance map',                        // Index 0
      'set start distance to 0',                    // Index 1
      'repeat V-1 times',                           // Index 2
      '  for each edge',                            // Index 3
      '    relax edge',                             // Index 4
      'repeat once more',                           // Index 5
      '  if edge still relaxes',                    // Index 6
      '    negative cycle detected',                // Index 7
    ],
  },

  run(nodes, edges, startNodeId): StepEvent[] {
    const steps: StepEvent[] = []

    const distances: Record<string, number> = {}
    const cameFrom: Record<string, string> = {} // Tracks layout trees for final pathway trace

    nodes.forEach((node) => {
      distances[node.id] = Infinity
    })

    distances[startNodeId] = 0

    steps.push({
      type: 'discover',
      nodeIds: [startNodeId],
      values: [0],
      pseudocodeLine: 1,
      description: `Initialized start node "${startNodeId}" distance to 0.`,
    })

    //---------------------------------------------
    // Main relaxation phase (V-1 passes)
    //---------------------------------------------
    for (let pass = 0; pass < nodes.length - 1; pass++) {
      let updated = false

      for (const edge of edges) {
        steps.push({
          type: 'compare',
          nodeIds: [edge.from, edge.to],
          edge,
          pseudocodeLine: 3,
          description: `Pass ${pass + 1}: Evaluating path from "${edge.from}" to "${edge.to}".`,
        })

        if (distances[edge.from] === Infinity) {
          continue
        }

        const weight = edge.weight ?? 1
        const newDistance = distances[edge.from] + weight

        steps.push({
          type: 'relax',
          nodeIds: [edge.to],
          edge,
          values: [newDistance],
          pseudocodeLine: 4,
          description: `Testing cost update boundary: ${distances[edge.from]} + ${weight} = ${newDistance}.`,
        })

        if (newDistance < distances[edge.to]) {
          distances[edge.to] = newDistance
          cameFrom[edge.to] = edge.from
          updated = true

          steps.push({
            type: 'discover',
            nodeIds: [edge.to],
            edge,
            values: [newDistance],
            pseudocodeLine: 4,
            description: `Optimized shortest distance of "${edge.to}" down to ${newDistance} via "${edge.from}".`,
          })
        }
      }

      // Early exit optimization if an entire iteration yields no changes
      if (!updated) {
        break
      }
    }

    //---------------------------------------------
    // Negative cycle detection
    //---------------------------------------------
    for (const edge of edges) {
      if (distances[edge.from] === Infinity) continue

      const weight = edge.weight ?? 1

      if (distances[edge.from] + weight < distances[edge.to]) {
        steps.push({
          type: 'negativeCycle',
          nodeIds: [edge.from, edge.to],
          edge,
          pseudocodeLine: 7,
          description: `Infinite loop risk! A negative weight cycle was detected spanning across link "${edge.from}" ➔ "${edge.to}". Paths are non-deterministic.`,
        })

        return steps
      }
    }

    //---------------------------------------------
    // Finished successfully
    //---------------------------------------------
    steps.push({
      type: 'finalize',
      nodeIds: nodes.map((node) => node.id),
      pseudocodeLine: 5, // Highlights completion review bounds
      description: 'Bellman-Ford completed successfully. All reachable nodes have been locked down with optimal path weights.',
    })

    return steps
  },
}