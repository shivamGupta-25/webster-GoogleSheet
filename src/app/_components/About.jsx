"use client";
import React, { memo, useMemo } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import siteContent from '@/app/_data/siteContent';

// Memoize animation configurations
const animations = {
    container: {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] } }
    },
    title: {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }
        }
    },
    content: {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.9, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] } }
    }
};

// Memoized paragraph component for better performance
const Paragraph = memo(({ html, className }) => (
    <p className={className} dangerouslySetInnerHTML={{ __html: html }} />
));

Paragraph.displayName = 'Paragraph';

const About = () => {
    const { ref, inView } = useInView({
        threshold: 0.2,
        triggerOnce: true
    });

    // Get about content from centralized data
    const { title, paragraphs } = useMemo(() => siteContent.about, []);

    return (
        <section
            id="about"
            className="flex items-center justify-center px-6 mb-12 md:px-12 lg:px-20 xl:px-32"
            ref={ref}
        >
            <motion.div
                className="text-center mt-10 md:mt-16"
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                variants={animations.container}
            >
                <motion.h1
                    className="text-6xl sm:text-8xl lg:text-9xl font-extrabold text-gray-900 dark:text-white mb-8"
                    variants={animations.title}
                >
                    {title}
                </motion.h1>
                <motion.div
                    className="mt-6 md:mt-8 text-gray-600 text-base md:text-lg lg:text-xl max-w-4xl mx-auto"
                    variants={animations.content}
                >
                    {paragraphs.map((paragraph) => (
                        <Paragraph
                            key={paragraph.id}
                            html={paragraph.content}
                            className={paragraph.id === 1 ? "" : "mt-4"}
                        />
                    ))}
                </motion.div>
            </motion.div>
        </section>
    );
};

export default memo(About);