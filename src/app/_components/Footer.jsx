"use client";
import { useEffect, useState, memo, useCallback } from "react";
import Image from "next/image";
import { FaInstagram, FaLinkedinIn, FaTwitter, FaFacebookF, FaYoutube } from "react-icons/fa";
import { motion } from "framer-motion";
import { fetchSiteContent } from "@/lib/utils";

// Animation configurations
const animations = {
    fadeInUp: {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    },
    container: {
        hidden: {},
        visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
    }
};

// Icon mapping
const iconComponents = {
    FaInstagram: FaInstagram,
    FaLinkedinIn: FaLinkedinIn,
    FaTwitter: FaTwitter,
    FaFacebookF: FaFacebookF,
    FaYoutube: FaYoutube
};

// Default social links as fallback
const defaultSocialLinks = [
    {
        id: 'instagram',
        url: 'https://www.instagram.com/websters.shivaji/',
        icon: 'FaInstagram',
        hoverClass: 'hover:text-pink-500'
    },
    {
        id: 'linkedin',
        url: 'https://www.linkedin.com/company/websters-shivaji-college/',
        icon: 'FaLinkedinIn',
        hoverClass: 'hover:text-blue-500'
    }
];

// Social link component
const SocialLink = memo(({ url, icon, hoverClass }) => {
    const IconComponent = iconComponents[icon] || FaInstagram;
    
    return (
        <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className={`${hoverClass} transition transform hover:scale-110 duration-300`}
        >
            <IconComponent />
        </a>
    );
});

SocialLink.displayName = 'SocialLink';

const Footer = () => {
    const [footerData, setFooterData] = useState({
        email: "websters@shivaji.du.ac.in",
        socialLinks: defaultSocialLinks,
        logoImage: "/assets/Footer_logo.png"
    });
    const [developerInfo, setDeveloperInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Optimized data fetching with useCallback
    const fetchDeveloperInfo = useCallback(async () => {
        try {
            const controller = new AbortController();
            const signal = controller.signal;
            
            const response = await fetch("https://credit-api.vercel.app/api/credits", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                signal
            });
            
            if (!response.ok) throw new Error("Failed to fetch developer info");
            const data = await response.json();
            setDeveloperInfo(data);
            
            return controller;
        } catch (error) {
            if (error.name !== 'AbortError') {
                setError(error.message);
            }
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch footer data
    useEffect(() => {
        const fetchFooterData = async () => {
            try {
                const siteContent = await fetchSiteContent();
                
                if (siteContent && siteContent.footer) {
                    setFooterData({
                        email: siteContent.footer.email || footerData.email,
                        socialLinks: siteContent.footer.socialLinks && siteContent.footer.socialLinks.length > 0 
                            ? siteContent.footer.socialLinks 
                            : footerData.socialLinks,
                        logoImage: siteContent.footer.logoImage || footerData.logoImage
                    });
                }
            } catch (error) {
                console.error("Error fetching footer data:", error);
            }
        };
        
        fetchFooterData();
    }, []);

    // Fetch developer info
    useEffect(() => {
        const controller = fetchDeveloperInfo();
        
        // Clean up function to abort fetch on unmount
        return () => {
            if (controller && controller.abort) {
                controller.abort();
            }
        };
    }, [fetchDeveloperInfo]);

    const currentYear = new Date().getFullYear();

    return (
        <motion.footer
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={animations.container}
            className="bg-gradient-to-b from-gray-900 to-black text-gray-300 py-10"
        >
            <div className="container mx-auto px-6 lg:px-20 flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
                <motion.div variants={animations.fadeInUp} className="flex-shrink-0 flex justify-center md:justify-start">
                    <a href="/" className="flex items-center gap-2">
                        <Image
                            alt="logo"
                            src={footerData.logoImage}
                            className="h-10 w-auto brightness-110 hover:brightness-125 transition"
                            width={250}
                            height={65}
                            loading="lazy"
                        />
                    </a>
                </motion.div>

                <motion.div variants={animations.fadeInUp} className="text-lg text-white font-bold flex flex-col md:flex-row items-center gap-1">
                    <span>Contact:</span>
                    <a href={`mailto:${footerData.email}`} className="hover:underline transition text-blue-400">{footerData.email}</a>
                </motion.div>

                <motion.div variants={animations.fadeInUp} className="flex space-x-6 text-2xl justify-center md:justify-start">
                    {footerData.socialLinks.map(link => (
                        <SocialLink 
                            key={link.id}
                            url={link.url}
                            icon={link.icon}
                            hoverClass={link.hoverClass}
                        />
                    ))}
                </motion.div>
            </div>

            <motion.div variants={animations.fadeInUp} className="text-center text-sm mt-8 border-t border-gray-700 pt-4 text-gray-500">
                <p className="text-lg">&copy; {currentYear} Websters. All rights reserved.</p>
                {loading ? (
                    <p className="mt-4 text-gray-400 text-lg">Loading developer info...</p>
                ) : error ? (
                    <p className="mt-4 text-red-400 text-lg">{error}</p>
                ) : (
                    developerInfo && (
                        <p className="mt-4 text-gray-400 text-lg">
                            Designed & Developed by: <a href={developerInfo.linkedin} className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">{developerInfo.credit}</a>
                        </p>
                    )
                )}
            </motion.div>
        </motion.footer>
    );
};

export default memo(Footer);