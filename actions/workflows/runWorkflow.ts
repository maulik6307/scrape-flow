"use server"

import prisma from "@/lib/prisma";
import { FlowToExecutionPlan } from "@/lib/workflow/executionPlan";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import { ExecutionPhaseStatus, WorkflowExecutionPlan, WorkflowExecutionStatus, WorkflowExecutionTrigger } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";

export async function RunWorkflow(form: {
    workflowId: string;
    flowDefinition?: string
}) {
    const { userId } = await auth()
    if (!userId) {
        throw new Error("Unauthenticated")
    }

    const { workflowId, flowDefinition } = form
    if (!workflowId) {
        throw new Error("WorkflowId not found")
    }

    const workflow = await prisma.workflow.findUnique({
        where: {
            userId,
            id: workflowId,
        }
    })

    if (!workflow) {
        throw new Error("Workflow not found")
    }

    let executionPlan: WorkflowExecutionPlan;
    if (!flowDefinition) {
        throw new Error("Flow definition not found")
    }

    const flow = JSON.parse(flowDefinition)
    const result = FlowToExecutionPlan(flow.nodes, flow.edges)

    if (result.error) {
        throw new Error("Invalid flow definition")
    }

    if (!result.executionPlan) {
        throw new Error("Execution plan not found")
    }

    executionPlan = result.executionPlan

    const execution = await prisma.workflowExecution.create({
        data: {
            workflowId,
            userId,
            status: WorkflowExecutionStatus.PENDING,
            startedAt: new Date(),
            trigger: WorkflowExecutionTrigger.MANUAL,
            phases: {
                create: executionPlan.flatMap((phase) => {
                    return phase.nodes.flatMap((node) => {
                        return {
                            userId,
                            status: ExecutionPhaseStatus.CREATED,
                            number: phase.phase,
                            node: JSON.stringify(node),
                            name: TaskRegistry[node.data.type].label
                        }
                    })
                })
            }
        },
        select: {
            id: true,
            phases: true
        }
    })
    if (!execution) {
        throw new Error("workflow execution not created")
    }
}