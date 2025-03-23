"use server"

import prisma from "@/lib/prisma";
import { FlowToExecutionPlan } from "@/lib/workflow/executionPlan";
import { CalculateWorkflowCost } from "@/lib/workflow/helper";
import { WorkflowStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function PublishWorkflow({ id, flowDefinition }: { id: string; flowDefinition: string }) {
    const { userId } = await auth()
    if (!userId) {
        redirect("/sign-in");
    }

    const workflow = await prisma.workflow.findUnique({
        where: {
            id,
            userId
        }
    })

    if (!workflow) {
        throw new Error("workflow not found")
    }

    if (workflow.status !== WorkflowStatus.DRAFT) {
        throw new Error("workflow is not draft")
    }

    const flow = JSON.parse(flowDefinition)
    const result = FlowToExecutionPlan(flow.nodes, flow.edges)
    if (result.error) {
        throw new Error("flow definition is not valid")
    }

    if (!result.executionPlan) {
        throw new Error("no execution plan found")
    }

    const creditsCost = await CalculateWorkflowCost(flow.nodes)

    await prisma.workflow.update({
        where: {
            id,
            userId
        },
        data: {
            definition: flowDefinition,
            executionPlan: JSON.stringify(result.executionPlan),
            status: WorkflowStatus.PUBLISHED,
            creditsCost: creditsCost
        }
    })

    revalidatePath(`/workflow/editor/${id}`)
}