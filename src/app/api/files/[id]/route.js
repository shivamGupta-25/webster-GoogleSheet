import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import mongoose from 'mongoose';
import FileUpload from '@/models/FileUpload';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid file ID' },
        { status: 400 }
      );
    }
    
    // Connect to database
    await connectToDatabase();
    
    // Find the file by ID
    const file = await FileUpload.findById(id);
    
    if (!file) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }
    
    // Create a response with the file data
    const response = new NextResponse(file.data);
    
    // Set appropriate headers
    response.headers.set('Content-Type', file.contentType || 'application/octet-stream');
    response.headers.set('Content-Disposition', `inline; filename="${file.originalName}"`);
    response.headers.set('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
    
    return response;
  } catch (error) {
    console.error('Error serving file:', error);
    return NextResponse.json(
      { error: 'Failed to serve file' },
      { status: 500 }
    );
  }
} 