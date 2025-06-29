# 🚀 Deployment Guide - WanderWise

This guide will help you deploy your WanderWise application to GitHub Pages.

## 📋 Prerequisites

- GitHub account
- Git installed on your computer
- Your WanderWise application files

## 🎯 Step-by-Step Deployment

### 1. Create GitHub Repository

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the "+" icon → "New repository"
3. Fill in details:
   - **Repository name**: `wanderwise` (or your preferred name)
   - **Description**: `A modern web application for tracking teacher summer break locations`
   - **Visibility**: Public (required for free GitHub Pages)
   - **Don't** initialize with README (we already have one)
4. Click "Create repository"

### 2. Connect Local Repository to GitHub

After creating the repository, GitHub will show you commands. Use these:

```bash
# Add the remote repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/wanderwise.git

# Push your code to GitHub
git branch -M main
git push -u origin main
```

### 3. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** tab
3. Scroll down to **Pages** section (in the left sidebar)
4. Under **Source**, select **Deploy from a branch**
5. Under **Branch**, select **main** and **/(root)**
6. Click **Save**

### 4. Configure Your Application

Before your app works properly, you need to:

1. **Create `config.js`** from the template:
   ```bash
   cp config-template.js config.js
   ```

2. **Edit `config.js`** with your actual credentials:
   ```javascript
   const CONFIG = {
       // Supabase Configuration
       SUPABASE_URL: 'YOUR_SUPABASE_URL',
       SUPABASE_ANON_KEY: 'YOUR_SUPABASE_ANON_KEY',
       
       // Google Maps Configuration
       GOOGLE_MAPS_API_KEY: 'YOUR_GOOGLE_MAPS_API_KEY',
       
       // App Configuration
       APP_NAME: 'WanderWise',
       // ... other settings
   };
   ```

3. **Update API keys** in your HTML files:
   - Replace `YOUR_SUPABASE_URL` and `YOUR_SUPABASE_ANON_KEY` in both HTML files
   - Replace `YOUR_GOOGLE_MAPS_API_KEY` in both HTML files

### 5. Deploy Configuration

```bash
# Add your config file
git add config.js

# Commit the configuration
git commit -m "Add configuration file"

# Push to GitHub
git push origin main
```

## 🌐 Access Your Application

After deployment, your app will be available at:
```
https://YOUR_USERNAME.github.io/wanderwise/
```

## 🔧 Important Notes

### Security Considerations
- **Never commit sensitive data** like API keys to public repositories
- Use environment variables or secure configuration management for production
- Consider using GitHub Secrets for sensitive data

### API Key Restrictions
- **Google Maps API**: Set up domain restrictions to only allow your GitHub Pages domain
- **Supabase**: Configure Row Level Security (RLS) policies properly

### Custom Domain (Optional)
1. In repository Settings → Pages
2. Under **Custom domain**, enter your domain
3. Add a `CNAME` file to your repository with your domain name
4. Configure DNS settings with your domain provider

## 🐛 Troubleshooting

### Common Issues

1. **Page not loading**: Check if GitHub Pages is enabled and deployed
2. **API errors**: Verify your API keys are correct and have proper permissions
3. **CORS errors**: Ensure your Supabase and Google Maps configurations allow your domain
4. **Images not loading**: Check if asset paths are correct

### Debug Steps

1. Check browser console for errors
2. Verify all files are in the correct locations
3. Test API connections using the test pages
4. Check GitHub Pages deployment status

## 📱 Testing Your Deployment

1. **Form Page**: `https://YOUR_USERNAME.github.io/wanderwise/form.html`
2. **Dashboard**: `https://YOUR_USERNAME.github.io/wanderwise/dashboard.html`
3. **Test Pages**: Use the various test pages to verify functionality

## 🔄 Updating Your Application

To update your deployed application:

```bash
# Make your changes
# Then commit and push
git add .
git commit -m "Update description of changes"
git push origin main
```

GitHub Pages will automatically rebuild and deploy your changes within a few minutes.

## 📞 Support

If you encounter issues:
1. Check the browser console for errors
2. Verify all configuration steps
3. Test with the provided test pages
4. Check GitHub Pages deployment logs

---

**Happy Deploying! 🎉** 