import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import FileUpload from '@/models/FileUpload';
import SiteContent from '@/models/SiteContent';
import TechelonsData from '@/models/TechelonsData';
import TechelonsRegistration from '@/models/TechelonsRegistration';
import WorkshopRegistration from '@/models/WorkshopRegistration';
import mongoose from 'mongoose';

export async function GET(request) {
  try {
    await connectToDatabase();
    
    // Check if we're looking for a specific file
    const { searchParams } = new URL(request.url);
    const specificFileId = searchParams.get('fileId');
    
    // Get all files or a specific file
    let allFiles;
    if (specificFileId && mongoose.Types.ObjectId.isValid(specificFileId)) {
      allFiles = await FileUpload.find({ _id: specificFileId }, { data: 0 }).lean();
      if (allFiles.length === 0) {
        return NextResponse.json({ 
          success: false,
          error: 'File not found'
        }, { status: 404 });
      }
    } else {
      allFiles = await FileUpload.find({}, { data: 0 }).lean();
    }
    
    // Get all content where files might be referenced
    const siteContent = await SiteContent.findOne().lean();
    const techelonsData = await TechelonsData.findOne().lean();
    const techelonsRegistrations = await TechelonsRegistration.find().lean();
    const workshopRegistrations = await WorkshopRegistration.find().lean();
    
    // Create a map to track file usage
    const fileUsageMap = new Map();
    allFiles.forEach(file => {
      fileUsageMap.set(file._id.toString(), false);
    });
    
    // More reliable reference checking for each specific model
    // Function to check if a file is used in a given object or array
    const checkFieldsForFileIds = (obj, fileUsageMap) => {
      if (!obj) return;
      
      // Recursively check objects and arrays
      if (Array.isArray(obj)) {
        for (const item of obj) {
          checkFieldsForFileIds(item, fileUsageMap);
        }
        return;
      }
      
      if (typeof obj === 'object' && obj !== null) {
        // Check if this object has an ID that matches a file ID
        if (obj._id) {
          const id = obj._id.toString();
          if (fileUsageMap.has(id)) {
            fileUsageMap.set(id, true);
          }
        }
        
        // Fields that are likely to contain file references
        const fileFields = [
          'fileId', 'file', 'documentId', 'imageId', 'image', 'photo', 
          'attachment', 'logo', 'logoImage', 'bannerImage', 'document',
          'collegeId', 'idProof', 'profilePicture', 'avatar'
        ];
        
        // Check each field in the object
        for (const [key, value] of Object.entries(obj)) {
          // If it's a field likely to contain file references
          if (fileFields.includes(key) && typeof value === 'string') {
            // Check if the value is a file ID
            if (fileUsageMap.has(value)) {
              fileUsageMap.set(value, true);
              continue;
            }
            
            // Check if the value contains a file ID (e.g., /api/files/123456)
            const idMatch = value.match(/\/files\/([a-f0-9]+)/);
            if (idMatch && idMatch[1] && fileUsageMap.has(idMatch[1])) {
              fileUsageMap.set(idMatch[1], true);
              continue;
            }
          }
          
          // Recursively check nested objects and arrays
          checkFieldsForFileIds(value, fileUsageMap);
        }
      }
    };
    
    // Check SiteContent model
    checkFieldsForFileIds(siteContent, fileUsageMap);
    
    // Check TechelonsData model
    checkFieldsForFileIds(techelonsData, fileUsageMap);
    
    // Check all TechelonsRegistration documents
    for (const registration of techelonsRegistrations) {
      checkFieldsForFileIds(registration, fileUsageMap);
    }
    
    // Check all WorkshopRegistration documents
    for (const registration of workshopRegistrations) {
      checkFieldsForFileIds(registration, fileUsageMap);
    }
    
    // Also do a fallback string search for any IDs we might have missed
    const contentSources = [
      siteContent,
      techelonsData,
      ...techelonsRegistrations,
      ...workshopRegistrations
    ];
    
    for (const source of contentSources) {
      if (!source) continue;
      
      // Convert to string to search, but handle JSON.stringify circular references
      let contentString;
      try {
        contentString = JSON.stringify(source);
      } catch (error) {
        console.error("Error stringifying content:", error);
        contentString = '';
      }
      
      // Check each file ID against the content string
      for (const [fileId, used] of fileUsageMap.entries()) {
        // Skip if already marked as used
        if (used) continue;
        
        // Use regex pattern to find exact file ID matches
        const pattern = new RegExp(`["']${fileId}["']|${fileId}`, 'g');
        if (pattern.test(contentString)) {
          fileUsageMap.set(fileId, true);
        }
      }
    }
    
    // Filter out unused files
    const unusedFiles = allFiles.filter(file => {
      return !fileUsageMap.get(file._id.toString());
    });
    
    // If looking for a specific file, provide detailed usage info
    if (specificFileId) {
      const fileInfo = allFiles[0];
      const isUsed = fileUsageMap.get(specificFileId);
      
      return NextResponse.json({
        success: true,
        file: {
          _id: fileInfo._id,
          filename: fileInfo.filename,
          originalName: fileInfo.originalName,
          contentType: fileInfo.contentType,
          section: fileInfo.section,
          createdAt: fileInfo.createdAt,
          isUsed: isUsed
        }
      });
    }
    
    return NextResponse.json({ 
      success: true,
      files: unusedFiles.map(file => ({
        _id: file._id,
        filename: file.filename,
        originalName: file.originalName,
        contentType: file.contentType,
        section: file.section,
        createdAt: file.createdAt
      }))
    });
  } catch (error) {
    console.error('Error getting unused files:', error);
    return NextResponse.json(
      { error: 'Failed to get unused files' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { fileIds } = await request.json();
    
    if (!fileIds || !Array.isArray(fileIds)) {
      return NextResponse.json(
        { error: 'Invalid file IDs' },
        { status: 400 }
      );
    }
    
    // Validate IDs
    const validFileIds = fileIds.filter(id => mongoose.Types.ObjectId.isValid(id));
    
    if (validFileIds.length === 0) {
      return NextResponse.json(
        { error: 'No valid file IDs provided' },
        { status: 400 }
      );
    }
    
    await connectToDatabase();
    
    // Delete files
    const result = await FileUpload.deleteMany({ _id: { $in: validFileIds } });
    
    return NextResponse.json({ 
      success: true,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Error deleting unused files:', error);
    return NextResponse.json(
      { error: 'Failed to delete unused files' },
      { status: 500 }
    );
  }
} 