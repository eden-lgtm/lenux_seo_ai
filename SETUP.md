# SEO Publisher Agent - Installation & Usage Guide

## 🎉 Project Successfully Created!

Your **SEO Publisher Agent MCP Server** has been built and compiled successfully. This is a comprehensive Model Context Protocol server for SEO publishing and content optimization.

## ✅ What's Been Created

### Core Files
- ✓ **TypeScript Source Code** (`src/`)
  - Main MCP server implementation
  - SEO analysis tool
  - Content writing tool
  - Meta tag optimization
  - WordPress API client

- ✓ **Compiled JavaScript** (`dist/`) - Ready to run
- ✓ **Configuration Files**
  - `package.json` - Dependencies and scripts
  - `tsconfig.json` - TypeScript configuration
  - `.env.example` - Environment variables template
  - `.vscode/mcp.json` - MCP server configuration

### Documentation
- ✓ `README.md` - Full project documentation
- ✓ Installation & setup instructions
- ✓ Tool descriptions and usage examples
- ✓ Architecture overview

## 🚀 Quick Start

### 1. Setup Environment
```powershell
# Copy and edit the .env file
Copy-Item .env.example .env

# Edit .env with your WordPress credentials
# You'll need:
# - WORDPRESS_SITE_URL: Your WordPress site URL
# - WORDPRESS_USERNAME: WordPress admin username
# - WORDPRESS_APP_PASSWORD: WordPress application password
```

### 2. Run the Server

```powershell
# Set Node.js path
$env:Path = "C:\Program Files\nodejs;$env:Path"

# Run the MCP server
& "C:\Program Files\nodejs\node.exe" dist/server.js
```

### 3. Test the Server

In another terminal, send test requests:

```powershell
# Test keywords analysis
$request = @{
    'jsonrpc' = '2.0'
    'id' = 1
    'method' = 'tools/call'
    'params' = @{
        'name' = 'analyze_keywords'
        'arguments' = @{
            'keywords' = @('your keyword 1', 'your keyword 2')
        }
    }
} | ConvertTo-Json -Depth 10 -Compress

$request | &"C:\Program Files\nodejs\node.exe" dist/server.js
```

## 📋 Available Tools

### 1. **analyze_keywords**
Analyze keywords for SEO potential

**Input:**
- `keywords` (array): Keywords to analyze
- `language` (optional): Language code (default: "he")
- `region` (optional): Region code (default: "IL")

**Returns:**
- Search volume
- Competition level
- Keyword difficulty
- Related keywords
- Seasonal trends
- Recommendations

### 2. **write_content**
Generate SEO-optimized content

**Input:**
- `topic` (string): Main topic
- `keywords` (array): Target keywords
- `contentType` (enum): "blog", "product", "landing-page", or "guide"
- `wordCount` (number): Target word count
- `tone` (string): Writing tone

### 3. **optimize_meta_tags**
Generate optimized meta tags

**Input:**
- `title`: Page title
- `description`: Page description
- `keywords`: Target keywords
- `urlSlug`: URL slug (optional)

### 4-7. **WordPress Tools**
- `get_wordpress_posts` - Retrieve posts
- `create_wordpress_post` - Create new posts
- `update_wordpress_post` - Update posts
- `delete_wordpress_post` - Delete posts

## 🔧 Integration with Claude

### Option 1: Direct CLI Usage
Run the server and send JSON-RPC requests via stdin.

### Option 2: Use mcp.json Configuration
The `.vscode/mcp.json` file contains:
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

### Option 3: MCP Protocol Client
Connect to the server via MCP protocol using any compatible client.

## 📝 Development

### Rebuild TypeScript
```powershell
$env:Path = "C:\Program Files\nodejs;$env:Path"
npm run build
```

### Development Mode (Watch)
```powershell
npm run dev
```

## 🔐 Security Notes

1. **Never commit `.env`** - Always use `.env.example` as template
2. **Use App Passwords** - Create dedicated WordPress app passwords
3. **HTTPS Only** - Use HTTPS for WordPress in production
4. **Limited Permissions** - Create restrictive WordPress user roles

## 🤔 Troubleshooting

### Node.js Not Found
If you get "node is not recognized", use the full path:
```powershell
& "C:\Program Files\nodejs\node.exe" dist/server.js
```

Or add Node.js to PATH:
```powershell
$env:Path = "C:\Program Files\nodejs;$env:Path"
node dist/server.js
```

### WordPress Connection Failed
- Verify credentials in `.env`
- Check if WordPress REST API is enabled
- Check if application password is correct
- Ensure WordPress is accessible from your machine

### Package Installation Failed
```powershell
# Clear npm cache
npm cache clean --force

# Reinstall
npm install
```

## 📚 Project Structure

```
.
├── src/
│   ├── server.ts              # MCP server implementation
│   └── tools/
│       ├── seo-analyzer.ts    # Keyword analysis
│       ├── content-writer.ts  # Content generation
│       ├── meta-optimizer.ts  # Meta tag optimization
│       └── wordpress-client.ts # WordPress integration
├── dist/                      # Compiled JavaScript
├── .vscode/
│   └── mcp.json               # MCP configuration
├── package.json
├── tsconfig.json
├── .env.example
├── README.md
└── this file (SETUP.md)
```

## 🎯 Next Steps

1. **Configure WordPress:**
   - Create WordPress app password
   - Update `.env` with credentials

2. **Test Each Tool:**
   - Start with `analyze_keywords`
   - Then test `write_content`
   - Test `optimize_meta_tags`
   - Connect WordPress tools

3. **Integrate with Claude:**
   - Use the provided `mcp.json` configuration
   - Or set up direct MCP client connection

4. **Extend Functionality:**
   - Add more tools as needed
   - Integrate with external APIs (SEMrush, Ahrefs, etc.)
   - Add LLM integration for content generation

## 📞 Support Resources

- **MCP Documentation:** https://modelcontextprotocol.io/
- **WordPress REST API:** https://developer.wordpress.org/rest-api/
- **Project README:** See `README.md` for full documentation

## ✨ Features Implemented

✅ SEO keyword analysis with competition scoring
✅ Content generation with SEO optimization
✅ Meta tag optimization with best practices
✅ WordPress REST API integration
✅ Yoast SEO metadata support
✅ MCP protocol implementation
✅ Error handling and validation
✅ Environment-based configuration

## 🚀 Advanced Configuration

### Custom Keywords Analysis
You can extend the keyword analysis by connecting real APIs:
- Google Keyword Planner API
- SEMrush API
- Ahrefs API

### AI Content Generation
Connect to LLM APIs for better content:
- OpenAI GPT-4
- Claude API
- Local models via Ollama

### Analytics Integration
Monitor results via:
- Google Search Console API
- Google Analytics 4
- Custom dashboards

---

**Happy SEO Publishing! 🎊**
