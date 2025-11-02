#!/bin/bash
# Quick Start Script for GolfSocial

echo "⛳ GolfSocial - Quick Start"
echo "========================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo "✅ npm version: $(npm -v)"
echo ""

# Navigate to project
cd "$(dirname "$0")"

echo "📦 Installing backend dependencies..."
cd backend
npm install > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Backend dependencies installed"
else
    echo "❌ Backend installation failed"
    exit 1
fi

echo ""
echo "🎯 To start the application, run:"
echo ""
echo "Terminal 1 (Backend - Port 4000):"
echo "  cd backend"
echo "  npm start"
echo ""
echo "Terminal 2 (Frontend - Port 3000):"
echo "  cd frontend"
echo "  npx http-server -p 3000"
echo ""
echo "Then open: http://localhost:3000"
echo ""
echo "📚 For more details, see README.md"
echo ""
