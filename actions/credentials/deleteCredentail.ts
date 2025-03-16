"use server"

import prisma from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"

export async function DeleteCredential(name: string) {
    const { userId } = await auth()

    if (!userId) {
        throw new Error("Unauthenticated")
    }

    const result = await prisma.credential.deleteMany({
        where: {
            userId: userId,
            name: name
        }
    })

    if (!result) {
        throw new Error("Failed to delete credential")
    }

    revalidatePath("credentials")
}