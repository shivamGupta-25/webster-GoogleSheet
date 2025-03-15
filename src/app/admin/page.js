"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, FileText, Calendar, Award } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="bg-slate-50 min-h-screen w-full p-3 sm:p-4 md:p-6 lg:p-8">
      {/* Welcome Banner */}
      <div className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-700 p-3 sm:p-4 md:p-6 shadow-lg mb-4 md:mb-6">
        <div className="text-white">
          <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold tracking-tight">Welcome back, Admin</h1>
          <p className="mt-1 text-xs sm:text-sm opacity-90 max-w-lg">
            Manage your website content and settings from this dashboard
          </p>
        </div>
      </div>

      {/* Main Management Cards */}
      <div className="mt-4 md:mt-6">
        <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold mb-3 md:mb-4 lg:mb-6 text-center">Management</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 lg:gap-6">
          {/* Content Management Card */}
          <Card className="bg-white border-none shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader className="pb-2 p-3 md:p-4 lg:p-5">
              <div className="p-1.5 w-fit rounded-lg bg-blue-100 mb-2">
                <FileText className="h-4 w-4 text-blue-600" />
              </div>
              <CardTitle className="text-sm sm:text-base md:text-lg lg:text-xl">Content Management</CardTitle>
              <CardDescription className="text-xs md:text-sm">
                Update website content like banner, about section, and more
              </CardDescription>
            </CardHeader>
            <CardContent className="px-3 md:px-4 lg:px-5 py-1">
              <p className="text-xs md:text-sm text-muted-foreground">
                Edit text, images, and other content displayed on the website. Changes will be reflected immediately.
              </p>
            </CardContent>
            <CardFooter className="px-3 md:px-4 lg:px-5 pb-3 md:pb-4 pt-2">
              <Link href="/admin/content" className="w-full">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 h-8 md:h-9 text-xs md:text-sm">
                  Manage Content
                  <ArrowRight className="ml-1 h-3 w-3 md:h-4 md:w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Workshop Management Card */}
          <Card className="bg-white border-none shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <CardHeader className="pb-2 p-3 md:p-4 lg:p-5">
              <div className="p-1.5 w-fit rounded-lg bg-purple-100 mb-2">
                <Calendar className="h-4 w-4 text-purple-600" />
              </div>
              <CardTitle className="text-sm sm:text-base md:text-lg lg:text-xl">Workshop Management</CardTitle>
              <CardDescription className="text-xs md:text-sm">
                Manage workshop details and registration
              </CardDescription>
            </CardHeader>
            <CardContent className="px-3 md:px-4 lg:px-5 py-1">
              <p className="text-xs md:text-sm text-muted-foreground">
                Update workshop information, registration status, and other details. Control workshop visibility and settings.
              </p>
            </CardContent>
            <CardFooter className="px-3 md:px-4 lg:px-5 pb-3 md:pb-4 pt-2">
              <Link href="/admin/workshop" className="w-full">
                <Button className="w-full bg-purple-600 hover:bg-purple-700 h-8 md:h-9 text-xs md:text-sm">
                  Manage Workshop
                  <ArrowRight className="ml-1 h-3 w-3 md:h-4 md:w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Techelons Management Card */}
          <Card className="bg-white border-none shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 sm:col-span-2 lg:col-span-1">
            <CardHeader className="pb-2 p-3 md:p-4 lg:p-5">
              <div className="p-1.5 w-fit rounded-lg bg-amber-100 mb-2">
                <Award className="h-4 w-4 text-amber-600" />
              </div>
              <CardTitle className="text-sm sm:text-base md:text-lg lg:text-xl">Techelons Management</CardTitle>
              <CardDescription className="text-xs md:text-sm">
                Manage Techelons fest details and events
              </CardDescription>
            </CardHeader>
            <CardContent className="px-3 md:px-4 lg:px-5 py-1">
              <p className="text-xs md:text-sm text-muted-foreground">
                Update Techelons fest information, manage events, registration settings, and other details for the tech fest.
              </p>
            </CardContent>
            <CardFooter className="px-3 md:px-4 lg:px-5 pb-3 md:pb-4 pt-2">
              <Link href="/admin/techelons" className="w-full">
                <Button className="w-full bg-amber-600 hover:bg-amber-700 h-8 md:h-9 text-xs md:text-sm">
                  Manage Techelons
                  <ArrowRight className="ml-1 h-3 w-3 md:h-4 md:w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}