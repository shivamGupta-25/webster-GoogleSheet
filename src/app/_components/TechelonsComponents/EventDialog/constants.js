import {
  BookOpen,
  Calendar,
  Code,
  ExternalLink,
  Gamepad2,
  Palette,
  Presentation,
  Wrench,
} from "lucide-react";

// Constants
export const SHARE_SUCCESS_TIMEOUT = 2000;
export const ICON_SIZE = "h-4 w-4";

// Icon map
export const ICON_MAP = {
  Code: <Code className="h-3 w-3 mr-1" />,
  Wrench: <Wrench className="h-3 w-3 mr-1" />,
  Gamepad2: <Gamepad2 className="h-3 w-3 mr-1" />,
  Palette: <Palette className="h-3 w-3 mr-1" />,
  Presentation: <Presentation className="h-3 w-3 mr-1" />,
  Calendar: <Calendar className="h-3 w-3 mr-1" />,
};

// Status configuration - defined outside component to prevent recreation
export const STATUS_CONFIG = {
  open: {
    color: "bg-emerald-500",
    text: "Registration Open",
    icon: <ExternalLink className="ml-2 h-4 w-4" />,
  },
  "coming-soon": {
    color: "bg-amber-500",
    text: "Coming Soon",
    icon: null,
  },
  closed: {
    color: "bg-rose-500",
    text: "Registration Closed",
    icon: null,
  },
};

// Helper function to get icon component based on icon name
export const getCategoryIcon = (category) => {
  const categoryStyle = getCategoryStyle(category);
  const iconName = categoryStyle.icon;
  return ICON_MAP[iconName] || ICON_MAP.Calendar;
};

// Import this at the top of the file to avoid circular dependencies
import { getCategoryStyle } from "@/app/_data/techelonsEventsData"; 