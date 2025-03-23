'use server'

import { PeriodToDateRange } from "@/lib/helper/dates";
import prisma from "@/lib/prisma";
import { Periods } from "@/types/analytics";
import { WorkflowExecutionStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const { COMPLETED, FAILED } = WorkflowExecutionStatus

export async function GetStatsCardsValues(period: Periods) {
    const { userId } = await auth()

    if (!userId) {
        redirect("/sign-in");
    }
    const dateRange = PeriodToDateRange(period)
    const executions = await prisma.workflowExecution.findMany({
        where: {
            userId,
            startedAt: {
                gte: dateRange.startDate,
                lt: dateRange.endDate
            },
            status: {
                in: [COMPLETED, FAILED]
            }
        },
        select: {
            creditsConsumed: true,
            phases: {
                where: {
                    creditsConsumed: {
                        not: null
                    }
                },
                select: {
                    creditsConsumed: true
                }
            }
        }
    });

    const stats = {
        workflowExecutions: executions.length,
        creditsConsumed: 0,
        phaseExecution: 0,
    }

    stats.creditsConsumed = executions.reduce((sum, execution) =>
        sum + execution.creditsConsumed
        , 0)

    stats.phaseExecution = executions.reduce((sum, execution) =>
        sum + execution.phases.length
        , 0)

    return stats;
}