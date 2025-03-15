import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import ParticipantForm from "./ParticipantForm";
import FileUpload from "./FileUpload";

// Email validation schema
const emailSchema = z.string()
  .min(1, "Email is required")
  .email("Invalid email address")
  .regex(
    /^[a-zA-Z0-9][a-zA-Z0-9._%+-]*@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,}|du\.ac\.in|ipu\.ac\.in|ignou\.ac\.in|jnu\.ac\.in|iitd\.ac\.in|nsut\.ac\.in|dtu\.ac\.in|igdtuw\.ac\.in|aud\.ac\.in|jamiahamdard\.edu|bhu\.ac\.in|bvpindia\.com|mait\.ac\.in|ip\.edu|msit\.in|gbpuat\.ac\.in)$/,
    "Please use valid EMail ID"
  );

// Phone validation schema
const phoneSchema = z.string()
  .min(1, "Phone number is required")
  .length(10, "Phone number must be exactly 10 digits")
  .regex(/^[6-9]\d{9}$/, "Please enter a valid Indian mobile number");

// Participant validation schema
const participantSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: emailSchema,
  phone: phoneSchema,
  rollNo: z.string().min(2, "Roll No. is required"),
  course: z.string().min(2, "Course is required"),
  year: z.enum(["1st Year", "2nd Year", "3rd Year"], {
    required_error: "Please select your year",
  }),
  college: z.string().min(2, "College is required"),
  otherCollege: z.string().optional(),
});

// Create dynamic form schema based on event type
const createFormSchema = (isTeamEvent, minTeamSize, maxTeamSize) => {
  const baseSchema = {
    mainParticipant: participantSchema,
    collegeIdUrl: z.string().min(1, "College ID is required"),
    query: z.string().optional(),
  };
  
  if (isTeamEvent) {
    return z.object({
      ...baseSchema,
      teamName: z.string().min(2, "Team name is required"),
      teamMembers: z.array(participantSchema)
        .min(minTeamSize === 1 ? 0 : minTeamSize - 1, `Team must have at least ${minTeamSize} members (including you)`)
        .max(maxTeamSize - 1, `Team cannot have more than ${maxTeamSize} members (including you)`),
    });
  }
  
  return z.object(baseSchema);
};

// Error messages
const ERROR_MESSAGES = {
  CONNECTION_ERROR: "Connection error. Please check your internet connection and try again.",
  DUPLICATE_EMAIL: "This email address is already registered for this event.",
  DUPLICATE_PHONE: "This phone number is already registered for this event.",
  DEFAULT: "Registration failed. Please try again or contact support."
};

export default function RegistrationForm({ 
  event, 
  onBack, 
  isSubmitting, 
  setIsSubmitting, 
  setServerError 
}) {
  const router = useRouter();
  // Consider an event as team event if max team size > 1, regardless of min size
  const isTeamEvent = event.teamSize && event.teamSize.max > 1;
  const minTeamSize = isTeamEvent ? event.teamSize.min : 1;
  const maxTeamSize = isTeamEvent ? event.teamSize.max : 1;
  
  const [teamMembers, setTeamMembers] = useState([]);
  
  // Initialize team members array based on min team size
  useEffect(() => {
    // If min team size is 1, we still want to show the option to add team members
    // but we don't require any by default
    if (isTeamEvent) {
      const initialMembers = [];
      // Only pre-populate team members if min size > 1
      if (minTeamSize > 1) {
        for (let i = 0; i < minTeamSize - 1; i++) {
          initialMembers.push({});
        }
      }
      setTeamMembers(initialMembers);
    }
  }, [isTeamEvent, minTeamSize]);
  
  // Create form schema based on event type
  const formSchema = createFormSchema(isTeamEvent, minTeamSize, maxTeamSize);
  
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
    trigger,
    getValues,
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mainParticipant: {
        college: "Shivaji College",
        year: "1st Year",
      },
      teamMembers: [],
      query: "",
    },
  });
  
  // Update form values when teamMembers state changes
  useEffect(() => {
    if (isTeamEvent) {
      setValue("teamMembers", teamMembers);
    }
  }, [teamMembers, setValue, isTeamEvent]);
  
  // Watch for college selection to show/hide other college field
  const mainParticipantCollege = watch("mainParticipant.college");
  
  // Add team member
  const addTeamMember = useCallback(() => {
    if (teamMembers.length < maxTeamSize - 1) {
      setTeamMembers([...teamMembers, {}]);
    }
  }, [teamMembers, maxTeamSize]);
  
  // Remove team member
  const removeTeamMember = useCallback((index) => {
    const newTeamMembers = [...teamMembers];
    newTeamMembers.splice(index, 1);
    setTeamMembers(newTeamMembers);
    
    // Trigger validation
    trigger("teamMembers");
  }, [teamMembers, trigger]);
  
  // Handle form submission
  const onSubmit = useCallback(async (data) => {
    if (isSubmitting) {
      return;
    }
    
    setIsSubmitting(true);
    setServerError(null);
    
    // Show loading toast
    const toastId = toast.loading("Submitting your registration...");
    
    try {
      // Prepare payload
      const payload = {
        eventId: event.id,
        eventName: event.name,
        isTeamEvent,
        ...data,
      };
      
      console.log('Sending registration payload:', JSON.stringify(payload));
      
      // Send registration request
      const response = await fetch('/api/techelonsregistration', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
        cache: 'no-store'
      });
      
      const result = await response.json();
      
      console.log('API Response:', result);
      
      if (!response.ok) {
        let errorMessage = result.error || ERROR_MESSAGES.DEFAULT;
        
        // Log detailed error information
        console.error('Registration API error:', {
          status: response.status,
          statusText: response.statusText,
          result
        });
        
        if (errorMessage.includes("already registered")) {
          errorMessage = ERROR_MESSAGES.DUPLICATE_EMAIL;
        }
        
        setServerError(errorMessage);
        toast.error(errorMessage, { id: toastId });
        return;
      }
      
      // Check if user is already registered
      if (result.alreadyRegistered) {
        toast.success("You are already registered! Redirecting...", { id: toastId });
        
        // Redirect to the form submission page with debugging
        console.log('Redirecting to already registered page with token:', result.registrationToken);
        const redirectUrl = `/formsubmitted/techelons?token=${encodeURIComponent(result.registrationToken)}&alreadyRegistered=true&eventId=${encodeURIComponent(event.id)}`;
        console.log('Redirect URL:', redirectUrl);
        
        setTimeout(() => {
          // Use window.location.href for more reliable redirection
          window.location.href = redirectUrl;
        }, 1000);
        return;
      }
      
      // Handle success for new registrations
      toast.success("Registration successful! Redirecting...", { id: toastId });
      
      // Redirect to success page with debugging
      console.log('Redirecting to success page with token:', result.registrationToken);
      const redirectUrl = `/formsubmitted/techelons?token=${encodeURIComponent(result.registrationToken)}&eventId=${encodeURIComponent(event.id)}`;
      console.log('Redirect URL:', redirectUrl);
      
      setTimeout(() => {
        // Use window.location.href for more reliable redirection
        window.location.href = redirectUrl;
      }, 1000);
    } catch (error) {
      console.error("Registration error:", error);
      
      // Provide more detailed error information in the console
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        console.error("Network error - API endpoint might be unreachable");
        toast.error("Network error. Please check your internet connection.", { id: toastId });
        setServerError("Network error. Please check your internet connection.");
      } else {
        toast.error(ERROR_MESSAGES.CONNECTION_ERROR, { id: toastId });
        setServerError(ERROR_MESSAGES.CONNECTION_ERROR);
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, setIsSubmitting, setServerError, event, isTeamEvent, router]);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onBack}
          className="mr-2"
          disabled={isSubmitting}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Register for {event.name}
        </h2>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Event Information */}
        <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-md">
          <h3 className="font-medium mb-2">Event Information</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            <span className="font-medium">Event:</span> {event.name}
          </p>
          {event.date && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              <span className="font-medium">Date:</span> {event.date}
            </p>
          )}
          {event.time && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              <span className="font-medium">Time:</span> {event.time}
            </p>
          )}
          {isTeamEvent && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium">Team Size:</span> {minTeamSize} to {maxTeamSize} members
            </p>
          )}
        </div>
        
        {/* Team Name (for team events) */}
        {isTeamEvent && (
          <div>
            <label className="block text-sm font-medium mb-1">
              Team Name <span className="text-red-500">*</span>
            </label>
            <Input
              {...register("teamName")}
              placeholder="Enter your team name"
              disabled={isSubmitting}
            />
            {errors.teamName && (
              <p className="text-red-500 text-sm mt-1">{errors.teamName.message}</p>
            )}
          </div>
        )}
        
        {/* Main Participant */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4">
          <h3 className="font-medium mb-4">
            {isTeamEvent ? "Team Leader Information" : "Participant Information"}
          </h3>
          
          <ParticipantForm
            register={register}
            errors={errors}
            control={control}
            isSubmitting={isSubmitting}
            prefix="mainParticipant"
          />
        </div>
        
        {/* Team Members (for team events) */}
        {isTeamEvent && (
          <div className="space-y-4">
            <h3 className="font-medium">
              Team Members 
              {minTeamSize > 1 && <span className="text-red-500">*</span>}
              <span className="text-sm font-normal text-gray-600 dark:text-gray-400 ml-2">
                ({teamMembers.length}/{maxTeamSize - 1})
              </span>
            </h3>
            
            {errors.teamMembers?.message && (
              <p className="text-red-500 text-sm">{errors.teamMembers.message}</p>
            )}
            
            {teamMembers.map((_, index) => (
              <div 
                key={index} 
                className="border border-gray-200 dark:border-gray-700 rounded-md p-4 relative"
              >
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-medium">Team Member {index + 1}</h4>
                  
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeTeamMember(index)}
                    disabled={isSubmitting || (minTeamSize > 1 && teamMembers.length <= minTeamSize - 1)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                </div>
                
                <ParticipantForm
                  register={register}
                  errors={errors}
                  control={control}
                  isSubmitting={isSubmitting}
                  prefix={`teamMembers.${index}`}
                />
              </div>
            ))}
            
            {teamMembers.length < maxTeamSize - 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={addTeamMember}
                disabled={isSubmitting}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Team Member
              </Button>
            )}
          </div>
        )}
        
        {/* College ID Upload */}
        <div>
          <label className="block text-sm font-medium mb-1">
            College ID <span className="text-red-500">*</span>
          </label>
          <FileUpload
            setValue={setValue}
            value={watch("collegeIdUrl")}
            isSubmitting={isSubmitting}
            maxSizeMB={2}
          />
          {errors.collegeIdUrl && (
            <p className="text-red-500 text-sm mt-1">{errors.collegeIdUrl.message}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Upload your college ID card (max 2MB)
          </p>
        </div>
        
        {/* Query */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Any Query?
          </label>
          <Textarea
            {...register("query")}
            placeholder="Enter your query (optional)"
            disabled={isSubmitting}
            className="resize-none"
            rows={3}
          />
        </div>
        
        {/* Submit Button */}
        <div className="pt-4">
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Registration"}
          </Button>
        </div>
      </form>
    </div>
  );
} 