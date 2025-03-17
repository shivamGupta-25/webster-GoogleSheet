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
      // Get current form values
      const currentValues = getValues();
      const currentTeamMembers = currentValues.teamMembers || [];
      
      // Only update if there's a difference and we're not in the middle of an add/remove operation
      if (JSON.stringify(currentTeamMembers) !== JSON.stringify(teamMembers)) {
        setValue("teamMembers", teamMembers, {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true
        });
      }
    }
  }, [teamMembers, setValue, isTeamEvent, getValues]);
  
  // Watch for college selection to show/hide other college field
  const mainParticipantCollege = watch("mainParticipant.college");
  
  // Remove team member
  const removeTeamMember = useCallback((index) => {
    // Get current form values before removing the member
    const currentValues = getValues();
    const currentTeamMembers = [...(currentValues.teamMembers || [])];
    
    // Remove the member at the specified index
    currentTeamMembers.splice(index, 1);
    
    // Update both local state and form values
    setTeamMembers(currentTeamMembers);
    
    // Update form values while preserving other team members' data
    setValue("teamMembers", currentTeamMembers, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true
    });
  }, [getValues, setValue]);

  // Add team member
  const addTeamMember = useCallback(() => {
    if (teamMembers.length < maxTeamSize - 1) {
      // Get current form values before adding new member
      const currentValues = getValues();
      const currentTeamMembers = [...(currentValues.teamMembers || [])];
      
      // Add new empty member
      currentTeamMembers.push({});
      
      // Update both local state and form values
      setTeamMembers(currentTeamMembers);
      
      // Update form values while preserving existing team members' data
      setValue("teamMembers", currentTeamMembers, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true
      });
    }
  }, [maxTeamSize, getValues, setValue]);
  
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
      // Update college field with custom college name if "Other" is selected
      if (data.mainParticipant.college === "Other" && data.mainParticipant.otherCollege) {
        data.mainParticipant.college = data.mainParticipant.otherCollege;
      }
      
      // Update college field for team members if "Other" is selected
      if (data.teamMembers) {
        data.teamMembers = data.teamMembers.map(member => {
          if (member.college === "Other" && member.otherCollege) {
            member.college = member.otherCollege;
          }
          return member;
        });
      }
      
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
        
        // Check for specific error messages
        if (errorMessage.includes("email address")) {
          errorMessage = ERROR_MESSAGES.DUPLICATE_EMAIL;
        } else if (errorMessage.includes("phone number")) {
          errorMessage = ERROR_MESSAGES.DUPLICATE_PHONE;
        } else if (errorMessage.includes("already registered")) {
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
  }, [event, isSubmitting, isTeamEvent, setIsSubmitting, setServerError]);
  
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Back button */}
      <Button
        type="button"
        variant="ghost"
        onClick={onBack}
        className="mb-2 h-8 sm:h-10 text-xs sm:text-sm px-2 sm:px-3"
        disabled={isSubmitting}
      >
        <ArrowLeft className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
        Back to Events
      </Button>
      
      {/* Event info */}
      <div className="mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">
          {event.name}
        </h2>
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
          {event.description}
        </p>
      </div>
      
      {/* Registration form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
        {/* Team name (for team events) */}
        {isTeamEvent && (
          <div>
            <label className="block text-xs sm:text-sm font-medium mb-1">
              Team Name <span className="text-red-500">*</span>
            </label>
            <Input
              {...register("teamName")}
              placeholder="Enter your team name"
              disabled={isSubmitting}
              className="text-xs sm:text-sm h-8 sm:h-10"
            />
            {errors.teamName && (
              <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.teamName.message}</p>
            )}
          </div>
        )}
        
        {/* Main participant */}
        <div className="bg-gray-50 dark:bg-gray-800 p-3 sm:p-4 rounded-lg">
          <h3 className="text-sm sm:text-base font-medium mb-3 sm:mb-4">
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
        
        {/* Team members (for team events) */}
        {isTeamEvent && (
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-sm sm:text-base font-medium">
              Team Members {minTeamSize > 1 && <span className="text-red-500">*</span>}
            </h3>
            
            {teamMembers.map((_, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-800 p-3 sm:p-4 rounded-lg relative">
                <div className="flex justify-between items-center mb-3 sm:mb-4">
                  <h4 className="text-xs sm:text-sm font-medium">Team Member {index + 1}</h4>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeTeamMember(index)}
                    disabled={isSubmitting || (minTeamSize > 1 && teamMembers.length <= minTeamSize - 1)}
                    className="h-6 sm:h-8 px-2 sm:px-3 text-xs"
                  >
                    <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-0 sm:mr-1" />
                    <span className="hidden sm:inline">Remove</span>
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
                className="w-full h-8 sm:h-10 text-xs sm:text-sm"
              >
                <Plus className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                Add Team Member
              </Button>
            )}
            
            {errors.teamMembers && errors.teamMembers.message && (
              <p className="text-red-500 text-xs sm:text-sm">{errors.teamMembers.message}</p>
            )}
          </div>
        )}
        
        {/* College ID upload */}
        <div>
          <label className="block text-xs sm:text-sm font-medium mb-1">
            {isTeamEvent ? "College ID (Compile and upload all team members' IDs)" : "College ID"} <span className="text-red-500">*</span>
          </label>
          <FileUpload
            setValue={setValue}
            value={watch("collegeIdUrl")}
            isSubmitting={isSubmitting}
          />
          {errors.collegeIdUrl && (
            <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.collegeIdUrl.message}</p>
          )}
        </div>
        
        {/* Additional query */}
        <div>
          <label className="block text-xs sm:text-sm font-medium mb-1">
            Any queries? (Optional)
          </label>
          <Textarea
            {...register("query")}
            placeholder="Enter any questions or comments you have"
            disabled={isSubmitting}
            className="text-xs sm:text-sm min-h-[60px] sm:min-h-[80px]"
          />
        </div>
        
        {/* Submit button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-10 sm:h-12 text-sm sm:text-base mt-2 sm:mt-4"
        >
          {isSubmitting ? "Submitting..." : "Submit Registration"}
        </Button>
      </form>
    </div>
  );
} 