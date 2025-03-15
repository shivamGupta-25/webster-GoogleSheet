import mongoose from 'mongoose';

const TeamMemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    validate: {
      validator: function(v) {
        return /^[6-9]\d{9}$/.test(v);
      },
      message: props => `${props.value} is not a valid Indian mobile number!`
    }
  },
  rollNo: {
    type: String,
    required: [true, 'Roll No. is required'],
    trim: true,
  },
  course: {
    type: String,
    required: [true, 'Course is required'],
    trim: true,
  },
  year: {
    type: String,
    required: [true, 'Year is required'],
    enum: ['1st Year', '2nd Year', '3rd Year'],
  },
  college: {
    type: String,
    required: [true, 'College is required'],
    trim: true,
  },
  otherCollege: {
    type: String,
    trim: true,
    default: '',
  },
}, { _id: true });

const TechelonsRegistrationSchema = new mongoose.Schema({
  eventId: {
    type: String,
    required: [true, 'Event ID is required'],
    trim: true,
  },
  eventName: {
    type: String,
    required: [true, 'Event name is required'],
    trim: true,
  },
  isTeamEvent: {
    type: Boolean,
    default: false,
  },
  teamName: {
    type: String,
    trim: true,
    default: '',
  },
  mainParticipant: {
    type: TeamMemberSchema,
    required: [true, 'Main participant information is required'],
  },
  teamMembers: {
    type: [TeamMemberSchema],
    default: [],
  },
  collegeIdUrl: {
    type: String,
    required: [true, 'College ID is required'],
    trim: true,
  },
  query: {
    type: String,
    trim: true,
    default: '',
  },
  registrationDate: {
    type: Date,
    default: Date.now,
  }
}, { timestamps: true });

// Create a compound index to prevent duplicate registrations for the same event
TechelonsRegistrationSchema.index(
  { 
    eventId: 1, 
    'mainParticipant.email': 1 
  }, 
  { unique: true }
);

// Create model if it doesn't exist already
export default mongoose.models.TechelonsRegistration || mongoose.model('TechelonsRegistration', TechelonsRegistrationSchema); 