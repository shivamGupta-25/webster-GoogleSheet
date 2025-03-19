'use client';

import { useState, useEffect, useCallback, memo, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { useRouter, usePathname } from "next/navigation";
import { fetchTechelonsData, fetchSiteContent } from "@/lib/utils";

// Animation configurations
const animations = {
    fadeIn: {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { duration: 0.4, ease: "easeOut" }
        }
    },
    buttonHover: {
        initial: { scale: 1 },
        hover: { scale: 1.03, transition: { duration: 0.3 } },
        tap: { scale: 0.98, transition: { duration: 0.2 } }
    },
    stagger: {
        visible: { transition: { staggerChildren: 0.06 } }
    }
};

// Navigation data
const NAV_LINKS = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/#about' },
    { name: 'Workshop', href: '/#workshop' },
    { name: 'Past Event', href: '/#pastevent' },
    { name: 'Council', href: '/#council' },
    { name: 'Techelons - 25', href: '/techelons' },
];

// Constants for performance optimization
const NAVIGATION_THROTTLE = 50;
const SCROLL_CHECK_INTERVAL = 50;
const SCROLL_MAX_ATTEMPTS = 3;

// CSS classes using Tailwind composition
const STYLES = {
    desktopLink: "text-sm lg:text-base font-semibold text-gray-900 hover:text-gray-600 hover:underline transition-all duration-300",
    mobileLink: "block text-lg font-semibold text-gray-900 hover:text-gray-600 hover:underline transition-all duration-300",
    registerButton: "bg-gray-900 text-white py-2 px-4 text-sm lg:text-base font-bold rounded-full shadow-md hover:bg-gray-800 transition-all duration-300",
    mobileRegisterButton: "w-full bg-gray-900 text-white font-bold py-3 rounded-full shadow-md",
    menuButton: "md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
};

// Module-scoped variables for throttling
let lastNavigationTime = 0;
let pendingScrollTarget = null;

// Extract section ID from href
const getSectionIdFromHref = (href) => {
    return href.startsWith('/#') ? href.substring(2) : null;
};

// Memoized Logo component
const Logo = memo(({ className }) => (
    <Image
        alt="logo"
        src="/assets/Header_logo.png"
        width={250}
        height={65}
        className={className}
        priority
    />
));
Logo.displayName = 'Logo';

// Optimized NavLink component
const NavLink = memo(({ href, name, onClick, className, isCurrent }) => (
    <a
        href={href}
        className={className}
        onClick={(e) => {
            e.preventDefault();
            // Remove delay for immediate response
            onClick(href);
        }}
        aria-current={isCurrent ? 'page' : undefined}
    >
        {name}
    </a>
));
NavLink.displayName = 'NavLink';

// Loading fallback for the header
const HeaderFallback = () => (
    <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
                <div className="w-[250px] h-[65px] bg-gray-200 animate-pulse rounded"></div>
                <div className="hidden md:flex space-x-8">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="h-4 w-20 bg-gray-200 animate-pulse rounded"></div>
                    ))}
                </div>
                <div className="h-10 w-28 bg-gray-200 animate-pulse rounded-full"></div>
            </div>
        </div>
    </div>
);

// Main component that uses usePathname
const HeaderContent = ({ children }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [techelonsRegistrationEnabled, setTechelonsRegistrationEnabled] = useState(false);
    const [workshopRegistrationOpen, setWorkshopRegistrationOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const isHomePage = pathname === '/';

    // Fetch Techelons and Workshop registration status on component mount
    useEffect(() => {
        const getRegistrationStatus = async () => {
            try {
                // Fetch Techelons data
                const techelonsData = await fetchTechelonsData();
                console.log("DEBUG - Techelons Data:", techelonsData);
                
                if (techelonsData && techelonsData.festInfo) {
                    console.log("DEBUG - Techelons festInfo:", techelonsData.festInfo);
                    console.log("DEBUG - Registration enabled:", techelonsData.festInfo.registrationEnabled);
                    setTechelonsRegistrationEnabled(techelonsData.festInfo.registrationEnabled);
                } else {
                    console.log("DEBUG - No festInfo in techelonsData or techelonsData is null");
                }
                
                // Fetch Site content for workshop data
                const siteContent = await fetchSiteContent();
                console.log("DEBUG - Site Content:", siteContent);
                
                if (siteContent && siteContent.workshop) {
                    console.log("DEBUG - Workshop data:", siteContent.workshop);
                    console.log("DEBUG - Workshop registration open:", siteContent.workshop.isRegistrationOpen);
                    setWorkshopRegistrationOpen(siteContent.workshop.isRegistrationOpen);
                } else {
                    console.log("DEBUG - No workshop in siteContent or siteContent is null");
                }
            } catch (error) {
                console.error("Error fetching registration status:", error);
                setTechelonsRegistrationEnabled(false);
                setWorkshopRegistrationOpen(false);
            }
        };
        
        getRegistrationStatus();
    }, []);

    // Periodically refresh registration status
    useEffect(() => {
        // Don't refresh on admin pages to avoid conflicts with admin operations
        if (pathname.startsWith('/admin')) {
            return;
        }
        
        const refreshInterval = setInterval(async () => {
            try {
                // Fetch Techelons data
                const techelonsData = await fetchTechelonsData();
                if (techelonsData && techelonsData.festInfo) {
                    setTechelonsRegistrationEnabled(techelonsData.festInfo.registrationEnabled);
                }
                
                // Fetch Site content for workshop data
                const siteContent = await fetchSiteContent();
                if (siteContent && siteContent.workshop) {
                    setWorkshopRegistrationOpen(siteContent.workshop.isRegistrationOpen);
                }
            } catch (error) {
                console.error("Error refreshing registration status:", error);
            }
        }, 60000); // Refresh every minute
        
        return () => clearInterval(refreshInterval);
    }, [pathname]);

    // Scroll to section with element checking - optimized for performance
    const scrollToSection = useCallback((sectionId) => {
        if (!sectionId) return false;

        const element = document.getElementById(sectionId);
        if (element) {
            // For non-sticky header, add a small offset for better visual positioning
            const offset = 20; // Small visual offset to position section better
            const y = element.getBoundingClientRect().top + window.scrollY - offset;
            
            // Use requestAnimationFrame for smoother scrolling
            requestAnimationFrame(() => {
                window.scrollTo({
                    top: y,
                    behavior: 'smooth'
                });
            });
            return true;
        }

        return false;
    }, []);

    // Enhanced navigation handler with optimized throttling
    const handleNavigation = useCallback((href) => {
        // Throttle navigations
        const now = Date.now();
        if (now - lastNavigationTime < NAVIGATION_THROTTLE) return;
        lastNavigationTime = now;

        // Close mobile menu first to prevent UI issues
        setMobileMenuOpen(false);

        // Handle hash navigation
        if (href.startsWith('/#')) {
            const sectionId = getSectionIdFromHref(href);

            if (!isHomePage) {
                // Save target and navigate to home
                pendingScrollTarget = sectionId;
                sessionStorage.setItem('scrollTarget', sectionId);
                router.push('/');
            } else {
                // Already on home page, scroll directly
                requestAnimationFrame(() => {
                    scrollToSection(sectionId);
                });
            }
        } else {
            // Standard navigation
            router.push(href);
        }
    }, [router, isHomePage, scrollToSection]);

    // Navigation to registration page
    const handleExit = useCallback(() => {
        // Check if techelons registration is open
        const isTechelonsOpen = techelonsRegistrationEnabled === true;
        // Check if workshop registration is open
        const isWorkshopOpen = workshopRegistrationOpen === true;
        
        // Add more detailed logging
        console.log("DEBUG - Registration Status:");
        console.log("techelonsRegistrationEnabled:", techelonsRegistrationEnabled);
        console.log("techelonsRegistrationEnabled type:", typeof techelonsRegistrationEnabled);
        console.log("workshopRegistrationOpen:", workshopRegistrationOpen);
        console.log("workshopRegistrationOpen type:", typeof workshopRegistrationOpen);
        console.log("isTechelonsOpen (after conversion):", isTechelonsOpen);
        console.log("isWorkshopOpen (after conversion):", isWorkshopOpen);
        console.log("Both registrations open?", isTechelonsOpen && isWorkshopOpen);

        if (isTechelonsOpen && isWorkshopOpen) {
            // Both registrations are open, show a dialog or redirect to a page that lets the user choose
            console.log("DEBUG - Redirecting to register-options");
            router.push("/register-options");
        } else if (isTechelonsOpen) {
            // Only techelons registration is open
            console.log("DEBUG - Redirecting to techelonsregistration");
            router.push("/techelonsregistration");
        } else if (isWorkshopOpen) {
            // Only workshop registration is open
            console.log("DEBUG - Redirecting to workshopregistration");
            router.push("/workshopregistration");
        } else {
            // No registrations are open
            console.log("DEBUG - Redirecting to registrationclosed");
            router.push("/registrationclosed");
        }
    }, [router, techelonsRegistrationEnabled, workshopRegistrationOpen]);

    // Handle section scrolling on page load - optimized
    useEffect(() => {
        if (!isHomePage) return;

        const targetFromRef = pendingScrollTarget;
        const targetFromStorage = sessionStorage.getItem('scrollTarget');
        const targetId = targetFromRef || targetFromStorage;

        if (!targetId) return;

        // Clean up references
        pendingScrollTarget = null;
        sessionStorage.removeItem('scrollTarget');

        // Improved polling mechanism with better performance
        let attempts = 0;

        const attemptScroll = () => {
            attempts++;
            if (scrollToSection(targetId) || attempts >= SCROLL_MAX_ATTEMPTS) {
                return;
            }

            // Use setTimeout to wait for elements to fully load
            setTimeout(attemptScroll, SCROLL_CHECK_INTERVAL);
        };

        // Delay initial scroll attempt to ensure all elements are loaded
        setTimeout(attemptScroll, 100);

    }, [isHomePage, scrollToSection]);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (mobileMenuOpen) {
            const scrollY = window.scrollY;
            const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
            
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = '100%';
            document.body.style.paddingRight = `${scrollbarWidth}px`;

            return () => {
                document.body.style.position = '';
                document.body.style.top = '';
                document.body.style.width = '';
                document.body.style.paddingRight = '';
                window.scrollTo(0, scrollY);
            };
        }
    }, [mobileMenuOpen]);

    // Handle escape key for mobile menu
    useEffect(() => {
        const handleEscKey = (e) => {
            if (e.key === 'Escape' && mobileMenuOpen) {
                setMobileMenuOpen(false);
            }
        };

        window.addEventListener('keydown', handleEscKey);
        return () => window.removeEventListener('keydown', handleEscKey);
    }, [mobileMenuOpen]);

    return (
        <>
            <header className="bg-white w-full">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-5">
                    <nav className="flex items-center justify-between" aria-label="Main navigation">
                        {/* Logo */}
                        <a
                            href="/"
                            onClick={(e) => {
                                e.preventDefault();
                                handleNavigation('/');
                            }}
                            className="flex-shrink-0 z-10"
                            aria-label="Home"
                        >
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.4 }}
                                className="hidden md:block"
                            >
                                <Logo className="h-8 sm:h-6 lg:h-8 w-auto" />
                            </motion.div>
                            <div className="md:hidden">
                                <Logo className="h-8 sm:h-6 lg:h-8 w-auto" />
                            </div>
                        </a>

                        {/* Desktop Navigation Links */}
                        <motion.div
                            variants={animations.stagger}
                            initial="hidden"
                            animate="visible"
                            className="hidden md:flex md:items-center md:gap-4 lg:gap-6 xl:gap-8"
                        >
                            {NAV_LINKS.map((link) => (
                                <motion.div
                                    key={link.name}
                                    variants={animations.fadeIn}
                                >
                                    <NavLink
                                        href={link.href}
                                        name={link.name}
                                        onClick={handleNavigation}
                                        className={STYLES.desktopLink}
                                        isCurrent={pathname === link.href || (link.href.includes('#') && pathname === '/')}
                                    />
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Desktop Register Button */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.4 }}
                            className="hidden md:block"
                        >
                            <motion.button
                                variants={animations.buttonHover}
                                initial="initial"
                                whileHover="hover"
                                whileTap="tap"
                                className={STYLES.registerButton}
                                onClick={handleExit}
                            >
                                Register Now
                            </motion.button>
                        </motion.div>

                        {/* Mobile Menu Button */}
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(true)}
                            onTouchEnd={(e) => {
                                e.preventDefault();
                                setMobileMenuOpen(true);
                            }}
                            className={STYLES.menuButton}
                            aria-label="Open menu"
                            aria-expanded={mobileMenuOpen}
                            aria-controls="mobile-menu"
                        >
                            <Bars3Icon className="h-6 w-6" />
                        </button>
                    </nav>
                </div>
            </header>

            {/* Mobile Menu Dialog - Improved Animation */}
            <AnimatePresence mode="sync">
                {mobileMenuOpen && (
                    <Dialog
                        as={motion.div}
                        static
                        open={mobileMenuOpen}
                        onClose={() => setMobileMenuOpen(false)}
                        className="fixed inset-0 z-50 isolate"
                        id="mobile-menu"
                    >
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.5 }}
                            exit={{ opacity: 0 }}
                            transition={{
                                duration: 0.2,
                                ease: "linear"
                            }}
                            className="fixed inset-0 bg-gray-900"
                            onClick={() => setMobileMenuOpen(false)}
                            aria-hidden="true"
                        />

                        {/* Mobile menu - Smoother animation */}
                        <div className="fixed inset-y-0 right-0 max-w-full flex pointer-events-none">
                            <motion.div
                                initial={{ x: '100%' }}
                                animate={{ x: 0 }}
                                exit={{ x: '100%' }}
                                transition={{
                                    duration: 0.2,
                                    ease: "easeOut"
                                }}
                                className="w-64 sm:w-72 bg-white px-6 py-6 shadow-lg overflow-y-auto pointer-events-auto will-change-transform"
                            >
                                <div className="flex items-center justify-between">
                                    <a
                                        href="/"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleNavigation('/');
                                        }}
                                        className="flex-shrink-0"
                                        aria-label="Home"
                                    >
                                        <Logo className="h-9 w-auto" />
                                    </a>
                                    <button
                                        type="button"
                                        onClick={() => setMobileMenuOpen(false)}
                                        onTouchEnd={(e) => {
                                            e.preventDefault();
                                            setMobileMenuOpen(false);
                                        }}
                                        className="p-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                                        aria-label="Close menu"
                                    >
                                        <XMarkIcon className="h-6 w-6" />
                                    </button>
                                </div>

                                <nav className="mt-6 space-y-4">
                                    {NAV_LINKS.map((link, index) => (
                                        <div key={link.name} className="transform-gpu">
                                            <NavLink
                                                href={link.href}
                                                name={link.name}
                                                onClick={handleNavigation}
                                                className={STYLES.mobileLink}
                                                isCurrent={pathname === link.href || (link.href.includes('#') && pathname === '/')}
                                            />
                                        </div>
                                    ))}
                                    <hr className="border-gray-300 my-4" />
                                    <div className="transform-gpu">
                                        <button
                                            className={STYLES.mobileRegisterButton}
                                            onClick={handleExit}
                                        >
                                            Register Now
                                        </button>
                                    </div>
                                </nav>
                            </motion.div>
                        </div>
                    </Dialog>
                )}
            </AnimatePresence>

            <main>{children}</main>
        </>
    );
};

// Wrapper component with Suspense boundary
const Header = memo(({ children }) => {
    return (
        <Suspense fallback={<HeaderFallback />}>
            <HeaderContent children={children} />
        </Suspense>
    );
});

Header.displayName = 'Header';

export default Header;