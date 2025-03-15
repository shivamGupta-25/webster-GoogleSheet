import { Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ParticipantForm({
  register,
  errors,
  control,
  isSubmitting,
  prefix,
}) {
  // Helper function to get nested errors
  const getNestedError = (path) => {
    const parts = path.split(".");
    let error = errors;
    
    for (const part of parts) {
      if (!error || !error[part]) return null;
      error = error[part];
    }
    
    return error.message;
  };
  
  // Check if college is "Other" to show the other college field
  const isOtherCollege = (college) => college === "Other";
  
  return (
    <div className="space-y-4">
      {/* Full Name */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Full Name <span className="text-red-500">*</span>
        </label>
        <Input
          {...register(`${prefix}.name`)}
          placeholder="Enter your full name"
          disabled={isSubmitting}
        />
        {getNestedError(`${prefix}.name`) && (
          <p className="text-red-500 text-sm mt-1">{getNestedError(`${prefix}.name`)}</p>
        )}
      </div>
      
      {/* Email */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Email <span className="text-red-500">*</span>
        </label>
        <Input
          {...register(`${prefix}.email`)}
          type="email"
          placeholder="Enter your email address"
          disabled={isSubmitting}
        />
        {getNestedError(`${prefix}.email`) && (
          <p className="text-red-500 text-sm mt-1">{getNestedError(`${prefix}.email`)}</p>
        )}
      </div>
      
      {/* Phone Number */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Phone Number <span className="text-red-500">*</span>
        </label>
        <Input
          {...register(`${prefix}.phone`)}
          type="tel"
          placeholder="Enter your 10-digit phone number"
          maxLength={10}
          disabled={isSubmitting}
        />
        {getNestedError(`${prefix}.phone`) && (
          <p className="text-red-500 text-sm mt-1">{getNestedError(`${prefix}.phone`)}</p>
        )}
      </div>
      
      {/* Roll Number */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Roll Number <span className="text-red-500">*</span>
        </label>
        <Input
          {...register(`${prefix}.rollNo`)}
          placeholder="Enter your college roll number"
          disabled={isSubmitting}
        />
        {getNestedError(`${prefix}.rollNo`) && (
          <p className="text-red-500 text-sm mt-1">{getNestedError(`${prefix}.rollNo`)}</p>
        )}
      </div>
      
      {/* Course */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Course <span className="text-red-500">*</span>
        </label>
        <Input
          {...register(`${prefix}.course`)}
          placeholder="Enter your course (e.g., B.Sc. Computer Science)"
          disabled={isSubmitting}
        />
        {getNestedError(`${prefix}.course`) && (
          <p className="text-red-500 text-sm mt-1">{getNestedError(`${prefix}.course`)}</p>
        )}
      </div>
      
      {/* Year */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Year <span className="text-red-500">*</span>
        </label>
        <Controller
          name={`${prefix}.year`}
          control={control}
          render={({ field }) => (
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              disabled={isSubmitting}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1st Year">1st Year</SelectItem>
                <SelectItem value="2nd Year">2nd Year</SelectItem>
                <SelectItem value="3rd Year">3rd Year</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {getNestedError(`${prefix}.year`) && (
          <p className="text-red-500 text-sm mt-1">{getNestedError(`${prefix}.year`)}</p>
        )}
      </div>
      
      {/* College */}
      <div>
        <label className="block text-sm font-medium mb-1">
          College <span className="text-red-500">*</span>
        </label>
        <Controller
          name={`${prefix}.college`}
          control={control}
          render={({ field }) => (
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              disabled={isSubmitting}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your college" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Shivaji College">Shivaji College</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {getNestedError(`${prefix}.college`) && (
          <p className="text-red-500 text-sm mt-1">{getNestedError(`${prefix}.college`)}</p>
        )}
      </div>
      
      {/* Other College (conditional) */}
      <Controller
        name={`${prefix}.college`}
        control={control}
        render={({ field }) => (
          isOtherCollege(field.value) && (
            <div>
              <label className="block text-sm font-medium mb-1">
                Other College <span className="text-red-500">*</span>
              </label>
              <Input
                {...register(`${prefix}.otherCollege`)}
                placeholder="Enter your college name"
                disabled={isSubmitting}
              />
              {getNestedError(`${prefix}.otherCollege`) && (
                <p className="text-red-500 text-sm mt-1">{getNestedError(`${prefix}.otherCollege`)}</p>
              )}
            </div>
          )
        )}
      />
    </div>
  );
} 