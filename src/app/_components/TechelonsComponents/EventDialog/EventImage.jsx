import { memo } from "react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { getCategoryIcon } from "./constants";

const EventImage = memo(({ 
  event, 
  imagePath, 
  categoryStyle, 
  imageError, 
  imageLoading, 
  imageHeight, 
  handleImageLoad, 
  handleImageError 
}) => {
  return (
    <div
      className="relative w-full overflow-hidden bg-gradient-to-b from-gray-900 to-gray-800"
      style={{ 
        height: imageHeight || 'auto',
        minHeight: '12rem',
        maxHeight: '28rem',
        transition: 'height 0.3s ease-in-out'
      }}
    >
      {/* Image with responsive handling */}
      {!imageError && (
        <img
          src={imagePath}
          alt={event.name}
          onLoad={handleImageLoad}
          onError={handleImageError}
          className={cn(
            "w-full h-full object-cover transition-all duration-300",
            imageLoading ? "opacity-0 scale-105" : "opacity-100 scale-100"
          )}
          loading="eager"
          fetchPriority="high"
        />
      )}

      {/* Loading state with responsive skeleton */}
      {imageLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Skeleton className="w-full h-full absolute inset-0" />
          <div className="text-white text-opacity-80 text-sm animate-pulse">Loading image...</div>
        </div>
      )}

      {/* Fallback for error with responsive design */}
      {imageError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
          <div className="text-center p-4">
            <div className="text-3xl sm:text-4xl md:text-5xl mb-2">{event.emoji || "🎮"}</div>
            <div className="text-white text-opacity-80 text-xs sm:text-sm">Event image unavailable</div>
          </div>
        </div>
      )}

      {/* Improved overlay gradient for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80"></div>

      {/* Event category badge with responsive positioning */}
      <div className="absolute top-3 sm:top-4 left-3 sm:left-4 z-10">
        <Badge
          className={cn(
            "text-xs px-2 py-1 font-medium shadow-md",
            categoryStyle?.color || "bg-primary text-primary-foreground"
          )}
        >
          {getCategoryIcon(event.category)}
          <span className="ml-1">{event.category}</span>
        </Badge>
      </div>

      {/* Event title overlay with improved responsive typography */}
      <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 md:p-5 lg:p-6 z-10">
        <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white mb-1 drop-shadow-md line-clamp-2">
          {event.name}
        </h2>
        {event.tagline && (
          <p className="text-white text-opacity-90 text-xs sm:text-sm md:text-base mb-1 sm:mb-2 drop-shadow-sm line-clamp-2">
            {event.tagline}
          </p>
        )}
      </div>
    </div>
  );
});

EventImage.displayName = "EventImage";

export default EventImage; 