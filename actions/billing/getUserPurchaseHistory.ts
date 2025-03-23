"use server"

import prisma from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation";

export async function GetUserPurchaseHistory() {
    const { userId } = await auth()

    if (!userId) {
        redirect("/sign-in");
    }

    return await prisma.userPurchase.findMany({
        where: {
            userId
        },
        orderBy: {
            date: "desc"
        }
    })
}