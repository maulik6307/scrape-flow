import { getAppUrl } from "@/lib/helper/appUrl"
import prisma from "@/lib/prisma"
import { WorkflowStatus } from "@/types/workflow"

// Force dynamic rendering so Next.js doesn't treat this as a page for static generation
export const dynamic = "force-dynamic";
export async function GET(req: Request) {
    const now = new Date()
    const workflows = await prisma.workflow.findMany({
        select: { id: true },
        where: {
            status: WorkflowStatus.PUBLISHED,
            cron: { not: null },
            nextRunAt: { lte: now }
        }
    })

    for (const workflow of workflows) {
        triggerWorkflow(workflow.id)
    }

    return Response.json({ workflowsToRun: workflows.length }, { status: 200 })
}



function triggerWorkflow(workflowId: string) {
    const triggerApiUrl = getAppUrl(`api/workflows/execute?workflowId=${workflowId}`)

    fetch(triggerApiUrl, {
        headers: {
            Authorization: `Bearer ${process.env.API_SECRET!}`,
        },
        cache: "no-store",
    }).catch((error) => console.log(error))
}