"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Periods } from '@/types/analytics'
import { useRouter, useSearchParams } from 'next/navigation'
import React from 'react'

const MONTH_NAME = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
] as const

function PeriodsSelector({ periods, selectedPeriod }: { periods: Periods[], selectedPeriod: Periods }) {
    const router = useRouter()
    const searchParams = useSearchParams()
    return (
        <Select
            value={`${selectedPeriod.month}-${selectedPeriod.year}`}
            onValueChange={(value) => {
                const [month, year] = value.split('-')
                const params = new URLSearchParams(searchParams)
                params.set('month', month)
                params.set('year', year)
                router.push(`?${params.toString()}`)
            }}>
            <SelectTrigger className='w-[180px]'>
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                {
                    periods.map((periods, index) => (
                        <SelectItem key={index} value={`${periods.month}-${periods.year}`} className='cursor-pointer'>
                            {`${MONTH_NAME[periods.month]} ${periods.year}`}
                        </SelectItem>
                    ))
                }
            </SelectContent>
        </Select>
    )
}

export default PeriodsSelector