"use client"
import { GetAvailableCredits } from '@/actions/billing/getAvailableCredits'
import { cn } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import { CoinsIcon, Loader2Icon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import ReactCountWrapper from './ReactCountWrapper'
import { buttonVariants } from './ui/button'

const UserAvailableCreditsBadge = () => {
    const query = useQuery({
        queryKey: ["user-available-credits"],
        queryFn: () => GetAvailableCredits(),
        refetchInterval: 30 * 1000 //30 sec
    })
    return (
        <Link href={"/billing"} className={cn("w-full space-x-2 items-center", buttonVariants({ variant: "outline" }))}>
            <CoinsIcon size={20} className='text-primary' />
            <span className='font-semibold capitalize'>
                {query.isLoading && <Loader2Icon className='animate-spin w-4 h-4' />}
                {!query.isLoading && query.data && <ReactCountWrapper value={query.data} />}
                {!query.isLoading && !query.data && "-"}
            </span>
        </Link>
    )
}

export default UserAvailableCreditsBadge