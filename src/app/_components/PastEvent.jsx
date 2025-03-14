"use client";

import React, { useState, useEffect, useCallback, useMemo, Suspense } from "react";
import dynamic from 'next/dynamic';
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { PastEventSkeleton } from "./Skeletons/PastEvent";
import siteContent from '@/app/_data/siteContent';

// Dynamically import the EventSwiper component
const EventSwiper = dynamic(() => import('./Skeletons/PastEvent/EventSwiper').then(mod => ({ default: mod.EventSwiper })), {
  ssr: false,
  loading: () => <div className="w-full max-w-md mx-auto aspect-[16/9] rounded-xl bg-gray-200 animate-pulse" />
});

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

// Optimized image component with loading state
const EventImage = React.memo(({ src, alt, priority = false }) => {
  const [isLoading, setIsLoading] = useState(true);
  
  return (
    <div className="relative w-full aspect-[16/9]">
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-xl" />
      )}
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 640px) 280px, (max-width: 768px) 384px, 512px"
        className={cn(
          "object-cover transition-opacity duration-300 rounded-xl",
          isLoading ? "opacity-0" : "opacity-100"
        )}
        onLoad={() => setIsLoading(false)}
        priority={priority}
      />
    </div>
  );
});

EventImage.displayName = 'EventImage';

// Main PastEvent component
const PastEvent = () => {
  const isMobile = useWindowSize();
  
  // Get past events content from centralized data
  const { title, description, events } = useMemo(() => siteContent.pastEvents, []);
  
  // Use events from centralized data
  const slides = useMemo(() => events || [], [events]);

  // Animation variants for the section
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.section 
      id="past-events"
      className="relative py-16 md:py-24 overflow-hidden"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={sectionVariants}
    >
      <div className="container px-4 md:px-6 mx-auto">
        <motion.div 
          className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
          variants={itemVariants}
        >
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">{title}</h2>
          <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
            {description}
          </p>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          {slides && slides.length > 0 ? (
            <EventSwiper 
              slides={slides} 
              isMobile={isMobile} 
              EventImage={EventImage} 
            />
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">No past events to display</p>
            </div>
          )}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default PastEvent;