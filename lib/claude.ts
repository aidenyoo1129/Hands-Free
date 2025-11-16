import Anthropic from '@anthropic-ai/sdk';
import { SemesterRoadmap } from './types';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export async function generateRoadmap(syllabusText: string): Promise<SemesterRoadmap> {
  const prompt = `You are an academic planning assistant. Analyze the following syllabus and create a comprehensive semester roadmap.

SYLLABUS:
${syllabusText}

Please extract and structure the following information:

1. Course Name
2. All assignments, exams, and readings with their due dates
3. Prioritize tasks based on deadlines and importance
4. Create study guides for major topics/units
5. Generate a timeline with key milestones

Return your response as a JSON object matching this exact structure:
{
  "courseName": "string",
  "tasks": [
    {
      "id": "unique-id",
      "title": "string",
      "description": "string",
      "dueDate": "YYYY-MM-DD",
      "priority": "high" | "medium" | "low",
      "subtasks": [
        {
          "id": "unique-id",
          "title": "string",
          "completed": false
        }
      ],
      "category": "assignment" | "exam" | "reading"
    }
  ],
  "studyGuides": [
    {
      "topic": "string",
      "content": "string (detailed study guide content)",
      "relatedTasks": ["task-id-1", "task-id-2"]
    }
  ],
  "timeline": [
    {
      "id": "unique-id",
      "title": "string",
      "date": "YYYY-MM-DD",
      "type": "assignment" | "exam" | "reading" | "milestone",
      "taskId": "task-id (optional)"
    }
  ]
}

Be thorough and create actionable subtasks for each major assignment or exam. Generate study guides for all major topics covered in the course.`;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const content = message.content[0];
    if (content.type === 'text') {
      // Extract JSON from the response (handle markdown code blocks)
      let jsonText = content.text.trim();
      if (jsonText.startsWith('```json')) {
        jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      } else if (jsonText.startsWith('```')) {
        jsonText = jsonText.replace(/```\n?/g, '');
      }

      const roadmap = JSON.parse(jsonText) as SemesterRoadmap;
      return roadmap;
    }

    throw new Error('Unexpected response format from Claude');
  } catch (error) {
    console.error('Error generating roadmap:', error);
    throw error;
  }
}

