"use client"
import { usePathname } from 'next/navigation'
import React from 'react'
import { Breadcrumb, BreadcrumbLink, BreadcrumbList } from './ui/breadcrumb'
import { MobileSidebar } from './Sidebar'

const BreadcrumbHeader = () => {
    const pathName = usePathname()
    const paths = pathName === "/" ? [""] : pathName?.split("/")
    return (
        <div className="flex flex-start items-center">
            <MobileSidebar />
            <Breadcrumb>
                <BreadcrumbList>
                    {
                        paths.map((path, index) => (
                            <React.Fragment key={index}>
                                <BreadcrumbLink className="capitalize" href={`/${path}`}>
                                    {path === "" ? "home" : path}
                                </BreadcrumbLink>
                            </React.Fragment>
                        ))
                    }
                </BreadcrumbList>
            </Breadcrumb>
        </div>
    )
}

export default BreadcrumbHeader