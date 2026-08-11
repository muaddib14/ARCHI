import { getToolDefinitions } from '@/lib/tools';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const toolDefinitions = getToolDefinitions();

    return NextResponse.json({
      tools: toolDefinitions.map(tool => ({
        name: tool.name,
        description: tool.description,
        input_schema: tool.input_schema,
      })),
    });
  } catch (error) {
    console.error('Error fetching tools:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tools' },
      { status: 500 }
    );
  }
}
