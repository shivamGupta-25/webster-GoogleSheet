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

// Optimized blur data URL for image placeholders
const BLUR_DATA_URL = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxIiBoZWlnaHQ9IjEiPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiNmMWYxZjEiLz48L3N2Zz4=";

// Animation variants
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

// LinkedIn button component
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

// MemberCard component
const MemberCard = memo(({ member, index }) => {
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

// Swiper configuration
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
        320: { slidesPerView: 1, spaceBetween: 26 },
        480: { slidesPerView: 1.5, spaceBetween: 12 },
        640: { slidesPerView: 2, spaceBetween: 16 },
        768: { slidesPerView: 2.5, spaceBetween: 20 },
        1024: { slidesPerView: 3.5, spaceBetween: 24 },
        1280: { slidesPerView: 4, spaceBetween: 24 }
    }
};

// Skeleton loader component
const CouncilSkeleton = memo(() => {
    return (
        <section id="council" className="w-full">
            <div className="w-full px-0">
                <div className="flex flex-col items-center justify-center space-y-2 sm:space-y-4 text-center mb-6 sm:mb-8 md:mb-12 px-3 sm:px-4 md:px-6">
                    <Skeleton className="h-12 sm:h-16 md:h-20 lg:h-24 w-64 sm:w-80 md:w-96 mx-auto" />
                    <Skeleton className="h-4 sm:h-5 md:h-6 w-full max-w-[600px] md:max-w-[700px] mx-auto" />
                </div>

                <div className="w-full overflow-x-hidden">
                    <div 
                        className="flex space-x-4"
                        style={{
                            width: '100vw',
                            marginLeft: '50%',
                            transform: 'translateX(-50%)',
                            paddingTop: '10px',
                            paddingBottom: '20px',
                            paddingLeft: '10px',
                            paddingRight: '10px'
                        }}
                    >
                        {/* Generate multiple skeleton cards to match the swiper layout */}
                        {[...Array(5)].map((_, index) => (
                            <div key={index} className={`flex-shrink-0 w-full xs:w-2/3 sm:w-1/2 md:w-2/5 lg:w-1/3 xl:w-1/4 ${index > 0 && index < 2 ? '' : index > 2 ? 'hidden sm:block' : ''}`}>
                                <div className="px-1 py-2 h-full">
                                    <Card className="overflow-hidden bg-white shadow-md p-0 h-full flex flex-col">
                                        <div className="relative w-full" style={{ paddingTop: '133.33%' }}>
                                            <Skeleton className="absolute inset-0 w-full h-full" />
                                        </div>
                                        <CardContent className="p-4 text-center flex-grow flex flex-col justify-between">
                                            <div>
                                                <Skeleton className="h-5 w-3/4 mx-auto mb-2" />
                                                <Skeleton className="h-4 w-1/2 mx-auto mb-2" />
                                            </div>
                                            <div className="mt-2 flex justify-center">
                                                <Skeleton className="h-5 w-5 rounded-full" />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
});

CouncilSkeleton.displayName = 'CouncilSkeleton';

const Council = () => {
    const [isMounted, setIsMounted] = useState(false);
    const [councilData, setCouncilData] = useState({
        title: "",
        description: "",
        members: []
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Set mounted state immediately
        setIsMounted(true);

        // Use a timeout to defer non-critical data fetching
        const timer = setTimeout(() => {
            fetchSiteContent()
                .then(content => {
                    if (content && content.council) {
                        setCouncilData(content.council);
                    }
                })
                .catch(error => {
                    console.error('Error loading council data:', error);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }, 100); // Small delay to prioritize initial render

        return () => clearTimeout(timer);
    }, []);

    const { title, description, members } = councilData;

    // Optimize slide rendering with better memoization
    const renderSlides = useMemo(() => {
        if (!members || members.length === 0) return null;

        return members.map((member, index) => (
            <SwiperSlide key={member.name} className="h-auto" style={{ width: 'auto' }}>
                <div className="px-1 py-2 h-full">
                    <MemberCard member={member} index={index} />
                </div>
            </SwiperSlide>
        ));
    }, [members]);

    if (isLoading) {
        return <CouncilSkeleton />;
    }

    // Optimize Swiper config to reduce initial load time
    const optimizedSwiperConfig = {
        ...SWIPER_CONFIG,
        // Remove DOM props that cause React warnings
        lazy: {
            loadPrevNext: true,
            loadPrevNextAmount: 1
        },
        observer: true,
        observeParents: true
    };

    return (
        <section id="council" className="w-full">
            <div className="w-full px-0">
                <div className="flex flex-col items-center justify-center space-y-2 sm:space-y-4 text-center mb-6 sm:mb-8 md:mb-12 px-3 sm:px-4 md:px-6">
                    <motion.h2
                        className="text-4xl sm:text-6xl md:text-6xl lg:text-8xl font-bold tracking-tighter"
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
                            {...optimizedSwiperConfig}
                            className="w-full"
                            style={{
                                paddingTop: '10px',
                                paddingBottom: '20px',
                                paddingLeft: '10px',
                                paddingRight: '10px',
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