"use server"

import prisma from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation";

export async function GetWorkflowExecutionWithPhases(executionId: string) {
    const { userId } = await auth()

    if (!userId) {
        redirect("/sign-in");
    }

    return prisma.workflowExecution.findUnique({
        where: {
            id: executionId,
            userId
        },
        include: {
            phases: {
                orderBy: {
                    number: "asc"
                }
            }
        }
    })
}