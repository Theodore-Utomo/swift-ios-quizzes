#!/bin/bash

# Docker development script for Quiz App Frontend

echo "🐳 Starting Quiz App Frontend in development mode..."

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose is not installed. Please install it first."
    exit 1
fi

# Stop and remove existing containers
echo "🧹 Cleaning up existing containers..."
docker-compose down

# Build and start the development container
echo "🔨 Building and starting development container..."
docker-compose up --build -d

echo "✅ Development container started!"
echo "🌐 Frontend available at: http://localhost:5173"
echo ""
echo "📋 Useful commands:"
echo "   docker-compose logs -f frontend    # View logs"
echo "   docker-compose down                # Stop container"
echo "   docker-compose up -d               # Start container"
echo "   docker-compose restart frontend    # Restart container"
echo ""
echo "🔄 Hot reload is enabled - changes will be reflected automatically!"