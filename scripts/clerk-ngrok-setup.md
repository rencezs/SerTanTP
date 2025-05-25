# Clerk + ngrok Local Development Setup

This file is **for local development only**. You can safely delete it after setup.

---

## 1. Expose Your Local Server with ngrok

**A. Install ngrok (if you haven't):**
```sh
npm install -g ngrok
```

**B. Start your dev server:**
```sh
npm run dev
```
- Note the port (3000 or 3001).

**C. In a new terminal, run ngrok:**
```sh
./ngrok.exe http 3000
```
- If your app is running on 3001, use `ngrok http 3001`.
- Copy the HTTPS forwarding URL ngrok gives you (e.g., `https://abc123.ngrok.io`).

---

## 2. Set Up Clerk Webhooks

**A. Go to your [Clerk dashboard](https://dashboard.clerk.com/).**  
**B. Find the Webhooks section for your project.**  
**C. Set the webhook URL to:**  
```
https://ser-tan-tp-fullstak.vercel.app/api/inngest
```
- Replace `ser-tan-tp-fullstak.vercel.app` with your actual Vercel URL.

---

## 3. Test the Flow

**A. Log out and log in with Google (or create a new user) in your app.**  
**B. Watch your terminal running `npm run dev` for logs like:**
- `Received user creation event: ...`
- `User created successfully: ...`

**C. Check MongoDB Atlas:**  
- You should see a new user in the `Admen.users` collection.

---

## 4. Clean Up

- When you're done, you can delete this file and the entire `scripts/` folder if you wish.
- Your production code is in `app/` and `config/`—this file is just for local setup help. 