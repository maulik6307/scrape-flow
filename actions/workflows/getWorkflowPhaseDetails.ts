"use server"

import prisma from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation";

export async function GetWorkflowPhaseDetails(phaseId: string) {
    const { userId } = await auth()

    if (!userId) {
        redirect("/sign-in");
    }

    return prisma.executionPhase.findUnique({
        where: {
            id: phaseId,
            execution: {
                userId
            },
        },
        include: {
            logs: {
                orderBy: {
                    timestamp: "asc"
                }
            }
        }
    })

}