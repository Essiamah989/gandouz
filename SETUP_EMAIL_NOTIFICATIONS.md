# 📧 Setup Guide: Order Email Notifications

This guide will walk you through setting up the email credentials required for the order notification feature to work.

We use **Nodemailer**, which connects to an SMTP server (like Gmail, Outlook, or a custom email server) to send the emails securely. 

Follow these steps carefully to configure it.

---

## Step 1: Open Your Environment Variables File

1. Open your code editor (VS Code, etc.).
2. In the `web` folder (where your project is located), look for a file named `.env` or `.env.local` in the root directory. 
   *(If you don't have one, create a new file and name it exactly `.env`)*.

---

## Step 2: Add the Configuration Variables

Copy and paste the following block of text into your `.env` file:

```env
# ==========================================
# 📧 EMAIL NOTIFICATION SETTINGS
# ==========================================

# 1. The SMTP server you are using (e.g., smtp.gmail.com)
SMTP_HOST=smtp.gmail.com

# 2. The port used by your SMTP server (465 is standard for secure SSL)
SMTP_PORT=465

# 3. The email address that will SEND the notifications (e.g., your store's Gmail)
SMTP_USER=your-store-email@gmail.com

# 4. The App Password for the sending email account (NOT your normal password)
SMTP_PASS=your-16-character-app-password

# 5. The email address of the CLIENT who should RECEIVE the new order alerts
NOTIFICATION_EMAIL=client-email@example.com
```

---

## Step 3: Get a Google "App Password" (If using Gmail)

If you are using a regular Gmail account or a Google Workspace account to **send** the emails (`SMTP_USER`), Google will block the attempt if you use your normal password. You must generate a special **App Password**.

Here is how to do it in 2 minutes:

1. **Go to Google Account Security**:
   - Open your browser, sign in to the Gmail account you want to send emails from, and navigate to: [https://myaccount.google.com/security](https://myaccount.google.com/security)

2. **Enable 2-Step Verification**:
   - Scroll down to the "How you sign in to Google" section.
   - If "2-Step Verification" is off, click it and follow the prompts to turn it on (it requires a phone number).
   - *Note: App Passwords cannot be created unless 2-Step Verification is ON.*

3. **Create the App Password**:
   - In the search bar at the very top of the Google Account page, search for **"App passwords"**.
   - Click on the "App passwords" result.
   - Google will ask for a name. Type something like: `Next.js Store App`.
   - Click **Create**.

4. **Copy your new Password**:
   - Google will display a popup with a **16-character password** (usually with spaces in a yellow box, like `abcd efgh ijkl mnop`).
   - Copy this entire password.

---

## Step 4: Update the `.env` File with Your Credentials

Now, go back to the `.env` file in your code editor and fill in the real values:

- Change `SMTP_USER` to the Gmail address you just used to create the App Password.
- Change `SMTP_PASS` to the **16-character password** you copied. *(You can remove the spaces, e.g., `abcdefghijklmnop`)*.
- Change `NOTIFICATION_EMAIL` to the email address where your client actually wants to read the new order alerts.

---

## Step 5: Restart Your Development Server

When you change environment variables in a Next.js project, the server needs to be restarted to recognize them.

1. Go to your terminal where your app is running (usually `npm run dev`).
2. Stop the server by pressing `Ctrl + C`.
3. Start it again by typing: `npm run dev`.

---

## 🎉 You're Done!

To test the feature:
1. Go to your website.
2. Add items to the cart and complete the checkout process.
3. Check the inbox of the `NOTIFICATION_EMAIL`. You should see an email with the subject **"New Order Received"** and the full breakdown of the order!
