import { AppNode } from '@/types/appNodes'
import { TaskType } from '@/types/task'

function createFlowNode(
    nodeType: TaskType,
    position?: { x: number, y: number }
): AppNode {
    return {
        id: crypto.randomUUID(),
        type: "FlowScrapeNode",
        dragHandle: ".drag-handle",
        data: {
            type: nodeType,
            inputs: {},
        },
        position: position ?? { x: 0, y: 0 }
    }
}

export default createFlowNode