# CHATIMJD Project Structure Documentation
*Last Updated: June 2, 2025*

## 📋 Project Overview
**CHATIMJD** is a full-stack AI-powered chatbot application with WhatsApp integration, Google Calendar functionality, and product management capabilities. The project uses a hybrid backend (Node.js + Flask) with a React frontend.

## 🏗️ Architecture
- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js (primary) + Flask (Python services)
- **AI Integration**: Google APIs + Calendar
- **Communication**: WhatsApp Web.js
- **Data Storage**: JSON files + CSV exports
- **Deployment**: Shared hosting at imjd.asia

## 📁 Complete File Structure

### 🔧 Root Directory (`/home/imjd/CHATIMJD/`)
```
📄 app.py (44KB)                    - Main Flask application server
📄 app.py.save (2KB)                - Backup copy of Flask app
📄 requirements.txt (235B)          - Python dependencies list
📄 package.json (51B)               - Root Node.js package config
📄 package-lock.json (8KB)          - Node.js dependency lock
📄 .env (353B)                      - Environment variables
📄 .gitignore (2KB)                 - Git ignore patterns
📄 google_calendar_utils.py (3KB)   - Google Calendar API utilities
📄 system_instruction.txt (5KB)     - AI system prompts and instructions
📄 system_instruction_history.json  - Historical AI instruction changes
📄 credentials.json (415B)          - Google API credentials
📄 client_secret_*.json (429B)      - Google OAuth client secret
📄 token.pickle (1KB)               - Google API authentication token
📄 # Code Citations.md (850B)       - Code documentation and citations
```

### 🗄️ Backend Directory (`backend/`)
**Purpose**: Node.js server handling WhatsApp integration, AI processing, and file uploads
```
📄 index.js (19KB)                  - Main Express.js server
📄 ai_handler.js (453B)             - AI request processing logic
📄 service_account.json (2KB)       - Google service account credentials
📄 package.json (234B)              - Backend dependencies
📄 package-lock.json (101KB)        - Backend dependency lock
📄 .env (274B)                      - Backend environment variables
📁 uploads/                         - Product catalog upload storage
   📄 *-wc-product-export-*.csv (5 files, ~52KB each) - WooCommerce exports
   📄 last_catalog_path.txt (95B)   - Path to latest catalog
📁 node_modules/                    - Backend Node.js dependencies
📁 .wwebjs_cache/                   - WhatsApp Web.js session cache
```

### 🎨 Frontend Directory (`frontend/`)
**Purpose**: React-based user interface with modern styling
```
📄 index.html (380B)                - Main HTML entry point
📄 vite.config.js (194B)            - Vite build configuration
📄 tailwind.config.js (185B)        - Tailwind CSS configuration
📄 eslint.config.js (844B)          - ESLint code quality rules
📄 postcss.config.cjs (0B)          - PostCSS configuration
📄 README.md (856B)                 - Frontend documentation
📄 package.json (791B)              - Frontend dependencies
📄 package-lock.json (109KB)        - Frontend dependency lock
📁 public/                          - Static public assets
📁 src/                             - React source code
📁 node_modules/                    - Frontend Node.js dependencies
```

#### Frontend Source (`frontend/src/`)
```
📄 App.jsx (2KB)                    - Main React application component
📄 main.jsx (339B)                  - React application entry point
📄 App.css (606B)                   - Application-specific styles
📄 index.css (3KB)                  - Global styles with Tailwind
📄 ConnectionContext.jsx (2KB)      - WebSocket connection context
📄 useConnection.js (169B)          - Custom React hook for connections
📄 logo.png (111KB)                 - Application logo image
📄 # Code Citations.md (745B)       - Frontend code documentation
```

#### React Pages (`frontend/src/pages/`)
```
📄 AdminPage.jsx (7KB)              - Admin dashboard and controls
📄 Home.jsx (8KB)                   - Main landing page
📄 TrainBot.jsx (6KB)               - AI training interface
📄 Logs.jsx (5KB)                   - System logs viewer
📄 Pricing.jsx (3KB)                - Pricing plans page
📄 ProductUploadPage.jsx (2KB)      - Product catalog upload interface
📄 Contact.jsx (1KB)                - Contact information page
📄 Leads.jsx (1KB)                  - Customer leads display
```

#### Assets (`frontend/src/assets/`)
```
📄 logo.png (111KB)                 - Company logo
📄 saba.png (388KB)                 - Saba brand logo
📄 Saba-02.jpg (412KB)              - Saba brand image 1
📄 Saba-04.jpg (381KB)              - Saba brand image 2
📄 Saba-07.jpg (480KB)              - Saba brand image 3
📄 gemini.png (115KB)               - Gemini AI logo
📄 whatsapp.png (17KB)              - WhatsApp icon
📄 react.svg (4KB)                  - React framework logo
```

### 📊 Client Data Directory (`client_data/`)
**Purpose**: Customer interactions, leads, and conversation logs
```
📄 leads.json (45KB)                - Customer lead database
📄 conversation_default_*.txt (6 files, ~4KB each) - Chat transcripts
📄 conversation_e76de2c8-*.txt (5KB) - Specific user conversation
📁 daily_lead_reports/              - Excel reports for lead analysis
   📄 daily_leads_*_*.xlsx (3 files) - Daily lead generation reports
```

### 🌐 Templates Directory (`templates/`)
**Purpose**: HTML templates for reports and displays
```
📄 leads.html (0B)                  - HTML template for lead display
```

### 🔧 Development & Deployment
```
📁 venv/                            - Python virtual environment
📁 node_modules/                    - Root level Node.js dependencies
📁 __pycache__/                     - Python compiled bytecode cache
📁 .wwebjs_cache/                   - WhatsApp Web.js authentication cache
📁 .git/                            - Git version control
📁 .vscode/                         - VS Code editor settings
```

## 🔗 Key Integrations

### Google Services
- **Calendar API**: Event scheduling and management
- **OAuth 2.0**: User authentication
- **Service Account**: Server-to-server communication

### WhatsApp Integration
- **whatsapp-web.js**: Direct WhatsApp messaging
- **Session Management**: Persistent login sessions
- **Message Processing**: Automated responses

### AI Components
- **System Instructions**: Custom AI behavior prompts
- **Conversation Logging**: Complete chat history
- **Lead Generation**: Automated customer data collection

## 🚀 Deployment Information
- **Primary Domain**: imjd.asia
- **Server IP**: 64.31.22.34
- **User**: imjdasia
- **Home Directory**: /home2/imjdasia
- **Target Directories**: 
  - `saba.imjd.asia/` (empty, ready for deployment)
  - `saba/` (empty, alternative location)

## 📝 Development Notes
- **Last Major Update**: May 25, 2025
- **Current Status**: Ready for production deployment
- **Dependencies**: All package files present and up-to-date
- **Data**: Contains real customer interactions and leads
- **Security**: Contains sensitive API keys and tokens

## 🔄 File Change Tracking
- **Most Active**: `app.py` (main application logic)
- **Recent Updates**: Frontend pages, system instructions
- **Static Assets**: Branding images and logos
- **Growing Data**: Conversation logs, lead database

---
*This documentation should be updated whenever significant structural changes are made to the project.*
