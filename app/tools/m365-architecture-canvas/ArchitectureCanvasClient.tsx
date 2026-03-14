'use client'

import React, { useState, useCallback, useRef } from 'react'
import {
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  Panel,
  Node,
  Edge,
  Connection,
  Handle,
  Position
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import {
  Save,
  Download,
  Trash2,
  Share2,
  MessageSquare,
  FileText,
  Database,
  Users,
  Cpu,
  Zap,
} from 'lucide-react'

// --- Custom Nodes ---

const nodeStyles: Record<string, any> = {
  sharepoint: { background: '#0369a1', border: '#bae6fd' }, // Sky/Ocean
  teams: { background: '#4c1d95', border: '#ddd6fe' }, // Violet
  powerAutomate: { background: '#1e40af', border: '#bfdbfe' }, // Blue
  powerApps: { background: '#86198f', border: '#f0abfc' }, // Fuchsia
  entra: { background: '#0f172a', border: '#94a3b8' }, // Slate
}

const iconMap: Record<string, React.ReactNode> = {
  sharepoint: <Database className="w-5 h-5" />,
  teams: <MessageSquare className="w-5 h-5" />,
  powerAutomate: <Zap className="w-5 h-5" />,
  powerApps: <Cpu className="w-5 h-5" />,
  entra: <Users className="w-5 h-5" />,
}

const labelMap: Record<string, string> = {
  sharepoint: 'SharePoint',
  teams: 'Microsoft Teams',
  powerAutomate: 'Power Automate',
  powerApps: 'Power Apps',
  entra: 'Entra ID',
}

const CustomNode = ({ data, type }: any) => {
  const style = nodeStyles[data.serviceType] || {
    background: '#334155',
    border: '#cbd5e1',
  }

  return (
    <div
      className="px-4 py-3 shadow-lg rounded-xl border flex items-center gap-3 transition-transform hover:scale-105"
      style={{
        backgroundColor: style.background,
        borderColor: style.border,
        color: 'white',
        minWidth: '160px',
      }}
    >
      <div className="p-2 bg-white/10 rounded-lg">
        {iconMap[data.serviceType] || <FileText className="w-5 h-5" />}
      </div>
      <div className="flex flex-col">
        <div className="font-bold text-sm">
          {labelMap[data.serviceType] || 'Service'}
        </div>
        <div className="text-xs text-white/70">{data.label}</div>
      </div>
      
      {/* Handles for connections */}
      <Handle 
        type="target" 
        position={Position.Left} 
        style={{ background: '#cbd5e1', width: '8px', height: '8px', border: 'none' }} 
      />
      <Handle 
        type="source" 
        position={Position.Right} 
        style={{ background: '#38bdf8', width: '8px', height: '8px', border: 'none' }} 
      />
    </div>
  )
}

// Initial Canvas State
const initialNodes: Node[] = [
  {
    id: '1',
    type: 'default', // Using default to keep standard handles for now, styled via className later if needed. Actually, creating a true custom node is better for visual consistency.
    position: { x: 250, y: 100 },
    data: { label: 'Doc Library', serviceType: 'sharepoint' },
  },
  {
    id: '2',
    position: { x: 250, y: 250 },
    data: { label: 'Approval Flow', serviceType: 'powerAutomate' },
  },
]
const initialEdges: Edge[] = [{ id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#38bdf8', strokeWidth: 2 } }]


let id = 0;
const getId = () => `dndnode_${id++}`;

// --- Main Client Component ---

export default function ArchitectureCanvasClient({ tool }: { tool: any }) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null)
  const [markdownOutput, setMarkdownOutput] = useState('')

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: '#38bdf8', strokeWidth: 2 } }, eds)),
    [setEdges]
  )

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType)
    event.dataTransfer.effectAllowed = 'move'
  }

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()

      if (!reactFlowWrapper.current || !reactFlowInstance) return

      const type = event.dataTransfer.getData('application/reactflow')

      if (typeof type === 'undefined' || !type) {
        return
      }

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      })

      const newNode: Node = {
        id: getId(),
        position,
        data: { label: `New ${labelMap[type]}`, serviceType: type },
      }

      setNodes((nds) => nds.concat(newNode))
    },
    [reactFlowInstance, setNodes]
  )

  const clearCanvas = () => {
    setNodes([])
    setEdges([])
    setMarkdownOutput('')
  }

  const generateMarkdown = () => {
    let md = `# M365 Architecture Design\n\nGenerated by ImRizwan Tools on ${new Date().toLocaleDateString()}\n\n## Components\n\n`
    
    if (nodes.length === 0) {
      md += `*No components defined.*\n`
    } else {
        nodes.forEach(n => {
            md += `- **${labelMap[n.data.serviceType as string] || 'Node'}**: ${n.data.label} (ID: ${n.id})\n`
        })
    }

    md += `\n## Data Flow & Integration\n\n`
    
    if (edges.length === 0) {
        md += `*No connections defined.*\n`
    } else {
        edges.forEach(e => {
            const sourceNode = nodes.find(n => n.id === e.source)
            const targetNode = nodes.find(n => n.id === e.target)
            
            if (sourceNode && targetNode) {
                md += `- **${sourceNode.data.label}** (${labelMap[sourceNode.data.serviceType as string]})  -- triggers -->  **${targetNode.data.label}** (${labelMap[targetNode.data.serviceType as string]})\n`
            }
        })
    }

    setMarkdownOutput(md)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden flex flex-col md:flex-row shadow-2xl" style={{ height: '600px' }}>
        
        {/* Sidebar Toolkit */}
        <div className="w-full md:w-64 bg-slate-900/80 border-r border-slate-700/50 p-4 flex flex-col gap-4 overflow-y-auto">
          <div className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Toolbox
          </div>
          <p className="text-xs text-slate-500 mb-2">Drag components onto the canvas below.</p>
          
          <div 
            className="p-3 bg-sky-900/40 border border-sky-700/50 rounded-lg flex items-center gap-3 cursor-grab hover:bg-sky-800/50 transition-colors"
            draggable
            onDragStart={(e) => onDragStart(e, 'sharepoint')}
          >
            <Database className="text-sky-400 w-5 h-5"/>
            <span className="text-sm font-medium text-slate-200">SharePoint</span>
          </div>
          
          <div 
            className="p-3 bg-indigo-900/40 border border-indigo-700/50 rounded-lg flex items-center gap-3 cursor-grab hover:bg-indigo-800/50 transition-colors"
            draggable
            onDragStart={(e) => onDragStart(e, 'powerAutomate')}
          >
            <Zap className="text-indigo-400 w-5 h-5"/>
            <span className="text-sm font-medium text-slate-200">Power Automate</span>
          </div>

          <div 
            className="p-3 bg-fuchsia-900/40 border border-fuchsia-700/50 rounded-lg flex items-center gap-3 cursor-grab hover:bg-fuchsia-800/50 transition-colors"
            draggable
            onDragStart={(e) => onDragStart(e, 'powerApps')}
          >
            <Cpu className="text-fuchsia-400 w-5 h-5"/>
            <span className="text-sm font-medium text-slate-200">Power Apps</span>
          </div>

          <div 
            className="p-3 bg-violet-900/40 border border-violet-700/50 rounded-lg flex items-center gap-3 cursor-grab hover:bg-violet-800/50 transition-colors"
            draggable
            onDragStart={(e) => onDragStart(e, 'teams')}
          >
            <MessageSquare className="text-violet-400 w-5 h-5"/>
            <span className="text-sm font-medium text-slate-200">Teams</span>
          </div>

          <div 
            className="p-3 bg-slate-800/80 border border-slate-600/50 rounded-lg flex items-center gap-3 cursor-grab hover:bg-slate-700/80 transition-colors"
            draggable
            onDragStart={(e) => onDragStart(e, 'entra')}
          >
            <Users className="text-slate-300 w-5 h-5"/>
            <span className="text-sm font-medium text-slate-200">Entra ID</span>
          </div>


          <div className="mt-auto"></div>
          <div className="border-t border-slate-700/50 pt-4 flex flex-col gap-2">
            <button 
                onClick={clearCanvas}
                className="btn-secondary w-full flex justify-center items-center gap-2"
            >
              <Trash2 className="w-4 h-4"/> Clear
            </button>
            <button 
                onClick={generateMarkdown}
                className="btn-primary w-full flex justify-center items-center gap-2 bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400"
            >
              <FileText className="w-4 h-4"/> Generate Docs
            </button>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 h-full" ref={reactFlowWrapper}>
          <ReactFlowProvider>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodeTypes={{ custom: CustomNode }}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onInit={setReactFlowInstance}
              onDrop={onDrop}
              onDragOver={onDragOver}
              fitView
              className="bg-slate-900/40"
            >
              <Background color="#1e293b" gap={16} />
              <Controls className="fill-slate-400 text-slate-400" />
            </ReactFlow>
          </ReactFlowProvider>
        </div>
      </div>

      {/* Markdown Output Area */}
      {markdownOutput && (
        <div className="bg-slate-800/50 border border-sky-900/50 rounded-xl p-6 shadow-xl reveal">
           <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                  <FileText className="text-sky-400"/> Generated Architecture Document
              </h3>
              <button 
                onClick={() => navigator.clipboard.writeText(markdownOutput)}
                className="text-sm text-sky-400 hover:text-sky-300 flex items-center gap-1 bg-sky-900/30 px-3 py-1.5 rounded border border-sky-800/50 transition-colors"
              >
                <Share2 className="w-4 h-4"/> Copy
              </button>
           </div>
           <pre className="bg-slate-950 p-4 rounded-lg overflow-x-auto text-sm text-slate-300 border border-slate-800">
               <code>{markdownOutput}</code>
           </pre>
        </div>
      )}
    </div>
  )
}
