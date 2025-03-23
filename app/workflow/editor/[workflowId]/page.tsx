import prisma from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'
import React from 'react'
import Editor from '../../_components/Editor'
export const dynamic = "force-dynamic";


const page = async ({ params }: { params: { workflowId: string } }) => {
    const workflowId = params.workflowId
    const { userId } = await auth()
    if (!userId) return <div>unauthenticated</div>

    const workflow = await prisma.workflow.findUnique({
        where: {
            id: workflowId,
            userId
        }
    })

    if (!workflow) return <div>workflow not found</div>
    return (
        <Editor workflow={workflow} />
    )
}

export default page