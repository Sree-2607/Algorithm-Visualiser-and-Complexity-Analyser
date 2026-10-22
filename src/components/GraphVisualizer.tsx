import type { GraphData, StepEvent } from '../types'

interface GraphVisualizerProps {
  graph: GraphData
  activeStep?: StepEvent | null
  isDirected?: boolean
}

export default function GraphVisualizer({
  graph,
  activeStep = null,
  isDirected = false,
}: GraphVisualizerProps) {
  const nodeMap = new Map(graph.nodes.map((node) => [node.id, node]))

  const getNodeColor = (nodeId: string) => {
    if (!activeStep) return { fill: 'var(--graph-node-bg)', stroke: 'var(--graph-node-border)', active: false }

    const isNodeActive = activeStep.nodeIds?.includes(nodeId)

    if (isNodeActive) {
      switch (activeStep.type) {
        case 'visit':
          return { fill: '#2563eb', stroke: '#60a5fa', active: true }
        case 'discover':
        case 'enqueue':
          return { fill: '#7c3aed', stroke: '#a78bfa', active: true }
        case 'compare':
        case 'relax':
          return { fill: '#d97706', stroke: '#fbbf24', active: true }
        case 'finalize':
          return { fill: '#059669', stroke: '#34d399', active: true }
        case 'negativeCycle':
          return { fill: '#dc2626', stroke: '#f87171', active: true }
        default:
          return { fill: '#2563eb', stroke: '#60a5fa', active: true }
      }
    }

    return { fill: 'var(--graph-node-bg)', stroke: 'var(--graph-node-border)', active: false }
  }

  const getEdgeStyle = (from: string, to: string) => {
    if (!activeStep?.edge) return { stroke: 'var(--graph-edge)', strokeWidth: 2 }

    const isTargetEdge =
      (activeStep.edge.from === from && activeStep.edge.to === to) ||
      (!isDirected && activeStep.edge.from === to && activeStep.edge.to === from)

    if (isTargetEdge) {
      if (activeStep.type === 'negativeCycle') {
        return { stroke: '#ef4444', strokeWidth: 4 }
      }
      if (activeStep.type === 'relax' || activeStep.type === 'discover') {
        return { stroke: '#10b981', strokeWidth: 3.5 }
      }
      return { stroke: '#f59e0b', strokeWidth: 3.5 }
    }

    return { stroke: 'var(--graph-edge)', strokeWidth: 2 }
  }

  return (
    <div className="relative w-full overflow-hidden rounded-xl border border-slate-700 bg-slate-850 p-4 shadow-2xl">
      <svg viewBox="0 0 500 400" className="h-full w-full select-none">
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="var(--graph-edge)" />
          </marker>
        </defs>

        {graph.edges.map((edge) => {
          const fromNode = nodeMap.get(edge.from)
          const toNode = nodeMap.get(edge.to)
          if (!fromNode || !toNode) return null

          const edgeStyle = getEdgeStyle(edge.from, edge.to)
          const midX = (fromNode.x + toNode.x) / 2
          const midY = (fromNode.y + toNode.y) / 2

          return (
            <g key={`edge-${edge.from}-${edge.to}`}>
              <line
                x1={fromNode.x}
                y1={fromNode.y}
                x2={toNode.x}
                y2={toNode.y}
                stroke={edgeStyle.stroke}
                strokeWidth={edgeStyle.strokeWidth}
                markerEnd={isDirected ? 'url(#arrowhead)' : undefined}
                className="transition-all duration-300 ease-in-out"
              />
              {edge.weight !== undefined && (
                <g transform={`translate(${midX}, ${midY})`}>
                  <circle r="12" fill="var(--graph-weight-bg)" stroke={edgeStyle.stroke} strokeWidth="1" />
                  <text textAnchor="middle" dy="4" fill="var(--graph-weight-text)" fontSize="11" fontWeight="600">
                    {edge.weight}
                  </text>
                </g>
              )}
            </g>
          )
        })}

        {graph.nodes.map((node) => {
          const colors = getNodeColor(node.id)
          return (
            <g
              key={`node-${node.id}`}
              transform={`translate(${node.x}, ${node.y})`}
              className="cursor-pointer transition-transform duration-300 hover:scale-105"
            >
              <circle
                r="22"
                fill={colors.fill}
                stroke={colors.stroke}
                strokeWidth="3"
                className="transition-colors duration-300"
              />
              <text
                textAnchor="middle"
                dy="5"
                fill={colors.active ? '#ffffff' : 'var(--graph-node-text)'}
                fontSize="14"
                fontWeight="bold"
                className="pointer-events-none"
              >
                {node.id}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}