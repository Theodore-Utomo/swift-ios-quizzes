#!/bin/bash

# Frontend Development Setup Script

echo "🚀 Quiz App Frontend Development Setup"
echo ""

# Function to show menu
show_menu() {
    echo "Choose your development mode:"
    echo "1) 🐳 Docker Development (with hot reload & file sync)"
    echo "2) 🖥️  Local Development Server"
    echo "3) 🛑 Stop all containers"
    echo "4) 📊 View container logs"
    echo "5) ❌ Exit"
    echo ""
}

# Function to start Docker development
start_docker_dev() {
    echo "🐳 Starting Docker development environment..."
    echo "🔧 Building image..."
    docker-compose build
    echo "🚀 Starting container with hot reload..."
    docker-compose up -d
    echo ""
    echo "✅ Development server running at: http://localhost:5173"
    echo "🔄 Hot reload enabled - changes will appear automatically!"
    echo "🌐 API calls will go to: http://localhost:8000"
    echo ""
    echo "📋 Useful commands:"
    echo "   docker-compose logs -f    # View live logs"
    echo "   docker-compose down       # Stop container"
    echo "   docker-compose restart    # Restart container"
}

# Function to start local development
start_local_dev() {
    echo "🖥️  Starting local development server..."
    echo "📁 Make sure you have the .env file with VITE_API_URL=http://localhost:8000/"
    echo ""
    # Check if .env exists
    if [ ! -f ".env" ]; then
        echo "⚠️  Creating .env file..."
        echo "VITE_API_URL=http://localhost:8000/" > .env
        echo "✅ Created .env file with API URL"
    fi
    echo "🚀 Starting development server..."
    npm run dev
}

# Function to stop containers
stop_containers() {
    echo "🛑 Stopping all frontend containers..."
    docker-compose down
    echo "✅ All containers stopped"
}

# Function to view logs
view_logs() {
    echo "📊 Showing container logs (Press Ctrl+C to exit)..."
    docker-compose logs -f
}

# Main menu loop
while true; do
    show_menu
    read -p "Enter your choice (1-5): " choice
    echo ""
    
    case $choice in
        1)
            stop_containers
            start_docker_dev
            break
            ;;
        2)
            stop_containers
            start_local_dev
            break
            ;;
        3)
            stop_containers
            break
            ;;
        4)
            view_logs
            ;;
        5)
            echo "👋 Goodbye!"
            exit 0
            ;;
        *)
            echo "❌ Invalid choice. Please enter 1-5."
            echo ""
            ;;
    esac
done