import { NextRequest, NextResponse } from 'next/server';
import { generateRoadmap } from '@/lib/claude';

export async function POST(request: NextRequest) {
  try {
    const { syllabusText } = await request.json();

    if (!syllabusText || typeof syllabusText !== 'string') {
      return NextResponse.json(
        { error: 'Syllabus text is required' },
        { status: 400 }
      );
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'ANTHROPIC_API_KEY is not configured' },
        { status: 500 }
      );
    }

    const roadmap = await generateRoadmap(syllabusText);

    return NextResponse.json(roadmap);
  } catch (error) {
    console.error('Error generating roadmap:', error);
    return NextResponse.json(
      { error: 'Failed to generate roadmap' },
      { status: 500 }
    );
  }
}

