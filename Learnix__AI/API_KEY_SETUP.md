# 🔑 Groq API Key Setup - Quick Guide

## Step-by-Step Instructions

### 1. Get Your Free API Key

Visit: **[console.groq.com](https://console.groq.com)**

1. Click **"Sign Up"** or **"Login"**
2. Complete the registration (email verification required)
3. Once logged in, go to **"API Keys"** in the left sidebar
4. Click **"Create API Key"**
5. Give it a name (e.g., "Learnix AI")
6. Click **"Create"**
7. **COPY THE KEY** (it starts with `gsk_`)

⚠️ **Important**: Save this key securely. You won't be able to see it again!

---

### 2. Add API Key to Learnix AI

#### Option A: Using VS Code or Text Editor

1. Open the project in VS Code
2. Navigate to: `src/services/groqService.ts`
3. Find line 6:
   ```typescript
   const GROQ_API_KEY = 'gsk_YOUR_GROQ_API_KEY_HERE';
   ```
4. Replace with your actual key:
   ```typescript
   const GROQ_API_KEY = 'gsk_abc123xyz...your-real-key-here';
   ```
5. Save the file (Ctrl+S or Cmd+S)
6. The app will automatically reload

#### Option B: Using Command Line

```bash
# On Mac/Linux
sed -i "s/gsk_YOUR_GROQ_API_KEY_HERE/YOUR_ACTUAL_KEY_HERE/g" src/services/groqService.ts

# On Windows (PowerShell)
(Get-Content src/services/groqService.ts) -replace 'gsk_YOUR_GROQ_API_KEY_HERE', 'YOUR_ACTUAL_KEY_HERE' | Set-Content src/services/groqService.ts
```

---

### 3. Verify It Works

1. Start the dev server (if not running):
   ```bash
   npm run dev
   ```

2. Open browser to `http://localhost:5173`

3. Login to your account

4. Go to **"AI Summary"** page

5. If configured correctly, you'll see:
   - ✅ No yellow warning about API key
   - ✅ Can select files and generate summaries

6. If still showing warning:
   - ⚠️ Check you saved the file
   - ⚠️ Check the API key is correct
   - ⚠️ Refresh the browser (Ctrl+F5)

---

## 🎯 Visual Guide

### Before (Not Configured):
```
⚠️ Groq API Key Not Configured
```

### After (Configured):
```
✅ No warning message
✅ All AI features ready to use
```

---

## 🔍 File Location

```
learnix-ai/
└── src/
    └── services/
        └── groqService.ts  ← EDIT THIS FILE
```

---

## 📝 What to Edit

**Find this line (line 6):**
```typescript
const GROQ_API_KEY = 'gsk_YOUR_GROQ_API_KEY_HERE';
```

**Change to:**
```typescript
const GROQ_API_KEY = 'gsk_AbCdEf123456789XyZ...';  // Your actual key
```

---

## ✅ Checklist

- [ ] Registered at console.groq.com
- [ ] Created API key
- [ ] Copied the key (starts with `gsk_`)
- [ ] Opened `src/services/groqService.ts`
- [ ] Replaced `gsk_YOUR_GROQ_API_KEY_HERE` with your key
- [ ] Saved the file
- [ ] Refreshed browser
- [ ] Tested AI features

---

## 🆓 Groq Free Tier Limits

- **3,000 requests per day**
- **Perfect for:**
  - Development and testing
  - Student projects
  - Personal use
  - Academic demonstrations

**For your final year project, the free tier is more than enough!**

---

## 🔐 Security Notes

### ⚠️ Important Security Tips:

1. **Don't commit to Git:**
   - If using version control, add `.env` to `.gitignore`
   - Never share your API key publicly
   - Don't post screenshots with visible keys

2. **For Production:**
   - Use environment variables
   - Implement backend API proxy
   - Never expose keys in frontend code
   
3. **Current Setup:**
   - ✅ Fine for local development
   - ✅ Good for project demonstration
   - ⚠️ Not recommended for public deployment
   - 💡 For production, use backend (see BACKEND_STRUCTURE.md)

---

## 🐛 Troubleshooting

### Error: "API key not configured"
**Solution:** Make sure you replaced the placeholder text and saved the file.

### Error: "Failed to generate"
**Possible causes:**
1. API key is incorrect → Double-check you copied it correctly
2. No internet connection → Check your network
3. Rate limit exceeded → Wait a few minutes and try again

### Still not working?
1. Clear browser cache (Ctrl+Shift+Delete)
2. Restart dev server (Ctrl+C, then `npm run dev`)
3. Check browser console for errors (F12 → Console)

---

## 💡 Tips

1. **Test immediately** after adding the key
2. **Keep a backup** of your key in a secure location
3. **Regenerate if needed** - you can create new keys anytime
4. **Monitor usage** at console.groq.com

---

## 📊 Expected Behavior

Once configured correctly:

| Feature | Status |
|---------|--------|
| AI Summary | ✅ Working |
| Key Points | ✅ Working |
| Question Generator | ✅ Working |
| Quiz Generator | ✅ Working |
| AI Chatbot | ✅ Working |
| Study Planner | ✅ Working |

---

## 🎓 For Your Project

When demonstrating to faculty:

1. **Already have the key configured** before the demo
2. **Test all features** beforehand
3. **Have a backup plan** (screenshots/video) if internet fails
4. **Explain the API** - mention it's free and powerful
5. **Show the code** - demonstrate AI integration

---

## 🚀 Quick Reference

**API Key Format:** `gsk_` followed by random characters

**Example (fake):** `gsk_AbC123dEf456GhI789jKl012MnO345pQr678StU901vWx234YzA567`

**Length:** Usually 56 characters total

**Source:** https://console.groq.com

**Cost:** FREE (up to 3000 requests/day)

---

**Need more help?** See [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed setup instructions.

**Ready to use?** See [USER_GUIDE.md](USER_GUIDE.md) to learn all features.

---

✨ **You're all set! Happy coding!** 🎓
