"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";


export async function GetWorkflowsForUser() {
    const { userId } = await auth();

    if (!userId) {
        redirect("/sign-in");
    }

    return await prisma.workflow.findMany({
        where: {
            userId
        },
        orderBy: {
            createdAt: "asc"
        }
    })
}