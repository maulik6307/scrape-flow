"use server"

import prisma from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function RemoveWorkflowSchedule(id: string) {
    const { userId } = await auth()
    if (!userId) {
        redirect("/sign-in");
    }
    await prisma.workflow.update({
        where: { id, userId },
        data: {
            cron: null,
            nextRunAt: null
        }
    })

    revalidatePath("/workflows")
}