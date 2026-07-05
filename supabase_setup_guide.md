# Supabase & Prisma Setup Guide

This guide will walk you through creating a Supabase project, getting your database connection credentials, pushing your Prisma schema to your new database, and preparing your site for publication.

## Step 1: Create a Supabase Project

1. Go to [Supabase](https://supabase.com/) and sign up or log in.
2. Click on **"New Project"** and select your organization.
3. Fill in the project details:
   - **Name:** Gandouz (or your preferred project name)
   - **Database Password:** Generate a strong password and **save it somewhere secure**. You will need this for your `.env` files.
   - **Region:** Select a region closest to your primary user base (e.g., Paris or Frankfurt for Europe).
4. Click **"Create new project"**. It will take a couple of minutes for the database to be provisioned.

## Step 2: Get Your Connection Strings

Once your project is ready, you need to get two connection strings for Prisma: a Transaction URL (for pooling) and a Session URL (direct connection).

1. In your Supabase dashboard, go to **Project Settings** (the gear icon on the bottom left).
2. Click on **Database** in the sidebar.
3. Scroll down to the **Connection String** section.
4. Select the **URI** tab. 

You need two distinct URLs:
- **Transaction URL:** Check the "Use connection pooling" checkbox. The port should be `6543`. Make sure the mode is set to `Transaction`. This is your `DATABASE_URL`.
- **Session (Direct) URL:** Uncheck the "Use connection pooling" checkbox. The port should be `5432`. This is your `DIRECT_URL`.

**Important:** Replace `[YOUR-PASSWORD]` in the strings with the database password you created in Step 1.

## Step 3: Update your `.env.local`

Open the `.env.local` file in your project root and update the `DATABASE_URL` and `DIRECT_URL` variables. 

```env
# --- DATABASE (Supabase) ---
# Use the pooled connection string (port 6543, pgbouncer)
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"

# Use the direct connection string (port 5432)
DIRECT_URL="postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"
```

## Step 4: Push Schema to Supabase

Now that your app is connected to your Supabase database, you need to create the tables based on your Prisma schema.

1. Open your terminal in VS Code (or your preferred terminal).
2. Make sure you are in the `web` directory (`cd web`).
3. Run the following command to push your schema:

```bash
npx prisma db push
```

> [!TIP]
> `prisma db push` syncs your Prisma schema with your database without creating formal migration files. This is great for prototyping. When you are in production and need to make careful schema changes, use `npx prisma migrate dev` instead.

3. To verify everything worked, you can explore your database by running:
```bash
npx prisma studio
```
This will open a local web interface where you can see your empty tables.

## Step 5: Publishing Your Website (e.g., Vercel)

Since you are building a Next.js application, Vercel is the easiest place to deploy.

1. **Push your code to GitHub** (or GitLab/Bitbucket).
2. Go to [Vercel](https://vercel.com/) and log in with your GitHub account.
3. Click **"Add New"** -> **"Project"**.
4. Import your Gandouz repository.
5. In the **Environment Variables** section, you MUST copy everything from your `.env.local` file and paste it into Vercel. 
   > [!WARNING]
   > Make sure you include all API keys (Clerk, Cloudinary, Resend, etc.) and your Supabase `DATABASE_URL` and `DIRECT_URL`.
   > Update `NEXT_PUBLIC_APP_URL` to the production URL once Vercel generates it for you.
6. Click **Deploy**.

Vercel will build your Next.js project and provide you with a live URL!
