"use server"

import prisma from "@/lib/prisma"
import { Periods } from "@/types/analytics"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

export async function GetPeriods() {
    const { userId } = await auth()

    if (!userId) {
        redirect("/sign-in");
    }

    const years = await prisma.workflowExecution.aggregate({
        where: {
            userId
        },
        _min: {
            startedAt: true
        }
    })

    const currentYear = new Date().getFullYear()

    const minYear = years._min.startedAt ? years._min.startedAt.getFullYear() : currentYear

    const periods: Periods[] = []
    for (let year = minYear; year <= currentYear; year++) {
        for (let month = 0; month <= 11; month++) {
            periods.push({ year, month })
        }
    }

    return periods
}