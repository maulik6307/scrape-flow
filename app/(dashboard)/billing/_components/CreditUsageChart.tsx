"use client"

import { GetCreditsUsageInPeriod } from '@/actions/analytics/getCreditsUsageInPeriod'
import { GetWorkflowExecutionStats } from '@/actions/analytics/getWorkflowExecutionStats'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { ChartColumnStacked, Layers2 } from 'lucide-react'
import React from 'react'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis } from 'recharts'

type ChartData = Awaited<ReturnType<typeof GetCreditsUsageInPeriod>>

const chartConfig = {
    success: {
        lable: "Successfull Phases Credits",
        color: "hsl(var(--chart-2))"
    },
    failed: {
        lable: "Failed Phases Credits",
        color: "hsl(var(--chart-1))"
    }
}

function CreditUsageChart({ data, title, description }: { data: ChartData, title: string, description: string }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className='text-2xl font-bold flex items-center gap-2'>
                    <ChartColumnStacked className='w-6 h-6 text-primary' />
                    {title}
                </CardTitle>
                <CardDescription>
                    {description}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className='max-h-[200px] w-full'>
                    <BarChart data={data} accessibilityLayer margin={{ top: 20 }}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                        <XAxis dataKey={"date"} tickLine={false} axisLine={false} tickMargin={8} minTickGap={32} tickFormatter={date => new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" })} />
                        <ChartLegend content={<ChartLegendContent />} />
                        <ChartTooltip content={<ChartTooltipContent className='w-[250px]' />} />
                        <Bar dataKey={"success"} fill="var(--color-success)" fillOpacity={0.8} radius={[0, 0, 4, 4]} stroke='var(--color-success)' stackId={"a"} />
                        <Bar dataKey={"failed"} fill="var(--color-failed)" fillOpacity={0.8} radius={[4, 4, 0, 0]} stroke='var(--color-failed)' stackId={"a"} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}

export default CreditUsageChart