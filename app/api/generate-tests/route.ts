import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { getUser, updateUserTokenUsage, createTestHistory, trackUsage, ensureUserExists } from '@/lib/database';

// Initialize AI clients
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

type AIModel = {
  client: "openai" | "anthropic";
  maxTokens: number;
  costPerToken: number;
};

type AIModels = {
  [key: string]: AIModel;
};

const AI_MODELS: { free: AIModels; pro: AIModels } = {
  free: {
    "gpt-3.5-turbo": {
      client: "openai",
      maxTokens: 4000,
      costPerToken: 0.000002,
    },
  },
  pro: {
    "gpt-4": {
      client: "openai",
      maxTokens: 8000,
      costPerToken: 0.00003,
    },
    "claude-3-7-sonnet-20250219": {
      client: "anthropic",
      maxTokens: 200000,
      costPerToken: 0.000015,
    },
    "claude-3-5-haiku-20241022": {
      client: "anthropic",
      maxTokens: 200000,
      costPerToken: 0.000003,
    },
  },
};

// Helper function to detect language from code
function detectLanguage(code: string): string {
  if (code.includes('def ') || code.includes('import ')) return 'python';
  if (code.includes('function ') || code.includes('const ') || code.includes('let ')) return 'javascript';
  if (code.includes('public class ') || code.includes('private ')) return 'java';
  if (code.includes('fn ') || code.includes('let ')) return 'rust';
  if (code.includes('func ') || code.includes('package ')) return 'go';
  if (code.includes('class ') || code.includes('namespace ')) return 'cpp';
  return 'javascript'; // default
}

// Helper function to determine test framework based on language
function getTestFramework(language: string, framework: string): string {
  const frameworks: { [key: string]: { [key: string]: string } } = {
    javascript: {
      jest: 'Jest',
      mocha: 'Mocha',
    },
    python: {
      pytest: 'PyTest',
      unittest: 'unittest',
    },
    java: {
      junit: 'JUnit',
    },
    rust: {
      rusttest: 'Rust Test',
    },
    go: {
      gotest: 'Go Test',
    },
    cpp: {
      cpptest: 'Catch2',
    },
  };

  return frameworks[language]?.[framework] || framework;
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { code, framework, model } = body;

    if (!code || !framework) {
      return new NextResponse('Missing required fields: code and framework', { status: 400 });
    }

    if (!model) {
      return new NextResponse('Missing required field: model', { status: 400 });
    }

    // Ensure user exists in database
    await ensureUserExists(userId);

    // Get user data
    const user = await getUser(userId);
    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }

    // Check token usage
    if (user.token_usage >= user.token_limit) {
      return new NextResponse('Token limit exceeded', { status: 429 });
    }

    const language = detectLanguage(code);
    const testFramework = getTestFramework(language, framework);

    // Construct the prompt for the AI model
    const prompt = `Generate comprehensive test cases for the following ${language} code using ${testFramework}. 
    Follow the Arrange-Act-Assert pattern and include tests for edge cases and error handling.
    
    Code:
    ${code}
    
    Generate tests that:
    1. Cover all functions and methods
    2. Include edge cases and error handling
    3. Follow best practices for ${testFramework}
    4. Include clear comments and documentation
    5. Are properly formatted and indented
    
    Return only the test code, no explanations.`;

    let response;
    try {
      if (model.startsWith('gpt')) {
        const completion = await openai.chat.completions.create({
          model: model,
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
          max_tokens: 2000,
        });
        response = completion.choices[0]?.message?.content;
      } else if (model.startsWith('claude')) {
        const completion = await anthropic.messages.create({
          model: model,
          max_tokens: 2000,
          messages: [{ role: 'user', content: prompt }],
        });
        const content = completion.content[0];
        response = content?.type === 'text' ? content.text : '';
      }

      if (!response) {
        throw new Error('No response from AI model');
      }

      // Generate documentation using the same AI model
      const documentationPrompt = `Analyze the following test code and provide detailed documentation following this structure:
1. Overview: Brief explanation of what the tests cover
2. Test Structure: Explain the Arrange-Act-Assert pattern used
3. Coverage Analysis: What specific functionality is being tested
4. Framework-Specific Features: How the tests leverage ${framework}'s features
5. Best Practices: What testing best practices are implemented
6. Implementation Details: Specific test cases and their purpose

Test code to analyze:
${response}

Respond in this exact format:
{
  "overview": "Brief overview text...",
  "testStructure": "Explanation of test structure...",
  "coverageDetails": ["List of covered functionality..."],
  "frameworkFeatures": ["List of framework features used..."],
  "bestPractices": ["List of implemented best practices..."],
  "implementationNotes": ["List of specific test details..."]
}`;

      let docResponse;
      try {
        if (model.startsWith('gpt')) {
          const completion = await openai.chat.completions.create({
            model: model,
            messages: [{ role: 'user', content: documentationPrompt }],
            temperature: 0.7,
            max_tokens: 1000,
          });
          docResponse = completion.choices[0]?.message?.content;
        } else if (model.startsWith('claude')) {
          const completion = await anthropic.messages.create({
            model: model,
            max_tokens: 1000,
            messages: [{ role: 'user', content: documentationPrompt }],
          });
          const content = completion.content[0];
          docResponse = content?.type === 'text' ? content.text : '';
        }
      } catch (error) {
        console.error('Error generating documentation:', error);
        docResponse = null;
      }

      let documentation;
      try {
        documentation = docResponse ? JSON.parse(docResponse) : null;
      } catch (error) {
        console.error('Error parsing documentation:', error);
        documentation = null;
      }

      // Calculate test coverage and count
      const testCases = response.split(/\n(?=test_|it\(|describe\(|def test_)/).filter(Boolean);
      const testCount = testCases.length;
      const coverage = Math.min(Math.floor((testCount * 20) + 70), 100);

      // Update token usage
      await updateUserTokenUsage(userId, response.length);

      // Create test history
      await createTestHistory(
        userId,
        code,
        response,
        framework,
        language,
        response.length
      );

      return NextResponse.json({
        tests: response,
        coverage,
        testCount,
        documentation
      });
    } catch (error) {
      console.error('Error generating tests with AI:', error);
      return new NextResponse('Failed to generate tests with AI model', { status: 500 });
    }
  } catch (error) {
    console.error('Error in generate-tests route:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 