"use client";

import React, { useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-cards";

/**
 * EventSwiper component - Displays past events in a card swiper
 */
export const EventSwiper = React.memo(({ slides, isMobile, EventImage }) => {
  // Memoize Swiper configuration to prevent recreation on each render
  const swiperConfig = useMemo(() => ({
    effect: "cards",
    grabCursor: true,
    modules: [EffectCards, Autoplay],
    className: "aspect-[16/9] rounded-xl",
    loop: true,
    autoplay: {
      delay: isMobile ? 2500 : 3000,
      disableOnInteraction: false
    },
    speed: 800,
    cardsEffect: {
      slideShadows: false,
      perSlideOffset: 8,
      perSlideRotate: 2,
      rotate: true,
    }
  }), [isMobile]);

  return (
    <>
      <div className="flex justify-center overflow-hidden">
        <div className="w-full max-w-[280px] xs:max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
          <Swiper {...swiperConfig}>
            {slides.map((slide, index) => (
              <SwiperSlide key={slide.title} className="rounded-xl shadow-lg overflow-hidden bg-gray-800">
                <EventImage 
                  src={slide.imageUrl} 
                  alt={slide.title} 
                  priority={index < 1}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      <div className="mt-6 sm:mt-8 text-center">
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 hidden sm:block">
          Swipe to navigate through our past events
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400 sm:hidden">
          Swipe to view more events
        </p>
      </div>
    </>
  );
});

EventSwiper.displayName = 'EventSwiper';