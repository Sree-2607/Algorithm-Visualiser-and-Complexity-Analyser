import type {
  AlgorithmType,
  GraphAlgorithm,
  GraphData,
  GraphEdge,
  GraphNode,
  StepEvent,
} from '../../types'

export const GRAPH_BENCHMARK_SIZES = [5, 10, 20, 40]

export type GraphBenchmarkOutcome =
  | 'completed'
  | 'incorrect'
  | 'unverified'
  | 'negativeCycle'
  | 'unreachable'
  | 'rejected'

export interface GraphBenchmarkResult {
  algorithmId: AlgorithmType
  algorithmName: string
  vertexCount: number
  edgeCount: number
  comparisons: number
  visits: number
  discoveries: number
  relaxations: number
  totalOperations: number
  visualizationSteps: number
  outcome: GraphBenchmarkOutcome
}

// Deterministic, connected, positively weighted graph.
export function generateBenchmarkGraph(
  vertexCount: number
): GraphData {
  if (
    !Number.isInteger(vertexCount) ||
    vertexCount < 2 ||
    vertexCount > 100
  ) {
    throw new Error(
      'Graph benchmark requires 2 to 100 vertices.'
    )
  }

  const nodes: GraphNode[] = []
  const edges: GraphEdge[] = []

  const columns = Math.ceil(Math.sqrt(vertexCount))
  const spacing = 40

  for (let i = 0; i < vertexCount; i++) {
    nodes.push({
      id: `N${i}`,
      x: (i % columns) * spacing,
      y: Math.floor(i / columns) * spacing,
      state: 'unvisited',
    })
  }

  // Connected backbone.
  for (let i = 0; i < vertexCount - 1; i++) {
    edges.push({
      from: `N${i}`,
      to: `N${i + 1}`,
      weight: 100,
    })
  }

  // Additional shortcuts.
  for (let i = 0; i < vertexCount - 2; i++) {
    if (i % 2 === 0) {
      edges.push({
        from: `N${i}`,
        to: `N${i + 2}`,
        weight: 200,
      })
    }
  }

  return { nodes, edges }
}

function countGraphOperations(steps: StepEvent[]) {
  let comparisons = 0
  let visits = 0
  let discoveries = 0
  let relaxations = 0

  for (const step of steps) {
    switch (step.type) {
      case 'compare':
        comparisons++
        break

      case 'visit':
        visits++
        break

      case 'discover':
      case 'enqueue':
        discoveries++
        break

      case 'relax':
        relaxations++
        break
    }
  }

  return {
    comparisons,
    visits,
    discoveries,
    relaxations,
    totalOperations:
      comparisons + visits + discoveries + relaxations,
  }
}

// Independent reference implementation.
//
// Uses repeated edge relaxation, rather than
// calling Dijkstra, A* or Bellman-Ford engines.
//
// These reference distances are the expected
// shortest-path costs for our nonnegative graphs.
function calculateReferenceDistances(
  graph: GraphData,
  startNodeId: string
): Record<string, number> {
  const distances: Record<string, number> = {}

  for (const node of graph.nodes) {
    distances[node.id] = Infinity
  }

  distances[startNodeId] = 0

  const directedEdges: GraphEdge[] = []

  for (const edge of graph.edges) {
    directedEdges.push(edge)
    directedEdges.push({
      from: edge.to,
      to: edge.from,
      weight: edge.weight,
    })
  }

  for (let pass = 0; pass < graph.nodes.length - 1; pass++) {
    let updated = false

    for (const edge of directedEdges) {
      const fromDistance = distances[edge.from]
      const weight = edge.weight ?? 1

      if (fromDistance === Infinity) continue

      const candidate = fromDistance + weight

      if (candidate < distances[edge.to]) {
        distances[edge.to] = candidate
        updated = true
      }
    }

    if (!updated) break
  }

  return distances
}

// Compute graph reachability without relying
// on the traversal algorithms being tested.
function calculateReachableNodes(
  graph: GraphData,
  startNodeId: string
): Set<string> {
  const adjacency = new Map<string, string[]>()

  for (const node of graph.nodes) {
    adjacency.set(node.id, [])
  }

  for (const edge of graph.edges) {
    adjacency.get(edge.from)?.push(edge.to)
    adjacency.get(edge.to)?.push(edge.from)
  }

  const reached = new Set<string>([startNodeId])
  const queue = [startNodeId]

  for (let index = 0; index < queue.length; index++) {
    const current = queue[index]

    for (const neighbor of adjacency.get(current) ?? []) {
      if (!reached.has(neighbor)) {
        reached.add(neighbor)
        queue.push(neighbor)
      }
    }
  }

  return reached
}

// Reconstruct reported distances from successful
// distance-update events, not from message text.
//
// Dijkstra and Bellman-Ford both use "discover"
// with a numeric value when they improve a distance.
function extractReportedDistances(
  graph: GraphData,
  startNodeId: string,
  steps: StepEvent[]
): Record<string, number> {
  const distances: Record<string, number> = {}

  for (const node of graph.nodes) {
    distances[node.id] = Infinity
  }

  distances[startNodeId] = 0

  for (const step of steps) {
    if (step.type !== 'discover') continue

    const nodeId = step.nodeIds?.[0]
    const value = step.values?.[0]

    if (
      nodeId === undefined ||
      value === undefined ||
      !Number.isFinite(value) ||
      !Object.prototype.hasOwnProperty.call(
        distances,
        nodeId
      )
    ) {
      continue
    }

    distances[nodeId] = value
  }

  return distances
}

function distancesMatch(
  expected: Record<string, number>,
  actual: Record<string, number>
): boolean {
  for (const nodeId of Object.keys(expected)) {
    const expectedValue = expected[nodeId]
    const actualValue = actual[nodeId]

    if (
      expectedValue === Infinity &&
      actualValue === Infinity
    ) {
      continue
    }

    if (
      !Number.isFinite(actualValue) ||
      Math.abs(expectedValue - actualValue) > 1e-9
    ) {
      return false
    }
  }

  return true
}

// Verify the route supplied by A* when its final
// event contains a full ordered path.
function verifyAStarPath(
  graph: GraphData,
  startNodeId: string,
  goalNodeId: string,
  steps: StepEvent[],
  expectedGoalDistance: number
): GraphBenchmarkOutcome {
  const finalStep = [...steps]
    .reverse()
    .find((step) => step.type === 'finalize')

  const path = finalStep?.nodeIds

  // A goal-only finalization event is insufficient
  // to validate the shortest path independently.
  if (!path || path.length < 2) {
    return 'unverified'
  }

  if (
    path[0] !== startNodeId ||
    path[path.length - 1] !== goalNodeId
  ) {
    return 'incorrect'
  }

  let pathCost = 0

  for (let i = 0; i < path.length - 1; i++) {
    const from = path[i]
    const to = path[i + 1]

    const edge = graph.edges.find(
      (candidate) =>
        (candidate.from === from && candidate.to === to) ||
        (candidate.from === to && candidate.to === from)
    )

    if (!edge) {
      return 'incorrect'
    }

    pathCost += edge.weight ?? 1
  }

  return Math.abs(pathCost - expectedGoalDistance) <= 1e-9
    ? 'completed'
    : 'incorrect'
}

function validateGraphResult(
  algorithmId: AlgorithmType,
  graph: GraphData,
  startNodeId: string,
  goalNodeId: string,
  steps: StepEvent[]
): GraphBenchmarkOutcome {
  if (steps.length === 0) {
    return 'incorrect'
  }

  if (
    steps.some((step) => step.type === 'negativeCycle')
  ) {
    return 'negativeCycle'
  }

  const lastDescription =
    steps[steps.length - 1].description.toLowerCase()

  if (
    lastDescription.includes('cannot process') ||
    lastDescription.includes('invalid start')
  ) {
    return 'rejected'
  }

  const expectedDistances =
    calculateReferenceDistances(graph, startNodeId)

  if (
    algorithmId === 'dijkstra' ||
    algorithmId === 'bellman-ford'
  ) {
    const reportedDistances = extractReportedDistances(
      graph,
      startNodeId,
      steps
    )

    return distancesMatch(
      expectedDistances,
      reportedDistances
    )
      ? 'completed'
      : 'incorrect'
  }

  if (algorithmId === 'bfs' || algorithmId === 'dfs') {
    const expectedReached =
      calculateReachableNodes(graph, startNodeId)

    const visited = new Set<string>()

    for (const step of steps) {
      if (step.type === 'visit') {
        for (const nodeId of step.nodeIds ?? []) {
          visited.add(nodeId)
        }
      }
    }

    if (
      visited.size !== expectedReached.size ||
      [...visited].some(
        (nodeId) => !expectedReached.has(nodeId)
      )
    ) {
      return 'incorrect'
    }

    return 'completed'
  }

  if (algorithmId === 'astar') {
    return verifyAStarPath(
      graph,
      startNodeId,
      goalNodeId,
      steps,
      expectedDistances[goalNodeId]
    )
  }

  return 'unverified'
}

export function benchmarkGraphAlgorithm(
  algorithm: GraphAlgorithm,
  graph: GraphData
): GraphBenchmarkResult {
  const startNodeId = graph.nodes[0]?.id
  const goalNodeId =
    graph.nodes[graph.nodes.length - 1]?.id

  if (!startNodeId || !goalNodeId) {
    throw new Error('Benchmark graph has no valid nodes.')
  }

  const steps = algorithm.run(
    graph.nodes,
    graph.edges,
    startNodeId,
    { goalNodeId, isDirected: false }
  )

  const metrics = countGraphOperations(steps)

  const outcome = validateGraphResult(
    algorithm.info.id,
    graph,
    startNodeId,
    goalNodeId,
    steps
  )

  return {
    algorithmId: algorithm.info.id,
    algorithmName: algorithm.info.name,
    vertexCount: graph.nodes.length,
    edgeCount: graph.edges.length,
    ...metrics,
    visualizationSteps: steps.length,
    outcome,
  }
}

export function runGraphBenchmarks(
  algorithms: GraphAlgorithm[],
  sizes: number[] = GRAPH_BENCHMARK_SIZES
): GraphBenchmarkResult[] {
  const results: GraphBenchmarkResult[] = []

  for (const size of sizes) {
    const graph = generateBenchmarkGraph(size)

    for (const algorithm of algorithms) {
      results.push(
        benchmarkGraphAlgorithm(algorithm, graph)
      )
    }
  }

  return results
}