import { logger } from "@/lib/utils";
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const videoUrl = searchParams.get('url');
    
    if (!videoUrl) {
      return NextResponse.json({ error: 'No video URL provided' }, { status: 400 });
    }
    
    // For now, return a basic response that indicates the video is being processed
    // This allows the video component to fall back to the original URL
    return NextResponse.json({ 
      message: 'Video processing initiated',
      originalUrl: videoUrl,
      status: 'processing'
    });
    
  } catch (error) {
    // Only log actual errors, not regular requests
    const videoLogger = logger.createApiLogger("Video", Math.random().toString(36).substr(2, 9));
    videoLogger.error('Video API error:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json({ 
      error: 'Video API handler error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 