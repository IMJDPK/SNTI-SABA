#!/bin/bash

# SNTI TEST - Complete Demo Script
# This script demonstrates the full user journey through the SNTI TEST

echo "🧠 SNTI TEST BY SULNAQ x IMJD - Interactive Demo"
echo "================================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# API endpoint
API="http://localhost:3001/api/psychology-chat"

# Function to send message and display response
send_message() {
    local message="$1"
    echo -e "${BLUE}👤 User:${NC} $message"
    echo ""
    
    response=$(curl -s -X POST "$API" \
        -H "Content-Type: application/json" \
        -H "X-Forwarded-For: 192.168.1.$RANDOM" \
        -d "{\"message\": \"$message\"}")
    
    echo -e "${GREEN}🤖 AI:${NC}"
    echo "$response" | jq -r '.response'
    echo ""
    
    # Display session info
    session_id=$(echo "$response" | jq -r '.sessionId')
    user_name=$(echo "$response" | jq -r '.userName')
    state=$(echo "$response" | jq -r '.state')
    progress=$(echo "$response" | jq -r '.progress')
    mbti_type=$(echo "$response" | jq -r '.mbtiType')
    
    echo -e "${YELLOW}📊 Session Info:${NC}"
    echo "  ID: $session_id | Name: $user_name | State: $state"
    if [ "$progress" != "null" ]; then
        echo "  Progress: $progress"
    fi
    if [ "$mbti_type" != "null" ]; then
        echo "  MBTI Type: $mbti_type"
    fi
    echo ""
    echo "---------------------------------------------------"
    echo ""
    
    sleep 2
}

# Demo Flow
echo "Step 1: Initial Greeting"
echo "========================"
send_message "Hello there!"

echo "Step 2: Provide Name"
echo "==================="
send_message "My name is Sarah"

echo "Step 3: Start the Test"
echo "======================"
send_message "START"

echo "Step 4: Answer Questions (showing first 3)"
echo "=========================================="

# Question 1 - E/I
send_message "A"

# Question 2 - E/I
send_message "B"

# Question 3 - E/I
send_message "A"

echo "🎯 Demo Complete!"
echo ""
echo "To complete the full test, continue answering with 'A' or 'B' for all 20 questions."
echo ""
echo "📊 View All Sessions:"
echo "curl http://localhost:3001/api/sessions | jq"
echo ""
echo "🌐 Frontend: http://localhost:5173 (Navigate to Psychology Chat)"
