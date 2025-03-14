'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Linkedin } from "lucide-react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCoverflow } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/autoplay";
import { memo, useCallback, useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import siteContent from '@/app/_data/siteContent';

// Council members data - now imported from centralized content

// Optimized blur data URL for image placeholders (smaller SVG)
const BLUR_DATA_URL = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxIiBoZWlnaHQ9IjEiPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiNmMWYxZjEiLz48L3N2Zz4=";

// Animation variants - simplified for better performance
const animations = {
    title: {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0, 
            transition: { duration: 0.5 } 
        }
    },
    card: {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: { duration: 0.3 } 
        }
    }
};

// LinkedIn button component - memoized
const LinkedInButton = memo(({ url, name }) => {
    if (!url) return null;
    
    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center text-blue-500 hover:text-blue-700 transition-colors"
            aria-label={`LinkedIn profile of ${name}`}
        >
            <Linkedin className="w-5 h-5" />
        </a>
    );
});

LinkedInButton.displayName = 'LinkedInButton';

// MemberCard component - memoized with proper dependency tracking
const MemberCard = memo(({ member, index }) => {
    // Only prioritize loading for the first visible cards
    const isPriority = index < 2;
    
    return (
        <motion.div
            variants={animations.card}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
        >
            <Card className="overflow-hidden bg-white shadow-md hover:shadow-lg transition-shadow duration-200 p-0">
                <div className="relative w-full h-[380px]">
                    <Image
                        src={member.image}
                        alt={`${member.name} - ${member.role}`}
                        className="object-cover"
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
                        loading={isPriority ? "eager" : "lazy"}
                        priority={isPriority}
                        quality={75}
                        placeholder="blur"
                        blurDataURL={BLUR_DATA_URL}
                    />
                </div>
                <CardContent className="p-4 text-center">
                    <h2 className="text-lg font-bold truncate mb-1">
                        {member.name}
                    </h2>
                    <p className="text-md text-gray-600 mb-2">
                        {member.role}
                    </p>
                    <LinkedInButton url={member.linkedin} name={member.name} />
                </CardContent>
            </Card>
        </motion.div>
    );
});

MemberCard.displayName = 'MemberCard';

// Swiper configuration - defined outside component to prevent recreation
const SWIPER_CONFIG = {
    modules: [Autoplay, EffectCoverflow],
    effect: "coverflow",
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: "auto",
    loop: true,
    coverflowEffect: {
        rotate: 10,
        depth: 100,
        modifier: 1,
        slideShadows: false,
    },
    autoplay: {
        delay: 3000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true
    },
    breakpoints: {
        320: { slidesPerView: 1, spaceBetween: 12 },
        640: { slidesPerView: 2, spaceBetween: 16 },
        768: { slidesPerView: 3, spaceBetween: 24 },
        1024: { slidesPerView: 4, spaceBetween: 24 }
    }
};

// Skeleton loader component for better UX during loading
const CouncilSkeleton = memo(() => (
    <div className="w-full max-w-7xl mx-auto px-4 py-6">
        {/* Heading skeleton */}
        <div className="mb-6 text-center">
            <Skeleton className="h-10 w-64 mx-auto mb-2" />
            <Skeleton className="h-4 w-full max-w-md mx-auto" />
        </div>
        
        {/* Council members grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
                <div key={index} className="overflow-hidden bg-white dark:bg-gray-900 shadow-md rounded-xl h-[460px]">
                    <div className="flex flex-col h-full">
                        {/* Image skeleton with responsive aspect ratio */}
                        <div className="w-full relative bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900" style={{ paddingTop: '100%' }}>
                            <Skeleton className="absolute inset-0 w-full h-full" />
                        </div>
                        
                        {/* Content skeleton */}
                        <div className="p-4 flex flex-col flex-grow space-y-3">
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                            <Skeleton className="h-4 w-5/6" />
                            <Skeleton className="h-4 w-full" />
                            
                            {/* Social icons skeleton */}
                            <div className="flex space-x-2 mt-auto pt-2">
                                <Skeleton className="h-8 w-8 rounded-full" />
                                <Skeleton className="h-8 w-8 rounded-full" />
                                <Skeleton className="h-8 w-8 rounded-full" />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
));

// Add display name for better debugging
CouncilSkeleton.displayName = 'CouncilSkeleton';

const Council = () => {
    // Use a ref to track if component is mounted to prevent hydration issues
    const [isMounted, setIsMounted] = useState(false);
    
    useEffect(() => {
        setIsMounted(true);
    }, []);
    
    // Get council content from centralized data
    const { title, description, members } = useMemo(() => siteContent.council, []);
    
    // Replace the hardcoded council members with the data from siteContent
    const councilMembers = useMemo(() => members, [members]);
    
    // Memoize the slider content to prevent unnecessary re-renders
    const renderSlides = useMemo(() => 
        councilMembers.map((member, index) => (
            <SwiperSlide key={member.name} className="h-auto">
                <MemberCard member={member} index={index} />
            </SwiperSlide>
        )),
    []);

    return (
        <section className="py-12 md:py-24">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">{title}</h2>
                    <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                        {description}
                    </p>
                </div>
                
                {!isMounted ? (
                    <CouncilSkeleton />
                ) : (
                    <Swiper {...SWIPER_CONFIG} className="w-full">
                        {renderSlides}
                    </Swiper>
                )}
            </div>
        </section>
    );
};

export default memo(Council);