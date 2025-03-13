"use client"

import { memo } from "react"
import { Skeleton } from "@/components/ui/skeleton"

/**
 * Skeleton for the schedule section in the Techelons page
 */
const ScheduleSkeleton = memo(() => (
    <section className="w-full max-w-7xl mx-auto px-4 py-6 sm:py-8">
        {/* Heading skeleton */}
        <div className="mb-4 sm:mb-6">
            <Skeleton className="h-12 sm:h-14 md:h-16 lg:h-20 w-64 sm:w-72 md:w-80 lg:w-96 mx-auto" />
        </div>
        
        {/* Tabs skeleton */}
        <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-slate-50/80 to-slate-100/80 dark:from-slate-900/80 dark:to-slate-800/80 p-1.5 rounded-xl shadow-sm border border-slate-200/50 dark:border-slate-700/50 w-full sm:w-auto">
                <div className="flex gap-10 justify-center">
                    <Skeleton className="h-10 w-24 rounded-lg mx-2" />
                    <Skeleton className="h-10 w-24 rounded-lg mx-2" />
                </div>
            </div>
        </div>
        
        {/* Filter skeleton */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border p-3 sm:p-4 mb-4 sm:mb-6 shadow-sm">
            <Skeleton className="h-10 w-full mb-3" />
            <Skeleton className="h-6 w-40 mb-2" />
            <div className="flex flex-wrap gap-2 mt-2">
                <Skeleton className="h-8 w-20 rounded-full" />
                <Skeleton className="h-8 w-24 rounded-full" />
                <Skeleton className="h-8 w-28 rounded-full" />
                <Skeleton className="h-8 w-22 rounded-full" />
            </div>
        </div>
        
        {/* Event grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {Array.from({ length: 6 }, (_, i) => (
                <div key={i} className="overflow-hidden h-full border-0 bg-white dark:bg-gray-900 shadow-md rounded-xl">
                    <div className="p-0 h-full flex flex-col">
                        {/* Image skeleton */}
                        <div
                            className="w-full overflow-hidden relative bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900"
                            style={{ paddingTop: '56.25%' }}
                        >
                            <Skeleton className="absolute inset-0 w-full h-full" />
                        </div>
                        
                        {/* Content skeleton */}
                        <div className="p-3 sm:p-4 flex flex-col flex-grow space-y-2 sm:space-y-3">
                            <div className="flex items-center">
                                <Skeleton className="h-5 w-5 rounded-full mr-2" />
                                <Skeleton className="h-4 w-24 sm:h-5 sm:w-28" />
                            </div>
                            <Skeleton className="h-5 w-5/6 sm:h-6" />
                            <div className="flex">
                                <Skeleton className="h-4 w-28 sm:h-5 sm:w-32 rounded-md" />
                            </div>
                            <Skeleton className="h-3 w-full sm:h-4" />
                            <Skeleton className="h-3 w-5/6 sm:h-4" />
                            <div className="mt-auto pt-2">
                                <Skeleton className="h-8 w-full sm:h-9 rounded-md" />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </section>
));

ScheduleSkeleton.displayName = 'ScheduleSkeleton';

export { ScheduleSkeleton } 