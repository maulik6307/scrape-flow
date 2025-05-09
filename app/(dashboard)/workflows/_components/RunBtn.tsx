"use client"
import { RunWorkflow } from '@/actions/workflows/runWorkflow'
import { Button } from '@/components/ui/button'
import { useMutation } from '@tanstack/react-query'
import { PlayIcon } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'

const RunBtn = ({ workflowId }: { workflowId: string }) => {
  const mutation = useMutation({
    mutationFn: RunWorkflow,
    onSuccess: () => {
      toast.success("Workflow started", { id: workflowId })
    },
    onError: () => {
      toast.error("Something Went Wrong", { id: workflowId })
    }
  })
  return (
    <Button variant={"outline"} size={"sm"} className='flex items-center gap-2' disabled={mutation.isPending} onClick={() => {
      toast.loading("Running workflow...", { id: workflowId })
      mutation.mutate({ workflowId })
    }}>
      <PlayIcon size={16} />
      Run
    </Button>
  )
}

export default RunBtn