"use client";

import { useCallback, useState, useEffect, memo, useRef } from "react";
import dynamic from 'next/dynamic';
import Header from "./_components/Header";
import Footer from "./_components/Footer";

// Import Swiper styles globally
import 'swiper/css';
import 'swiper/css/effect-cards';

const Banner = dynamic(() => import("./_components/Banner"), {
  ssr: true,
  loading: () => <div className="h-[400px] animate-pulse bg-gray-100 rounded-lg" aria-label="Loading banner" />
});
const About = dynamic(() => import("./_components/About"), { ssr: true });
const Workshop = dynamic(() => import("./_components/Workshop"), { ssr: true });
const PastEvent = dynamic(() => import("./_components/PastEvent"), {
  ssr: true,
  loading: () => <div className="h-[400px] animate-pulse bg-gray-100 rounded-lg" aria-label="Loading past events" />
});
const Council = dynamic(() => import("./_components/Council"), { ssr: true });
const ScrollToTopButton = dynamic(() => import("./_components/ScrollToTopButton"), { ssr: false });

const ScrollIndicator = memo(({ visible }) => (
  <div
    className={`fixed bottom-8 w-full flex justify-center z-50 transition-opacity duration-500 ${visible ? 'opacity-80 hover:opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    aria-hidden={!visible}
  >
    <div className="flex flex-col items-center animate-bounce">
      <span className="text-sm text-gray-600 mb-1 text-center px-4">Scroll to explore</span>
      <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    </div>
  </div>
));

ScrollIndicator.displayName = 'ScrollIndicator';

const useScrollState = () => {
  const [scroll, setScroll] = useState({
    showIndicator: true,
    showTopButton: false
  });

  const scrollRef = useRef(scroll);
  scrollRef.current = scroll;

  const rafIdRef = useRef(null);
  const tickingRef = useRef(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      lastScrollY = window.scrollY;

      if (!tickingRef.current) {
        rafIdRef.current = window.requestAnimationFrame(() => {
          const shouldShowIndicator = lastScrollY < 100;
          const shouldShowTopButton = lastScrollY > 300;

          if (scrollRef.current.showIndicator !== shouldShowIndicator ||
            scrollRef.current.showTopButton !== shouldShowTopButton) {
            setScroll({
              showIndicator: shouldShowIndicator,
              showTopButton: shouldShowTopButton
            });
          }

          tickingRef.current = false;
        });
        tickingRef.current = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafIdRef.current) {
        window.cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, []);

  return scroll;
};

const MainContent = memo(({ scroll, scrollToTop }) => (
  <>
    <Header />
    <main>
      <Banner />
      <About />
      <Workshop />
      <PastEvent />
      <Council />
      <ScrollIndicator visible={scroll.showIndicator} />
      <ScrollToTopButton visible={scroll.showTopButton} onClick={scrollToTop} />
    </main>
    <Footer />
  </>
));

MainContent.displayName = 'MainContent';

export default function Home() {
  const scroll = useScrollState();

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return <MainContent scroll={scroll} scrollToTop={scrollToTop} />;
}