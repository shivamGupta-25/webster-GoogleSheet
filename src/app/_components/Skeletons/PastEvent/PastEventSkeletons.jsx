"use client"

import { memo } from "react"
import { Skeleton } from "@/components/ui/skeleton"

/**
 * Skeleton for the PastEvent card in the swiper
 */
const EventCardSkeleton = memo(() => (
    <div className="rounded-xl shadow-lg overflow-hidden bg-gray-800/20 backdrop-blur-sm">
        <div className="relative aspect-[16/9] w-full">
            <Skeleton className="absolute inset-0 w-full h-full" />
            <div className="absolute inset-0 flex items-end">
                <div className="w-full bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 xs:p-4 sm:p-5">
                    <Skeleton className="h-6 sm:h-7 md:h-8 w-3/4 bg-white/20" />
                </div>
            </div>
        </div>
    </div>
));

EventCardSkeleton.displayName = 'EventCardSkeleton';

/**
 * Skeleton for the entire PastEvent section
 */
const PastEventSkeleton = memo(() => (
    <section className="mb-8 sm:py-16 md:py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        <div className="flex justify-center items-center mb-8">
            <Skeleton className="h-12 sm:h-16 lg:h-20 w-48 sm:w-64 lg:w-80" />
        </div>

        <div className="flex justify-center overflow-hidden">
            <div className="w-full max-w-[280px] xs:max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
                <div className="aspect-[16/9] rounded-xl">
                    <EventCardSkeleton />
                </div>
            </div>
        </div>

        <div className="mt-6 sm:mt-8 text-center">
            <Skeleton className="h-4 sm:h-5 w-48 sm:w-64 mx-auto" />
        </div>
    </section>
));

PastEventSkeleton.displayName = 'PastEventSkeleton';

export { EventCardSkeleton, PastEventSkeleton }