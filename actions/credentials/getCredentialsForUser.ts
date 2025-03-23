"use server"

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function GetCredentialsForUser() {
    const { userId } = await auth();
    if (!userId) {
        redirect("/sign-in");
    }
    return await prisma.credential.findMany({
        where: {
            userId
        },
        orderBy: {
            name: "asc"
        }
    })
}