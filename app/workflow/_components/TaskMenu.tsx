"use client"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TaskRegistry } from '@/lib/workflow/task/registry'
import { TaskType } from '@/types/task'
import { CoinsIcon } from 'lucide-react'
import React from 'react'

const TaskMenu = () => {
    return (
        <aside className='w-[340px] min-w-[340px] max-w-[340px] border-r-2 border-separate h-full p-2 px-4 overflow-auto'>
            <Accordion className='w-full' type='multiple' defaultValue={["extraction", "interaction", "timing", "results", "storage"]}>
                <AccordionItem value='interaction'>
                    <AccordionTrigger className='font-bold'>
                        User interaction
                    </AccordionTrigger>
                    <AccordionContent className='flex flex-col gap-1'>
                        <TaskMenuBtn taskType={TaskType.FILL_INPUT} />
                        <TaskMenuBtn taskType={TaskType.CLICK_ON_ELEMENT} />
                        <TaskMenuBtn taskType={TaskType.NAVIGATE_URL} />
                        <TaskMenuBtn taskType={TaskType.SCROLL_TO_ELEMENT} />
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value='extraction'>
                    <AccordionTrigger className='font-bold'>
                        Data extraction
                    </AccordionTrigger>
                    <AccordionContent className='flex flex-col gap-1'>
                        <TaskMenuBtn taskType={TaskType.PAGE_TO_HTML} />
                        <TaskMenuBtn taskType={TaskType.EXTRACT_TEXT_FROM_ELEMENT} />
                        <TaskMenuBtn taskType={TaskType.EXTRACT_DATA_WITH_AI} />
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value='storage'>
                    <AccordionTrigger className='font-bold'>
                        Data Storage
                    </AccordionTrigger>
                    <AccordionContent className='flex flex-col gap-1'>
                        <TaskMenuBtn taskType={TaskType.READ_PROPERTY_FROM_JSON} />
                        <TaskMenuBtn taskType={TaskType.ADD_PROPERTY_TO_JSON} />
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value='timing'>
                    <AccordionTrigger className='font-bold'>
                        Timing controls
                    </AccordionTrigger>
                    <AccordionContent className='flex flex-col gap-1'>
                        <TaskMenuBtn taskType={TaskType.WAIT_FOR_ELEMENT} />
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value='results'>
                    <AccordionTrigger className='font-bold'>
                        Results Delivery
                    </AccordionTrigger>
                    <AccordionContent className='flex flex-col gap-1'>
                        <TaskMenuBtn taskType={TaskType.DELIVER_VIA_WEBHOOK} />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </aside>
    )
}

export default TaskMenu

function TaskMenuBtn({ taskType }: { taskType: TaskType }) {
    const task = TaskRegistry[taskType]
    const onDragStart = (event: React.DragEvent, type: TaskType) => {
        event.dataTransfer.setData("application/reactflow", type);
        event.dataTransfer.effectAllowed = "move";
    }
    return <Button variant={"secondary"} draggable className='flex justify-between items-center gap-2 border w-full' onDragStart={(event) => onDragStart(event, taskType)}>
        <div className='flex gap-2'>
            <task.icon size={20} />
            {
                task.label
            }
        </div>
        <Badge className='flex items-center gap-1' variant={"outline"}>
            <CoinsIcon size={16} />
            {task.credits}
        </Badge>
    </Button>
}