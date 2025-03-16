import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import FileUpload from '@/models/FileUpload';
import crypto from 'crypto';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Get file data
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Get file metadata
    const originalName = file.name;
    const contentType = file.type;
    const extension = originalName.split('.').pop().toLowerCase();
    
    // Only allow image files
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'pdf'];
    if (!allowedExtensions.includes(extension)) {
      return NextResponse.json(
        { error: 'Only image and PDF files are allowed' },
        { status: 400 }
      );
    }
    
    // Generate a unique filename
    const uniqueId = crypto.randomBytes(8).toString('hex');
    const fileName = `${uniqueId}.${extension}`;
    
    // Determine the section
    const section = formData.get('section') || 'misc';
    
    // Connect to database
    await connectToDatabase();
    
    // Store the file in MongoDB
    const fileUpload = await FileUpload.create({
      filename: fileName,
      originalName,
      contentType,
      section,
      data: buffer
    });
    
    // Return the file ID as the URL
    const fileId = fileUpload._id.toString();
    
    return NextResponse.json({ 
      success: true,
      url: `/api/files/${fileId}`,
      fileId
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
} 