# Cafe Application 🍰☕

A modern, AI-powered food ordering platform similar to JustEat, designed to connect businesses with customers through an intelligent shopping experience.

## 🌟 Overview

This full-stack application enables businesses to list their products while providing customers with an intuitive marketplace and AI-powered shopping assistant. Built with a microservices architecture, the platform combines traditional e-commerce functionality with cutting-edge AI agents to create a seamless ordering experience.

## ✨ Key Features

### For Customers
- **🛍️ Product Marketplace**: Browse products from multiple businesses with detailed product views
- **🤖 AI Shopping Assistant**: Conversational AI agent that helps users:
  - Search for products
  - Add items to checkout
  - Get product information
  - Manage shopping cart
- **🛒 Smart Checkout**: Real-time cart management with quantity controls and price calculations
- **📱 Responsive Design**: Fully optimized for mobile, tablet, and desktop devices
- **🌓 Dark Mode Support**: Comfortable viewing in any lighting condition

### For Businesses
- **🏢 Business Dashboard**: Dedicated management interface for business owners
- **📦 Product Management**: Create and manage product listings with:
  - Product names and descriptions
  - Pricing and categories
  - Image uploads (via Cloudinary)

## 🏗️ Architecture

The application follows a microservices architecture with four main components:

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐    
│              │     │              │     │              │     │              │     
│  Frontend    ├───▶│   Backend    ├────▶│   AI Agent   ├────▶│  MCP Server ├
│ (React/Vite) │     │ (Express.js) │     │  (FastAPI)   │     │  (FastMCP)   │     
│              │     │              │     │              │     │              │     
└──────────────┘     └──────┬───────┘     └──────────────┘     └──────────────┘   
                            │
                            ▼
                     ┌──────────────┐
                     │              │
                     │  MongoDB     │
                     │   (Atlas)    │
                     │              │
                     └──────────────┘


```

### Services

1. **Frontend** (React + Vite)
   - Modern React application with Tailwind CSS
   - Framer Motion animations
   - React Router for navigation
   - JWT-based authentication

2. **Backend** (Node.js + Express)
   - RESTful API endpoints
   - JWT authentication with refresh tokens
   - MongoDB integration via Mongoose
   - CORS-enabled for cross-origin requests

3. **AI Agent Service** (Python + FastAPI)
   - Conversational AI using OpenAI Agents
   - Context-aware chat with conversation history
   - Triage agent for intelligent request routing
   - Product-specific agent for order management

4. **MCP Server** (Python + FastMCP)
   - Model Context Protocol implementation
   - Backend tool integration
   - Authentication token management
   - Product search and checkout operations

## 🚀 Getting Started

### Prerequisites

- Docker and Docker Compose
- Node.js 22.13.1 (handled by Docker)
- Python 3.12 (handled by Docker)

### Environment Variables

Create `.env` files in the respective directories:

#### `backend/.env`
```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:4173
AGENT_SERVER_URL=http://ai-agent-service:5050
```

#### `frontend/.env`
```env
VITE_BACKEND_URL=http://localhost:3000
VITE_CLOUDINARY_UPLOAD_URL=your_cloudinary_upload_url
```

#### `ai-agent-service/.env`
```env
MCP_SERVER_URL=http://js-ai-service:8000/mcp
OPENAI_API_KEY=your_openai_api_key
```

#### `ai-mcp-service/.env`
```env
EXPRESS_BASE_URL=http://js-backend:3000
```

### Running with Docker

1. Clone the repository:
```bash
git clone <repository-url>
cd cafe-application
```

2. Ensure your `.env` files are configured

3. Build and start all services:
```bash
docker compose up --build
```

4. Access the application:
   - Frontend: http://localhost:4173
   - Backend API: http://localhost:3000
   - AI Agent Service: http://localhost:5050
   - MCP Server: http://localhost:8000

## 🔐 Authentication System

The application implements a dual-layer JWT authentication system:

### Backend Middleware
- Validates JWT tokens on every protected API request
- Prevents unauthorized access to sensitive endpoints
- Adds user information to request context

### Frontend Token Management
- Automatic token refresh when access tokens expire
- Seamless retry of failed requests with fresh tokens
- Graceful handling of authentication failures

### Authentication Flow
1. User logs in → Backend generates access + refresh tokens
2. Frontend stores tokens in localStorage
3. Protected requests include access token in Authorization header
4. On token expiry (401/403) → Frontend uses refresh token
5. Backend validates refresh token → Issues new tokens
6. Frontend retries original request with new access token

## 📁 Project Structure

```
cafe-application/
├── backend/                 # Express.js REST API
│   ├── controller/         # Request handlers
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API routes
│   └── server.js          # Entry point
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/        # Page components
│   │   └── utils/        # Utility functions
│   └── vite.config.js    # Vite configuration
├── ai-agent-service/      # FastAPI agent service
│   └── src/
│       └── main.py        # Agent logic
├── ai-mcp-service/        # FastMCP server
│   └── src/
│       └── main.py        # MCP tools
└── compose.yaml           # Docker Compose config
```

## 🛠️ Technology Stack

### Frontend
- React 19.2.0
- Vite 7.1.7
- Tailwind CSS 4.1.14
- Framer Motion 12.23.22
- React Router 7.9.3
- Lucide React (icons)

### Backend
- Node.js with Express 5.1.0
- MongoDB with Mongoose 8.19.0
- JWT (jsonwebtoken 9.0.2)
- bcryptjs for password hashing
- CORS for cross-origin requests

### AI Services
- FastAPI (Python)
- FastMCP (Model Context Protocol)
- OpenAI Agents
- Uvicorn (ASGI server)

## 🔄 API Endpoints

### Unauthenticated Routes
- `POST /api/user-unAuth/createUser` - User registration
- `POST /api/user-unAuth/userLogin` - User login
- `POST /api/user-unAuth/refresh` - Refresh access token
- `GET /api/product-unAuth/getAllProducts` - Get all products
- `POST /api/business-unAuth/createBusiness` - Create business

### Authenticated Routes
- `GET /api/user-auth/fetchCurrentUserInformation` - Get current user
- `POST /api/user-auth/userLogout` - Logout user
- `POST /api/user-auth/addItemToCheckout` - Add item to cart
- `POST /api/user-auth/updateCheckoutQuantity` - Update cart item quantity
- `POST /api/user-auth/removeFromCheckout` - Remove item from cart
- `POST /api/user-auth/calculateTotalCheckoutValue` - Calculate cart total
- `POST /api/agentChat-auth/agentChat` - Chat with AI agent

## 🤖 AI Agent Capabilities

The AI shopping assistant can:

1. **Search Products**
   - Find products by name
   - Browse entire product catalog
   - Get detailed product information

2. **Manage Cart**
   - Add items to checkout
   - Remove items from cart
   - Update quantities

3. **Provide Information**
   - Answer questions about products
   - Provide business information
   - Guide users through the ordering process

### Example Interactions
```
User: "Add a cappuccino to my order"
Agent: *Searches for cappuccino → Adds to cart → Confirms*

User: "Show me the menu"
Agent: *Displays categorized product list with emojis*

User: "Remove the croissant from my cart"
Agent: *Identifies item → Removes → Confirms*
```

## 🐳 Docker Configuration

Each service runs in its own container with:
- Non-root user for security
- Health checks for monitoring
- Optimized caching layers
- Production-ready configurations

### Service Ports
- Backend: 3000
- Frontend: 4173
- AI Agent Service: 5050
- MCP Server: 8000

## 📝 Development

### Local Development (without Docker)

#### Backend
```bash
cd backend
npm install
npm run dev
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

#### AI Services
```bash
cd ai-agent-service
pip install -r requirements.txt
uvicorn src.main:app --reload

cd ai-mcp-service
pip install -r requirements.txt
python src/main.py
```

## 🔒 Security Features

- JWT-based authentication with refresh tokens
- Password hashing using bcryptjs
- CORS configuration for API security
- Non-root Docker containers
- Environment variable management
- Input validation and sanitization

## 🎨 UI/UX Features

- Clean, modern interface with Tailwind CSS
- Smooth animations with Framer Motion
- Responsive grid layouts
- Loading states and error handling
- Toast notifications for user feedback
- Progress indicators for uploads
- Dark mode support throughout

## 📦 Database Schema

### User
- Email (unique)
- Hashed password
- Business information (role, businessId)
- Checkout basket
- Order history

### Product
- Product name
- Description
- Price
- Category
- Image URL
- Business reference

### Business
- Business name (unique)
- Owner reference
- Employees list
- Location
- Products list

## 🚧 Future Enhancements

- Payment gateway integration
- Order tracking system
- Business analytics dashboard
- Product reviews and ratings
- Advanced search and filtering
- Notification system
- Multiple language support
- Mobile applications (iOS/Android)

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For support, please open an issue in the repository or contact the development team.

---
