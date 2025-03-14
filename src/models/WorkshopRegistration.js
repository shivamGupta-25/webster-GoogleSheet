import mongoose from 'mongoose';

const WorkshopRegistrationSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
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
  college: {
    type: String,
    default: 'Shivaji College',
    trim: true,
  },
  year: {
    type: String,
    required: [true, 'Year is required'],
    enum: ['1st Year', '2nd Year', '3rd Year'],
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    unique: true,
    trim: true,
    validate: {
      validator: function(v) {
        return /^[6-9]\d{9}$/.test(v);
      },
      message: props => `${props.value} is not a valid Indian mobile number!`
    }
  },
  query: {
    type: String,
    trim: true,
    default: '',
  },
  registrationType: {
    type: String,
    default: 'Workshop',
  },
  registrationDate: {
    type: Date,
    default: Date.now,
  }
}, { timestamps: true });

// Create model if it doesn't exist already
export default mongoose.models.WorkshopRegistration || mongoose.model('WorkshopRegistration', WorkshopRegistrationSchema); 