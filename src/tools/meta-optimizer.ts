/**
 * Meta Tags Optimizer Tool
 * Generates and optimizes SEO meta tags
 */

interface OptimizedMetaTags {
  title: string;
  titleLength: number;
  metaDescription: string;
  descriptionLength: number;
  keywords: string;
  openGraphTags: {
    og_title: string;
    og_description: string;
    og_type: string;
    og_url: string;
  };
  twitterTags: {
    twitter_card: string;
    twitter_title: string;
    twitter_description: string;
  };
  canonicalUrl: string;
  structuredData: {
    "@context": string;
    "@type": string;
    "name": string;
    "description": string;
  };
  recommendations: string[];
}

export async function optimizeMetaTags(
  title: string,
  description: string,
  keywords: string[],
  urlSlug?: string
): Promise<OptimizedMetaTags> {
  const optimizedTitle = optimizeTitle(title, keywords);
  const optimizedDescription = optimizeDescription(description, keywords);

  return {
    title: optimizedTitle,
    titleLength: optimizedTitle.length,
    metaDescription: optimizedDescription,
    descriptionLength: optimizedDescription.length,
    keywords: keywords.slice(0, 5).join(", "),
    openGraphTags: {
      og_title: optimizedTitle,
      og_description: optimizedDescription,
      og_type: "article",
      og_url: `https://example.com/${urlSlug || "page"}`,
    },
    twitterTags: {
      twitter_card: "summary_large_image",
      twitter_title: optimizedTitle,
      twitter_description: optimizedDescription,
    },
    canonicalUrl: `https://example.com/${urlSlug || "page"}`,
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Article",
      "name": optimizedTitle,
      "description": optimizedDescription,
    },
    recommendations: generateMetaRecommendations(
      optimizedTitle,
      optimizedDescription,
      keywords
    ),
  };
}

function optimizeTitle(title: string, keywords: string[]): string {
  let optimized = title;

  // Ensure title includes primary keyword if not already present
  if (
    !optimized.toLowerCase().includes(keywords[0].toLowerCase()) &&
    optimized.length < 55
  ) {
    optimized = `${optimized} - ${keywords[0]}`;
  }

  // Keep title between 50-60 characters for optimal display in search results
  if (optimized.length > 60) {
    optimized = optimized.substring(0, 57) + "...";
  }

  if (optimized.length < 30) {
    optimized = optimized + " | " + keywords[0];
  }

  return optimized;
}

function optimizeDescription(description: string, keywords: string[]): string {
  let optimized = description;

  // Include primary keyword if not present
  if (!optimized.toLowerCase().includes(keywords[0].toLowerCase())) {
    optimized = `${optimized} Learn more about ${keywords[0]}.`;
  }

  // Keep between 150-160 characters for optimal display
  if (optimized.length > 160) {
    optimized = optimized.substring(0, 157) + "...";
  } else if (optimized.length < 120) {
    optimized =
      optimized + ` Discover tips and strategies for ${keywords[1] || keywords[0]}.`;
  }

  return optimized;
}

function generateMetaRecommendations(
  title: string,
  description: string,
  keywords: string[]
): string[] {
  const recommendations: string[] = [];

  // Title recommendations
  if (title.length < 30) {
    recommendations.push(
      "Title is too short (< 30 chars) - expand to include more context"
    );
  } else if (title.length > 60) {
    recommendations.push(
      "Title may be truncated in search results - keep under 60 characters"
    );
  } else {
    recommendations.push("✓ Title length is optimal (30-60 characters)");
  }

  // Description recommendations
  if (description.length < 120) {
    recommendations.push(
      "Description is too short - expand to at least 120 characters"
    );
  } else if (description.length > 160) {
    recommendations.push(
      "Description may be truncated - keep under 160 characters"
    );
  } else {
    recommendations.push(
      "✓ Description length is optimal (120-160 characters)"
    );
  }

  // Keyword recommendations
  if (!title.toLowerCase().includes(keywords[0].toLowerCase())) {
    recommendations.push(
      `Include primary keyword "${keywords[0]}" in the title`
    );
  } else {
    recommendations.push(`✓ Primary keyword "${keywords[0]}" found in title`);
  }

  if (!description.toLowerCase().includes(keywords[0].toLowerCase())) {
    recommendations.push(
      `Include primary keyword "${keywords[0]}" in meta description`
    );
  } else {
    recommendations.push(
      `✓ Primary keyword "${keywords[0]}" found in description`
    );
  }

  // Additional suggestions
  recommendations.push(
    "Add structured data markup for rich snippets in search results"
  );
  recommendations.push(
    "Set up Open Graph tags for better social media sharing"
  );
  recommendations.push("Configure URL slug to be descriptive and keyword-rich");

  return recommendations;
}
