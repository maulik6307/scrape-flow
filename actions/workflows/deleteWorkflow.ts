"use server"

import prisma from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function DeleteWorkflow(id: string) {
    const { userId } = await auth()
    if (!userId) {
        redirect("/sign-in");
    }

    await prisma.workflow.delete({
        where: {
            id,
            userId
        }
    })

    revalidatePath("/workflows")
}