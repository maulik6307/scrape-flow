"use client"

import { GetWorkflowExecutionStats } from '@/actions/analytics/getWorkflowExecutionStats'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Layers2 } from 'lucide-react'
import React from 'react'
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'

type ChartData = Awaited<ReturnType<typeof GetWorkflowExecutionStats>>

const chartConfig = {
    success: {
        lable: "Success",
        color: "hsl(var(--chart-2))"
    },
    failed: {
        lable: "Failed",
        color: "hsl(var(--chart-1))"
    }
}

function ExecutionStatusChart({ data }: { data: ChartData }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className='text-2xl font-bold flex items-center gap-2'>
                    <Layers2 className='w-6 h-6 text-primary' />
                    Workflow execution status
                </CardTitle>
                <CardDescription>
                    Daily number of successful and failed executions
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className='max-h-[200px] w-full'>
                    <AreaChart data={data} accessibilityLayer margin={{ top: 20 }}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                        <XAxis dataKey={"date"} tickLine={false} axisLine={false} tickMargin={8} minTickGap={32} tickFormatter={date => new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" })} />
                        <ChartLegend
                            content={<ChartLegendContent />}
                            layout="horizontal"
                            verticalAlign="bottom"
                            align="center"
                        />
                        <ChartTooltip content={<ChartTooltipContent className='w-[250px]' />} />
                        <Area dataKey={"success"} min={0} type={"bump"} fill="var(--color-success)" fillOpacity={0.6} stroke='var(--color-success)' stackId={"a"} />
                        <Area dataKey={"failed"} min={0} type={"bump"} fill="var(--color-failed)" fillOpacity={0.6} stroke='var(--color-failed)' stackId={"a"} />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}

export default ExecutionStatusChart