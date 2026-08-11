import { ToolDefinition, ToolResult } from '../types';

export const httpTool = {
  name: 'http_request',
  definition: {
    name: 'http_request',
    description: 'Make HTTP requests to external APIs or services',
    input_schema: {
      type: 'object',
      properties: {
        url: {
          type: 'string',
          description: 'The URL to request',
        },
        method: {
          type: 'string',
          enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
          description: 'HTTP method',
        },
        headers: {
          type: 'object',
          description: 'Optional HTTP headers',
        },
        body: {
          type: 'object',
          description: 'Optional request body (for POST/PUT/PATCH)',
        },
      },
      required: ['url', 'method'],
    },
  } as ToolDefinition,

  handler: async (input: {
    url: string;
    method: string;
    headers?: Record<string, string>;
    body?: Record<string, any>;
  }): Promise<ToolResult> => {
    try {
      const response = await fetch(input.url, {
        method: input.method,
        headers: {
          'Content-Type': 'application/json',
          ...input.headers,
        },
        body: input.body ? JSON.stringify(input.body) : undefined,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: `HTTP ${response.status}: ${response.statusText}`,
          data,
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },
};
