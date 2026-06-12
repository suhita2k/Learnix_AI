# 🚀 Learnix AI - Setup Guide

This guide will help you set up and run Learnix AI on your local machine.

## 📋 Prerequisites

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** - Comes with Node.js
- **Web Browser** - Chrome, Firefox, Edge, or Safari
- **Text Editor** - VS Code recommended

## 🔧 Installation Steps

### Step 1: Install Dependencies

Open terminal in the project directory and run:

```bash
npm install
```

This will install all required packages.

### Step 2: Configure Groq API Key

To use AI features, you need a Groq API key:

1. **Get API Key:**
   - Visit [console.groq.com](https://console.groq.com)
   - Sign up for a free account
   - Navigate to "API Keys" section
   - Click "Create API Key"
   - Copy the generated key (starts with `gsk_`)

2. **Add API Key to Code:**
   - Open `src/services/groqService.ts` in your text editor
   - Find this line:
     ```typescript
     const GROQ_API_KEY = 'gsk_YOUR_GROQ_API_KEY_HERE';
     ```
   - Replace `gsk_YOUR_GROQ_API_KEY_HERE` with your actual API key:
     ```typescript
     const GROQ_API_KEY = 'gsk_abc123xyz...'; // Your real key
     ```
   - Save the file

### Step 3: Run Development Server

Start the development server:

```bash
npm run dev
```

You should see output like:

```
  VITE v7.3.2  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### Step 4: Open in Browser

Open your browser and go to:

```
http://localhost:5173
```

You should see the Learnix AI login page!

## 🎯 First Time Use

### 1. Create an Account

- Click **"Sign Up"** on the login page
- Enter your details:
  - Full Name
  - Email Address
  - Password (min 6 characters)
  - Confirm Password
- Click **"Sign Up"**

### 2. Login

- Enter your email and password
- Click **"Login"**
- You'll be redirected to the dashboard

### 3. Upload Your First Note

- Click **"Upload Notes"** in the sidebar
- Click **"Choose File"**
- Select a PDF or TXT file (max 10MB)
- Wait for upload to complete

### 4. Try AI Features

**Generate Summary:**
- Go to **"AI Summary"**
- Select your uploaded file
- Click **"Generate Summary"**
- Wait 10-15 seconds for AI to process

**Take a Quiz:**
- Go to **"Quiz Generator"**
- Select a file
- Click **"Start Quiz"**
- Answer 10 questions
- See your score!

**Use Chatbot:**
- Go to **"AI Chatbot"**
- Type a question
- Get instant AI responses

## 🏗️ Build for Production

To create a production build:

```bash
npm run build
```

This creates optimized files in the `dist/` folder.

To preview the production build:

```bash
npm run preview
```

## 🐛 Troubleshooting

### Problem: "Cannot find module" errors

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Problem: AI features not working

**Solution:**
1. Check that you've added your Groq API key in `src/services/groqService.ts`
2. Verify the API key is correct (starts with `gsk_`)
3. Check browser console for errors (F12 → Console tab)
4. Ensure you have internet connection

### Problem: Port 5173 already in use

**Solution:**
```bash
# Kill the process using port 5173
# On Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# On Mac/Linux:
lsof -ti:5173 | xargs kill -9

# Or use a different port:
npm run dev -- --port 3000
```

### Problem: Build fails

**Solution:**
```bash
# Clear cache and rebuild
rm -rf dist node_modules
npm install
npm run build
```

### Problem: File upload not working

**Solution:**
- Check file size (must be under 10MB)
- Ensure file type is PDF or TXT
- Try a different file
- Check browser console for errors

## 💻 Development Tips

### Hot Reload

Changes to code automatically refresh the browser. Just save your file!

### Browser DevTools

Press **F12** to open developer tools:
- **Console**: See errors and logs
- **Network**: Monitor API calls
- **Application**: View localStorage data

### Code Editor Setup (VS Code)

Install these extensions:
- ESLint
- Prettier
- TypeScript and JavaScript Language Features
- Tailwind CSS IntelliSense

### Project Structure

```
src/
├── components/    # React components
├── services/      # Business logic
├── types/         # TypeScript types
├── utils/         # Helper functions
└── App.tsx        # Main component
```

## 📦 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## 🔐 Data Storage

Currently, the app uses **localStorage** for:
- User accounts
- Uploaded files (base64 encoded)
- Quiz results
- Session data

**Note**: All data is stored in your browser. Clearing browser data will delete everything.

## 🌐 Accessing from Other Devices

To access from mobile or other devices on same network:

```bash
npm run dev -- --host
```

Then use the Network URL shown (e.g., `http://192.168.1.100:5173`)

## 🎨 Customization

### Change Theme Color

Edit `src/components/` files and replace:
- `bg-blue-900` with your color
- `text-blue-900` with your color

### Change App Name

Edit:
1. `index.html` - Update `<title>` tag
2. `src/components/Navbar.tsx` - Update app name
3. `src/components/Login.tsx` - Update header

## 📚 Learning Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Vite Guide](https://vitejs.dev/guide/)
- [Groq API Docs](https://console.groq.com/docs)

## 🆘 Getting Help

### Common Questions

**Q: Is the Groq API free?**
A: Yes! Groq offers a free tier with generous limits.

**Q: Can I deploy this?**
A: Yes! See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

**Q: Where is data stored?**
A: Currently in browser localStorage. For production, implement backend (see [BACKEND_STRUCTURE.md](BACKEND_STRUCTURE.md))

**Q: Can I use without internet?**
A: No, AI features require internet connection to Groq API.

## ✅ Setup Checklist

- [ ] Node.js installed
- [ ] Project downloaded
- [ ] Dependencies installed (`npm install`)
- [ ] Groq API key obtained
- [ ] API key added to code
- [ ] Dev server running
- [ ] Browser opened to localhost:5173
- [ ] Account created
- [ ] First file uploaded
- [ ] AI features tested

## 🎉 You're All Set!

If you've completed all steps, you should now have Learnix AI running locally. 

Start by:
1. Uploading some study notes
2. Generating a summary
3. Taking a quiz
4. Chatting with the AI

Enjoy studying smarter with Learnix AI! 📚✨

---

**Need help?** Check the troubleshooting section or refer to the [User Guide](USER_GUIDE.md).

**Ready to deploy?** See the [Deployment Guide](DEPLOYMENT_GUIDE.md).
