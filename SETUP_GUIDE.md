# Gandouz Project Setup and Run Guide

This document provides complete instructions for a technician to set up, run, and deploy the Gandouz Next.js application.

## Prerequisites

Before starting, ensure you have the following installed on your machine:
- **Node.js** (v18.17 or higher recommended)
- **npm** (comes with Node.js)
- **Git**
- A code editor like **VS Code**

## 1. Initial Setup

### Navigate to Project
Ensure you are in the `web` directory of the project:
```bash
cd path/to/gandouz/web
```

### Install Dependencies
Install all required Node packages. This will read the `package.json` file and install libraries like Next.js, React, Prisma, Clerk, etc.
```bash
npm install
```

## 2. Environment Variables Configuration

The project requires several external services to function properly. You must create a `.env.local` file in the `web` directory. 

1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```
2. Open `.env.local` and fill in the required keys:

- **Supabase (Database)**: **First, ensure the project is initialized on Supabase.** Refer to the included `supabase_setup_guide.md` for detailed instructions on obtaining the connection strings. **Important**: Ensure passwords are URL-encoded if they contain special characters.
- **Clerk (Authentication)**: Obtain keys from the Clerk Dashboard.
- **Cloudinary (Image Storage)**: Obtain the Cloud Name, API Key, and API Secret from Cloudinary.
- **Resend (Email)**: Obtain the API key from Resend.

## 3. Database Setup (Prisma & Supabase)

The project uses Prisma as an ORM connected to a PostgreSQL database hosted on Supabase.

1. **Push the Schema**: This command synchronizes your local Prisma schema with the remote Supabase database and creates the necessary tables.
   ```bash
   npx prisma db push
   ```
   > **Note**: If you encounter connection issues (especially related to IPv6), ensure you are using the correct IPv4 pooler URLs (e.g., `aws-0-eu-central-1.pooler.supabase.com`) as noted in `project_status.md`. Update both `DATABASE_URL` and `DIRECT_URL` in your `.env.local` accordingly.

2. **Seed the Database (Optional)**: If you need initial mock data to test the UI, run the seed script:
   ```bash
   node seed_mock_db.js
   ```

3. **Explore the Database**: You can view the tables visually using Prisma Studio:
   ```bash
   npx prisma studio
   ```

## 4. Running the Application Locally

Once dependencies are installed and the database is connected, start the development server:
```bash
npm run dev
```
Open your browser and navigate to [http://localhost:3000](http://localhost:3000). The app will automatically reload when you save changes to the code.

## 5. Deployment (Vercel)

The easiest way to deploy this Next.js application is via Vercel.

1. Push your latest code changes to the GitHub repository: `https://github.com/Essiamah989/gandouz`
2. Log into [Vercel](https://vercel.com/) and create a **New Project**.
3. Import the `gandouz` repository. Ensure the Framework Preset is set to "Next.js" and the Root Directory is set to `web`.
4. **Environment Variables**: Copy *all* variables from your `.env.local` file into Vercel's Environment Variables section before hitting deploy.
5. **Set App URL**: Update `NEXT_PUBLIC_APP_URL` to match your new Vercel domain once it is generated.
6. Click **Deploy**.

## 6. Troubleshooting & Current Status

- **Database Connection Fails on Local**: Ensure your local network supports IPv6 or switch to the Supabase pooler URL which operates on IPv4. 
- **Missing Translations**: The application has been fully translated to French. If any English strings remain, check the `src/dictionaries` folder.
- **Role Management**: The app uses different logic for general users vs. admin roles (e.g., "Close App" vs. "Sign Out"). Validate these flows after deployment.
