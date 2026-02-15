AI-Powered Digital Marketing Portfolio & Analytics Platform

A full-stack web platform for digital marketing agencies featuring portfolio management, intelligent lead capture, real-time analytics, and AI-driven automation.

Show Image
Show Image
Show Image
Show Image

📋 Table of Contents

Overview
Key Features
Tech Stack
System Architecture
Installation & Setup
Project Structure
Core Modules
AI/ML Features
Screenshots
API Documentation
Testing
Deployment
Future Enhancements
Contributing
License
Contact


🎯 Overview
This platform transforms traditional agency websites into intelligent, automated business systems. It combines modern web development with optional AI/ML capabilities to create a 24/7 digital sales and marketing engine.
Problem Statement
Traditional agency websites are passive information displays that:

Require manual content updates
Treat all leads equally
Provide no visitor insights
Lack real-time client communication

Solution
An automated platform that:

Generates professional content using AI
Predicts and prioritizes high-value leads
Engages visitors with intelligent chatbot
Provides transparent client portals
Delivers actionable business analytics

Academic Context
Developed as a Final Year Project (FYP) demonstrating:

Full-stack web development
System design and architecture
Optional AI/ML integration
Real-world business applications


✨ Key Features
🎨 Core Features (No AI/ML Required)

Responsive Design - Mobile-first, works flawlessly on all devices
Dynamic CMS - Easy content management without coding
Interactive Portfolio - Filterable gallery with lightbox viewing
Smart Contact Forms - Validation, spam protection, instant notifications
ROI Calculator - Interactive tool for prospect engagement
Client Portal - Secure login for campaign tracking and documents
Analytics Dashboard - Comprehensive visitor and conversion tracking
Performance Optimization - Sub-2-second load times, 90+ PageSpeed score

🤖 AI/ML Enhanced Features (Optional)

AI Content Generation - Automated professional copywriting (Claude AI)
Intelligent Chatbot - 24/7 visitor engagement with context awareness
Predictive Lead Scoring - ML-powered identification of high-value prospects
Smart Personalization - Netflix-style content adaptation
Automated Case Studies - Generate PDFs from campaign data
Sentiment Analysis - Social proof engine with review aggregation

🚀 Advanced Features

A/B Testing Framework - Data-driven optimization
Email Automation - Drip campaigns for lead nurturing
Performance Benchmarking - Free website audit tool for lead generation
Real-time Campaign Tracking - Live metrics for existing clients
Social Media Aggregator - Unified performance dashboard


🛠 Tech Stack
Frontend
React 18+ with TypeScript
Tailwind CSS
React Router
Axios
Chart.js / Recharts
Backend
Node.js (v16+)
Express.js
PostgreSQL
Prisma ORM
JWT Authentication
AI/ML (Optional)
Claude AI API (Anthropic)
Python 3.9+
scikit-learn
TensorFlow (optional)
Natural Language Processing libraries
DevOps & Tools
Git & GitHub
Docker
Vercel / AWS
Cloudflare CDN
GitHub Actions (CI/CD)

🏗 System Architecture
┌─────────────────────────────────────────────────────────┐
│                     Client Layer                         │
│  (React SPA - Mobile/Tablet/Desktop Responsive)         │
└─────────────────┬───────────────────────────────────────┘
                  │
                  │ HTTPS/REST API
                  │
┌─────────────────▼───────────────────────────────────────┐
│                  Application Layer                       │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │   Express   │  │     Auth     │  │   Business    │  │
│  │   Routes    │  │  Middleware  │  │     Logic     │  │
│  └─────────────┘  └──────────────┘  └───────────────┘  │
└─────────────────┬───────────────────────────────────────┘
                  │
        ┌─────────┴─────────┐
        │                   │
┌───────▼────────┐   ┌──────▼──────────────────┐
│   PostgreSQL   │   │   AI/ML Services        │
│   Database     │   │  ┌──────────────────┐   │
│                │   │  │  Claude AI API   │   │
│  - Users       │   │  │  (Content Gen)   │   │
│  - Portfolio   │   │  └──────────────────┘   │
│  - Leads       │   │  ┌──────────────────┐   │
│  - Analytics   │   │  │  Python ML       │   │
│                │   │  │  (Lead Scoring)  │   │
└────────────────┘   │  └──────────────────┘   │
                     │  ┌──────────────────┐   │
                     │  │  NLP Engine      │   │
                     │  │  (Chatbot)       │   │
                     │  └──────────────────┘   │
                     └─────────────────────────┘

📦 Installation & Setup
Prerequisites
bashNode.js >= 16.x
PostgreSQL >= 14.x
Python >= 3.9 (for ML features)
npm or yarn
1. Clone Repository
bashgit clone https://github.com/yourusername/digital-marketing-platform.git
cd digital-marketing-platform
2. Install Dependencies
Frontend:
bashcd client
npm install
Backend:
bashcd server
npm install
ML Services (Optional):
bashcd ml-services
pip install -r requirements.txt
3. Environment Configuration
Create .env files in respective directories:
Backend .env:
envDATABASE_URL="postgresql://user:password@localhost:5432/marketing_db"
JWT_SECRET="your-secret-key-here"
CLAUDE_API_KEY="your-claude-api-key" # Optional
PORT=5000
NODE_ENV=development
Frontend .env:
envREACT_APP_API_URL=http://localhost:5000
REACT_APP_ENABLE_AI=true # Set to false to disable AI features
4. Database Setup
bashcd server
npx prisma migrate dev
npx prisma db seed # Optional: Load sample data
5. Run Development Servers
Backend:
bashcd server
npm run dev
Frontend:
bashcd client
npm start
ML Services (Optional):
bashcd ml-services
python app.py
```

### 6. Access Application
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **ML Services:** http://localhost:8000

---

## 📁 Project Structure
```
digital-marketing-platform/
├── client/                    # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Page components
│   │   ├── services/         # API calls
│   │   ├── hooks/            # Custom React hooks
│   │   ├── context/          # React Context
│   │   ├── utils/            # Helper functions
│   │   └── types/            # TypeScript types
│   └── package.json
│
├── server/                    # Node.js backend
│   ├── src/
│   │   ├── controllers/      # Route controllers
│   │   ├── models/           # Database models
│   │   ├── routes/           # API routes
│   │   ├── middleware/       # Express middleware
│   │   ├── services/         # Business logic
│   │   └── utils/            # Helper functions
│   ├── prisma/
│   │   └── schema.prisma     # Database schema
│   └── package.json
│
├── ml-services/               # Python ML services (Optional)
│   ├── models/               # ML model files
│   ├── services/
│   │   ├── lead_scoring.py
│   │   ├── sentiment.py
│   │   └── chatbot.py
│   ├── app.py                # Flask/FastAPI server
│   └── requirements.txt
│
├── docs/                      # Documentation
├── tests/                     # Test files
└── README.md

🔧 Core Modules
1. Authentication & Authorization

JWT-based authentication
Role-based access control (Admin/Client/Visitor)
Secure password hashing with bcrypt

2. Content Management System
typescript// Admin can manage content via API
POST /api/portfolio/create
PUT /api/portfolio/:id/update
DELETE /api/portfolio/:id/delete
GET /api/portfolio/list
3. Lead Management

Contact form submissions
Lead scoring (if ML enabled)
Email notifications
CRM integration ready

4. Analytics Engine

Page view tracking
Conversion tracking
User behavior analysis
Custom event tracking

5. Client Portal

Secure authentication
Real-time campaign metrics
Document management
Messaging system


🧠 AI/ML Features
Implementation Options
Option 1: Full AI Integration (Recommended)
Cost: ~$5-15 for entire FYP

Real Claude AI API calls
Actual ML model training
Production-grade implementation

Option 2: Hybrid Approach

Rule-based system with AI enhancement
Limited API calls for demo
Cost-effective for academic projects

Option 3: Mock Implementation

Simulated AI responses
Detailed documentation of real implementation
Zero cost, acceptable for FYP

AI Content Generation
javascript// Example usage
const generatedContent = await claudeAI.generatePortfolioDescription({
  campaignType: "Social Media",
  metrics: { conversions: 1200, rate: 4.8 },
  tone: "professional"
});
Lead Scoring Model
python# Features used for prediction
features = [
    'pages_viewed',
    'time_on_site',
    'downloads',
    'return_visits',
    'form_interactions'
]

# Model achieves ~85% accuracy
score = lead_scoring_model.predict(visitor_data)

📸 Screenshots
Homepage
Show Image
Admin Dashboard
Show Image
Portfolio Gallery
Show Image
AI Chatbot
Show Image
Analytics
Show Image

📚 API Documentation
Authentication
httpPOST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
Portfolio Management
httpGET    /api/portfolio              # Get all projects
GET    /api/portfolio/:id          # Get single project
POST   /api/portfolio              # Create project (Admin)
PUT    /api/portfolio/:id          # Update project (Admin)
DELETE /api/portfolio/:id          # Delete project (Admin)
Lead Management
httpPOST   /api/leads                  # Submit enquiry
GET    /api/leads                  # Get all leads (Admin)
GET    /api/leads/:id              # Get lead details
PUT    /api/leads/:id/score        # Update lead score
Analytics
httpGET    /api/analytics/overview     # Dashboard metrics
GET    /api/analytics/traffic      # Traffic data
GET    /api/analytics/conversions  # Conversion tracking
POST   /api/analytics/track        # Track custom event
AI Services (Optional)
httpPOST   /api/ai/generate-content    # Generate text
POST   /api/ai/score-lead          # ML lead scoring
POST   /api/ai/chatbot             # Chatbot response
Full API documentation: View Postman Collection

🧪 Testing
Run Tests
bash# Backend tests
cd server
npm test

# Frontend tests
cd client
npm test

# ML tests
cd ml-services
pytest
Test Coverage

Unit tests for business logic
Integration tests for API endpoints
E2E tests for critical user flows
ML model validation


🚀 Deployment
Frontend (Vercel)
bashcd client
vercel --prod
Backend (AWS/Railway/Render)
bashcd server
# Configure environment variables
# Deploy using platform CLI or GitHub integration
Database (Supabase/Neon)
bash# Use free tier PostgreSQL hosting
# Update DATABASE_URL in production .env
Environment Variables Checklist

 DATABASE_URL
 JWT_SECRET
 CLAUDE_API_KEY (if using AI)
 NODE_ENV=production
 CORS_ORIGIN


🔮 Future Enhancements

 Multi-language support
 Advanced A/B testing dashboard
 Integration with Google Analytics 4
 Webhook support for CRM systems
 Mobile app (React Native)
 Advanced ML models (GPT-4, custom training)
 Blockchain-based client verification
 Voice-enabled chatbot


🤝 Contributing
Contributions are welcome! Please follow these steps:

Fork the repository
Create feature branch (git checkout -b feature/AmazingFeature)
Commit changes (git commit -m 'Add AmazingFeature')
Push to branch (git push origin feature/AmazingFeature)
Open Pull Request

Please read CONTRIBUTING.md for detailed guidelines.

📄 License
This project is licensed under the MIT License - see LICENSE file for details.

👨‍💻 Contact
Your Name

Email: your.email@example.com
LinkedIn: Your Profile
GitHub: @yourusername

Project Link: https://github.com/yourusername/digital-marketing-platform

🙏 Acknowledgments

Anthropic Claude AI for AI capabilities
React Documentation for frontend framework
PostgreSQL for database
University supervisors and mentors
Open source community


📊 Project Stats
Show Image
Show Image
Show Image
Show Image

⭐ If you find this project helpful, please consider giving it a star!
