/**
 * SEO Content Writer Tool
 * Generates SEO-optimized content for various types
 */

interface ContentGenerationResult {
  title: string;
  content: string;
  wordCount: number;
  keywordDensity: Record<string, number>;
  readabilityScore: number;
  seoScore: number;
  suggestions: string[];
}

export async function writeContent(
  topic: string,
  keywords: string[],
  contentType: "blog" | "product" | "landing-page" | "guide",
  wordCount: number = 1000,
  tone: string = "professional"
): Promise<ContentGenerationResult> {
  // In production, this would use OpenAI API or other LLM services
  // For now, returning structured AI-like content

  const content = generateContentByType(
    topic,
    keywords,
    contentType,
    wordCount,
    tone
  );
  const actualWordCount = content.split(/\s+/).length;

  return {
    title: generateTitle(topic, keywords, contentType),
    content,
    wordCount: actualWordCount,
    keywordDensity: calculateKeywordDensity(content, keywords),
    readabilityScore: calculateReadabilityScore(content),
    seoScore: calculateSEOScore(content, keywords),
    suggestions: generateSuggestions(content, keywords),
  };
}

function generateTitle(
  topic: string,
  keywords: string[],
  contentType: string
): string {
  const templates: Record<string, string[]> = {
    blog: [
      `Ultimate Guide to ${topic}: Everything You Need to Know`,
      `${topic}: ${keywords[0]} Tips & Strategies`,
      `How to ${topic}: Complete ${new Date().getFullYear()} Guide`,
    ],
    product: [
      `${topic}: Features, Benefits & Pricing Guide`,
      `Best ${topic} Solutions: Compare & Choose`,
      `${topic} Review: Everything You Need to Know`,
    ],
    "landing-page": [
      `Professional ${topic} Services | Get Started Today`,
      `${topic} Solutions – Trusted by Thousands`,
      `Transform Your ${topic} Experience Now`,
    ],
    guide: [
      `${topic} Guide: Step-by-Step Instructions`,
      `Beginner's Guide to ${topic}`,
      `Complete ${topic} Handbook for ${new Date().getFullYear()}`,
    ],
  };

  const templates_arr = templates[contentType] || templates.blog;
  return templates_arr[Math.floor(Math.random() * templates_arr.length)];
}

function generateContentByType(
  topic: string,
  keywords: string[],
  contentType: string,
  wordCount: number,
  tone: string
): string {
  let content = "";

  const sections = Math.ceil(wordCount / 200);

  // Introduction
  content += `## Introduction\n\nWelcome to our comprehensive guide on ${topic}. This article covers everything you need to know about ${keywords.join(", ")}. Whether you're a beginner or an experienced professional, you'll find valuable insights and actionable strategies to help you succeed.\n\n`;

  // Main sections
  for (let i = 1; i <= sections; i++) {
    content += `## Section ${i}: Key Aspects of ${topic}\n\nWhen discussing ${keywords[Math.floor(Math.random() * keywords.length)]}, it's important to understand the foundational concepts. This section explores the critical elements that make ${topic} successful.\n\n`;
    content += `Key points to consider:\n`;
    content += `- Understanding the basics of ${keywords[0]}\n`;
    content += `- Implementing effective strategies for ${keywords[1] || keywords[0]}\n`;
    content += `- Measuring success with proper metrics\n`;
    content += `- Optimizing performance continuously\n\n`;
  }

  // Conclusion
  content += `## Conclusion\n\n${topic} is an essential aspect of modern business and personal development. By implementing the strategies discussed in this guide and focusing on ${keywords[0]}, you can achieve significant improvements in your results.\n\nTake action today and start applying these principles to see the difference they can make in your success journey.\n`;

  return content;
}

function calculateKeywordDensity(
  content: string,
  keywords: string[]
): Record<string, number> {
  const words = content
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 0);
  const totalWords = words.length;
  const density: Record<string, number> = {};

  keywords.forEach((keyword) => {
    const keywordLower = keyword.toLowerCase();
    const count = words.filter((w) => w.includes(keywordLower)).length;
    density[keyword] = parseFloat(((count / totalWords) * 100).toFixed(2));
  });

  return density;
}

function calculateReadabilityScore(content: string): number {
  // Flesch Reading Ease score (0-100)
  const sentences = content.split(/[.!?]+/).length;
  const words = content.split(/\s+/).length;
  const syllables = estimateSyllables(content);

  const score =
    206.835 -
    1.015 * (words / sentences) -
    84.6 * (syllables / words);

  return Math.max(0, Math.min(100, Math.round(score)));
}

function estimateSyllables(text: string): number {
  const words = text.split(/\s+/);
  let syllableCount = 0;

  words.forEach((word) => {
    const lowerWord = word.toLowerCase();
    // Simple syllable estimation
    const vowels = (lowerWord.match(/[aeiouy]/gi) || []).length;
    const syllables = vowels > 0 ? vowels : 1;
    syllableCount += syllables;
  });

  return syllableCount;
}

function calculateSEOScore(content: string, keywords: string[]): number {
  let score = 60; // Base score

  // Keyword density (optimal 1-3%)
  const wordCount = content.split(/\s+/).length;
  const avgDensity =
    keywords.reduce((sum, keyword) => {
      const count = (
        content.toLowerCase().match(new RegExp(keyword.toLowerCase(), "g")) ||
        []
      ).length;
      return sum + count / wordCount;
    }, 0) / keywords.length;

  if (avgDensity >= 0.01 && avgDensity <= 0.03) {
    score += 15;
  } else if (avgDensity > 0) {
    score += 8;
  }

  // Word count (optimal 300-3000)
  if (wordCount >= 300 && wordCount <= 3000) {
    score += 15;
  }

  // Heading structure
  if (content.includes("##")) {
    score += 10;
  }

  return Math.min(100, score);
}

function generateSuggestions(content: string, keywords: string[]): string[] {
  const suggestions: string[] = [];

  // Check keyword density
  const wordCount = content.split(/\s+/).length;
  const avgDensity =
    keywords.reduce((sum, keyword) => {
      const count = (
        content.toLowerCase().match(new RegExp(keyword.toLowerCase(), "g")) ||
        []
      ).length;
      return sum + count / wordCount;
    }, 0) / keywords.length;

  if (avgDensity < 0.01) {
    suggestions.push(
      "Increase keyword frequency - aim for 1-3% keyword density"
    );
  } else if (avgDensity > 0.03) {
    suggestions.push(
      "Keyword density is too high - avoid keyword stuffing for better user experience"
    );
  }

  if (wordCount < 300) {
    suggestions.push("Content is too short - aim for at least 300 words");
  }

  if (!content.includes("##")) {
    suggestions.push("Add subheadings (##) to improve content structure");
  }

  if (!content.includes("- ")) {
    suggestions.push("Use bullet points to break up content and improve readability");
  }

  suggestions.push("Add internal links to related content");
  suggestions.push("Include a clear call-to-action at the end");

  return suggestions;
}
