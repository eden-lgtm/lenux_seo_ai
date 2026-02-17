#!/usr/bin/env node

import readline from "readline";
import { z } from "zod";

// Tool implementations
import { analyzeKeywords } from "./tools/seo-analyzer.js";
import { writeContent } from "./tools/content-writer.js";
import { optimizeMetaTags } from "./tools/meta-optimizer.js";
import {
  getWordPressPosts,
  createWordPressPost,
  updateWordPressPost,
  deleteWordPressPost,
} from "./tools/wordpress-client.js";

// Define available tools
const tools = [
  {
    name: "analyze_keywords",
    description:
      "Analyze keywords for SEO potential, search volume, competition, and trends",
    inputSchema: z
      .object({
        keywords: z
          .array(z.string())
          .describe("List of keywords to analyze"),
        language: z.string().optional().describe("Language code (default: he)"),
        region: z.string().optional().describe("Region code (default: IL)"),
      })
      .strict(),
  },
  {
    name: "write_content",
    description:
      "Generate SEO-optimized content based on keywords and topic",
    inputSchema: z
      .object({
        topic: z.string().describe("The main topic for content"),
        keywords: z
          .array(z.string())
          .describe("Primary keywords to target"),
        contentType: z.enum(["blog", "product", "landing-page", "guide"]),
        wordCount: z
          .number()
          .default(1000)
          .describe("Target word count"),
        tone: z.string().default("professional"),
      })
      .strict(),
  },
  {
    name: "optimize_meta_tags",
    description: "Generate and optimize meta tags (title, description, etc.)",
    inputSchema: z
      .object({
        title: z.string().describe("Current page title"),
        description: z.string().describe("Current page description"),
        keywords: z.array(z.string()).describe("Target keywords"),
        urlSlug: z.string().optional().describe("URL slug for the page"),
      })
      .strict(),
  },
  {
    name: "get_wordpress_posts",
    description: "Fetch posts from connected WordPress site",
    inputSchema: z
      .object({
        search: z.string().optional().describe("Search term"),
        limit: z.number().default(10).describe("Number of posts to fetch"),
        status: z
          .enum(["publish", "draft", "pending", "all"])
          .default("publish"),
      })
      .strict(),
  },
  {
    name: "create_wordpress_post",
    description: "Create a new post on WordPress site",
    inputSchema: z
      .object({
        title: z.string().describe("Post title"),
        content: z.string().describe("Post content"),
        excerpt: z.string().optional().describe("Short excerpt"),
        tags: z.array(z.string()).optional().describe("Tags for the post"),
        categories: z
          .array(z.string())
          .optional()
          .describe("Categories for the post"),
        status: z.enum(["publish", "draft", "pending"]).default("draft"),
        featured_image_url: z
          .string()
          .optional()
          .describe("Featured image URL"),
        seo_title: z.string().optional().describe("SEO title"),
        seo_description: z.string().optional().describe("SEO meta description"),
      })
      .strict(),
  },
  {
    name: "update_wordpress_post",
    description: "Update an existing WordPress post",
    inputSchema: z
      .object({
        post_id: z.number().describe("WordPress post ID"),
        title: z.string().optional().describe("New post title"),
        content: z.string().optional().describe("New post content"),
        status: z
          .enum(["publish", "draft", "pending"])
          .optional()
          .describe("New status"),
        seo_title: z.string().optional().describe("Updated SEO title"),
        seo_description: z
          .string()
          .optional()
          .describe("Updated SEO description"),
      })
      .strict(),
  },
  {
    name: "delete_wordpress_post",
    description: "Delete a WordPress post",
    inputSchema: z
      .object({
        post_id: z.number().describe("WordPress post ID"),
        force: z.boolean().default(false).describe("Force delete (skip trash)"),
      })
      .strict(),
  },
];

// MCP Protocol implementation
interface MCPRequest {
  jsonrpc: string;
  id: string | number;
  method: string;
  params?: any;
}

interface MCPResponse {
  jsonrpc: string;
  id: string | number;
  result?: any;
  error?: {
    code: number;
    message: string;
    data?: any;
  };
}

async function handleRequest(request: MCPRequest): Promise<MCPResponse> {
  const { jsonrpc, id, method, params } = request;

  try {
    if (method === "tools/list") {
      return {
        jsonrpc,
        id,
        result: {
          tools: tools.map((t) => ({
            name: t.name,
            description: t.description,
            inputSchema: {
              type: "object",
              properties: {},
            },
          })),
        },
      };
    } else if (method === "tools/call") {
      const { name, arguments: args } = params;

      let result;
      switch (name) {
        case "analyze_keywords":
          result = await analyzeKeywords(
            args.keywords,
            args.language,
            args.region
          );
          break;
        case "write_content":
          result = await writeContent(
            args.topic,
            args.keywords,
            args.contentType,
            args.wordCount,
            args.tone
          );
          break;
        case "optimize_meta_tags":
          result = await optimizeMetaTags(
            args.title,
            args.description,
            args.keywords,
            args.urlSlug
          );
          break;
        case "get_wordpress_posts":
          result = await getWordPressPosts(
            args.search,
            args.limit,
            args.status
          );
          break;
        case "create_wordpress_post":
          result = await createWordPressPost(
            args.title,
            args.content,
            args.excerpt,
            args.tags,
            args.categories,
            args.status,
            args.featured_image_url,
            args.seo_title,
            args.seo_description
          );
          break;
        case "update_wordpress_post":
          result = await updateWordPressPost(
            args.post_id,
            args.title,
            args.content,
            args.status,
            args.seo_title,
            args.seo_description
          );
          break;
        case "delete_wordpress_post":
          result = await deleteWordPressPost(args.post_id, args.force);
          break;
        default:
          throw new Error(`Unknown tool: ${name}`);
      }

      return {
        jsonrpc,
        id,
        result,
      };
    }

    return {
      jsonrpc,
      id,
      error: {
        code: -32601,
        message: "Method not found",
      },
    };
  } catch (error: any) {
    return {
      jsonrpc,
      id,
      error: {
        code: -32603,
        message: "Internal error",
        data: {
          message: error.message,
        },
      },
    };
  }
}

// Start the server
async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
  });

  console.error("SEO Publisher Agent started");

  for await (const line of rl) {
    try {
      if (line.trim()) {
        const request = JSON.parse(line) as MCPRequest;
        const response = await handleRequest(request);
        console.log(JSON.stringify(response));
      }
    } catch (error: any) {
      console.log(
        JSON.stringify({
          jsonrpc: "2.0",
          id: null,
          error: {
            code: -32700,
            message: "Parse error",
            data: { message: error.message },
          },
        })
      );
    }
  }
}

main();

