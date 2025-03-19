// NOTE: This file was automatically updated to use fetchSiteContent instead of importing siteContent directly.
// Please review and update the component to use the async fetchSiteContent function.
"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import dynamic from 'next/dynamic';
import Image from "next/image";
import { motion } from "framer-motion";
import { cn, fetchSiteContent } from "@/lib/utils";
import { PastEventSkeleton } from "./Skeletons/PastEvent";

// Dynamically import the EventSwiper component with increased loading delay
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

// Optimized image component with loading state and better lazy loading
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
        loading={priority ? "eager" : "lazy"}
        quality={75}
      />
    </div>
  );
});

EventImage.displayName = 'EventImage';

// Animation variants - moved outside component to prevent recreation
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

// Main PastEvent component
const PastEvent = () => {
  const isMobile = useWindowSize();
  const [pastEventsData, setPastEventsData] = useState({
    title: "",
    description: "",
    events: []
  });
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch past events data with improved caching
  useEffect(() => {
    let isMounted = true;
    
    const loadContent = async () => {
      try {
        // Add a small delay to prioritize more critical components
        const content = await fetchSiteContent();
        
        if (isMounted && content && content.pastEvents) {
          setPastEventsData(content.pastEvents);
        }
      } catch (error) {
        console.error('Error loading past events data:', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    // Delay loading of past events to prioritize more critical content
    const timeoutId = setTimeout(loadContent, 100);
    
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, []);
  
  // Destructure past events data
  const { title, description, events } = pastEventsData;
  
  // Use events from fetched data
  const slides = useMemo(() => events || [], [events]);

  if (isLoading) {
    return <PastEventSkeleton />;
  }

  return (
    <motion.section 
      id="pastevent"
      className="relative pt-8 mb-22 overflow-hidden"
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
          <h2 className="text-6xl font-bold tracking-tighter sm:text-8xl">{title}</h2>
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

export default React.memo(PastEvent);