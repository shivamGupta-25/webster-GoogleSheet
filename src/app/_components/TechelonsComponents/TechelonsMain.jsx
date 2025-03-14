// NOTE: This file was automatically updated to use fetchTechelonsData instead of importing from techelonsData directly.
// Please review and update the component to use the async fetchTechelonsData function.
import { useState, useEffect, lazy, Suspense, useCallback, useMemo, memo } from "react";
import { useRouter } from "next/navigation";
import PropTypes from 'prop-types';
import { fetchTechelonsData } from '@/lib/utils'; // NOTE: You need to update this component to use the async fetchTechelonsData function
import { Skeleton } from "@/components/ui/skeleton";
import {
    FeatureCardSkeleton,
    Scene3DSkeleton,
    Scene3DFallback,
    AboutSectionSkeleton,
    ExploreSectionSkeleton,
    LOADING_TIMEOUT,
    CONTENT_LOADING_TIMEOUT
} from "@/app/_components/Skeletons/Techelons";

// Constants
const MOBILE_BREAKPOINT = 768;
const TABLET_BREAKPOINT = 1024;

// Lazy load the SplineScene component with dynamic import
const SplineScene = lazy(() => 
    import("@/components/ui/splite").then(mod => ({ default: mod.SplineScene }))
);

// Custom hook for responsive design
const useResponsive = () => {
    const [isMobile, setIsMobile] = useState(false);
    const [isTablet, setIsTablet] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        
        const updateDimensions = () => {
            const width = window.innerWidth;
            setIsMobile(width <= MOBILE_BREAKPOINT);
            setIsTablet(width > MOBILE_BREAKPOINT && width <= TABLET_BREAKPOINT);
        };
        
        updateDimensions();
        
        if (typeof ResizeObserver !== 'undefined') {
            const resizeObserver = new ResizeObserver(throttle(updateDimensions, 200));
            resizeObserver.observe(document.documentElement);
            return () => resizeObserver.disconnect();
        } else {
            const throttledUpdate = throttle(updateDimensions, 200);
            window.addEventListener('resize', throttledUpdate, { passive: true });
            return () => window.removeEventListener('resize', throttledUpdate);
        }
    }, []);

    return { isMobile, isTablet };
};

// Throttle function to limit execution frequency
function throttle(func, delay) {
    let lastCall = 0;
    return function(...args) {
        const now = Date.now();
        if (now - lastCall >= delay) {
            lastCall = now;
            func.apply(this, args);
        }
    };
}

// Custom hook for registration status
const useRegistrationStatus = () => {
    const [registrationStatus, setRegistrationStatus] = useState({
        registrationOpen: false,
        statusMessage: "Loading..."
    });

    useEffect(() => {
        const getRegistrationStatus = async () => {
            try {
                const data = await fetchTechelonsData();
                if (data && data.festInfo) {
                    const regStatus = data.festInfo.registrationEnabled;
                    setRegistrationStatus({
                        registrationOpen: regStatus,
                        statusMessage: regStatus ? "Registration Open" : "Registration Closed"
                    });
                }
            } catch (error) {
                console.error("Error fetching registration status:", error);
                setRegistrationStatus({
                    registrationOpen: false,
                    statusMessage: "Registration Status Unavailable"
                });
            }
        };
        
        getRegistrationStatus();
    }, []);

    return registrationStatus;
};

// Feature Card component
const FeatureCard = memo(({ icon, title, description }) => (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 md:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
        <div className="text-2xl md:text-3xl lg:text-4xl mb-2 md:mb-4" aria-hidden="true">{icon}</div>
        <h3 className="text-base md:text-lg lg:text-xl font-bold text-gray-900 mb-1 md:mb-2">{title}</h3>
        <p className="text-gray-600 text-sm md:text-base">{description}</p>
    </div>
));

FeatureCard.propTypes = {
    icon: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired
};

FeatureCard.displayName = 'FeatureCard';

// Default features data
const DEFAULT_FEATURES = [
    {
        title: "Competitions",
        icon: "🏆",
        description: "Participate in coding, analysis, and gaming competitions with exciting prizes."
    },
    {
        title: "Seminar",
        icon: "🎤",
        description: "Gain insights from industry leaders through engaging and informative seminars."
    },
    {
        title: "Networking",
        icon: "🌐",
        description: "Connect with tech enthusiasts and industry professionals."
    }
];

// Main component
const TechelonsMain = () => {
    const router = useRouter();
    const { isMobile, isTablet } = useResponsive();
    const { registrationOpen, statusMessage } = useRegistrationStatus();
    const [is3DLoaded, setIs3DLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [shouldRender3D, setShouldRender3D] = useState(false);
    const [reducedQuality, setReducedQuality] = useState(false);
    const [contentLoaded, setContentLoaded] = useState(false);
    
    // State for content from CMS
    const [techelonsContent, setTechelonsContent] = useState({
        title: "Techelons'25",
        subtitle: "Shivaji College's premier technical festival, where innovation meets creativity.",
        festDate: "April 2025",
        aboutTitle: "About Techelons",
        aboutParagraphs: [
            "Techelons is the annual tech fest by Websters, the CS Society of Shivaji College, DU. It's where students showcase technical skills through competitions, hackathons, and coding challenges.",
            "Beyond competitions, Techelons features expert-led seminars on emerging tech and industry trends. The fest promotes networking and collaboration among students and professionals in a celebration of technological innovation."
        ],
        exploreTitle: "Explore the Future of Technology",
        exploreDescription: "Join us for two days of innovation, competition, and creativity at Shivaji College. Showcase your skills and connect with tech enthusiasts from across the nation.",
        features: DEFAULT_FEATURES
    });

    // Fetch content from API or use default
    useEffect(() => {
        const fetchTechelonsContent = async () => {
            try {
                setIsLoading(true);
                const data = await fetchTechelonsData();
                
                if (data) {
                    // Check if there's UI content in the response
                    if (data.uiContent) {
                        setTechelonsContent(data.uiContent);
                    }
                }
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching Techelons content:", error);
                // Keep using default content on error
                setIsLoading(false);
            }
        };
        
        fetchTechelonsContent();
    }, []);

    // Handle registration button click
    const handleRegistration = useCallback(() => {
        if (registrationOpen) {
            router.push("/techelonsregistration");
        } else {
            router.push("/registrationclosed");
        }
    }, [registrationOpen, router]);

    // Handle 3D scene load completion
    const handle3DLoad = useCallback(() => {
        setIs3DLoaded(true);
        setIsLoading(false);
    }, []);

    // Handle learn more button click
    const handleLearnMore = useCallback(() => {
        window.location.href = "/techelons#events";
    }, []);

    // Use IntersectionObserver to only load 3D when visible
    useEffect(() => {
        if (typeof window === 'undefined' || isMobile) return;
        
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setShouldRender3D(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1, rootMargin: '100px' }
        );
        
        const container = document.querySelector('.techelons-3d-container');
        if (container) {
            observer.observe(container);
        }
        
        return () => observer.disconnect();
    }, [isMobile]);

    // Simulate content loading with a shorter timeout to match TechelonsSchedule
    useEffect(() => {
        const contentTimer = setTimeout(() => {
            setContentLoaded(true);
        }, CONTENT_LOADING_TIMEOUT);
        
        return () => clearTimeout(contentTimer);
    }, []);

    // Set a timeout to hide loading state even if 3D doesn't load
    useEffect(() => {
        if (isMobile) {
            setIsLoading(false);
            return;
        }
        
        const loadingTimer = setTimeout(() => {
            if (!is3DLoaded) setIsLoading(false);
        }, LOADING_TIMEOUT);

        return () => clearTimeout(loadingTimer);
    }, [is3DLoaded, isMobile]);

    // Check device performance to determine if we should reduce 3D quality
    useEffect(() => {
        if (typeof window === 'undefined' || isMobile) return;
        
        const checkPerformance = () => {
            if (isTablet) {
                setReducedQuality(true);
                return;
            }
            
            if (navigator.deviceMemory && navigator.deviceMemory < 4) {
                setReducedQuality(true);
                return;
            }
            
            if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
                setReducedQuality(true);
                return;
            }
            
            try {
                const canvas = document.createElement('canvas');
                const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
                
                if (!gl) {
                    setReducedQuality(true);
                    return;
                }
                
                const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
                if (debugInfo) {
                    const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
                    if (renderer.includes('Intel') || 
                        renderer.includes('AMD') && !renderer.includes('Radeon') ||
                        renderer.includes('Apple') ||
                        renderer.toLowerCase().includes('mobile')) {
                        setReducedQuality(true);
                        return;
                    }
                }
            } catch (e) {
                setReducedQuality(true);
            }
        };
        
        checkPerformance();
    }, [isMobile, isTablet]);

    // Memoize the status badge style
    const statusBadgeStyle = useMemo(() => ({
        container: `inline-flex items-center gap-2 px-4 py-2 md:px-5 md:py-3 rounded-full ${
            registrationOpen ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
        }`,
        indicator: `w-2 h-2 rounded-full ${
            registrationOpen ? "bg-green-500" : "bg-red-500"
        } animate-pulse`,
        text: `font-bold text-sm md:text-md ${
            registrationOpen ? "text-green-600" : "text-red-600"
        }`
    }), [registrationOpen]);

    // Memoize the 3D scene
    const scene3D = useMemo(() => {
        if (isMobile || !shouldRender3D) return null;
        
        const sceneUrl = reducedQuality 
            ? "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            : "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode";
        
        return (
            !isLoading && (
                <SplineScene
                    scene={sceneUrl}
                    className="w-full h-full"
                    onLoad={handle3DLoad}
                />
            )
        );
    }, [isLoading, handle3DLoad, isMobile, shouldRender3D, reducedQuality]);

    // Memoize the spotlight effects
    const spotlightEffects = useMemo(() => (
        <>
            <div className="absolute top-1/4 left-1/4 w-40 h-40 sm:w-60 sm:h-60 md:w-80 md:h-80 lg:w-96 lg:h-96 bg-blue-500 rounded-full opacity-20 blur-3xl" aria-hidden="true"></div>
            <div className="absolute top-1/2 right-1/4 w-32 h-32 sm:w-40 sm:h-40 md:w-56 md:h-56 lg:w-64 lg:h-64 bg-purple-500 rounded-full opacity-20 blur-3xl" aria-hidden="true"></div>
        </>
    ), []);

    // Memoize the 3D container
    const scene3DContainer = useMemo(() => {
        if (isMobile) return null;
        
        return (
            <div className="h-full flex techelons-3d-container">
                {isLoading || !contentLoaded ? (
                    <Scene3DSkeleton />
                ) : (
                    <div className="relative w-full h-full bg-gradient-to-br from-black to-indigo-950 rounded-2xl overflow-hidden shadow-2xl border border-indigo-900/20">
                        {spotlightEffects}

                        <div className="absolute inset-0">
                            <Suspense fallback={<Scene3DFallback />}>
                                {scene3D}
                            </Suspense>
                        </div>

                        <div className="absolute inset-0 flex items-center justify-center p-4 md:p-8 z-100 pointer-events-none">
                            <div className="text-white text-center">
                                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">Tech<span className="text-blue-400">elons</span></div>
                                <div className="text-sm sm:text-base md:text-lg lg:text-xl text-blue-200 mb-2 sm:mb-3 md:mb-4 lg:mb-6 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">{techelonsContent.festDate}</div>
                                {isLoading && (
                                    <div className="text-xs md:text-sm bg-gradient-to-r from-blue-300 to-indigo-300 bg-clip-text text-transparent font-medium tracking-wide animate-pulse">
                                        Interactive 3D Experience Loading
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }, [isMobile, scene3D, isLoading, spotlightEffects, contentLoaded, techelonsContent.festDate]);

    // Memoize the features section
    const featuresSection = useMemo(() => (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mt-6 sm:mt-8 md:mt-10 lg:mt-12">
            {!contentLoaded ? (
                <>
                    <FeatureCardSkeleton />
                    <FeatureCardSkeleton />
                    <FeatureCardSkeleton />
                </>
            ) : (
                techelonsContent.features.map((feature, index) => (
                    <FeatureCard
                        key={`feature-${index}`}
                        icon={feature.icon}
                        title={feature.title}
                        description={feature.description}
                    />
                ))
            )}
        </div>
    ), [contentLoaded, techelonsContent.features]);

    // Mobile-specific 3D alternative
    const mobileBanner = useMemo(() => {
        if (!isMobile) return null;
        
        return (
            <div className="mb-6 rounded-2xl overflow-hidden shadow-lg">
                {!contentLoaded ? (
                    <div className="relative bg-gradient-to-br from-black to-indigo-950 py-10 px-4">
                        <Skeleton className="h-8 w-48 mx-auto mb-2 bg-white/20" />
                        <Skeleton className="h-4 w-32 mx-auto mb-2 bg-white/20" />
                        <Skeleton className="h-4 w-64 mx-auto bg-white/20" />
                    </div>
                ) : (
                    <div className="relative bg-gradient-to-br from-black to-indigo-950 py-10 px-4">
                        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500 rounded-full opacity-20 blur-3xl" aria-hidden="true"></div>
                        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-purple-500 rounded-full opacity-20 blur-3xl" aria-hidden="true"></div>
                        
                        <div className="relative text-center">
                            <div className="text-3xl sm:text-4xl font-bold mb-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] text-white">Tech<span className="text-blue-400">elons</span></div>
                            <div className="text-base sm:text-lg text-blue-200 mb-3 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">{techelonsContent.festDate}</div>
                            <div className="text-white/80 text-sm">Shivaji College's Premier Tech Fest</div>
                        </div>
                    </div>
                )}
            </div>
        );
    }, [isMobile, contentLoaded, techelonsContent.festDate]);

    // Memoize the about section
    const aboutSection = useMemo(() => (
        !contentLoaded ? (
            <AboutSectionSkeleton />
        ) : (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-5 md:p-6 lg:p-8 shadow-xl border border-gray-100">
                <h2 className="text-lg sm:text-xl md:text-2xl text-center font-bold text-gray-900 mb-2 sm:mb-3">{techelonsContent.aboutTitle}</h2>
                {techelonsContent.aboutParagraphs.map((paragraph, index) => (
                    <p key={`about-p-${index}`} className="text-gray-600 text-xs sm:text-sm md:text-base mb-2">
                        {paragraph}
                    </p>
                ))}
            </div>
        )
    ), [contentLoaded, techelonsContent.aboutTitle, techelonsContent.aboutParagraphs]);

    // Memoize the explore section
    const exploreSection = useMemo(() => (
        !contentLoaded ? (
            <ExploreSectionSkeleton />
        ) : (
            <div className="bg-gradient-to-br from-indigo-900 to-blue-900 text-white rounded-2xl p-4 sm:p-5 md:p-6 lg:p-8 shadow-xl">
                <h2 className="text-lg sm:text-xl md:text-2xl text-center font-bold mb-2 sm:mb-3">{techelonsContent.exploreTitle}</h2>
                <p className="text-indigo-100 mb-3 sm:mb-4 text-xs sm:text-sm md:text-base">
                    {techelonsContent.exploreDescription}
                </p>

                <div className="flex flex-col xs:flex-row justify-center items-center gap-2 sm:gap-3 mt-3 sm:mt-4">
                    <button
                        onClick={handleRegistration}
                        className="w-full xs:w-auto bg-white text-indigo-800 py-2 px-3 sm:py-2 sm:px-4 md:py-2.5 md:px-5 text-sm sm:text-base font-semibold rounded-full shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 hover:bg-white/90 active:transform active:scale-95"
                        aria-label={registrationOpen ? "Register Now" : "Registration Closed"}
                    >
                        {registrationOpen ? "Register Now" : "Registration Closed"}
                    </button>
                    <button
                        onClick={handleLearnMore}
                        className="w-full xs:w-auto text-center bg-indigo-700/50 text-white py-2 px-3 sm:py-2 sm:px-4 md:py-2.5 md:px-5 text-sm sm:text-base font-semibold rounded-full border border-indigo-500/30 hover:bg-indigo-700/70 transition-all duration-300 active:transform active:scale-95"
                        aria-label="Learn More About Events"
                    >
                        Explore Events
                    </button>
                </div>
            </div>
        )
    ), [handleRegistration, handleLearnMore, registrationOpen, contentLoaded, techelonsContent.exploreTitle, techelonsContent.exploreDescription]);

    // Memoize the heading section
    const headingSection = useMemo(() => (
        <div className="text-center mb-6 sm:mb-8 md:mb-10 lg:mb-16">
            {!contentLoaded ? (
                <>
                    <div className="inline-block relative">
                        <Skeleton className="h-12 sm:h-14 md:h-16 lg:h-20 w-64 sm:w-72 md:w-80 lg:w-96 mx-auto" />
                        <div className="absolute -bottom-2 sm:-bottom-3 left-0 right-0 h-1 bg-gradient-to-r from-blue-600/0 via-purple-600 to-indigo-600/0 blur-sm" aria-hidden="true"></div>
                    </div>
                    <Skeleton className="h-6 w-full max-w-2xl mx-auto mt-4" />
                </>
            ) : (
                <>
                    <div className="inline-block relative">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 leading-none">
                            {techelonsContent.title}
                        </h1>
                        <div className="absolute -bottom-2 sm:-bottom-3 left-0 right-0 h-1 bg-gradient-to-r from-blue-600/0 via-purple-600 to-indigo-600/0 blur-sm" aria-hidden="true"></div>
                    </div>
                    <p className="mt-3 sm:mt-4 md:mt-5 lg:mt-6 text-gray-700 text-sm sm:text-base md:text-lg lg:text-xl max-w-2xl mx-auto">
                        {techelonsContent.subtitle}
                    </p>
                </>
            )}
        </div>
    ), [contentLoaded, techelonsContent.title, techelonsContent.subtitle]);

    return (
        <section className="relative py-6 sm:py-8 md:py-10 overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
                {/* Top badge */}
                <div className="flex justify-center mb-4 sm:mb-5 md:mb-6 lg:mb-8">
                    {!contentLoaded ? (
                        <Skeleton className="h-10 w-48 rounded-full" />
                    ) : (
                        <div className={statusBadgeStyle.container}>
                            <span className={statusBadgeStyle.indicator} aria-hidden="true"></span>
                            <span className={statusBadgeStyle.text}>
                                {statusMessage}
                            </span>
                        </div>
                    )}
                </div>

                {/* Main heading section */}
                {headingSection}

                {/* Mobile-specific banner */}
                {mobileBanner}

                {/* Main content card */}
                <div className={`${isMobile ? "" : isTablet ? "grid grid-cols-1" : "grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-stretch"}`}>
                    {/* Right column: Festival information */}
                    <div className="h-full flex flex-col space-y-4 sm:space-y-5 md:space-y-6">
                        {aboutSection}
                        {exploreSection}
                    </div>

                    {/* Left column: 3D Scene - only rendered for non-mobile devices */}
                    {scene3DContainer}
                </div>

                {/* Features section */}
                {featuresSection}
            </div>
        </section>
    );
};

export default memo(TechelonsMain);