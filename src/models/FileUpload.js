import mongoose from 'mongoose';

// Define the FileUpload schema
const FileUploadSchema = new mongoose.Schema({
  filename: String,
  originalName: String,
  contentType: String,
  section: String,
  data: Buffer,
  createdAt: {
    type: Date,
    default: Date.now,
    expires: '455d' // Automatically delete files after 1 year and 3 months (approximately 455 days)
  }
});

// Create the model if it doesn't exist
const FileUpload = mongoose.models.FileUpload || mongoose.model('FileUpload', FileUploadSchema);

export default FileUpload; 