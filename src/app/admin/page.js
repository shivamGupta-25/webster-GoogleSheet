"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, FileText, Image, Users, Calendar, Settings, Award } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to the Websters Admin Dashboard
          </p>
        </div>
      </div>

      <Separator />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Content Management
            </CardTitle>
            <CardDescription>
              Update website content like banner, about section, and more
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Edit text, images, and other content displayed on the website. Changes will be reflected immediately.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/admin/content" className="w-full">
              <Button className="w-full" variant="secondary">
                Manage Content
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Workshop Management
            </CardTitle>
            <CardDescription>
              Manage workshop details and registration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Update workshop information, registration status, and other details. Control workshop visibility and settings.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/admin/workshop" className="w-full">
              <Button className="w-full" variant="secondary">
                Manage Workshop
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Techelons Management
            </CardTitle>
            <CardDescription>
              Manage Techelons fest details and events
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Update Techelons fest information, manage events, registration settings, and other details for the tech fest.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/admin/techelons" className="w-full">
              <Button className="w-full" variant="secondary">
                Manage Techelons
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              User Management
            </CardTitle>
            <CardDescription>
              Manage user accounts and permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Add, edit, or remove user accounts. Manage user roles and permissions for the admin dashboard.
            </p>
          </CardContent>
          <CardFooter>
            <Button className="w-full" variant="outline" disabled>
              Coming Soon
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Image className="h-5 w-5" />
              Media Library
            </CardTitle>
            <CardDescription>
              Manage your website's media assets
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Upload, organize, and manage images and other media files used across your website.
            </p>
          </CardContent>
          <CardFooter>
            <Button className="w-full" variant="outline" disabled>
              Coming Soon
            </Button>
          </CardFooter>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Site Settings
            </CardTitle>
            <CardDescription>
              Configure website-wide settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Manage general website settings, SEO configuration, and other global options.
            </p>
          </CardContent>
          <CardFooter>
            <Button className="w-full" variant="outline" disabled>
              Coming Soon
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
} 