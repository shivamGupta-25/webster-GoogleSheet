"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, Home, Calendar, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

export default function TechelonsFormSubmittedPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const alreadyRegistered = searchParams.get("alreadyRegistered") === "true";
  const eventId = searchParams.get("eventId");
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [registrationData, setRegistrationData] = useState(null);
  const [eventData, setEventData] = useState(null);

  useEffect(() => {
    const fetchRegistrationData = async () => {
      if (!token) {
        setError("Invalid registration token");
        setLoading(false);
        return;
      }

      try {
        // Decode base64 token to get email
        let email;
        try {
          email = atob(token);
          console.log("Decoded email from token:", email);
        } catch (decodeError) {
          console.error("Error decoding token:", decodeError);
          throw new Error("Invalid token format");
        }
        
        if (!email || !email.includes('@')) {
          throw new Error("Invalid email in token");
        }
        
        // Build API URL with email and eventId if available
        let apiUrl = `/api/techelons/registration-details?email=${encodeURIComponent(email)}`;
        if (eventId) {
          apiUrl += `&eventId=${encodeURIComponent(eventId)}`;
        }
        
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
          let errorMessage = "Failed to fetch registration data";
          try {
            const errorData = await response.json();
            if (errorData && errorData.error) {
              errorMessage = errorData.error;
            }
          } catch (jsonError) {
            console.error("Error parsing error response:", jsonError);
          }
          throw new Error(errorMessage);
        }
        
        const data = await response.json();
        if (!data || !data.registration) {
          throw new Error("No registration data found");
        }
        
        setRegistrationData(data.registration);
        setEventData(data.event);
      } catch (error) {
        console.error("Error fetching registration data:", error);
        setError(error.message || "Failed to fetch registration data");
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrationData();
  }, [token, eventId]);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl md:text-3xl font-bold">
              {alreadyRegistered ? "Already Registered" : "Registration Successful"}
            </CardTitle>
            <CardDescription>
              {alreadyRegistered 
                ? "You have already registered for this event" 
                : "Thank you for registering for Techelons"}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            ) : error ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : (
              <>
                <Alert className={alreadyRegistered ? "bg-amber-50 border-amber-200" : "bg-green-50 border-green-200"}>
                  <div className="flex items-center gap-2">
                    {alreadyRegistered ? (
                      <AlertCircle className="h-5 w-5 text-amber-500" />
                    ) : (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                    <AlertTitle className={alreadyRegistered ? "text-amber-700" : "text-green-700"}>
                      {alreadyRegistered ? "Already Registered" : "Form Submitted Successfully"}
                    </AlertTitle>
                  </div>
                  <AlertDescription className="mt-2">
                    {alreadyRegistered
                      ? "You have already registered for this event. Your registration details are shown below."
                      : "Your registration has been confirmed. Please check your email for confirmation."}
                  </AlertDescription>
                </Alert>

                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold mb-3">Event Details</h3>
                  <div className="space-y-2">
                    <p><strong>Event:</strong> {eventData?.name || registrationData?.eventName}</p>
                    {eventData?.description && (
                      <p><strong>Description:</strong> {eventData.description}</p>
                    )}
                    {eventData?.date && (
                      <p><strong>Date:</strong> {eventData.date}</p>
                    )}
                    {eventData?.time && (
                      <p><strong>Time:</strong> {eventData.time}</p>
                    )}
                    {eventData?.venue && (
                      <p><strong>Venue:</strong> {eventData.venue}</p>
                    )}
                    {eventData?.whatsappGroup && (
                      <div className="mt-4">
                        <p className="font-medium mb-2">Join WhatsApp Group for Updates:</p>
                        <a 
                          href={eventData.whatsappGroup} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors"
                        >
                          <ExternalLink className="h-4 w-4" />
                          Join WhatsApp Group
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {registrationData?.isTeamEvent && registrationData?.teamName && (
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold mb-2">Team Information</h3>
                    <p><strong>Team Name:</strong> {registrationData.teamName}</p>
                  </div>
                )}
              </>
            )}
          </CardContent>
          
          <CardFooter className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Button asChild variant="outline" className="w-full sm:w-auto">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Home
              </Link>
            </Button>
            <Button asChild className="w-full sm:w-auto">
              <Link href="/techelonsregistration">
                <Calendar className="mr-2 h-4 w-4" />
                Register for Another Event
              </Link>
            </Button>
            <Button asChild variant="secondary" className="w-full sm:w-auto">
              <Link href="/techelons">
                <ExternalLink className="mr-2 h-4 w-4" />
                Visit Techelons Page
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
