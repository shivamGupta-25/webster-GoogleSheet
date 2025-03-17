import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

export default function GeneralSettings({ techelonsData, handleFestInfoChange, handleDateChange }) {
  return (
    <Card className="w-full">
      <CardHeader className="px-4 sm:px-6">
        <CardTitle className="text-xl sm:text-2xl">General Settings</CardTitle>
        <CardDescription className="text-sm">
          Update general Techelons fest information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6">
        <div className="flex items-center space-x-2">
          <Switch 
            id="registration-enabled"
            checked={techelonsData.festInfo.registrationEnabled}
            onCheckedChange={(checked) => handleFestInfoChange("registrationEnabled", checked)}
          />
          <Label htmlFor="registration-enabled" className="text-sm sm:text-base">
            Registration Enabled
          </Label>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="space-y-2">
            <Label htmlFor="day1-date" className="text-sm sm:text-base">Day 1 Date</Label>
            <Input
              id="day1-date"
              value={techelonsData.festInfo.dates.day1}
              onChange={(e) => handleDateChange("day1", e.target.value)}
              placeholder="April 10, 2025"
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="day2-date" className="text-sm sm:text-base">Day 2 Date</Label>
            <Input
              id="day2-date"
              value={techelonsData.festInfo.dates.day2}
              onChange={(e) => handleDateChange("day2", e.target.value)}
              placeholder="April 11, 2025"
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="registration-deadline" className="text-sm sm:text-base">Registration Deadline</Label>
            <Input
              id="registration-deadline"
              value={techelonsData.festInfo.dates.registrationDeadline}
              onChange={(e) => handleDateChange("registrationDeadline", e.target.value)}
              placeholder="April 8, 2025"
              className="w-full"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 