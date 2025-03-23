"use server"

import prisma from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation";

export async function GetAvailableCredits() {
    const { userId } = await auth()
    if (!userId) {
        redirect("/sign-in");
    }

    const balance = await prisma.userBalance.findUnique({
        where: {
            userId
        }
    })

    if (!balance) return -1

    return balance.credits
}