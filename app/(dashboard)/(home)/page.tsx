export const dynamic = "force-dynamic";
import { GetPeriods } from '@/actions/analytics/getPeriods'
import React, { Suspense } from 'react'
import PeriodsSelector from './_components/PeriodsSelector'
import { Periods } from '@/types/analytics'
import { Skeleton } from '@/components/ui/skeleton'
import { GetStatsCardsValues } from '@/actions/analytics/getStatsCardsValues'
import StatsCard from './_components/StatsCard'
import { CirclePlayIcon, CoinsIcon, WaypointsIcon } from 'lucide-react'
import { GetWorkflowExecutionStats } from '@/actions/analytics/getWorkflowExecutionStats'
import ExecutionStatusChart from './_components/ExecutionStatusChart'
import { GetCreditsUsageInPeriod } from '@/actions/analytics/getCreditsUsageInPeriod'
import CreditUsageChart from '../billing/_components/CreditUsageChart'



const Homepage = ({ searchParams }: { searchParams: { month?: string, year?: string } }) => {
    const currentDate = new Date()
    const { month, year } = searchParams
    const period: Periods = {
        month: month ? parseInt(month) : currentDate.getMonth(),
        year: year ? parseInt(year) : currentDate.getFullYear()
    }
    return (
        <div className='flex flex-1 flex-col h-full'>
            <div className='flex justify-between items-center'>
                <h1 className='text-3xl font-bold'>Analytics</h1>
                <Suspense fallback={<Skeleton className='w-[180px] h-[40px]' />}>
                    <PeriodSelectorWrapper selectedPeriod={period} />
                </Suspense>
            </div>
            <div className='h-full py-6 flex flex-col gap-4'>
                <Suspense fallback={<StatsCardsSkeleton />}>
                    <StatsCards selectedPeriod={period} />
                </Suspense>
                <Suspense fallback={<Skeleton className='w-full h-[300px]' />}>
                    <StatsExecutionStatus selectedPeriod={period} />
                </Suspense>
                <Suspense fallback={<Skeleton className='w-full h-[300px]' />}>
                    <CreditsUsageInPeriod selectedPeriod={period} />
                </Suspense>
            </div>
        </div>
    )
}

async function PeriodSelectorWrapper({ selectedPeriod }: { selectedPeriod: Periods }) {
    const periods = await GetPeriods()
    return <PeriodsSelector periods={periods} selectedPeriod={selectedPeriod} />
}

async function StatsCards({ selectedPeriod }: { selectedPeriod: Periods }) {
    const data = await GetStatsCardsValues(selectedPeriod)
    return <div className='grid gap-3 lg:gap-8 lg:grid-cols-3 min-h-[120px]'>
        <StatsCard title="Workflow Executions" value={data.workflowExecutions} icon={CirclePlayIcon} />
        <StatsCard title="Phase Executions" value={data.phaseExecution} icon={WaypointsIcon} />
        <StatsCard title="Credits Consumed" value={data.creditsConsumed} icon={CoinsIcon} />
    </div>
}

function StatsCardsSkeleton() {
    return <div className='grid gap-3 lg:gap-8 lg:grid-cols-3'>
        {
            [1, 2, 3].map((i) => (
                <Skeleton key={i} className='w-full min-h-[120px]' />
            ))
        }
    </div>
}


async function StatsExecutionStatus({ selectedPeriod }: { selectedPeriod: Periods }) {
    const data = await GetWorkflowExecutionStats(selectedPeriod)
    return <ExecutionStatusChart data={data} />
}

async function CreditsUsageInPeriod({ selectedPeriod }: { selectedPeriod: Periods }) {
    const data = await GetCreditsUsageInPeriod(selectedPeriod)
    return <CreditUsageChart data={data} title="Daily credits spent" description="Credits spent per day" />
}

export default Homepage