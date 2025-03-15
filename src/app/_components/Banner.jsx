'use client';

import React, { useEffect, memo, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { motion, useAnimation } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useInView } from 'react-intersection-observer';
import { fetchSiteContent } from '@/lib/utils';

// Memoize animation configurations to prevent recreating on each render
const animations = {
  container: {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1.2, ease: [0.33, 1, 0.68, 1] }
    }
  },
  content: {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 1, ease: [0.33, 1, 0.68, 1] }
    }
  }
};

const Banner = () => {
  const router = useRouter();
  const controls = useAnimation();
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2
  });

  const [bannerContent, setBannerContent] = useState({
    title: "",
    subtitle: "",
    institution: "",
    description: "",
    buttonText: "",
    buttonLink: "",
    logoImage: ""
  });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch banner content
  useEffect(() => {
    const loadContent = async () => {
      try {
        const content = await fetchSiteContent();
        if (content && content.banner) {
          setBannerContent(content.banner);
        }
      } catch (error) {
        console.error('Error loading banner content:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadContent();
  }, []);

  // Start animation when component comes into view
  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  // Memoize the router navigation function to prevent recreating on each render
  const handleButtonClick = useMemo(() => () => {
    router.push(bannerContent.buttonLink);
  }, [router, bannerContent.buttonLink]);

  if (isLoading) {
    return (
      <section className="container px-8 mx-auto my-4 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center text-center">
          <div className="flex flex-col items-center justify-center text-center w-full md:pl-10">
            <div className="h-24 w-3/4 bg-gray-200 animate-pulse rounded-lg mb-4"></div>
            <div className="h-6 w-1/2 bg-gray-200 animate-pulse rounded-lg mb-2"></div>
            <div className="h-8 w-2/3 bg-gray-200 animate-pulse rounded-lg mb-4"></div>
            <div className="h-24 w-full bg-gray-200 animate-pulse rounded-lg mb-6"></div>
            <div className="h-12 w-40 bg-gray-200 animate-pulse rounded-[30px]"></div>
          </div>
          <div className="flex items-center justify-center">
            <div className="h-[350px] w-[350px] bg-gray-200 animate-pulse rounded-full"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} className="container px-8 mx-auto my-4 mb-12">
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center text-center"
        initial="hidden"
        animate={controls}
        variants={animations.container}
      >
        <motion.div
          className="flex flex-col items-center justify-center text-center w-full md:pl-10"
          variants={animations.content}
        >
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold">{bannerContent.title}</h1>
          <h2 className="text-sm md:text-xl font-normal">
            {bannerContent.subtitle}
          </h2>
          <h3 className="text-xl md:text-2xl">{bannerContent.institution}</h3>
          <p className="py-6 text-base md:text-lg max-w-2xl">
            {bannerContent.description}
          </p>
          <Button
            onClick={handleButtonClick}
            className="p-6 rounded-[30px] shadow-lg hover:scale-105 transition-all text-lg font-bold tracking-wide mt-4"
          >
            {bannerContent.buttonText}
          </Button>
        </motion.div>

        <div className="flex items-center justify-center">
          <Image
            alt="Websters Logo"
            src={bannerContent.logoImage}
            width={350}
            height={350}
            priority
            className="drop-shadow-[0px_8px_10px_rgba(0,0,0,0.9)]"
            loading="eager"
            sizes="(max-width: 768px) 280px, 350px"
          />
        </div>
      </motion.div>
    </section>
  );
};

export default memo(Banner);