import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import connectToDatabase from '@/lib/mongodb';
import TechelonsData from '@/models/TechelonsData';

// Helper function to check if a value is an object
function isObject(item) {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

// Deep merge function to properly handle nested objects and arrays
function deepMerge(target, source) {
  if (!source) return target;
  
  const output = { ...target };
  
  for (const key in source) {
    if (isObject(target[key]) && isObject(source[key])) {
      output[key] = deepMerge(target[key], source[key]);
    } else if (Array.isArray(source[key])) {
      // For arrays, we want to replace the entire array rather than merge
      output[key] = [...source[key]];
    } else {
      output[key] = source[key];
    }
  }
  
  return output;
}

// GET handler to fetch Techelons data
export async function GET() {
  try {
    await connectToDatabase();
    
    // Find the first document (we only have one document for Techelons data)
    let techelonsData = await TechelonsData.findOne({});
    
    // If no data exists yet, return a 404
    if (!techelonsData) {
      return NextResponse.json({ error: 'Techelons data not found' }, { status: 404 });
    }
    
    return NextResponse.json(techelonsData);
  } catch (error) {
    console.error('Error fetching Techelons data:', error);
    return NextResponse.json({ error: 'Failed to fetch Techelons data' }, { status: 500 });
  }
}

// POST handler to update Techelons data
export async function POST(request) {
  try {
    const body = await request.json();
    await connectToDatabase();
    
    // Find the first document or create a new one if it doesn't exist
    let techelonsData = await TechelonsData.findOne({});
    
    if (techelonsData) {
      // Update existing document
      techelonsData = await TechelonsData.findByIdAndUpdate(
        techelonsData._id,
        body,
        { new: true, runValidators: true }
      );
    } else {
      // Create new document
      techelonsData = await TechelonsData.create(body);
    }
    
    return NextResponse.json(techelonsData);
  } catch (error) {
    console.error('Error updating Techelons data:', error);
    return NextResponse.json({ error: 'Failed to update Techelons data' }, { status: 500 });
  }
} 