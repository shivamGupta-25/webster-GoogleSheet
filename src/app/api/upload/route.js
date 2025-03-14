import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import crypto from 'crypto';
import { existsSync } from 'fs';

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

    // Get file data and generate a unique filename
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Get file extension
    const originalName = file.name;
    const extension = originalName.split('.').pop().toLowerCase();
    
    // Only allow image files
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    if (!allowedExtensions.includes(extension)) {
      return NextResponse.json(
        { error: 'Only image files are allowed' },
        { status: 400 }
      );
    }
    
    // Generate a unique filename
    const uniqueId = crypto.randomBytes(8).toString('hex');
    const fileName = `${uniqueId}.${extension}`;
    
    // Determine the upload directory based on the section parameter
    const section = formData.get('section') || 'misc';
    let uploadDir;
    
    switch (section) {
      case 'council':
        uploadDir = join(process.cwd(), 'public', 'assets', 'Council');
        break;
      case 'events':
        uploadDir = join(process.cwd(), 'public', 'assets', 'Events');
        break;
      case 'banner':
        uploadDir = join(process.cwd(), 'public', 'assets', 'Banner');
        break;
      default:
        uploadDir = join(process.cwd(), 'public', 'assets', 'uploads');
    }
    
    // Ensure the upload directory exists
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }
    
    // Write the file to the filesystem
    const filePath = join(uploadDir, fileName);
    await writeFile(filePath, buffer);
    
    // Return the public URL to the file
    const publicPath = `/assets/${
      section === 'council' ? 'Council' : 
      section === 'events' ? 'Events' : 
      section === 'banner' ? 'Banner' : 
      'uploads'
    }/${fileName}`;
    
    return NextResponse.json({ 
      success: true,
      url: publicPath
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
} 