# SEO Publisher Agent - MCP Server

A comprehensive Model Context Protocol (MCP) server for SEO publishing and content optimization. This agent provides AI-powered tools for keyword analysis, content generation, meta tag optimization, and WordPress integration.

## Features

✨ **SEO Analysis**
- Keyword research and competition analysis
- Search volume trends and seasonal patterns
- Keyword difficulty scoring
- Related keyword suggestions

📝 **Content Generation**
- AI-powered SEO-optimized content creation
- Multiple content types (blog, product, landing page, guide)
- Automatic keyword optimization
- Readability and SEO scoring
- Content improvement suggestions

🏷️ **Meta Tag Optimization**
- Title and meta description generation
- Open Graph tag optimization
- Twitter card optimization
- Structured data (Schema.org) generation
- Canonical URL management

📱 **WordPress Integration**
- Create, read, update, and delete posts
- Category and tag management
- Featured image management
- SEO plugin support (Yoast SEO)
- Draft and publish workflow support

## Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- WordPress site with REST API enabled
- WordPress application password (for authentication)

### Setup

1. **Clone or download the project**
```bash
cd seo-publisher-agent-mcp
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` with your WordPress credentials:
```env
WORDPRESS_SITE_URL=https://your-wordpress-site.com
WORDPRESS_USERNAME=your_username
WORDPRESS_APP_PASSWORD=your_app_password
```

### Getting WordPress App Password

1. Go to WordPress Admin → Users → Your Profile
2. Scroll to "Application Passwords"
3. Create a new application password
4. Copy and paste into `.env`

## Build & Development

### Build the project
```bash
npm run build
```

### Development mode (watch)
```bash
npm run dev
```

### Run the server
```bash
npm start
```

## MCP Tools

### analyze_keywords
Analyze keywords for SEO potential and competition levels.

**Input:**
- `keywords` (array): Keywords to analyze
- `language` (optional): Language code, default "he"
- `region` (optional): Region code, default "IL"

**Output:**
- Search volume data
- Competition level
- Related keywords
- Seasonal trends
- Recommendations

### write_content
Generate SEO-optimized content.

**Input:**
- `topic` (string): Main topic
- `keywords` (array): Keywords to target
- `contentType` (enum): "blog", "product", "landing-page", or "guide"
- `wordCount` (number): Target word count (default: 1000)
- `tone` (string): Writing tone (default: "professional")

**Output:**
- Generated content
- Keyword density analysis
- Readability score
- SEO score
- Improvement suggestions

### optimize_meta_tags
Generate optimized meta tags for SEO.

**Input:**
- `title` (string): Current title
- `description` (string): Current description
- `keywords` (array): Target keywords
- `urlSlug` (optional): URL slug

**Output:**
- Optimized title and description
- Open Graph tags
- Twitter tags
- Structured data
- Recommendations

### get_wordpress_posts
Fetch posts from WordPress site.

**Input:**
- `search` (optional): Search term
- `limit` (number): Posts to retrieve (default: 10)
- `status` (enum): "publish", "draft", "pending", or "all"

### create_wordpress_post
Create a new WordPress post.

**Input:**
- `title` (string): Post title
- `content` (string): Post content
- `excerpt` (optional): Short excerpt
- `tags` (optional): Tag names
- `categories` (optional): Category names
- `status` (enum): "publish", "draft", or "pending"
- `featured_image_url` (optional): Image URL
- `seo_title` (optional): SEO title
- `seo_description` (optional): SEO description

### update_wordpress_post
Update an existing post.

**Input:**
- `post_id` (number): WordPress post ID
- `title` (optional): New title
- `content` (optional): New content
- `status` (optional): New status
- `seo_title` (optional): Updated SEO title
- `seo_description` (optional): Updated SEO description

### delete_wordpress_post
Delete a WordPress post.

**Input:**
- `post_id` (number): Post ID to delete
- `force` (boolean): Skip trash (default: false)

## Configuration for Claude

Use the `mcp.json` file in `.vscode/` to configure this MCP server with Claude:

```json
{
  "servers": {
    "seo-publisher-agent": {
      "type": "stdio",
      "command": "node",
      "args": ["dist/server.js"]
    }
  }
}
```

## Project Structure

```
.
├── src/
│   ├── server.ts                 # Main MCP server
│   ├── tools/
│   │   ├── seo-analyzer.ts      # Keyword analysis
│   │   ├── content-writer.ts    # Content generation
│   │   ├── meta-optimizer.ts    # Meta tag optimization
│   │   └── wordpress-client.ts  # WordPress API client
│   └── config/
│       └── env.ts               # Environment configuration
├── dist/                         # Compiled JavaScript
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

## Security Considerations

1. **Never commit `.env` file** - Always use `.env.example` as template
2. **Use application passwords** - Generate dedicated WordPress app passwords
3. **HTTPS only** - Use HTTPS for WordPress site in production
4. **Limit permissions** - Create WordPress users with minimal required permissions
5. **Rate limiting** - Implement rate limiting for API calls in production

## Roadmap

- [ ] Integration with Google Search Console API
- [ ] Integration with SEMrush/Ahrefs APIs
- [ ] Advanced AI content generation (OpenAI/Claude integration)
- [ ] Backlink analysis
- [ ] Competitor analysis
- [ ] Automated content scheduling
- [ ] Multi-language support
- [ ] Analytics dashboard
- [ ] Performance monitoring

## Troubleshooting

### WordPress Connection Issues
```
Error: 401 Unauthorized
```
- Verify WordPress credentials in `.env`
- Check if REST API is enabled
- Ensure application password is correct

### Content Generation Errors
```
Error: Rate limited
```
- Reduce number of requests
- Implement exponential backoff
- Check API quota

## Development

### Adding New Tools

1. Create a new file in `src/tools/`
2. Implement your tool function
3. Add to server.ts tools array
4. Add request handler in server.ts

Example:
```typescript
// src/tools/my-tool.ts
export async function myTool(param1: string): Promise<any> {
  // Implementation
  return result;
}
```

## License

MIT

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review the tool documentation
3. Check MCP documentation at https://modelcontextprotocol.io/

## Resources

- [MCP Documentation](https://modelcontextprotocol.io/)
- [WordPress REST API](https://developer.wordpress.org/rest-api/)
- [WordPress Application Passwords](https://make.wordpress.org/core/2020/12/15/application-passwords-integration-guide/)
