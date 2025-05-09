"use client"
import { UnPublishWorkflow } from '@/actions/workflows/UnPublishWorkflow'
import { Button } from '@/components/ui/button'
import { useMutation } from '@tanstack/react-query'
import { DownloadIcon } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'

const UnPublishBtn = ({ workflowId }: { workflowId: string }) => {
    const mutation = useMutation(
        {
            mutationFn: UnPublishWorkflow,
            onSuccess: () => {
                toast.success("Workflow Unpublished", { id: workflowId })
            },
            onError: () => {
                toast.error("Something went wrong", { id: workflowId })
            }
        }
    )
    return (
        <Button variant={"outline"} className='flex items-center gap-2'
            disabled={mutation.isPending}
            onClick={() => {
                toast.loading("UnPublishing workflow...", { id: workflowId })
                mutation.mutate(workflowId)
            }}>
            <DownloadIcon size={16} className='stroke-orange-500' />
            Unpublish
        </Button>
    )
}

export default UnPublishBtn