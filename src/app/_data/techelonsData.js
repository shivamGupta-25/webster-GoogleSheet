/**
 * Tech Fest Constants and Data
 * This file contains all the constants and data related to the tech fest events.
 */

// Fest Information
const festInfo = {
    "registrationEnabled": true,
    "dates": {
        "day1": "April 10, 2025",
        "day2": "April 11, 2025",
        "registrationDeadline": "April 8, 2025"
    }
};

// Event Categories
const eventCategories = {
    "TECHNICAL": "technical",
    "WORKSHOP": "workshop",
    "GAMING": "gaming",
    "CREATIVE": "creative",
    "SEMINAR": "seminar"
};

// Registration Status
const registrationStatus = {
    "OPEN": "open",
    "CLOSED": "closed",
    "COMING_SOON": "coming-soon"
};

// Fest Days
const festDays = {
    "DAY_1": "day1",
    "DAY_2": "day2"
};

// Constants for event images
const EVENT_IMAGES = {
    "DEFAULT_EVENT_IMAGE": "/placeholder.svg?height=160&width=320",
    "FALLBACK_IMAGE": "/placeholder.svg?height=200&width=600"
};

// Helper function to get image path
const getImagePath = (imagePath) => {
    if (!imagePath) return EVENT_IMAGES.DEFAULT_EVENT_IMAGE;
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) return imagePath;
    if (imagePath.startsWith("/public/")) return imagePath.replace("/public", "");
    return imagePath;
};

// WhatsApp Groups
const whatsappGroups = {
    "default": "https://chat.whatsapp.com/techelons-general-group"
};

// Helper function to get events by day
const getEventsByDay = (day) => {
    return events.filter(event => event.festDay === day);
};

// Helper function to get events by category
const getEventsByCategory = (category) => {
    return events.filter(event => event.category === category);
};

// Helper function to get event by ID
const getEventById = (id) => {
    return events.find(event => event.id === id);
};

// Helper function to get WhatsApp group link
const getWhatsAppGroupLink = (eventId) => {
    return whatsappGroups[eventId] || null;
};

// Helper function to format event date and time
const formatEventDateTime = (dateOrEvent, timeParam) => {
    // Handle case when an event object is passed
    let date, time;

    if (typeof dateOrEvent === 'object' && dateOrEvent !== null) {
        // An event object was passed
        const event = dateOrEvent;
        date = event.date;
        time = event.time;
    } else {
        // Individual date and time parameters were passed
        date = dateOrEvent;
        time = timeParam;
    }

    if (!date) return { formattedDate: "TBA", formattedTime: "TBA", dayOfWeek: "" };

    try {
        const eventDate = new Date(date);

        // Check if the date is valid
        if (isNaN(eventDate.getTime())) {
            return { formattedDate: "TBA", formattedTime: "TBA", dayOfWeek: "" };
        }

        const formattedDate = eventDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const dayOfWeek = eventDate.toLocaleDateString('en-US', { weekday: 'long' });

        return {
            formattedDate,
            formattedTime: time || "TBA",
            dayOfWeek
        };
    } catch (error) {
        console.error("Error formatting date:", error);
        return { formattedDate: "TBA", formattedTime: "TBA", dayOfWeek: "" };
    }
};

// Events Data
const events = [
    {
        "id": "Seminar",
        "image": "/assets/Poster.png",
        "name": "AI and Cyber Security (Seminar)",
        "shortDescription": "Learn about the latest trends in AI and Cyber Security",
        "description": "Join us for an informative seminar on AI and Cyber Security. Industry experts will share insights on the latest trends, challenges, and opportunities in these rapidly evolving fields.",
        "category": "seminar",
        "speaker": "Dr. Amit Kumar, University of Delhi",
        "teamSize": {
            "min": 1,
            "max": 1
        },
        "venue": "Main Auditorium",
        "festDay": "day1",
        "date": "April 10, 2025",
        "time": "10:00 AM",
        "duration": "2 hours",
        "registrationStatus": "open",
        "prizes": [
            {
                "position": "Participation",
                "reward": "Certificate of Participation"
            }
        ],
        "coordinators": [
            {
                "name": "Dr. Amit Kumar",
                "email": "amit.kumar@example.com",
                "phone": "9876543210"
            }
        ],
        "rules": [
            "Registration is mandatory",
            "Arrive 15 minutes before the seminar starts",
            "Q&A session will be held at the end"
        ],
        "instructions": "Please bring your college ID and registration confirmation",
        "resources": "Recommended reading: Latest trends in AI and Cybersecurity, Basic knowledge of computer security concepts",
        "whatsappGroup": "https://chat.whatsapp.com/JKLMNOPQRSTUVWXYZabcdef"
    },
    {
        "id": "debug-code",
        "image": "/assets/Poster.png",
        "name": "Debug the Code",
        "shortDescription": "Test your debugging skills by fixing broken code",
        "description": "Debug the Code is a competitive event where participants are given broken code snippets and must identify and fix the bugs within a time limit. Test your problem-solving skills and coding knowledge!",
        "category": "technical",
        "teamSize": {
            "min": 1,
            "max": 1
        },
        "venue": "Computer Lab 1",
        "festDay": "day1",
        "date": "April 10, 2025",
        "time": "02:00 PM",
        "duration": "2 hours",
        "registrationStatus": "open",
        "prizes": [
            {
                "position": "1st",
                "reward": "₹5,000 + Certificate"
            },
            {
                "position": "2nd",
                "reward": "₹3,000 + Certificate"
            },
            {
                "position": "3rd",
                "reward": "₹1,500 + Certificate"
            }
        ],
        "coordinators": [
            {
                "name": "Rahul Sharma",
                "email": "rahul.sharma@example.com",
                "phone": "9876543211"
            }
        ],
        "rules": [
            "Individual participation only",
            "Time limit: 2 hours",
            "Languages supported: C, C++, Java, Python",
            "Internet access will be restricted during the competition"
        ],
        "instructions": "Bring your own laptop with required development environments installed",
        "resources": "Recommended preparation: Practice debugging in C, C++, Java, and Python. Familiarize yourself with common programming errors and debugging techniques.",
        "whatsappGroup": "https://chat.whatsapp.com/ABCDEFGHIJKLMNOPQRSTUv"
    },
    {
        "id": "ai-artistry",
        "image": "/assets/Poster.png",
        "name": "AI Artistry",
        "shortDescription": "Create stunning artwork using AI tools",
        "description": "AI Artistry is a team event where participants use AI tools to create original artwork based on a given theme. Showcase your creativity and technical skills in this unique blend of art and technology!",
        "category": "creative",
        "teamSize": {
            "min": 2,
            "max": 2
        },
        "venue": "CS Lab 3",
        "festDay": "day2",
        "date": "April 11, 2025",
        "time": "10:00 AM",
        "duration": "2 hours",
        "registrationStatus": "open",
        "prizes": [
            {
                "position": "1st",
                "reward": "₹6,000 + Certificate"
            },
            {
                "position": "2nd",
                "reward": "₹4,000 + Certificate"
            },
            {
                "position": "3rd",
                "reward": "₹2,000 + Certificate"
            }
        ],
        "coordinators": [
            {
                "name": "Priya Singh",
                "email": "priya.singh@example.com",
                "phone": "9876543212"
            }
        ],
        "rules": [
            "Team of exactly 2 members",
            "Theme will be announced on the day of the event",
            "Participants must use at least one AI tool in their creation",
            "Final submission should include the artwork and a brief explanation"
        ],
        "instructions": "Bring your own devices with necessary AI tools installed",
        "resources": "Recommended AI tools: Midjourney, DALL-E, Stable Diffusion",
        "whatsappGroup": "https://chat.whatsapp.com/123456789abcdefghijklm"
    },
    {
        "id": "gaming",
        "image": "/assets/Poster.png",
        "name": "E-Lafda (Tekken)",
        "shortDescription": "Compete in Tekken tournament to prove your gaming skills",
        "description": "E-Lafda is an exciting Tekken tournament where gamers can showcase their fighting skills. Compete against other players in thrilling matches and claim the title of Tekken Champion!",
        "category": "gaming",
        "teamSize": {
            "min": 1,
            "max": 4
        },
        "venue": "Gaming Arena",
        "festDay": "day2",
        "date": "April 11, 2025",
        "time": "02:00 PM",
        "duration": "2 hours",
        "registrationStatus": "open",
        "prizes": [
            {
                "position": "1st",
                "reward": "₹8,000 + Gaming Peripherals + Certificate"
            },
            {
                "position": "2nd",
                "reward": "₹5,000 + Certificate"
            },
            {
                "position": "3rd",
                "reward": "₹3,000 + Certificate"
            }
        ],
        "coordinators": [
            {
                "name": "Vikram Patel",
                "email": "vikram.patel@example.com",
                "phone": "9876543213"
            }
        ],
        "rules": [
            "Individual or team participation (max 4 members)",
            "Tournament will follow a double elimination format",
            "Standard Tekken tournament rules apply",
            "Participants can bring their own controllers"
        ],
        "instructions": "Registration will be on a first-come, first-served basis with limited slots",
        "resources": "Recommended practice: Tekken 7 or Tekken 8, familiarity with game controls and basic combos",
        "whatsappGroup": "https://chat.whatsapp.com/nopqrstuvwxyz1234567890"
    },
    {
        "id": "data-diviation",
        "image": "/assets/Poster.png",
        "name": "Data Diviation",
        "shortDescription": "Analyze complex datasets to derive meaningful insights",
        "description": "Data Diviation challenges participants to analyze complex datasets and derive meaningful insights. Showcase your data analysis skills, statistical knowledge, and visualization techniques in this competitive event.",
        "category": "technical",
        "teamSize": {
            "min": 1,
            "max": 1
        },
        "venue": "Computer Lab 2",
        "festDay": "day1",
        "date": "April 10, 2025",
        "time": "10:00 AM",
        "duration": "2 hours",
        "registrationStatus": "open",
        "prizes": [
            {
                "position": "1st",
                "reward": "₹7,000 + Certificate"
            },
            {
                "position": "2nd",
                "reward": "₹4,000 + Certificate"
            },
            {
                "position": "3rd",
                "reward": "₹2,000 + Certificate"
            }
        ],
        "coordinators": [
            {
                "name": "Dr. Neha Gupta",
                "email": "neha.gupta@example.com",
                "phone": "9876543214"
            }
        ],
        "rules": [
            "Individual participation only",
            "Time limit: 4 hours",
            "Participants can use any data analysis tool or programming language",
            "Final submission should include analysis code, visualizations, and a report"
        ],
        "instructions": "Bring your own laptop with required software installed",
        "resources": "Recommended tools: Python (pandas, matplotlib, scikit-learn), R, Tableau",
        "whatsappGroup": "https://chat.whatsapp.com/abcdefghijklmnopqrstuv"
    },
    {
        "id": "poster-making",
        "image": "/assets/Poster.png",
        "name": "Digital Poster Making",
        "shortDescription": "Design creative digital posters on given themes",
        "description": "Digital Poster Making is a creative competition where participants design digital posters based on given themes. Showcase your graphic design skills, creativity, and visual storytelling abilities!",
        "category": "creative",
        "teamSize": {
            "min": 1,
            "max": 1
        },
        "venue": "Design Lab",
        "festDay": "day2",
        "date": "April 11, 2025",
        "time": "10:00 AM",
        "duration": "2 hours",
        "registrationStatus": "open",
        "prizes": [
            {
                "position": "1st",
                "reward": "₹4,000 + Certificate"
            },
            {
                "position": "2nd",
                "reward": "₹2,500 + Certificate"
            },
            {
                "position": "3rd",
                "reward": "₹1,500 + Certificate"
            }
        ],
        "coordinators": [
            {
                "name": "Ananya Desai",
                "email": "ananya.desai@example.com",
                "phone": "9876543215"
            }
        ],
        "rules": [
            "Individual participation only",
            "Time limit: 3 hours",
            "Theme will be announced on the day of the event",
            "Participants must create original artwork",
            "Final poster should be submitted in digital format (PNG/JPG)"
        ],
        "instructions": "Bring your own laptop with design software installed",
        "resources": "Recommended software: Adobe Photoshop, Illustrator, Canva, GIMP",
        "whatsappGroup": "https://chat.whatsapp.com/wxyz1234567890abcdefghi"
    },
    {
        "id": "reel-comp",
        "image": "/assets/Poster.png",
        "name": "Tech Reel War",
        "shortDescription": "Create engaging tech-themed short video reels",
        "description": "Tech Reel War challenges participants to create engaging and informative short video reels on technology-related topics. Showcase your video editing skills, creativity, and ability to communicate complex tech concepts in an engaging way!",
        "category": "creative",
        "teamSize": {
            "min": 1,
            "max": 1
        },
        "venue": "Virtual",
        "festDay": "day1",
        "date": "April 10, 2025",
        "time": "10:00 AM",
        "duration": "2 hours",
        "registrationStatus": "open",
        "prizes": [
            {
                "position": "1st",
                "reward": "₹5,000 + Certificate"
            },
            {
                "position": "2nd",
                "reward": "₹3,000 + Certificate"
            },
            {
                "position": "3rd",
                "reward": "₹2,000 + Certificate"
            }
        ],
        "coordinators": [
            {
                "name": "Karan Malhotra",
                "email": "karan.malhotra@example.com",
                "phone": "9876543216"
            }
        ],
        "rules": [
            "Individual participation only",
            "Reel duration: 30-60 seconds",
            "Topic must be technology-related",
            "Content must be original and created specifically for this competition",
            "Submission deadline: April 10, 2024, 11:59 PM"
        ],
        "instructions": "Submit your reel through the provided submission portal",
        "resources": "Recommended apps: Instagram, TikTok, CapCut, Adobe Premiere Rush",
        "whatsappGroup": "https://chat.whatsapp.com/jklmnopqrstuvwxyz123456"
    }
];

// UI Content for TechelonsMain component
const uiContent = {
    "title": "Techelons'25",
    "subtitle": "Shivaji College's premier technical festival, where innovation meets creativity.",
    "festDate": "April 2025",
    "aboutTitle": "About Techelons",
    "aboutParagraphs": [
        "Techelons is the annual tech fest by Websters, the CS Society of Shivaji College, DU. It's where students showcase technical skills through competitions, hackathons, and coding challenges.",
        "Beyond competitions, Techelons features expert-led seminars on emerging tech and industry trends. The fest promotes networking and collaboration among students and professionals in a celebration of technological innovation."
    ],
    "exploreTitle": "Explore the Future of Technology",
    "exploreDescription": "Join us for two days of innovation, competition, and creativity at Shivaji College. Showcase your skills and connect with tech enthusiasts from across the nation.",
    "features": [
        {
            "title": "Competitions",
            "icon": "🏆",
            "description": "Participate in coding, analysis, and gaming competitions with exciting prizes."
        },
        {
            "title": "Seminar",
            "icon": "🎤",
            "description": "Gain insights from industry leaders through engaging and informative seminars."
        },
        {
            "title": "Networking",
            "icon": "🌐",
            "description": "Connect with tech enthusiasts and industry professionals."
        }
    ]
};

// Export all constants and data
export {
    festInfo,
    eventCategories,
    registrationStatus,
    festDays,
    events,
    whatsappGroups,
    getEventsByDay,
    getEventsByCategory,
    getEventById,
    getWhatsAppGroupLink,
    formatEventDateTime,
    getImagePath,
    EVENT_IMAGES,
    uiContent
};