import type { GraphData, GraphNode, GraphEdge } from '../../types'

/**
 * Returns a static, clean default graph topology.
 */
export function createDefaultGraph(): GraphData {
  const nodes: GraphNode[] = [
    { id: 'A', x: 200, y: 80, state: 'unvisited' },
    { id: 'B', x: 100, y: 200, state: 'unvisited' },
    { id: 'C', x: 300, y: 200, state: 'unvisited' },
    { id: 'D', x: 150, y: 320, state: 'unvisited' },
    { id: 'E', x: 350, y: 320, state: 'unvisited' },
  ]

  const edges: GraphEdge[] = [
    { from: 'A', to: 'B', weight: 4 },
    { from: 'A', to: 'C', weight: 2 },
    { from: 'B', to: 'D', weight: 3 },
    { from: 'C', to: 'D', weight: 1 },
    { from: 'C', to: 'E', weight: 5 },
    { from: 'D', to: 'E', weight: 2 },
  ]

  return { nodes, edges }
}

/**
 * Generates a random connected graph positioned within specified SVG boundary dimensions.
 */
export function generateRandomGraph(
  nodeCount: number = 6,
  width: number = 500,
  height: number = 400
): GraphData {
  const nodes: GraphNode[] = []
  const edges: { from: string; to: string; weight: number }[] = []
  const labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

  const padding = 60 // Margin to keep nodes away from SVG canvas edges

  // 1. Generate scattered coordinates with minimum distance constraints
  for (let i = 0; i < nodeCount; i++) {
    const id = labels[i] ?? `N${i}`
    let x = 0
    let y = 0
    let validPosition = false

    // Retries to avoid overlapping nodes
    let attempts = 0
    while (!validPosition && attempts < 100) {
      attempts++
      x = Math.floor(padding + Math.random() * (width - padding * 2))
      y = Math.floor(padding + Math.random() * (height - padding * 2))

      validPosition = nodes.every((n) => {
        const dist = Math.sqrt((n.x - x) ** 2 + (n.y - y) ** 2)
        return dist >= 80 // Minimum 80px space between nodes
      })
      if (!validPosition && attempts >= 100) {
        console.warn(`Could not place node ${id} without overlap after 100 attempts.`)
      }
    }

    nodes.push({ id, x, y, state: 'unvisited' })
  }

  // 2. Connect consecutive nodes to ensure a connected graph
  for (let i = 0; i < nodes.length - 1; i++) {
    const from = nodes[i].id
    const to = nodes[i + 1].id
    const weight = Math.floor(1 + Math.random() * 9)
    edges.push({ from, to, weight })
  }

  // 3. Add random extra edges for density
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 2; j < nodes.length; j++) {
      const extraEdgeProbability = 0.35 // 35% chance to add an extra edge
      if (Math.random() > extraEdgeProbability) {
        const from = nodes[i].id
        const to = nodes[j].id
        const weight = Math.floor(1 + Math.random() * 9)
        edges.push({ from, to, weight })
      }
    }
  }

  return { nodes, edges }
}

/**
 * Parses user custom text input into valid graph data.
 * Format expected: "A-B:4, B-C:2, C-D:1"
 */
export function parseCustomGraph(input: string): GraphData & { errors: string[] } {
  const rawPairs = input.split(',').map((s) => s.trim())
  const nodeSet = new Set<string>()
  const edges: { from: string; to: string; weight: number }[] = []
  const errors: string[] = []

  rawPairs.forEach((pair) => {
    // Matches patterns like A-B:5 or A-B
    const match = pair.match(/^([a-zA-Z0-9]+)-([a-zA-Z0-9]+)(?::(-?\d+))?$/)
    if (match) {
      const [, from, to, weightStr] = match
      const weight = weightStr ? parseInt(weightStr, 10) : 1
      nodeSet.add(from)
      nodeSet.add(to)
      edges.push({ from, to, weight })
    } else if (pair.length > 0) {
      errors.push(`Invalid edge format: "${pair}"`)
    }
  })

  const nodes: GraphNode[] = Array.from(nodeSet).map((id) => ({
    id,
    x: Math.random() * 300 + 100,
    y: Math.random() * 300 + 50,
    state: 'unvisited',
  }))

  return { nodes, edges, errors }
}