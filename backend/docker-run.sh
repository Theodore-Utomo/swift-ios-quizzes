#!/bin/bash

# Docker run script for Quiz App Backend

echo "🐳 Building and running Quiz App Backend..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  Warning: .env file not found!"
    echo "📝 Please create a .env file based on env.example"
    echo "   cp env.example .env"
    echo "   Then edit .env with your Firebase credentials"
    exit 1
fi

# Build the Docker image
echo "🔨 Building Docker image..."
docker build -t quiz-app-backend .

# Run the container
echo "🚀 Starting container..."
docker run -d \
    --name quiz-backend \
    -p 8000:8000 \
    --env-file .env \
    --restart unless-stopped \
    quiz-app-backend

echo "✅ Container started!"
echo "🌐 API available at: http://localhost:8000"
echo "📚 API docs at: http://localhost:8000/docs"
echo ""
echo "📋 Useful commands:"
echo "   docker logs quiz-backend          # View logs"
echo "   docker stop quiz-backend          # Stop container"
echo "   docker start quiz-backend         # Start container"
echo "   docker rm quiz-backend            # Remove container" 