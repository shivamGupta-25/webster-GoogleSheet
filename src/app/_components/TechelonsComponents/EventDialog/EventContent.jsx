// NOTE: This file was automatically updated to use fetchTechelonsData instead of importing from techelonsData directly.
// Please review and update the component to use the async fetchTechelonsData function.
import { memo, useMemo, useState, useEffect } from "react";
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  Info, 
  Mail, 
  MapPin, 
  MessageCircle, 
  Phone, 
  Ticket, 
  Trophy, 
  User, 
  Users 
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ICON_SIZE } from "./constants";
import { SectionHeading, InfoCard, RegistrationStatus } from "./UIComponents";
import { fetchTechelonsData } from '@/lib/utils';

// Event details section
export const EventDetails = memo(({ event, formattedDate, formattedTime, dayOfWeek }) => {
  // Determine day display based on festDay value directly
  const getDayDisplay = () => {
    if (!event.festDay) return "";
    return event.festDay === "day1" ? "Day 1" : "Day 2";
  };
  
  return (
    <InfoCard
      icon={<Info className={ICON_SIZE} />}
      title="Event Details"
      className="overflow-hidden"
    >
      <div className="text-sm text-muted-foreground grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Date and Time */}
        <div className="flex items-start">
          <Calendar className="h-4 w-4 mr-2 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-medium text-primary">
              {getDayDisplay()}
            </div>
            <div>{formattedDate} ({dayOfWeek})</div>
            <div>{formattedTime}</div>
            {event.duration && (
              <div className="flex items-center mt-1">
                <Clock className="h-3 w-3 mr-1" />
                <span>Duration: {event.duration}</span>
              </div>
            )}
          </div>
        </div>

        {/* Location */}
        {event.venue && (
          <div className="flex items-start">
            <MapPin className="h-4 w-4 mr-2 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-medium">Location</div>
              <div className="break-words">{event.venue}</div>
            </div>
          </div>
        )}

        {/* Speaker */}
        {event.speaker && (
          <div className="flex items-start">
            <User className="h-4 w-4 mr-2 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-medium">Speaker</div>
              <div className="break-words">{event.speaker}</div>
            </div>
          </div>
        )}

        {/* Registration status */}
        <div className="flex items-start">
          <Ticket className="h-4 w-4 mr-2 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-medium">Registration</div>
            <div className="flex items-center">
              <RegistrationStatus status={event.registrationStatus} event={event} />
            </div>
          </div>
        </div>
      </div>
    </InfoCard>
  );
});
EventDetails.displayName = "EventDetails";

// Description section
export const Description = memo(({ description }) => {
  if (!description) return null;
  
  return (
    <div>
      <SectionHeading icon={<BookOpen className={ICON_SIZE} />}>Description</SectionHeading>
      <div className="prose prose-sm max-w-none text-muted-foreground">
        <p className="whitespace-pre-line">{description}</p>
      </div>
    </div>
  );
});
Description.displayName = "Description";

// Rules section
export const Rules = memo(({ rules }) => {
  if (!rules?.length) return null;
  
  return (
    <div>
      <SectionHeading icon={<Info className={ICON_SIZE} />}>Rules</SectionHeading>
      <ul className="list-disc pl-5 space-y-1 text-muted-foreground text-sm sm:text-base bg-gradient-to-br from-red-50/90 via-rose-50/90 to-pink-50/90 dark:from-red-950/40 dark:via-rose-950/40 dark:to-pink-950/40 p-3 rounded-lg border border-red-200/80 dark:border-red-800/80 shadow-sm hover:shadow-md transition-all duration-300">
        {rules.map((rule, index) => (
          <li key={index} className="hover:text-foreground transition-colors duration-200">
            {rule}
          </li>
        ))}
      </ul>
    </div>
  );
});
Rules.displayName = "Rules";

// Instructions section
export const Instructions = memo(({ instructions }) => {
  if (!instructions) return null;
  
  return (
    <div>
      <SectionHeading icon={<Info className={ICON_SIZE} />}>Instructions</SectionHeading>
      <Card className="border-amber-200/80 dark:border-amber-800/80 shadow-sm hover:shadow-md transition-all duration-300 hover:translate-y-[-2px] bg-gradient-to-br from-amber-50/90 via-yellow-50/90 to-orange-50/90 dark:from-amber-950/40 dark:via-yellow-950/40 dark:to-orange-950/40">
        <CardContent className="p-3 sm:p-4">
          <p className="whitespace-pre-line text-sm sm:text-base">{instructions}</p>
        </CardContent>
      </Card>
    </div>
  );
});
Instructions.displayName = "Instructions";

// Team size section
export const TeamSize = memo(({ teamSize }) => {
  if (!teamSize) return null;
  
  return (
    <div>
      <SectionHeading icon={<Users className={ICON_SIZE} />}>Team Requirements</SectionHeading>
      <Card className="border-emerald-200/80 dark:border-emerald-800/80 shadow-sm hover:shadow-md transition-all duration-300 hover:translate-y-[-2px] bg-gradient-to-br from-emerald-50/90 via-green-50/90 to-teal-50/90 dark:from-emerald-950/40 dark:via-green-950/40 dark:to-teal-950/40">
        <CardContent className="p-3 sm:p-4">
          <p className="text-sm sm:text-base">
            {typeof teamSize === "object" ? (
              <>
                <span className="font-medium">Team Size:</span> {teamSize.min} - {teamSize.max} members
              </>
            ) : (
              <>
                <span className="font-medium">Team Size:</span> {teamSize} {teamSize === 1 ? "member" : "members"}
              </>
            )}
          </p>
        </CardContent>
      </Card>
    </div>
  );
});
TeamSize.displayName = "TeamSize";

// Prizes section
export const Prizes = memo(({ prizes }) => {
  if (!prizes) return null;
  
  return (
    <div>
      <SectionHeading icon={<Trophy className={ICON_SIZE} />}>Prizes</SectionHeading>
      <Card className="border-blue-200/80 dark:border-blue-800/80 shadow-sm hover:shadow-md transition-all duration-300 hover:translate-y-[-2px] bg-gradient-to-br from-blue-50/90 via-indigo-50/90 to-violet-50/90 dark:from-blue-950/40 dark:via-indigo-950/40 dark:to-violet-950/40">
        <CardContent className="p-3 sm:p-4">
          {Array.isArray(prizes) ? (
            <ul className="space-y-2">
              {prizes.map((prize, index) => (
                <li key={index} className="text-sm sm:text-base">
                  <span className="font-medium">{prize.position}: </span>
                  {prize.reward}
                </li>
              ))}
            </ul>
          ) : (
            <p className="whitespace-pre-line text-sm sm:text-base">{prizes}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
});
Prizes.displayName = "Prizes";

// Coordinators section
export const Coordinators = memo(({ coordinators }) => {
  if (!coordinators?.length) return null;
  
  return (
    <div>
      <SectionHeading icon={<MessageCircle className={ICON_SIZE} />}>Contact Coordinators</SectionHeading>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {coordinators.map((coordinator, index) => (
          <Card key={index} className="border-cyan-200/80 dark:border-cyan-800/80 shadow-sm hover:shadow-md transition-all duration-300 hover:translate-y-[-2px] bg-gradient-to-br from-cyan-50/90 via-sky-50/90 to-blue-50/90 dark:from-cyan-950/40 dark:via-sky-950/40 dark:to-blue-950/40">
            <CardContent className="p-3 sm:p-4">
              <h4 className="font-medium text-sm sm:text-base mb-1 break-words">{coordinator.name}</h4>
              <div className="space-y-1 text-sm text-muted-foreground">
                {coordinator.email && (
                  <div className="flex items-center">
                    <Mail className="h-3 w-3 mr-2 flex-shrink-0" />
                    <a 
                      href={`mailto:${coordinator.email}`} 
                      className="hover:text-primary transition-colors break-all"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {coordinator.email}
                    </a>
                  </div>
                )}
                {coordinator.phone && (
                  <div className="flex items-center">
                    <Phone className="h-3 w-3 mr-2 flex-shrink-0" />
                    <a 
                      href={`tel:${coordinator.phone}`} 
                      className="hover:text-primary transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {coordinator.phone}
                    </a>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
});
Coordinators.displayName = "Coordinators";

// Resources section
export const Resources = memo(({ resources }) => {
  if (!resources) return null;
  
  return (
    <div>
      <SectionHeading icon={<BookOpen className={ICON_SIZE} />}>Resources</SectionHeading>
      <Card className="border-lime-200/80 dark:border-lime-800/80 shadow-sm hover:shadow-md transition-all duration-300 hover:translate-y-[-2px] bg-gradient-to-br from-lime-50/90 via-green-50/90 to-emerald-50/90 dark:from-lime-950/40 dark:via-green-950/40 dark:to-emerald-950/40">
        <CardContent className="p-3 sm:p-4">
          <p className="whitespace-pre-line text-sm sm:text-base">{resources}</p>
        </CardContent>
      </Card>
    </div>
  );
});
Resources.displayName = "Resources"; 