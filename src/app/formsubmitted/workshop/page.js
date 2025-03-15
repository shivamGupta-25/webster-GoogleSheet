"use client"
import Link from "next/link"
import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Instagram, Linkedin, Home, Check, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { fetchSiteContent } from '@/lib/utils';
import confetti from 'canvas-confetti'

// Make this page dynamic to avoid prerendering during build
export const dynamic = 'force-dynamic';

const SuccessIcon = () => (
    <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.2
        }}
        className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4 sm:mb-6"
    >
        <Check className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-green-600" />
    </motion.div>
);

const ErrorIcon = () => (
    <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.2
        }}
        className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4 sm:mb-6"
    >
        <AlertTriangle className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-red-600" />
    </motion.div>
);

const SocialButton = ({ href, icon, color, hoverColor, label }) => (
    <Link href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
        <Button
            variant="outline"
            size="icon"
            className={`h-9 w-9 sm:h-10 sm:w-10 rounded-full hover:bg-${hoverColor}-100 hover:border-${hoverColor}-300 transition-all duration-300`}
        >
            {icon}
        </Button>
    </Link>
);

// Create a client component that uses useSearchParams
const RegistrationContent = () => {
    const [isExiting, setIsExiting] = useState(false)
    const [isValid, setIsValid] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [alreadyRegistered, setAlreadyRegistered] = useState(false)
    const [workshopData, setWorkshopData] = useState(null)
    const router = useRouter()
    const searchParams = useSearchParams()

    // Fetch workshop data
    useEffect(() => {
        const loadContent = async () => {
            try {
                // Only run in browser environment
                if (typeof window !== 'undefined') {
                    const content = await fetchSiteContent();
                    if (content && content.workshop) {
                        setWorkshopData(content.workshop);
                    } else {
                        // If workshop data is not found, try to set it up
                        try {
                            // In the browser, we need to use the API endpoint
                            const setupResponse = await fetch('/api/workshop/setup');
                            if (setupResponse.ok) {
                                const setupData = await setupResponse.json();
                                if (setupData.data) {
                                    setWorkshopData(setupData.data);
                                }
                            }
                        } catch (setupError) {
                            console.error('Error setting up workshop data:', setupError);
                        }
                    }
                }
            } catch (error) {
                console.error('Error loading workshop data:', error);
            } finally {
                setIsLoading(false);
            }
        };
        
        loadContent();
    }, []);

    // Set WhatsApp link after component mounts to avoid hydration mismatch
    useEffect(() => {
        const token = searchParams.get('token')
        const alreadyRegisteredParam = searchParams.get('alreadyRegistered')
        console.log('Token received:', token ? 'Token present' : 'No token');
        console.log('Already registered:', alreadyRegisteredParam);
        
        if (alreadyRegisteredParam === 'true') {
            setAlreadyRegistered(true)
        }
        
        if (!token) {
            setIsLoading(false)
            setIsValid(false)
            return
        }
        
        try {
            // Validate token
            const decodedToken = atob(token)
            console.log('Token decoded successfully');
            
            const emailRegex = /^[a-zA-Z0-9][a-zA-Z0-9._%+-]*@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,}|du\.ac\.in|ipu\.ac\.in|ignou\.ac\.in|jnu\.ac\.in|iitd\.ac\.in|nsut\.ac\.in|dtu\.ac\.in|igdtuw\.ac\.in|aud\.ac\.in|jamiahamdard\.edu|bhu\.ac\.in|bvpindia\.com|mait\.ac\.in|ip\.edu|msit\.in|gbpuat\.ac\.in)$/
            
            // Extract email from token (handle both formats)
            let email = decodedToken;
            
            // If token has the old format (email|timestamp), extract just the email
            if (decodedToken.includes('|')) {
                console.log('Legacy token format: email|timestamp');
                email = decodedToken.split('|')[0];
            }
            
            if (emailRegex.test(email)) {
                setIsValid(true)
                // Trigger confetti effect for valid tokens
                setTimeout(() => triggerConfetti(), 500)
            } else {
                console.error('Invalid email in token:', email);
                setIsValid(false)
            }
        } catch (error) {
            console.error('Token validation error:', error);
            setIsValid(false)
        } finally {
            setIsLoading(false)
        }
    }, [searchParams]);

    const triggerConfetti = () => {
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        const interval = setInterval(function() {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            
            // since particles fall down, start a bit higher than random
            confetti(Object.assign({}, defaults, { 
                particleCount, 
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } 
            }));
            confetti(Object.assign({}, defaults, { 
                particleCount, 
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } 
            }));
        }, 250);
    }

    const handleExit = () => {
        setIsExiting(true)
        setTimeout(() => {
            router.push('/')
        }, 300)
    }

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
                <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
                <p className="mt-4 text-lg text-gray-600">Verifying your registration...</p>
            </div>
        )
    }

    return (
        <AnimatePresence>
            {!isExiting && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg"
                >
                    {isValid ? (
                        <>
                            <SuccessIcon />
                            
                            <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-2">
                                {alreadyRegistered ? "Already Registered!" : "Registration Successful!"}
                            </h1>
                            
                            <p className="text-center text-gray-600 mb-6">
                                {alreadyRegistered 
                                    ? "You have already registered for this workshop." 
                                    : "Thank you for registering for our workshop."}
                            </p>
                            
                            {workshopData?.whatsappGroupLink && (
                                <div className="mb-6">
                                    <p className="text-center text-gray-700 mb-3">
                                        Join our WhatsApp group for updates:
                                    </p>
                                    <div className="flex justify-center">
                                        <Link 
                                            href={workshopData.whatsappGroupLink} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                        >
                                            <Button className="bg-green-500 hover:bg-green-600">
                                                Join WhatsApp Group
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            )}
                            
                            {workshopData?.socialMedia && (
                                <div className="mb-6">
                                    <p className="text-center text-gray-700 mb-3">
                                        Follow us on social media:
                                    </p>
                                    <div className="flex justify-center space-x-3">
                                        {workshopData.socialMedia.instagram && (
                                            <SocialButton 
                                                href={workshopData.socialMedia.instagram}
                                                icon={<Instagram className="h-5 w-5 text-pink-500" />}
                                                color="pink"
                                                hoverColor="pink"
                                                label="Instagram"
                                            />
                                        )}
                                        {workshopData.socialMedia.linkedin && (
                                            <SocialButton 
                                                href={workshopData.socialMedia.linkedin}
                                                icon={<Linkedin className="h-5 w-5 text-blue-500" />}
                                                color="blue"
                                                hoverColor="blue"
                                                label="LinkedIn"
                                            />
                                        )}
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            <ErrorIcon />
                            
                            <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-2">
                                Invalid Registration
                            </h1>
                            
                            <p className="text-center text-gray-600 mb-6">
                                We couldn't verify your registration. Please try registering again.
                            </p>
                        </>
                    )}
                    
                    <div className="flex justify-center">
                        <Button 
                            onClick={handleExit}
                            variant="outline" 
                            className="flex items-center space-x-2"
                        >
                            <Home className="h-4 w-4" />
                            <span>Return to Home</span>
                        </Button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

const LoadingFallback = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
        <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
        <p className="mt-4 text-lg text-gray-600">Loading...</p>
    </div>
);

export default function RegistrationSuccessPage() {
    return (
        <main className="min-h-screen bg-gray-100 py-12 px-4">
            <Suspense fallback={<LoadingFallback />}>
                <RegistrationContent />
            </Suspense>
        </main>
    );
}
