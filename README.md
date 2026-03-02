# 🚀 Amstig - Complete Setup Guide

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Git** (optional, for version control)
- A modern web browser (Chrome, Firefox, Safari, Edge)

## 🏗️ Project Setup

### Step 1: Create the Root Directory
```bash
mkdir amstig
cd amstig
```

### Step 2: Setup Backend
```bash
# Create backend directory
mkdir backend
cd backend

# Initialize npm project
npm init -y

# Install dependencies
npm install express cors dotenv vm2 body-parser

# Install development dependencies (optional)
npm install -D nodemon

# Go back to root
cd ..
```

### Step 3: Setup Frontend
```bash
# Create React app
npx create-react-app frontend

# Navigate to frontend
cd frontend

# Install additional dependencies
npm install axios react-router-dom framer-motion lucide-react
npm install @monaco-editor/react react-syntax-highlighter
npm install -D tailwindcss postcss autoprefixer

# Initialize Tailwind CSS
npx tailwindcss init -p

# Go back to root
cd ..
```

## 📁 File Structure Creation

Create all the files as provided in the artifacts above. Here's the complete structure:
**Currently Frontend folder is Opened Up. So during your Project creation, add all the files inside the frontend folder, as it is shown below**
```
amstig/
├── backend/
│   ├── controllers/
│   │   └── codeController.js
│   ├── routes/
│   │   └── codeRoutes.js
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   │   └── index.html (created by create-react-app)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout/
│   │   │   │   ├── Layout.jsx
│   │   │   │   ├── Header.jsx
│   │   │   │   └── Sidebar.jsx
│   │   │   ├── CodeEditor/
│   │   │   │   ├── CodeEditor.jsx
│   │   │   │   └── OutputPanel.jsx
│   │   │   └── Content/
│   │   │       ├── ContentRenderer.jsx
│   │   │       └── TopicContent.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   └── Topic.jsx
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── data/
│   │   │   └── topics.js
│   │   ├── styles/
│   │   │   └── globals.css
│   │   ├── App.jsx
│   │   ├── index.js
│   │   └── reportWebVitals.js
│   ├── package.json
│   └── tailwind.config.js
└── README.md
```

## 🛠️ Configuration Steps

### Backend Configuration

1. **Update package.json scripts** (backend/package.json):
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

### Frontend Configuration

1. **Update package.json** with the proxy setting:
```json
{
  "proxy": "http://localhost:5000"
}
```

2. **Configure Tailwind CSS** (tailwind.config.js) - use the provided configuration

3. **Update src/index.css** with the provided global styles

## 🚦 Running the Application

### Terminal 1 - Backend Server
```bash
cd backend
npm start
# or for development with auto-restart:
npm run dev
```

You should see:
```
🚀 Amstig Backend Server is running on port 5000
📍 Health check: http://localhost:5000/api/health
```

### Terminal 2 - Frontend Development Server
```bash
cd frontend
npm start
```

The React app will open in your browser at `http://localhost:3000`

## 🎯 Testing the Setup

1. **Backend Health Check**: Visit `http://localhost:5000/api/health`
2. **Frontend**: Visit `http://localhost:3000`
3. **Code Execution**: Navigate to any topic and try running the code examples

## 🎨 Key Features Implemented

### ✨ Modern UI/UX
- **Glassmorphism Design**: Beautiful translucent effects
- **Smooth Animations**: Framer Motion powered transitions
- **Responsive Layout**: Mobile-first design approach
- **Dark Theme**: Eye-friendly dark interface
- **Gradient Effects**: Modern color schemes

### 🖥️ Code Editor
- **Monaco Editor**: VS Code-like editing experience
- **Syntax Highlighting**: Beautiful code coloring
- **Real-time Execution**: Run JavaScript code instantly
- **Output Panel**: See results and errors immediately
- **Copy/Download**: Easy code sharing features

### 📚 Learning System
- **Progressive Curriculum**: Step-by-step learning path
- **Interactive Content**: Engage with code examples
- **Navigation**: Easy topic and subtopic browsing
- **Progress Tracking**: Visual progress indicators

### 🚀 Performance Features
- **Fast Navigation**: React Router for smooth transitions
- **Optimized Rendering**: Efficient component updates
- **Lazy Loading**: Components load as needed
- **Responsive Images**: Optimized for all devices

## 🔧 Customization Options

### Adding New Topics
1. Edit `frontend/src/data/topics.js`
2. Add new topic objects with subtopics
3. Include content and code examples

### Styling Modifications
1. Update `frontend/tailwind.config.js` for theme changes
2. Modify `frontend/src/styles/globals.css` for custom styles
3. Edit component-specific styles in JSX files

### Backend Extensions
1. Add new routes in `backend/routes/`
2. Create controllers in `backend/controllers/`
3. Extend code execution for more languages

## 🐛 Troubleshooting

### Common Issues

**Port Already in Use**
```bash
# Kill process on port 5000
npx kill-port 5000
# or use a different port in .env file
```

**Module Not Found**
```bash
# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**CORS Issues**
- Ensure backend is running on port 5000
- Check the proxy setting in frontend package.json

**Monaco Editor Not Loading**
- Clear browser cache
- Check console for JavaScript errors
- Ensure all dependencies are installed

### Performance Optimization

1. **Enable Production Build**:
```bash
cd frontend
npm run build
npx serve -s build
```

2. **Monitor Bundle Size**:
```bash
npm install -g webpack-bundle-analyzer
npm run build
npx webpack-bundle-analyzer build/static/js/*.js
```

## 📈 Deployment Options

### Local Production
```bash
# Frontend
cd frontend
npm run build

# Serve with a static server
npx serve -s build -l 3000

# Backend (production mode)
cd backend
NODE_ENV=production npm start
```

### Docker Deployment (Optional)
Create a `Dockerfile` for containerization:
```dockerfile
# Example Dockerfile for frontend
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npx", "serve", "-s", "build"]
```

## 🎉 What You've Built

Congratulations! You now have a fully functional, modern programming learning platform with:

- 🎨 **Beautiful UI** with glassmorphism effects and smooth animations
- 💻 **Interactive Code Editor** with real-time execution
- 📚 **Structured Learning Content** with progressive curriculum
- 🚀 **Fast Performance** with optimized React components
- 📱 **Responsive Design** that works on all devices
- 🔧 **Extensible Architecture** for easy customization

The platform is ready for learning JavaScript, with the foundation to easily add Python, Java, and other programming languages!

## 🚀 Next Steps

1. **Add More Content**: Expand the topics and lessons
2. **User Authentication**: Add login/signup functionality
3. **Progress Tracking**: Implement user progress storage
4. **More Languages**: Add Python, Java, C++ support
5. **Community Features**: Add forums, discussions, or chat
6. **Mobile App**: Create React Native version

Happy coding and teaching! 🎓✨