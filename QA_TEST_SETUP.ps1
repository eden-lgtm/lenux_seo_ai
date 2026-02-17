# QA Test Script - Tool Testing

# Test 1: analyze_keywords
@"
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "analyze_keywords",
    "arguments": {
      "keywords": ["SEO optimization", "digital marketing"],
      "language": "he",
      "region": "IL"
    }
  }
}
"@ | Out-File test_keywords.json -Encoding UTF8

# Test 2: write_content
@"
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/call",
  "params": {
    "name": "write_content",
    "arguments": {
      "topic": "SEO Best Practices",
      "keywords": ["SEO", "optimization", "ranking"],
      "contentType": "blog",
      "wordCount": 800,
      "tone": "professional"
    }
  }
}
"@ | Out-File test_content.json -Encoding UTF8

# Test 3: optimize_meta_tags
@"
{
  "jsonrpc": "2.0",
  "id": 3,
  "method": "tools/call",
  "params": {
    "name": "optimize_meta_tags",
    "arguments": {
      "title": "Complete SEO Guide 2026",
      "description": "Learn SEO optimization techniques",
      "keywords": ["SEO", "optimization", "guide"],
      "urlSlug": "complete-seo-guide-2026"
    }
  }
}
"@ | Out-File test_meta.json -Encoding UTF8

# Test 4: get_wordpress_posts
@"
{
  "jsonrpc": "2.0",
  "id": 4,
  "method": "tools/call",
  "params": {
    "name": "get_wordpress_posts",
    "arguments": {
      "search": "",
      "limit": 5,
      "status": "publish"
    }
  }
}
"@ | Out-File test_wp_get.json -Encoding UTF8

# Test 5: create_wordpress_post
@"
{
  "jsonrpc": "2.0",
  "id": 5,
  "method": "tools/call",
  "params": {
    "name": "create_wordpress_post",
    "arguments": {
      "title": "Test Post - QA Testing",
      "content": "This is a test post created during QA testing.",
      "excerpt": "Test post",
      "status": "draft",
      "seo_title": "Test SEO Title",
      "seo_description": "Test SEO Description"
    }
  }
}
"@ | Out-File test_wp_create.json -Encoding UTF8

# Test 6: tools/list
@"
{
  "jsonrpc": "2.0",
  "id": 6,
  "method": "tools/list"
}
"@ | Out-File test_tools_list.json -Encoding UTF8

Write-Host "✅ All test files created!" -ForegroundColor Green
Write-Host "Files created:"
Get-ChildItem test_*.json | Select-Object Name
