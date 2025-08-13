import fetch from 'node-fetch';
import OpenAI from 'openai';

interface GPT5ResponseRequest {
  model: string;
  input: string | Array<{
    role: 'user' | 'developer' | 'assistant';
    content: string | Array<{
      type: 'input_text' | 'input_image' | 'input_file';
      text?: string;
      image_url?: string;
      file_id?: string;
      file_url?: string;
    }>;
  }>;
  instructions?: string;
  reasoning?: {
    effort?: 'low' | 'medium' | 'high';
  };
  tools?: Array<{
    type: 'web_search_preview' | 'file_search' | 'function';
    [key: string]: any;
  }>;
  stream?: boolean;
  max_tokens?: number;
  temperature?: number;
  top_p?: number;
}

interface GPT5Response {
  output: Array<{
    id: string;
    type: 'message';
    role: string;
    content: Array<{
      type: 'output_text';
      text: string;
      annotations?: any[];
    }>;
  }>;
  output_text?: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

async function callWithOpenRouter(
  apiKey: string,
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
  options: {
    model?: string;
    max_tokens?: number;
    temperature?: number;
    top_p?: number;
  } = {}
): Promise<{ content: string; usage?: any }> {
  const openai = new OpenAI({
    apiKey: apiKey,
    baseURL: 'https://openrouter.ai/api/v1',
    defaultHeaders: {
      'HTTP-Referer': 'http://localhost:3000',
      'X-Title': 'GPT5 MCP Server',
    },
  });

  console.error('Making OpenRouter API request with model:', options.model || 'gpt-5');

  try {
    const completion = await openai.chat.completions.create({
      model: options.model || 'gpt-5',
      messages,
      max_tokens: options.max_tokens,
      temperature: options.temperature,
      top_p: options.top_p,
    });

    console.error('OpenRouter API response received');

    return {
      content: completion.choices[0]?.message?.content || '',
      usage: completion.usage
    };
  } catch (error) {
    console.error('OpenRouter API error:', error);
    throw error;
  }
}

export async function callGPT5(
  apiKey: string,
  input: string,
  options: {
    model?: string;
    instructions?: string;
    reasoning_effort?: 'low' | 'medium' | 'high';
    max_tokens?: number;
    temperature?: number;
    top_p?: number;
    tools?: Array<{
      type: 'web_search_preview' | 'file_search' | 'function';
      [key: string]: any;
    }>;
    useOpenRouter?: boolean;
    openRouterApiKey?: string;
  } = {}
): Promise<{ content: string; usage?: any }> {
  // If OpenRouter is enabled and key is provided, use OpenRouter
  if (options.useOpenRouter && options.openRouterApiKey) {
    const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      ...(options.instructions ? [{ role: 'system' as const, content: options.instructions }] : []),
      { role: 'user' as const, content: input }
    ];
    
    return callWithOpenRouter(options.openRouterApiKey, messages, {
      model: options.model,
      max_tokens: options.max_tokens,
      temperature: options.temperature,
      top_p: options.top_p
    });
  }

  // Otherwise use OpenAI GPT-5 API
  const requestBody: GPT5ResponseRequest = {
    model: options.model || 'gpt-5',
    input,
    ...(options.instructions && { instructions: options.instructions }),
    ...(options.reasoning_effort && { reasoning: { effort: options.reasoning_effort } }),
    ...(options.tools && { tools: options.tools }),
    stream: false
  };

  console.error('Making GPT-5 API request:', JSON.stringify(requestBody, null, 2));

  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`GPT-5 API error: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const data = await response.json() as GPT5Response;
  console.error('GPT-5 API response:', JSON.stringify(data, null, 2));

  return {
    content: data.output_text || (data.output?.[0]?.content?.[0]?.text) || JSON.stringify(data, null, 2),
    usage: data.usage
  };
}

export async function callGPT5WithMessages(
  apiKey: string,
  messages: Array<{
    role: 'user' | 'developer' | 'assistant';
    content: string | Array<{
      type: 'input_text' | 'input_image' | 'input_file';
      text?: string;
      image_url?: string;
      file_id?: string;
      file_url?: string;
    }>;
  }>,
  options: {
    model?: string;
    instructions?: string;
    reasoning_effort?: 'low' | 'medium' | 'high';
    max_tokens?: number;
    temperature?: number;
    top_p?: number;
    tools?: Array<{
      type: 'web_search_preview' | 'file_search' | 'function';
      [key: string]: any;
    }>;
    useOpenRouter?: boolean;
    openRouterApiKey?: string;
  } = {}
): Promise<{ content: string; usage?: any }> {
  // If OpenRouter is enabled and key is provided, use OpenRouter
  if (options.useOpenRouter && options.openRouterApiKey) {
    // Convert messages to OpenRouter format
    const openRouterMessages = messages.map(msg => {
      let content: string;
      if (typeof msg.content === 'string') {
        content = msg.content;
      } else if (Array.isArray(msg.content)) {
        // Extract text content from structured messages
        content = msg.content
          .filter(item => item.type === 'input_text' && item.text)
          .map(item => item.text)
          .join('\n');
      } else {
        content = '';
      }
      
      // Map roles: developer -> system, keep others as is
      const role = msg.role === 'developer' ? 'system' : msg.role;
      
      return { role, content };
    });
    
    // Add system instructions if provided
    if (options.instructions) {
      openRouterMessages.unshift({ role: 'system', content: options.instructions });
    }
    
    return callWithOpenRouter(options.openRouterApiKey, openRouterMessages as Array<{ role: 'system' | 'user' | 'assistant'; content: string }>, {
      model: options.model,
      max_tokens: options.max_tokens,
      temperature: options.temperature,
      top_p: options.top_p
    });
  }

  // Otherwise use OpenAI GPT-5 API
  const requestBody: GPT5ResponseRequest = {
    model: options.model || 'gpt-5',
    input: messages,
    ...(options.instructions && { instructions: options.instructions }),
    ...(options.reasoning_effort && { reasoning: { effort: options.reasoning_effort } }),
    ...(options.tools && { tools: options.tools }),
    stream: false
  };

  console.error('Making GPT-5 API request with messages:', JSON.stringify(requestBody, null, 2));

  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`GPT-5 API error: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const data = await response.json() as GPT5Response;
  console.error('GPT-5 API response:', JSON.stringify(data, null, 2));

  return {
    content: data.output_text || (data.output?.[0]?.content?.[0]?.text) || JSON.stringify(data, null, 2),
    usage: data.usage
  };
}

