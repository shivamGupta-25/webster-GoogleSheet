import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import FileUpload from '@/models/FileUpload';

export async function GET(request) {
  try {
    await connectToDatabase();
    
    // Get total count of files
    const totalCount = await FileUpload.countDocuments();
    
    // Get count by section
    const sectionCounts = await FileUpload.aggregate([
      { $group: { _id: { $ifNull: ["$section", "misc"] }, count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    // Get file types distribution
    const typeCounts = await FileUpload.aggregate([
      { 
        $group: { 
          _id: {
            $cond: {
              if: { $isArray: { $split: ["$contentType", "/"] } },
              then: { $arrayElemAt: [{ $split: ["$contentType", "/"] }, 1] },
              else: "$contentType"
            }
          }, 
          count: { $sum: 1 } 
        }
      },
      { $sort: { count: -1 } }
    ]);
    
    // Get upload statistics by month
    const uploadStats = await FileUpload.aggregate([
      { 
        $group: { 
          _id: { 
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          }, 
          count: { $sum: 1 } 
        }
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
      { $limit: 12 }
    ]);
    
    return NextResponse.json({ 
      success: true,
      totalCount,
      sectionCounts,
      typeCounts,
      uploadStats
    });
  } catch (error) {
    console.error('Error getting file stats:', error);
    return NextResponse.json(
      { error: 'Failed to get file statistics' },
      { status: 500 }
    );
  }
} 