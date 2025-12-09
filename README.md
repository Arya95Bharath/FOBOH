# FOBOH Pricing Module - Fullstack Application

A complete fullstack application for managing product pricing profiles with dynamic and fixed price adjustments.

##  Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Design Decisions](#design-decisions)
- [Future Enhancements](#future-enhancements)
- [Troubleshooting](#troubleshooting)

---

##  Overview

This application allows suppliers to create custom pricing profiles for different customers. Suppliers can:
- Search and filter products by name, SKU, category, segment, or brand
- Select one, multiple, or all products
- Apply fixed ($) or dynamic (%) price adjustments
- Preview calculated prices before saving
- Save pricing profiles for later use

**Example Use Case:** Create a "VIP Customer Discount" profile that applies 10% off all wines for premium customers.

---

##  Features

### Product Management
-  Display 5 seeded wine products
-  Search by product name or SKU (fuzzy matching)
-  Filter by category, sub-category, segment, and brand
-  Multiple filter combinations (AND logic)

### Pricing Configuration
-  Fixed dollar amount adjustments ($5, $10, $20, etc.)
-  Dynamic percentage adjustments (5%, 10%, 25%, etc.)
-  Increase or decrease modes
-  Real-time price calculation preview
-  Negative price prevention

### User Interface
-  Professional FOBOH-branded design
-  Responsive layout (mobile, tablet, desktop)
-  Interactive product selection with checkboxes
-  Clear visual feedback for calculated prices
-  Success/error notifications

### Backend API
-  RESTful API design
-  Swagger/OpenAPI documentation
-  Input validation
-  Error handling
-  CORS enabled

---

##  Tech Stack

### Backend
- **Runtime:** Node.js v18+
- **Framework:** Express.js
- **Language:** TypeScript
- **API Docs:** Swagger/OpenAPI
- **Testing:** Jest (60 unit tests)
- **Storage:** In-memory (Arrays)

### Frontend
- **Framework:** React 18+ with TypeScript
- **Styling:** Custom CSS (FOBOH-branded)
- **HTTP Client:** Axios
- **Testing:** Jest + React Testing Library (21 tests)
- **Build Tool:** Create React App

---

##  Prerequisites

Before you begin, ensure you have:

- **Node.js** v16 or higher
- **npm** v7 or higher
- **Git** (for cloning the repository)

Check your versions:
```bash
node --version  # Should be v16+
npm --version   # Should be v7+
```

---

##  Quick Start

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd foboh-pricing-module
```

### 2. Start the Backend (Terminal 1)
```bash
# Navigate to backend folder
cd foboh-pricing-backend

# Install dependencies
npm install

# Start development server
npm run dev
```

Backend running at: **http://localhost:3001**  
Swagger docs at: **http://localhost:3001/api-docs**

### 3. Start the Frontend (Terminal 2)
```bash
# Navigate to frontend folder (open new terminal)
cd foboh-pricing-frontend

# Install dependencies
npm install

# Start development server
npm start
```

Frontend running at: **http://localhost:3000**

### 4. Open the Application

Open your browser and navigate to:
```
http://localhost:3000
```

---

##  Project Structure
```
foboh-pricing-module/
├── foboh-pricing-backend/         # Backend API
│   ├── src/
│   │   ├── index.ts               # Entry point
│   │   ├── app.ts                 # Express app setup
│   │   ├── routes/                # API routes
│   │   │   ├── products.routes.ts
│   │   │   ├── pricing.routes.ts
│   │   │   └── reference.routes.ts
│   │   ├── controllers/           # Request handlers
│   │   │   ├── products.controller.ts
│   │   │   ├── pricing.controller.ts
│   │   │   └── reference.controller.ts
│   │   ├── services/              # Business logic
│   │   │   ├── products.service.ts
│   │   │   ├── pricing.service.ts
│   │   │   └── calculation.service.ts
│   │   ├── models/                # TypeScript interfaces
│   │   │   ├── product.model.ts
│   │   │   └── pricing-profile.model.ts
│   │   ├── data/                  # Seed data
│   │   │   └── seed.ts
│   │   └── config/                # Configuration
│   │       └── swagger.ts
│   ├── __tests__/                 # Unit tests
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
│
├── foboh-pricing-frontend/        # Frontend React App
│   ├── src/
│   │   ├── components/            # React components
│   │   │   └── PricingProfile/
│   │   │       └── PricingProfileCreator.tsx
│   │   ├── services/              # API integration
│   │   │   └── api.ts
│   │   ├── types/                 # TypeScript types
│   │   │   └── index.ts
│   │   ├── utils/                 # Helper functions
│   │   │   └── priceCalculation.ts
│   │   ├── __tests__/             # Unit tests
│   │   ├── App.tsx
│   │   ├── index.tsx
│   │   └── index.css
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
│
└── README.md                      # This file
```

---

##  API Documentation

### Base URL
```
http://localhost:3001/api
```

### Swagger Documentation
Interactive API documentation available at:
```
http://localhost:3001/api-docs
```

### Key Endpoints

#### Products
```http
GET    /api/products                    # Get all products (with filters)
GET    /api/products/:id                # Get single product
```

**Query Parameters:**
- `search` - Search by title or SKU
- `brand` - Filter by brand name
- `subCategory` - Filter by sub-category
- `segment` - Filter by segment

**Example:**
```bash
curl "http://localhost:3001/api/products?search=pinot&brand=High%20Garden"
```

#### Pricing Profiles
```http
GET    /api/pricing-profiles            # Get all profiles
POST   /api/pricing-profiles            # Create new profile
GET    /api/pricing-profiles/:id        # Get single profile
PUT    /api/pricing-profiles/:id        # Update profile
DELETE /api/pricing-profiles/:id        # Delete profile
POST   /api/pricing-profiles/calculate  # Calculate prices (preview)
```

**Create Profile Example:**
```bash
curl -X POST http://localhost:3001/api/pricing-profiles \
  -H "Content-Type: application/json" \
  -d '{
    "name": "VIP Customer Discount",
    "basedOn": "global",
    "adjustmentType": "dynamic",
    "adjustmentMode": "decrease",
    "adjustmentValue": 10,
    "selectedProducts": ["product-id-1", "product-id-2"]
  }'
```

#### Reference Data
```http
GET    /api/reference/categories        # Get categories, segments, brands
```

---

##  Testing

### Backend Tests (60 tests)
```bash
cd foboh-pricing-backend

# Run all tests
npm test

# Run tests with coverage
npm run test:coverage
```

**Test Coverage:**
- Calculation Service (18 tests) - Fixed/Dynamic adjustments, edge cases
- Products Service (24 tests) - Search, filters, combined filters
- Pricing Service (18 tests) - CRUD operations, validation

### Frontend Tests (21 tests)
```bash
cd foboh-pricing-frontend

# Run all tests
npm test -- --watchAll=false

# Run with coverage
npm run test:coverage
```

**Test Coverage:**
- Price Calculation Utils (17 tests) - All calculation scenarios
- TypeScript Types (3 tests) - Type definitions
- API Structure (3 tests) - Endpoint validation

### Total Test Coverage
- **81 tests** across backend and frontend
- **All tests passing** 

---

##  Design Decisions

### Architecture

**Separation of Concerns:**
- **Routes** → Handle HTTP requests
- **Controllers** → Process requests and responses
- **Services** → Business logic and data manipulation
- **Models** → Data structure definitions

**Why TypeScript?**
- Type safety reduces bugs
- Better developer experience with IntelliJ

lliSense
- Self-documenting code
- Easier refactoring

### Price Calculation Algorithm

**Formula:**
```typescript
// Fixed Adjustment
newPrice = basedOnPrice ± fixedAmount

// Dynamic Adjustment (Percentage)
newPrice = basedOnPrice ± (basedOnPrice × percentage / 100)
```

**Negative Price Prevention:**
```typescript
if (newPrice <= 0) {
  throw new Error('Price cannot be negative');
}
```

This ensures prices never go below zero, protecting business logic.

### Data Storage

**Current:** In-memory arrays  
**Rationale:** Simplifies development and meets project requirements  
**Limitation:** Data lost on server restart  
**Production:** Would use PostgreSQL or MongoDB

### API Design

**RESTful Principles:**
- Resource-based URLs (`/products`, `/pricing-profiles`)
- Standard HTTP methods (GET, POST, PUT, DELETE)
- Consistent response format
- Proper status codes (200, 201, 400, 404, 500)

**Response Format:**
```json
{
  "success": true,
  "data": { ... },
  "count": 5
}
```

---

##  Future Enhancements

### With More Time, I Would Add:

#### 1. **Database Integration**
- PostgreSQL for persistence
- Prisma ORM for type-safe database access
- Migration system for schema changes
- Proper indexing for performance

#### 2. **Authentication & Authorization**
- JWT-based authentication
- Role-based access control (Supplier, Customer, Admin)
- Secure password hashing with bcrypt
- API key management for external access

#### 3. **Advanced Features**
- **Profile chaining:** Base profiles on other profiles
- **Bulk operations:** Update multiple profiles at once
- **Price history:** Track price changes over time
- **Scheduled pricing:** Set future-dated price changes
- **Multi-currency support:** Handle AUD, USD, EUR
- **Export functionality:** Generate CSV/Excel reports

#### 4. **Performance Optimizations**
- Redis caching layer
- Database query optimization
- Pagination for large datasets
- Rate limiting to prevent abuse
- CDN for static assets

#### 5. **Enhanced UI/UX**
- Drag-and-drop product selection
- Advanced filtering with saved filter sets
- Price comparison charts
- Keyboard shortcuts for power users
- Dark mode support
- Mobile app (React Native)

#### 6. **Monitoring & Logging**
- Winston for structured logging
- Sentry for error tracking
- Prometheus metrics
- Health check endpoints
- Performance monitoring

#### 7. **Testing Enhancements**
- E2E tests with Cypress
- Visual regression testing
- Load testing with k6
- API contract testing
- Accessibility testing

#### 8. **DevOps**
- CI/CD pipeline (GitHub Actions)
- Docker Compose for development
- Kubernetes for production
- Automated deployments
- Blue-green deployments

---

##  Troubleshooting

### Backend Issues

**Port 3001 already in use:**
```bash
# Kill the process using port 3001
lsof -ti:3001 | xargs kill -9

# Or change the port in src/index.ts
const PORT = process.env.PORT || 3002;
```

**TypeScript errors:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

**Tests failing:**
```bash
# Clear Jest cache
npm test -- --clearCache

# Run tests again
npm test
```

### Frontend Issues

**Port 3000 already in use:**
```
? Something is already running on port 3000.
Would you like to run the app on another port instead? › (Y/n)
```
Press `Y` to use another port.

**CORS errors:**
Make sure backend `src/app.ts` has:
```typescript
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
```

**API connection failed:**
1. Verify backend is running on port 3001
2. Check browser console for errors
3. Test backend directly: `curl http://localhost:3001/api/products`

**Blank page / White screen:**
1. Check browser console for errors
2. Verify all dependencies are installed: `npm install`
3. Clear browser cache and reload

---

##  Usage Examples

### Example 1: Create 10% VIP Discount

1. Open http://localhost:3000
2. Enter profile name: "VIP Customer Discount"
3. Select "Multiple Products"
4. Check boxes for 2-3 products
5. Select "Dynamic (%)"
6. Select "Decrease (-)"
7. Enter value: "10"
8. Click "Recalculate Prices"
9. Review calculated prices in table
10. Click "Save Profile"

**Result:**
- High Garden Pinot Noir: $279.06 → $251.15 (saved $27.91)
- Koyama Methode Brut: $120.00 → $108.00 (saved $12.00)

### Example 2: Add $5 Markup

1. Select products
2. Select "Fixed ($)"
3. Select "Increase (+)"
4. Enter value: "5"
5. Click "Recalculate Prices"
6. Save profile

**Result:**
- All prices increased by exactly $5.00

---

## 👥 Team FOBOH

Developed as a take-home challenge for FOBOH.

**Time Spent:** ~4 hours
- Backend: 1.5 hours
- Frontend: 1.5 hours
- Testing & Documentation: 1 hour

---

