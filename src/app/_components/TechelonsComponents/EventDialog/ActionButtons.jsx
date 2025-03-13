import { memo } from "react";
import { ArrowRight, CheckCircle, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const ActionButtons = memo(({ event, handleRegister, handleShare, shareSuccess }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2 sticky bottom-0 bg-background/95 backdrop-blur-sm py-3 -mx-3 -mb-3 sm:-mx-4 sm:-mb-4 md:-mx-5 md:-mb-5 lg:-mx-6 lg:-mb-6 px-3 sm:px-4 md:px-5 lg:px-6 border-t shadow-md transition-all duration-300">
      {event.registrationStatus === "open" && (
        <Button
          onClick={handleRegister}
          className="flex-1 bg-primary hover:bg-primary/90 h-9 sm:h-10 md:h-11 text-sm sm:text-base touch-manipulation active:scale-[0.98] transition-transform"
          aria-label="Register Now"
        >
          <span className="truncate">Register Now</span>
          <ArrowRight className="ml-1.5 sm:ml-2 h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
        </Button>
      )}
      <Button
        onClick={handleShare}
        variant="outline"
        className="flex-1 h-9 sm:h-10 md:h-11 text-sm sm:text-base touch-manipulation active:scale-[0.98] transition-transform"
        aria-label={shareSuccess ? "Copied to clipboard" : "Share Event"}
      >
        {shareSuccess ? (
          <>
            <CheckCircle className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0 text-green-500" />
            <span className="truncate">Copied!</span>
          </>
        ) : (
          <>
            <Share2 className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="truncate">Share Event</span>
          </>
        )}
      </Button>
    </div>
  );
});

ActionButtons.displayName = "ActionButtons";

export default ActionButtons; 