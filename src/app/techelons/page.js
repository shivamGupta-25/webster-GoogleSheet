"use client";

import { Suspense, useEffect, useRef, useState, useCallback, memo } from "react";
import dynamic from 'next/dynamic';
import Header from "../_components/Header";
import Footer from "../_components/Footer";
import ScrollToTopButton from "../_components/ScrollToTopButton";
import { ScheduleSkeleton } from "../_components/Skeletons/Techelons";

// Constants
const SCROLL_THRESHOLD = 300;
const SCROLL_THROTTLE_MS = 100;

// Dynamically import components with loading skeletons
const TechelonsHero = dynamic(() =>
    import(/* webpackChunkName: "techelons-hero" */ "../_components/TechelonsComponents/TechelonsMain"), {
    loading: () => <div className="min-h-[500px]"></div>,
    ssr: true
});

const TechelonsSchedule = dynamic(() =>
    import(/* webpackChunkName: "techelons-schedule" */ "../_components/TechelonsComponents/TechelonsSchedule"), {
    loading: () => <ScheduleSkeleton />,
    ssr: false
});

// Optimized custom hook for scroll-to-top functionality
const useScrollToTop = () => {
    const [showTopButton, setShowTopButton] = useState(false);

    const scrollToTop = useCallback(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        let ticking = false;
        let lastScrollTime = 0;

        const handleScroll = () => {
            const now = Date.now();
            if (now - lastScrollTime < SCROLL_THROTTLE_MS) return;

            lastScrollTime = now;

            if (!ticking) {
                window.requestAnimationFrame(() => {
                    setShowTopButton(window.scrollY > SCROLL_THRESHOLD);
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        setShowTopButton(window.scrollY > SCROLL_THRESHOLD);

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return { showTopButton, scrollToTop };
};

// Optimized custom hook for hash navigation
const useHashNavigation = (ref) => {
    useEffect(() => {
        if (typeof window === 'undefined' || !ref.current) return;

        let cachedNavHeight = 0;

        const handleHashNavigation = () => {
            if (window.location.hash === '#events') {
                if (!cachedNavHeight) {
                    cachedNavHeight = document.querySelector('header')?.offsetHeight || 0;
                }

                requestAnimationFrame(() => {
                    const elementPosition = ref.current.getBoundingClientRect().top + window.scrollY;
                    window.scrollTo({
                        top: elementPosition - cachedNavHeight - 20,
                        behavior: 'smooth'
                    });
                });
            }
        };

        handleHashNavigation();
        window.addEventListener('hashchange', handleHashNavigation);

        return () => window.removeEventListener('hashchange', handleHashNavigation);
    }, [ref]);
};

const Techelons = () => {
    const eventsRef = useRef(null);
    const { showTopButton, scrollToTop } = useScrollToTop();

    useHashNavigation(eventsRef);

    return (
        <div className="flex flex-col min-h-screen">
            <Header />

            <main className="flex-grow">
                <Suspense fallback={null}>
                    <section
                        aria-label="Techelons Hero Section"
                        style={{ contentVisibility: 'auto', containIntrinsicSize: '0 500px' }}
                    >
                        <TechelonsHero />
                    </section>
                </Suspense>

                <hr className="h-px bg-gray-200 border-0 w-4/5 mx-auto shadow-sm my-8" />

                <Suspense fallback={<ScheduleSkeleton />}>
                    <section
                        ref={eventsRef}
                        id="events"
                        aria-label="Techelons Event Schedule"
                        style={{ contentVisibility: 'auto', containIntrinsicSize: '0 800px' }}
                    >
                        <TechelonsSchedule />
                    </section>
                </Suspense>

                <ScrollToTopButton visible={showTopButton} onClick={scrollToTop} />
            </main>

            <Footer />
        </div>
    );
};

export default memo(Techelons);