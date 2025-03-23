"use server"

import prisma from "@/lib/prisma"
import { WorkflowStatus } from "@/types/workflow"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function updateWorkflow({ id, definition }: { id: string, definition: string }) {

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

    if (!workflow) throw new Error("Workflow not found")

    if (workflow.status !== WorkflowStatus.DRAFT) {
        throw new Error("Workflow is not in draft mode")
    }

    await prisma.workflow.update({
        data: {
            definition
        },
        where: {
            id, userId
        }
    })

    revalidatePath("/workflows")
}