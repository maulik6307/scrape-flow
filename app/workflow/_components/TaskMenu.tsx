"use client"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { TaskRegistry } from '@/lib/workflow/task/registry'
import { TaskType } from '@/types/task'
import React from 'react'

const TaskMenu = () => {
    return (
        <aside className='w-[340px] min-w-[340px] max-w-[340px] border-r-2 border-separate h-full p-2 px-4 overflow-auto'>
            <Accordion className='w-full' type='multiple' defaultValue={["extraction"]}>
                <AccordionItem value='extraction'>
                    <AccordionTrigger className='font-bold'>
                        Data extraction
                    </AccordionTrigger>
                    <AccordionContent className='flex flex-col gap-1'>
                        <TaskMenuBtn taskType={TaskType.PAGE_TO_HTML} />
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
    </Button>
}