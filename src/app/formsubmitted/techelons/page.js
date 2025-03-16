import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, Home, Calendar, ExternalLink } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import TechelonsFormSubmittedClient from "@/components/techelons/TechelonsFormSubmittedClient";

export const dynamic = 'force-dynamic';

export default async function TechelonsFormSubmittedPage({ searchParams }) {
  // Await searchParams before accessing its properties
  const params = await searchParams;
  const token = params?.token || "";
  const alreadyRegistered = params?.alreadyRegistered === "true";
  const eventId = params?.eventId || "";
  
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
          
          <TechelonsFormSubmittedClient 
            token={token} 
            alreadyRegistered={alreadyRegistered} 
            eventId={eventId} 
          />
          
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
