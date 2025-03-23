"use server"

import prisma from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation";

export async function GetWorkflowExecutions(workflowId: string) {
    const { userId } = await auth()
    if (!userId) {
        redirect("/sign-in");
    }
    return await prisma.workflowExecution.findMany({
        where: {
            workflowId,
            userId
        },
        orderBy: {
            createdAt: "desc"
        }
    })
}