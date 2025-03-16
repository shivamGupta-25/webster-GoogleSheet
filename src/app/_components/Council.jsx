'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Linkedin } from "lucide-react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCoverflow } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/autoplay";
import { memo, useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchSiteContent } from '@/lib/utils';

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
            className="h-full"
        >
            <Card className="overflow-hidden bg-white shadow-md hover:shadow-lg transition-shadow duration-200 p-0 h-full flex flex-col">
                {/* 3:4 aspect ratio (height:width) */}
                <div className="relative w-full" style={{ paddingTop: '133.33%' }}>
                    <Image
                        src={member.image}
                        alt={`${member.name} - ${member.role}`}
                        className="object-cover"
                        fill
                        sizes="(max-width: 480px) 90vw, (max-width: 640px) 45vw, (max-width: 768px) 30vw, (max-width: 1024px) 25vw, 20vw"
                        loading={isPriority ? "eager" : "lazy"}
                        priority={isPriority}
                        quality={75}
                        placeholder="blur"
                        blurDataURL={BLUR_DATA_URL}
                    />
                </div>
                <CardContent className="p-4 text-center flex-grow flex flex-col justify-between">
                    <div>
                        <h2 className="text-base sm:text-lg font-bold truncate mb-1">
                            {member.name}
                        </h2>
                        <p className="text-sm sm:text-md text-gray-600 mb-2">
                            {member.role}
                        </p>
                    </div>
                    <div className="mt-2">
                        <LinkedInButton url={member.linkedin} name={member.name} />
                    </div>
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
        320: { slidesPerView: 1.1, spaceBetween: 8 },
        480: { slidesPerView: 1.5, spaceBetween: 12 },
        640: { slidesPerView: 2, spaceBetween: 16 },
        768: { slidesPerView: 2.5, spaceBetween: 20 },
        1024: { slidesPerView: 3.5, spaceBetween: 24 },
        1280: { slidesPerView: 4, spaceBetween: 24 }
    }
};

// Skeleton loader component for better UX during loading
const CouncilSkeleton = memo(() => (
    <div className="w-full mx-auto px-4 py-6">
        {/* Heading skeleton */}
        <div className="mb-6 text-center">
            <Skeleton className="h-8 sm:h-10 w-48 sm:w-64 mx-auto mb-2" />
            <Skeleton className="h-3 sm:h-4 w-full max-w-xs sm:max-w-md mx-auto" />
        </div>
        
        {/* Council members grid skeleton - responsive grid with different columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {[...Array(4)].map((_, index) => (
                <div key={index} className="overflow-hidden bg-white dark:bg-gray-900 shadow-md rounded-xl h-auto">
                    <div className="flex flex-col h-full">
                        {/* Image skeleton with 3:4 aspect ratio */}
                        <div className="w-full relative bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900" style={{ paddingTop: '133.33%' }}>
                            <Skeleton className="absolute inset-0 w-full h-full" />
                        </div>
                        
                        {/* Content skeleton */}
                        <div className="p-3 sm:p-4 flex flex-col flex-grow space-y-2 sm:space-y-3">
                            <Skeleton className="h-5 sm:h-6 w-3/4" />
                            <Skeleton className="h-3 sm:h-4 w-1/2" />
                            
                            {/* Social icons skeleton */}
                            <div className="flex mt-auto pt-2">
                                <Skeleton className="h-6 w-6 sm:h-8 sm:w-8 rounded-full" />
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
    // Use state to track if component is mounted to prevent hydration issues
    const [isMounted, setIsMounted] = useState(false);
    const [councilData, setCouncilData] = useState({
        title: "",
        description: "",
        members: []
    });
    const [isLoading, setIsLoading] = useState(true);
    const [windowWidth, setWindowWidth] = useState(0);
    
    useEffect(() => {
        setIsMounted(true);
        
        const loadContent = async () => {
            try {
                const content = await fetchSiteContent();
                if (content && content.council) {
                    setCouncilData(content.council);
                }
            } catch (error) {
                console.error('Error loading council data:', error);
            } finally {
                setIsLoading(false);
            }
        };
        
        loadContent();
        
        // Add responsive window width tracking for better conditional rendering
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };
        
        // Set initial width
        setWindowWidth(window.innerWidth);
        
        // Add event listener
        window.addEventListener('resize', handleResize);
        
        // Clean up
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    
    // Destructure council data
    const { title, description, members } = councilData;
    
    // Memoize the slider content to prevent unnecessary re-renders
    const renderSlides = useMemo(() => 
        members && members.map((member, index) => (
            <SwiperSlide key={member.name} className="h-auto" style={{ width: 'auto' }}>
                <div className="px-1 py-2 h-full">
                    <MemberCard member={member} index={index} />
                </div>
            </SwiperSlide>
        )),
    [members]);

    if (isLoading) {
        return <CouncilSkeleton />;
    }

    return (
        <section id="council" className="w-full">
            <div className="w-full px-0">
                <div className="flex flex-col items-center justify-center space-y-2 sm:space-y-4 text-center mb-6 sm:mb-8 md:mb-12 px-3 sm:px-4 md:px-6">
                    <motion.h2 
                        className="text-6xl sm:text-6xl md:text-6xl lg:text-8xl font-bold tracking-tighter"
                        variants={animations.title}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        {title}
                    </motion.h2>
                    <motion.p 
                        className="max-w-full sm:max-w-[600px] md:max-w-[700px] text-sm sm:text-base md:text-lg lg:text-xl text-gray-500 dark:text-gray-400"
                        variants={animations.title}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        {description}
                    </motion.p>
                </div>
                
                {isMounted && (
                    <div className="w-full overflow-x-hidden">
                        <Swiper 
                            {...SWIPER_CONFIG} 
                            className="w-full"
                            style={{
                                paddingTop: '10px',
                                paddingBottom: '20px',
                                width: '100vw',
                                marginLeft: '50%',
                                transform: 'translateX(-50%)'
                            }}
                        >
                            {renderSlides}
                        </Swiper>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Council;