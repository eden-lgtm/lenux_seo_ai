## 🚀 Deployment to Railway.app

Railway היא הדרך הקלה ביותר להעלות את ה-MCP server לפרודקשן.

### ✅ Prerequisites
- GitHub account (Railway משתלב ישירות)
- Railway account (התחבר עם GitHub)
- WordPress credentials (סיסמה ואפליקציה)

### 📋 Step-by-Step Deployment

#### 1. **Initialize Git Repository** (אם עדיין לא קיים)

```powershell
cd "c:\Users\eden\OneDrive\שולחן העבודה\SEO\lenux SEO publisher agent"

# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: SEO Publisher Agent MCP Server"

# Add remote (אחרי שתוך repos בGitHub)
git remote add origin https://github.com/YOUR_USERNAME/seo-publisher-agent-mcp.git

# Push to main branch
git branch -M main
git push -u origin main
```

#### 2. **Create GitHub Repository**

1. Go to https://github.com/new
2. Name it `seo-publisher-agent-mcp`
3. Make it **Public** (for Railway to access)
4. Click "Create repository"
5. Copy the commands and run them in your terminal

#### 3. **Connect to Railway**

1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose your `seo-publisher-agent-mcp` repository
6. Railway will auto-detect Node.js project ✨

#### 4. **Configure Environment Variables**

In Railway Dashboard:
- Click on your project
- Go to "Variables" tab
- Add these environment variables:

```
WORDPRESS_SITE_URL=https://your-wordpress-site.com
WORDPRESS_USERNAME=your_admin_username
WORDPRESS_APP_PASSWORD=xxxx xxxx xxxx xxxx xxxx xxxx
NODE_ENV=production
```

💡 **To get WordPress App Password:**
1. WordPress Admin → Users → Your Profile
2. Scroll to "Application Passwords"
3. Create new app password
4. Copy and paste as `WORDPRESS_APP_PASSWORD`

#### 5. **Deploy!**

Railway automatically deploys when you push to GitHub:

```powershell
# Make changes locally
# Commit and push
git add .
git commit -m "Your message"
git push

# Railway automatically deploys! 🚀
```

#### 6. **Get Your URL**

After deployment:
1. Go to Railway Dashboard
2. Click your project
3. Find "Domains" section
4. Copy your Railway URL
   - Example: `https://seo-publisher-agent-XXXX.railway.app`

---

## 📡 Testing Production Server

After deployment, test with:

```powershell
$railwayUrl = "https://seo-publisher-agent-XXXX.railway.app"

# Test keywords analysis
$request = @{
    'jsonrpc' = '2.0'
    'id' = 1
    'method' = 'tools/call'
    'params' = @{
        'name' = 'analyze_keywords'
        'arguments' = @{
            'keywords' = @('עסקי קטנים', 'שיווק דיגיטלי')
        }
    }
} | ConvertTo-Json -Depth 10 -Compress

# Send request
$result = Invoke-WebRequest -Uri "$railwayUrl/api" -Method POST -Body $request -ContentType "application/json"
$result.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
```

---

## 🔄 CI/CD Workflow

Railway automatically:
1. **Builds** your project (`npm install` + `npm run build`)
2. **Tests** runs (if configured)
3. **Deploys** to production
4. **Monitors** logs and errors

---

## 📊 Monitoring & Logs

### View Logs in Railway Dashboard:
1. Go to your project
2. Click "Logs" tab
3. See real-time server logs

### Check Deployment Status:
1. Click "Deployments" tab
2. See deployment history
3. Rollback if needed

---

## 🔒 Production Checklist

- [x] Environment variables configured
- [x] HTTPS enabled (Railway auto)
- [x] Error logging enabled
- [x] Database ready (if needed)
- [x] Backups configured (set in Railway)
- [ ] Monitor logs regularly
- [ ] Set up alerts (Railway Pro feature)

---

## 💰 Railway Pricing

**Free tier includes:**
- 500 hours/month (always on)
- $5 credit/month
- Perfect for hobby projects

**For production scaling:**
- Pay-as-you-go after free tier
- Typically $5-20/month for small projects

---

## 🆘 Troubleshooting

### Build fails with "Module not found"
→ Check `tsconfig.json` and `package.json`
→ Ensure all imports use `.js` extension (ES modules)

### Server crashes after deploy
→ Check logs in Railway Dashboard
→ Verify environment variables are set
→ Check if WordPress API is accessible

### WordPress connection fails
→ Test: Can Railway reach your WordPress server?
→ Check firewall rules
→ Verify app password is correct
→ Test with Postman/curl first

### How to rollback to previous version
In Railway Dashboard:
1. Go "Deployments"
2. Find previous working deployment
3. Click "Rollback"

---

## 📚 Useful Links

- [Railway.app Documentation](https://docs.railway.app/)
- [Node.js Deployment Guide](https://docs.railway.app/deploy/deployments)
- [Environment Variables](https://docs.railway.app/develop/variables)
- [Custom Domains](https://docs.railway.app/deploy/expose-your-app)

---

## ✨ Next Steps After Deployment

1. **Get your public URL** from Railway Dashboard
2. **Test all endpoints** from production
3. **Configure WordPress** to connect to production server
4. **Set up monitoring** for errors
5. **Add custom domain** (if you have one)
6. **Enable auto-scaling** (if needed)

---

**That's it! Your SEO Publisher Agent is now live! 🎉**

Questions? Check Railway docs or run locally first to test.
