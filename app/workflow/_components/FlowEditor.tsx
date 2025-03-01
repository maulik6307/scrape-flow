"use client"
import { Workflow } from '@prisma/client'
import { addEdge, Background, BackgroundVariant, Connection, Controls, Edge, getOutgoers, ReactFlow, useEdgesState, useNodesState, useReactFlow } from '@xyflow/react'
import React, { useCallback, useEffect } from 'react'
import "@xyflow/react/dist/style.css"
import createFlowNode from '@/lib/workflow/createFlowNode'
import { TaskType } from '@/types/task'
import NodeComponent from './nodes/NodeComponents'
import { AppNode } from '@/types/appNodes'
import DeletableEdge from './edges/DeletableEdge'
import { TaskRegistry } from '@/lib/workflow/task/registry'

const nodeTypes = {
    FlowScrapeNode: NodeComponent
}

const edgeTypes = {
    default: DeletableEdge
}

const snapGrid: [number, number] = [50, 50]
const fitViewOptions = { padding: 2 }

const FlowEditor = ({ workflow }: { workflow: Workflow }) => {
    const [nodes, setNodes, onNodeChange] = useNodesState<AppNode>([]);
    const [edges, setEdges, onEdgeChange] = useEdgesState<Edge>([]);
    const { setViewport, screenToFlowPosition, updateNodeData } = useReactFlow()

    useEffect(() => {
        try {
            const flow = JSON.parse(workflow.definition)
            if (!flow) return;
            setNodes(flow.nodes || [])
            setEdges(flow.edges || [])
            if (!flow.viewport) return;
            const { x = 0, y = 0, zoom = 1 } = flow.viewport
            setViewport({ x, y, zoom })
        } catch (error) {

        }
    }, [workflow.definition, setNodes, setEdges, setViewport])

    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move"
    }, [])
    const onDrop = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        const taskType = event.dataTransfer.getData("application/reactflow")
        if (typeof taskType === undefined || !taskType) return;

        const position = screenToFlowPosition({
            x: event.clientX,
            y: event.clientY
        })

        const newNode = createFlowNode(taskType as TaskType, position)
        setNodes((nds) => nds.concat(newNode))
    }, [screenToFlowPosition, setNodes])

    const onConnect = useCallback((connection: Connection) => {
        setEdges((eds) => addEdge({ ...connection, animated: true }, eds))
        if (!connection.targetHandle) return

        const node = nodes.find((n) => n.id === connection.target)
        if (!node) return
        const nodeInputs = node.data.inputs
        updateNodeData(node.id, {
            inputs: {
                ...nodeInputs,
                [connection.targetHandle]: ""
            }
        })
    }, [setEdges, updateNodeData, nodes])

    const isValidConnection = useCallback((connection: Edge | Connection) => {
        //No self-connections allowed
        if (connection.target === connection.source) return false

        // Same taskParam type connection

        const source = nodes.find((node) => node.id === connection.source)
        const target = nodes.find((node) => node.id === connection.target)
        if (!source || !target) {
            console.error("Node not found", source, target)
            return false
        }

        const sourceTask = TaskRegistry[source.data.type]
        const targetTask = TaskRegistry[target.data.type]

        const output = sourceTask.outputs.find((output) => output.name === connection.sourceHandle)
        const input = targetTask.inputs.find((input) => input.name === connection.targetHandle)

        if (!output || !input) return false
        if (output.type !== input.type) {
            console.error("Output type not matching", output, input)
            return false
        }

        const hasCycle = (node: AppNode, visited = new Set()) => {
            if (visited.has(node.id)) return false;
            visited.add(node.id)

            for (const outgoer of getOutgoers(node, nodes, edges)) {
                if (outgoer.id === connection.source) return true;
                if (hasCycle(outgoer, visited)) return true
            }

        }

        const detectedCycle = hasCycle(target)
        return !detectedCycle

    }, [nodes, edges])


    return (
        <main className='h-full w-full'>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodeChange}
                onEdgesChange={onEdgeChange}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                snapToGrid
                snapGrid={snapGrid}
                fitViewOptions={fitViewOptions}
                fitView
                onDragOver={onDragOver}
                onDrop={onDrop}
                onConnect={onConnect}
                isValidConnection={isValidConnection}
            >
                <Controls position='top-left' fitViewOptions={fitViewOptions} />
                <Background variant={BackgroundVariant.Dots} size={1} gap={12} />
            </ReactFlow>
        </main>
    )
}

export default FlowEditor