# Deploying AI Kinetic to Vercel

Follow these steps to deploy the AI Kinetic project to Vercel.

## Prerequisites

1. Create a Vercel account at [vercel.com](https://vercel.com) if you don't have one
2. Fork or clone the repository to your GitHub account

## Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. Log in to your Vercel account
2. Click "Add New..." > "Project"
3. Import your GitHub repository (ai-kinetic)
4. Configure the project with the following settings:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: npm run build
   - Output Directory: .next
5. Add the following environment variables:
   - `NEXT_PUBLIC_API_URL`: https://ai-kinetic-backend.vercel.app/api
   - `NEXT_PUBLIC_USE_MOCK_DATA`: true
6. Click "Deploy"

### Option 2: Deploy via Vercel CLI

1. Install the Vercel CLI:
   ```
   npm install -g vercel
   ```

2. Log in to Vercel:
   ```
   vercel login
   ```

3. Navigate to your project directory:
   ```
   cd path/to/ai-kinetic
   ```

4. Deploy the project:
   ```
   vercel
   ```

5. Follow the prompts to configure your project
   - Link to existing project? Select "No"
   - Project name: ai-kinetic (or your preferred name)
   - Directory: ./
   - Override settings? Select "Yes"
   - Build Command: npm run build
   - Output Directory: .next
   - Development Command: npm run dev

6. For production deployment:
   ```
   vercel --prod
   ```

## Verifying Deployment

After deployment is complete, Vercel will provide you with a URL to access your deployed application. Visit this URL to verify that your application is working correctly.

## Troubleshooting

If you encounter any issues during deployment, check the following:

1. Ensure all dependencies are correctly listed in package.json
2. Check that your Next.js configuration is correct in next.config.js
3. Verify that your environment variables are set correctly
4. Review the build logs in the Vercel dashboard for any errors

## Continuous Deployment

Vercel automatically sets up continuous deployment from your GitHub repository. Any changes pushed to your main branch will trigger a new deployment.

To disable automatic deployments:
1. Go to your project in the Vercel dashboard
2. Navigate to Settings > Git
3. Under "Ignored Build Step", add a command that will prevent builds on certain conditions
