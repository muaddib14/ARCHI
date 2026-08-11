import { NextResponse } from 'next/server';
import { getToolDefinitions } from '@/lib/tools';

export async function GET() {
  try {
    const tools = getToolDefinitions();
    return NextResponse.json(tools);
  } catch (error) {
    console.error('Error fetching tools:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tools' },
      { status: 500 }
    );
  }
}
