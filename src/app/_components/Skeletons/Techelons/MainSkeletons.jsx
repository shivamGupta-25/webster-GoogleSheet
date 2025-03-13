"use client"

import { memo } from "react"
import { Skeleton } from "@/components/ui/skeleton"

/**
 * Feature Card Skeleton component for loading state
 */
const FeatureCardSkeleton = memo(() => (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 md:p-6 shadow-lg border border-gray-100">
        <Skeleton className="h-10 w-10 mb-2 md:mb-4 rounded-md" />
        <Skeleton className="h-6 w-24 mb-1 md:mb-2 rounded-md" />
        <Skeleton className="h-4 w-full mb-1 rounded-md" />
        <Skeleton className="h-4 w-5/6 rounded-md" />
    </div>
));

FeatureCardSkeleton.displayName = 'FeatureCardSkeleton';

/**
 * Scene3D Skeleton component for loading state
 */
const Scene3DSkeleton = memo(() => (
    <div className="relative w-full h-full bg-gradient-to-br from-black to-indigo-950 rounded-2xl overflow-hidden shadow-2xl border border-indigo-900/20">
        {/* Spotlight effect - responsive sizes */}
        <div className="absolute top-1/4 left-1/4 w-40 h-40 sm:w-60 sm:h-60 md:w-80 md:h-80 lg:w-96 lg:h-96 bg-blue-500 rounded-full opacity-20 blur-3xl" aria-hidden="true"></div>
        <div className="absolute top-1/2 right-1/4 w-32 h-32 sm:w-40 sm:h-40 md:w-56 md:h-56 lg:w-64 lg:h-64 bg-purple-500 rounded-full opacity-20 blur-3xl" aria-hidden="true"></div>
        
        {/* Skeleton overlay */}
        <div className="absolute inset-0">
            <Skeleton className="w-full h-full opacity-30" />
        </div>
        
        {/* Text overlay */}
        <div className="absolute inset-0 flex items-center justify-center p-4 md:p-8 z-100 pointer-events-none">
            <div className="text-white text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">Tech<span className="text-blue-400">elons</span></div>
                <div className="text-sm sm:text-base md:text-lg lg:text-xl text-blue-200 mb-2 sm:mb-3 md:mb-4 lg:mb-6 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">April 2025</div>
                <div className="text-xs md:text-sm bg-gradient-to-r from-blue-300 to-indigo-300 bg-clip-text text-transparent font-medium tracking-wide animate-pulse">
                    Interactive 3D Experience Loading
                </div>
            </div>
        </div>
    </div>
));

Scene3DSkeleton.displayName = 'Scene3DSkeleton';

/**
 * Loading fallback component - memoized
 */
const Scene3DFallback = memo(() => (
    <div className="flex items-center justify-center h-full">
        <div className="text-white text-center">
            <div className="text-lg animate-pulse">Loading 3D Experience...</div>
        </div>
    </div>
));

Scene3DFallback.displayName = 'Scene3DFallback';

/**
 * About Section Skeleton
 */
const AboutSectionSkeleton = memo(() => (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-5 md:p-6 lg:p-8 shadow-xl border border-gray-100">
        <Skeleton className="h-8 w-48 mx-auto mb-3" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-5/6 mb-2" />
        <Skeleton className="h-4 w-11/12 mb-2" />
        <hr className="my-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-5/6 mb-2" />
        <Skeleton className="h-4 w-11/12" />
    </div>
));

AboutSectionSkeleton.displayName = 'AboutSectionSkeleton';

/**
 * Explore Section Skeleton
 */
const ExploreSectionSkeleton = memo(() => (
    <div className="bg-gradient-to-br from-indigo-900 to-blue-900 text-white rounded-2xl p-4 sm:p-5 md:p-6 lg:p-8 shadow-xl">
        <Skeleton className="h-8 w-64 mx-auto mb-3 bg-white/20" />
        <Skeleton className="h-4 w-full mb-2 bg-white/20" />
        <Skeleton className="h-4 w-5/6 mb-2 bg-white/20" />
        <Skeleton className="h-4 w-11/12 mb-4 bg-white/20" />
        
        <div className="flex flex-col xs:flex-row justify-center items-center gap-2 sm:gap-3 mt-3 sm:mt-4">
            <Skeleton className="h-10 w-full xs:w-32 rounded-full bg-white/20" />
            <Skeleton className="h-10 w-full xs:w-32 rounded-full bg-white/20" />
        </div>
    </div>
));

ExploreSectionSkeleton.displayName = 'ExploreSectionSkeleton';

export {
    FeatureCardSkeleton,
    Scene3DSkeleton,
    Scene3DFallback,
    AboutSectionSkeleton,
    ExploreSectionSkeleton
} 