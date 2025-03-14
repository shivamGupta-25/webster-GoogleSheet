import { memo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ICON_MAP, STATUS_CONFIG } from "./constants";
import { getEffectiveRegistrationStatus } from "./utils";

// UI Components
export const SectionHeading = memo(({ icon, children }) => (
  <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 flex items-center">
    {icon && <span className="bg-primary/20 text-primary p-1 sm:p-1.5 rounded-md mr-2">{icon}</span>}
    {children}
  </h3>
));
SectionHeading.displayName = "SectionHeading";

export const TimelineItem = memo(({ icon, time, description }) => (
  <div className="relative">
    <div className="absolute -left-[25px] sm:-left-[29px] w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-md">
      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-background rounded-full"></div>
    </div>
    <div className="bg-gradient-to-r from-violet-50/90 via-purple-50/90 to-fuchsia-50/90 dark:from-violet-950/40 dark:via-purple-950/40 dark:to-fuchsia-950/40 p-3 sm:p-4 rounded-lg border border-purple-200/80 dark:border-purple-800/80 shadow-sm hover:shadow-md transition-all duration-300 hover:translate-y-[-2px]">
      <div className="flex items-center text-primary font-medium mb-1 text-sm sm:text-base">
        {icon}
        {time}
      </div>
      <p className="text-xs sm:text-sm text-muted-foreground">{description}</p>
    </div>
  </div>
));
TimelineItem.displayName = "TimelineItem";

export const InfoCard = memo(({ icon, title, children, className }) => (
  <Card className={cn("overflow-hidden hover:shadow-md transition-all duration-300 hover:translate-y-[-2px]", className)}>
    <CardContent className="p-4">
      <div className="flex items-start">
        {icon && (
          <div className="bg-primary/20 rounded-full p-1.5 sm:p-2 mr-2 sm:mr-3 mt-0.5 sm:mt-1 flex-shrink-0">
            {icon}
          </div>
        )}
        <div className="flex-1 min-w-0">
          {title && <h4 className="font-medium text-sm sm:text-base">{title}</h4>}
          {children}
        </div>
      </div>
    </CardContent>
  </Card>
));
InfoCard.displayName = "InfoCard";

// Registration status component
export const RegistrationStatus = memo(({ status, event }) => {
  // Use the utility function to get the effective status
  const effectiveStatus = event ? getEffectiveRegistrationStatus(event) : (status || "closed");
  const config = STATUS_CONFIG[effectiveStatus] || STATUS_CONFIG.closed;

  return (
    <>
      <span className={`inline-block w-2 h-2 rounded-full ${config.color} mr-2 animate-pulse`}></span>
      {config.text}
      {config.icon}
    </>
  );
});
RegistrationStatus.displayName = "RegistrationStatus"; 