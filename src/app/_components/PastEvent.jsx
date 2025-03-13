"use client";

import React, { useState, useEffect, useCallback, useMemo, Suspense } from "react";
import dynamic from 'next/dynamic';
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { PastEventSkeleton } from "./Skeletons/PastEvent";

// Custom hook for handling resize with debounce
const useWindowSize = () => {
  const [isMobile, setIsMobile] = useState(false);
  
  const handleResize = useCallback(() => {
    setIsMobile(window.innerWidth < 640);
  }, []);
  
  useEffect(() => {
    // Set initial state
    handleResize();
    
    // Add resize event listener with debounce
    let timeoutId;
    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleResize, 150);
    };

    window.addEventListener('resize', debouncedResize);
    
    // Clean up
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', debouncedResize);
    };
  }, [handleResize]);
  
  return isMobile;
};

// Memoized slides data to prevent recreation
const SLIDES = [
  { title: "UI/UX Workshop", imageUrl: "/assets/Events/UI-UX_Workshop.png" },
  { title: "AI Artistry-23", imageUrl: "/assets/Events/AI_Artistry_23.jpg" },
  { title: "AI Artistry-24", imageUrl: "/assets/Events/AI_Artistry_24.jpg" },
  { title: "Dark Coding-23", imageUrl: "/assets/Events/DarkCoding_23.jpg" },
  { title: "Dark Coding-24", imageUrl: "/assets/Events/DarkCoding_24.jpg" },
  { title: "E-Lafda-24", imageUrl: "/assets/Events/E-Lafda_24.jpg" },
  { title: "Git & GitHub Workshop", imageUrl: "/assets/Events/Git_GitHub.jpg" },
  { title: "Googler-23", imageUrl: "/assets/Events/Googler_23.jpg" },
  { title: "Googler-24", imageUrl: "/assets/Events/Googler_24.jpg" },
  { title: "Techelons-23", imageUrl: "/assets/Events/Techelons_23.jpg" },
  { title: "Techelons-24", imageUrl: "/assets/Events/Techelons_24.jpg" },
  { title: "TechnoQuiz-24", imageUrl: "/assets/Events/TechnoQuiz_24.jpg" },
  { title: "Web Hive-23", imageUrl: "/assets/Events/Web_Hive_23.jpg" },
  { title: "Whatzapper-23", imageUrl: "/assets/Events/Whatzapper_23.jpg" }
];

// Dynamically import Swiper components with loading skeleton
const EventSwiper = dynamic(() => 
  import('./Skeletons/PastEvent/EventSwiper').then(mod => mod.EventSwiper), {
  loading: () => <PastEventSkeleton />,
  ssr: false
});

// Optimized heading component
const SectionHeading = React.memo(() => (
  <motion.h1
    className="flex justify-center items-center text-6xl sm:text-8xl lg:text-9xl font-extrabold text-gray-900 dark:text-white mb-8"
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ amount: 0.5, once: true }}
    transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
  >
    Past Event
  </motion.h1>
));

SectionHeading.displayName = 'SectionHeading';

// Optimized image component with loading state
const EventImage = React.memo(({ src, alt, priority }) => {
  const [isLoading, setIsLoading] = useState(true);
  
  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <Skeleton className="absolute inset-0 w-full h-full rounded-xl" />
      )}
      <Image
        src={src}
        alt={alt}
        fill
        className={cn(
          "object-cover transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100"
        )}
        sizes="(max-width: 480px) 280px, (max-width: 640px) 320px, (max-width: 768px) 384px, (max-width: 1024px) 448px, 576px"
        priority={priority}
        loading={priority ? "eager" : "lazy"}
        placeholder="blur"
        blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAwIiBoZWlnaHQ9IjQ3NSIgdmlld0JveD0iMCAwIDcwMCA0NzUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iIzMzMzMzMyIgLz4KPC9zdmc+"
        onLoadingComplete={() => setIsLoading(false)}
      />
      <div className="absolute inset-0 flex items-end">
        <div className="w-full items-center bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 xs:p-4 sm:p-5">
          <h2 className="text-base xs:text-lg sm:text-xl md:text-2xl font-bold text-white line-clamp-2">{alt}</h2>
        </div>
      </div>
    </div>
  );
});

EventImage.displayName = 'EventImage';

const PastEvent = () => {
  const [isMounted, setIsMounted] = useState(false);
  const isMobile = useWindowSize();

  // Client-side only mounting
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Only render content client-side to prevent hydration issues
  if (!isMounted) return null;

  return (
    <section
      id="pastevent"
      className="mb-8 sm:py-16 md:py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden"
      style={{ contentVisibility: 'auto', containIntrinsicSize: '0 500px' }}
    >
      <SectionHeading />

      <Suspense fallback={<PastEventSkeleton />}>
        <EventSwiper 
          slides={SLIDES} 
          isMobile={isMobile} 
          EventImage={EventImage} 
        />
      </Suspense>
    </section>
  );
};

// Use React.memo to prevent unnecessary re-renders
export default React.memo(PastEvent);