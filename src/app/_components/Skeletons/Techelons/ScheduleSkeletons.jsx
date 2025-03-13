"use client"

import { memo } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

/**
 * Loading skeleton for event cards
 */
const EventCardSkeleton = memo(() => (
    <Card className="overflow-hidden h-full border-0 bg-white dark:bg-gray-900 shadow-md rounded-xl animate-pulse">
        <CardContent className="p-0 h-full flex flex-col">
            {/* Image skeleton with responsive aspect ratio */}
            <div
                className="w-full overflow-hidden relative bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900"
                style={{ paddingTop: '56.25%' }} // 16:9 aspect ratio
            >
                <Skeleton className="absolute inset-0 w-full h-full" />
                <div className="absolute bottom-0 left-0 right-0 p-3 flex justify-between items-end">
                    <Skeleton className="h-4 w-16 sm:h-5 sm:w-20 rounded-full" />
                </div>
            </div>
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
        </CardContent>
    </Card>
))

EventCardSkeleton.displayName = 'EventCardSkeleton'

/**
 * Grid of event card skeletons for loading state
 */
const EventGridSkeleton = memo(({ count = 6 }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {Array.from({ length: count }, (_, i) => (
            <EventCardSkeleton key={i} />
        ))}
    </div>
))

EventGridSkeleton.displayName = 'EventGridSkeleton'

export { EventCardSkeleton, EventGridSkeleton } 