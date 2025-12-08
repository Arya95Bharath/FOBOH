# FOBOH Pricing Module - Backend Requirements Document

## 1. PROJECT OVERVIEW

### 1.1 Purpose
Develop a Node.js backend API that enables suppliers to create and manage custom pricing profiles for different customers, allowing them to adjust product prices based on various criteria.

### 1.2 Key Objectives
- Provide RESTful API endpoints for product and pricing profile management
- Implement flexible price calculation logic (fixed/dynamic adjustments)
- Enable product filtering and search capabilities
- Ensure data validation and business rule enforcement
- Document API using Swagger/OpenAPI

### 1.3 Time Allocation
- Approximately 1.5-2 hours of focused development

---

## 2. TECHNICAL STACK REQUIREMENTS

### 2.1 Core Technologies
- **Runtime**: Node.js (v16+ recommended)
- **Framework**: Express.js or Fastify
- **Language**: TypeScript (strongly recommended) or JavaScript
- **API Documentation**: Swagger/OpenAPI specification

### 2.2 Recommended Libraries
- `express` or `fastify` - Web framework
- `swagger-ui-express` or `@fastify/swagger` - API documentation
- `cors` - CORS middleware
- `joi` or `zod` - Request validation (optional but recommended)
- `uuid` - Generate unique IDs

### 2.3 Data Storage
- **In-memory storage** (arrays/objects) - NO DATABASE REQUIRED
- Proper TypeScript interfaces or JSDoc types for validation

---

## 3. DATA MODELS

### 3.1 Product Model

```typescript
interface Product {
  id: string;                    // Unique identifier (UUID)
  title: string;                 // Product name
  skuCode: string;               // Stock Keeping Unit code
  brand: string;                 // Brand name
  categoryId: string;            // Category identifier
  subCategoryId: string;         // Sub-category (Wine, Beer, Liquor, etc.)
  segmentId: string;             // Segment (Red, White, Sparkling, etc.)
  globalWholesalePrice: number;  // Base price in AUD
}
```

**Example:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "title": "High Garden Pinot Noir 2021",
  "skuCode": "HGVPIN216",
  "brand": "High Garden",
  "categoryId": "alcoholic-beverage",
  "subCategoryId": "wine",
  "segmentId": "red",
  "globalWholesalePrice": 279.06
}
```

### 3.2 Pricing Profile Model

```typescript
interface PricingProfile {
  id: string;                    // Unique identifier
  name: string;                  // Profile name (e.g., "Tenure Discount")
  description?: string;          // Optional description
  basedOn: string;               // "global" or another profile ID
  adjustmentType: "fixed" | "dynamic";  // Fixed ($) or Dynamic (%)
  adjustmentMode: "increase" | "decrease";  // + or -
  adjustmentValue: number;       // The amount/percentage to adjust
  selectedProducts: string[];    // Array of product IDs
  createdAt: string;             // ISO timestamp
  updatedAt: string;             // ISO timestamp
}
```

**Example:**
```json
{
  "id": "profile-001",
  "name": "VIP Customer Discount",
  "description": "10% discount for VIP customers",
  "basedOn": "global",
  "adjustmentType": "dynamic",
  "adjustmentMode": "decrease",
  "adjustmentValue": 10,
  "selectedProducts": ["550e8400-e29b-41d4-a716-446655440001"],
  "createdAt": "2025-12-08T10:00:00.000Z",
  "updatedAt": "2025-12-08T10:00:00.000Z"
}
```

### 3.3 Calculated Price Response Model

```typescript
interface CalculatedPrice {
  productId: string;
  productTitle: string;
  skuCode: string;
  category: string;
  basedOnPrice: number;          // The price we're calculating from
  adjustmentValue: number;       // The adjustment amount
  newPrice: number;              // Calculated new price
}
```

---

## 4. SEED DATA REQUIREMENTS

### 4.1 Initial Products
Load the following 5 products on server startup:

| Title | SKU | Brand | Category | SubCategory | Segment | Price (AUD) |
|-------|-----|-------|----------|-------------|---------|-------------|
| High Garden Pinot Noir 2021 | HGVPIN216 | High Garden | Alcoholic Beverage | Wine | Red | 279.06 |
| Koyama Methode Brut Nature NV | KOYBRUNV6 | Koyama Wines | Alcoholic Beverage | Wine | Sparkling | 120.00 |
| Koyama Riesling 2018 | KOYNR1837 | Koyama Wines | Alcoholic Beverage | Wine | Port/Dessert | 215.04 |
| Koyama Tussock Riesling 2019 | KOYRIE19 | Koyama Wines | Alcoholic Beverage | Wine | White | 215.04 |
| LacourteGodbillon Brut Cru NV | LACBNATNV6 | LacourteGodbillon | Alcoholic Beverage | Wine | Sparkling | 409.32 |

### 4.2 Reference Data

**Sub-Categories:**
- Wine
- Beer
- Liquor & Spirits
- Cider
- Premixed & Ready-to-Drink
- Other

**Segments (Wine-specific):**
- Red
- White
- Rose
- Orange
- Sparkling
- Port/Dessert

**Brands:**
- High Garden
- Koyama Wines
- LacourteGodbillon

---

## 5. API ENDPOINTS SPECIFICATION

### 5.1 Products API

#### **GET /api/products**
Fetch products with optional filtering and search

**Query Parameters:**
- `search` (string, optional): Search by title or SKU (fuzzy matching)
- `brand` (string, optional): Filter by brand name
- `subCategory` (string, optional): Filter by sub-category
- `segment` (string, optional): Filter by segment

**Response: 200 OK**
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "title": "High Garden Pinot Noir 2021",
      "skuCode": "HGVPIN216",
      "brand": "High Garden",
      "categoryId": "alcoholic-beverage",
      "subCategoryId": "wine",
      "segmentId": "red",
      "globalWholesalePrice": 279.06
    }
  ],
  "count": 1
}
```

#### **GET /api/products/:id**
Fetch a single product by ID

**Response: 200 OK**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "title": "High Garden Pinot Noir 2021",
    ...
  }
}
```

**Response: 404 Not Found**
```json
{
  "success": false,
  "error": "Product not found"
}
```

---

### 5.2 Pricing Profiles API

#### **POST /api/pricing-profiles**
Create a new pricing profile

**Request Body:**
```json
{
  "name": "VIP Customer Discount",
  "description": "10% discount for VIP customers",
  "basedOn": "global",
  "adjustmentType": "dynamic",
  "adjustmentMode": "decrease",
  "adjustmentValue": 10,
  "selectedProducts": ["550e8400-e29b-41d4-a716-446655440001"]
}
```

**Response: 201 Created**
```json
{
  "success": true,
  "data": {
    "id": "profile-001",
    "name": "VIP Customer Discount",
    "description": "10% discount for VIP customers",
    "basedOn": "global",
    "adjustmentType": "dynamic",
    "adjustmentMode": "decrease",
    "adjustmentValue": 10,
    "selectedProducts": ["550e8400-e29b-41d4-a716-446655440001"],
    "createdAt": "2025-12-08T10:00:00.000Z",
    "updatedAt": "2025-12-08T10:00:00.000Z"
  }
}
```

**Response: 400 Bad Request**
```json
{
  "success": false,
  "error": "Validation error",
  "details": ["adjustmentValue must be a positive number"]
}
```

#### **GET /api/pricing-profiles**
Fetch all pricing profiles

**Response: 200 OK**
```json
{
  "success": true,
  "data": [
    {
      "id": "profile-001",
      "name": "VIP Customer Discount",
      ...
    }
  ],
  "count": 1
}
```

#### **GET /api/pricing-profiles/:id**
Fetch a single pricing profile by ID

**Response: 200 OK**
```json
{
  "success": true,
  "data": {
    "id": "profile-001",
    "name": "VIP Customer Discount",
    ...
  }
}
```

#### **PUT /api/pricing-profiles/:id**
Update an existing pricing profile

**Request Body:** (same as POST, all fields optional)
```json
{
  "adjustmentValue": 15
}
```

**Response: 200 OK**
```json
{
  "success": true,
  "data": {
    "id": "profile-001",
    "adjustmentValue": 15,
    "updatedAt": "2025-12-08T11:00:00.000Z",
    ...
  }
}
```

#### **DELETE /api/pricing-profiles/:id**
Delete a pricing profile

**Response: 200 OK**
```json
{
  "success": true,
  "message": "Pricing profile deleted successfully"
}
```

---

### 5.3 Price Calculation API

#### **POST /api/pricing-profiles/calculate**
Calculate prices without saving (preview mode)

**Request Body:**
```json
{
  "basedOn": "global",
  "adjustmentType": "dynamic",
  "adjustmentMode": "decrease",
  "adjustmentValue": 10,
  "productIds": ["550e8400-e29b-41d4-a716-446655440001"]
}
```

**Response: 200 OK**
```json
{
  "success": true,
  "data": [
    {
      "productId": "550e8400-e29b-41d4-a716-446655440001",
      "productTitle": "High Garden Pinot Noir 2021",
      "skuCode": "HGVPIN216",
      "category": "Wine",
      "basedOnPrice": 279.06,
      "adjustmentValue": -27.91,
      "newPrice": 251.15
    }
  ]
}
```

---

### 5.4 Reference Data API

#### **GET /api/reference/categories**
Get all categories

**Response: 200 OK**
```json
{
  "success": true,
  "data": {
    "subCategories": ["Wine", "Beer", "Liquor & Spirits", "Cider", "Premixed & Ready-to-Drink", "Other"],
    "segments": ["Red", "White", "Rose", "Orange", "Sparkling", "Port/Dessert"],
    "brands": ["High Garden", "Koyama Wines", "LacourteGodbillon"]
  }
}
```

---

## 6. BUSINESS LOGIC REQUIREMENTS

### 6.1 Price Calculation Algorithm

The core business logic must implement the following calculation rules:

#### **Fixed Adjustment**
```
Increase: newPrice = basedOnPrice + adjustmentValue
Decrease: newPrice = basedOnPrice - adjustmentValue
```

**Examples:**
- Base: $500, Adjustment: +$20 (Fixed Increase) → **$520**
- Base: $500, Adjustment: -$20 (Fixed Decrease) → **$480**

#### **Dynamic Adjustment (Percentage)**
```
Increase: newPrice = basedOnPrice + (basedOnPrice × adjustmentValue / 100)
Decrease: newPrice = basedOnPrice - (basedOnPrice × adjustmentValue / 100)
```

**Examples:**
- Base: $500, Adjustment: +20% (Dynamic Increase) → **$600**
- Base: $500, Adjustment: -20% (Dynamic Decrease) → **$400**

### 6.2 Price Calculation Function Signature

```typescript
function calculatePrice(
  basedOnPrice: number,
  adjustmentType: 'fixed' | 'dynamic',
  adjustmentMode: 'increase' | 'decrease',
  adjustmentValue: number
): number {
  // Implementation here
  // Return rounded to 2 decimal places
}
```

### 6.3 "Based On" Price Resolution

When calculating prices, resolve the "based on" price as follows:

1. **If basedOn = "global"**: Use `product.globalWholesalePrice`
2. **If basedOn = profileId**: 
   - Look up the pricing profile by ID
   - Calculate price using that profile's settings
   - Use the calculated price as the base

This allows profile chaining (profiles based on other profiles).

---

## 7. VALIDATION RULES

### 7.1 Product Validation
- `title`: Required, non-empty string
- `skuCode`: Required, unique, non-empty string
- `globalWholesalePrice`: Required, positive number (> 0)
- `brand`, `categoryId`, `subCategoryId`, `segmentId`: Required strings

### 7.2 Pricing Profile Validation
- `name`: Required, non-empty string (max 100 chars)
- `basedOn`: Required, must be "global" or valid profile ID
- `adjustmentType`: Required, must be "fixed" or "dynamic"
- `adjustmentMode`: Required, must be "increase" or "decrease"
- `adjustmentValue`: Required, positive number (> 0)
- `selectedProducts`: Required, non-empty array of valid product IDs

### 7.3 Business Rules
- **Negative Price Prevention**: If calculated price < 0, return error
- **Profile Chaining**: Prevent circular dependencies (profile A based on profile B based on profile A)
- **Product Existence**: All product IDs in `selectedProducts` must exist

---

## 8. SEARCH & FILTER IMPLEMENTATION

### 8.1 Search Functionality
**Requirements:**
- Case-insensitive search
- Match partial strings in `title` or `skuCode`
- Support fuzzy matching (e.g., "garden" matches "High Garden")

**Implementation approach:**
```typescript
function searchProducts(query: string, products: Product[]): Product[] {
  const lowerQuery = query.toLowerCase();
  return products.filter(product => 
    product.title.toLowerCase().includes(lowerQuery) ||
    product.skuCode.toLowerCase().includes(lowerQuery)
  );
}
```

### 8.2 Filter Functionality
**Multiple filters should work together (AND logic):**
- If `brand=Koyama Wines` AND `segment=Sparkling` → Return only Koyama Sparkling wines

**Implementation approach:**
```typescript
function filterProducts(filters: {
  brand?: string;
  subCategory?: string;
  segment?: string;
}, products: Product[]): Product[] {
  return products.filter(product => {
    if (filters.brand && product.brand !== filters.brand) return false;
    if (filters.subCategory && product.subCategoryId !== filters.subCategory) return false;
    if (filters.segment && product.segmentId !== filters.segment) return false;
    return true;
  });
}
```

---

## 9. ERROR HANDLING

### 9.1 Standard Error Response Format
```json
{
  "success": false,
  "error": "Error message",
  "details": ["Additional detail 1", "Additional detail 2"]
}
```

### 9.2 HTTP Status Codes
- `200 OK`: Successful GET, PUT, DELETE
- `201 Created`: Successful POST
- `400 Bad Request`: Validation errors, business rule violations
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Unexpected server errors

### 9.3 Common Error Scenarios
- Product not found → 404
- Invalid adjustment value → 400
- Calculated price is negative → 400
- Missing required fields → 400
- Circular profile dependency → 400

---

## 10. SWAGGER/OPENAPI DOCUMENTATION

### 10.1 Requirements
- API must be documented using OpenAPI 3.0 specification
- Swagger UI must be accessible at `/api-docs` endpoint
- Include examples for all requests and responses
- Document all query parameters, request bodies, and response schemas

### 10.2 Swagger UI Setup Example
```typescript
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json';

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
```

### 10.3 Required Documentation Sections
- API overview and base URL
- Authentication (if any)
- All endpoints with:
  - Path and method
  - Parameters
  - Request body schema
  - Response schemas (success and error)
  - Example requests and responses

---

## 11. PROJECT STRUCTURE (RECOMMENDED)

```
backend/
├── src/
│   ├── index.ts                 # Entry point
│   ├── app.ts                   # Express app setup
│   ├── routes/
│   │   ├── products.routes.ts
│   │   ├── pricing.routes.ts
│   │   └── reference.routes.ts
│   ├── controllers/
│   │   ├── products.controller.ts
│   │   ├── pricing.controller.ts
│   │   └── reference.controller.ts
│   ├── services/
│   │   ├── products.service.ts
│   │   ├── pricing.service.ts
│   │   └── calculation.service.ts
│   ├── models/
│   │   ├── product.model.ts
│   │   └── pricing-profile.model.ts
│   ├── data/
│   │   └── seed.ts              # Initial product data
│   ├── utils/
│   │   ├── validation.ts
│   │   └── errors.ts
│   └── swagger/
│       └── swagger.json
├── package.json
├── tsconfig.json
└── README.md
```

---

## 12. TESTING CONSIDERATIONS (BONUS)

### 12.1 Unit Tests
- Price calculation logic
- Search and filter functions
- Validation functions

### 12.2 Integration Tests
- API endpoint responses
- Error handling
- Data persistence (in-memory)

### 12.3 Test Examples
```typescript
describe('Price Calculation', () => {
  test('Fixed increase calculation', () => {
    const result = calculatePrice(500, 'fixed', 'increase', 20);
    expect(result).toBe(520);
  });

  test('Dynamic decrease calculation', () => {
    const result = calculatePrice(500, 'dynamic', 'decrease', 20);
    expect(result).toBe(400);
  });

  test('Prevents negative prices', () => {
    expect(() => {
      calculatePrice(10, 'fixed', 'decrease', 20);
    }).toThrow('Price cannot be negative');
  });
});
```

---

## 13. PERFORMANCE CONSIDERATIONS

### 13.1 Response Time Targets
- Product listing: < 100ms
- Price calculation: < 50ms
- Profile creation: < 100ms

### 13.2 Optimization Tips
- Use array methods efficiently (filter, map, reduce)
- Cache reference data (categories, brands)
- Round prices to 2 decimal places consistently
- Validate early, fail fast

---

## 14. CORS CONFIGURATION

### 14.1 Requirements
- Allow cross-origin requests from frontend
- Support common HTTP methods: GET, POST, PUT, DELETE
- Allow headers: Content-Type, Authorization

### 14.2 Implementation
```typescript
import cors from 'cors';

app.use(cors({
  origin: 'http://localhost:3000', // Frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

---

## 15. DELIVERABLES CHECKLIST

### 15.1 Code
- [ ] Node.js server with Express/Fastify
- [ ] All API endpoints implemented and working
- [ ] Price calculation logic implemented
- [ ] Search and filter functionality
- [ ] In-memory data storage with seed data
- [ ] Input validation
- [ ] Error handling
- [ ] CORS enabled

### 15.2 Documentation
- [ ] Swagger/OpenAPI documentation accessible
- [ ] README with setup instructions
- [ ] Code comments for complex logic
- [ ] API endpoint examples

### 15.3 Code Quality
- [ ] Consistent code style
- [ ] Proper TypeScript types (if using TS)
- [ ] Meaningful variable/function names
- [ ] Separation of concerns (routes, controllers, services)
- [ ] No hardcoded values (use constants)

---

## 16. TECHNICAL NOTES & TRADEOFFS

### 16.1 In-Memory Storage
**Pros:**
- Fast access
- Simple implementation
- No database setup required

**Cons:**
- Data lost on server restart
- Not suitable for production
- No concurrent user support

**Mitigation:**
- Document this limitation
- Mention database integration as future improvement

### 16.2 Profile Chaining
**Consideration:** Allowing profiles to be based on other profiles adds complexity.

**Recommendation:**
- Implement basic version (profiles based on "global" only)
- Document profile chaining as future enhancement
- If implemented, add depth limit to prevent deep nesting

### 16.3 TypeScript vs JavaScript
**Recommendation:** Use TypeScript for better type safety and developer experience.

**If using JavaScript:**
- Use JSDoc for type hints
- Add runtime validation library (Joi, Yup)

---

## 17. FUTURE ENHANCEMENTS (DOCUMENT BUT DON'T IMPLEMENT)

These should be mentioned in your README as "what I'd do with more time":

1. **Database Integration**
   - PostgreSQL or MongoDB for persistence
   - Migration system
   - Connection pooling

2. **Authentication & Authorization**
   - JWT-based authentication
   - Role-based access control (suppliers, customers)
   - API key management

3. **Advanced Features**
   - Bulk price updates
   - Price history tracking
   - Export pricing profiles to CSV/Excel
   - Schedule price changes
   - Multi-currency support

4. **Performance**
   - Caching layer (Redis)
   - Database indexing
   - Pagination for large datasets
   - Rate limiting

5. **Monitoring**
   - Logging system (Winston, Pino)
   - Error tracking (Sentry)
   - Performance monitoring
   - Health check endpoints

---

## 18. GETTING STARTED

### 18.1 Initial Setup
```bash
mkdir foboh-pricing-backend
cd foboh-pricing-backend
npm init -y
npm install express cors swagger-ui-express
npm install -D typescript @types/node @types/express @types/cors ts-node nodemon
npx tsc --init
```

### 18.2 Development Workflow
1. Set up project structure
2. Create data models and seed data
3. Implement product endpoints
4. Implement pricing profile endpoints
5. Implement price calculation logic
6. Add Swagger documentation
7. Test all endpoints
8. Write README

---

## 19. SUCCESS CRITERIA

Your backend will be evaluated on:

1. **Functionality** (40%)
   - All endpoints work correctly
   - Price calculations are accurate
   - Search and filters work as expected

2. **Code Quality** (30%)
   - Clean, readable code
   - Proper structure and organization
   - Error handling
   - Validation

3. **API Design** (20%)
   - RESTful principles
   - Consistent response format
   - Proper HTTP status codes
   - Swagger documentation

4. **Documentation** (10%)
   - Clear README
   - Setup instructions
   - API examples
   - Technical decisions explained

---

## 20. CONTACT & SUBMISSION

- **Time Limit:** 3 business days
- **Submission:** Git repository link
- **Contact:** info@foboh.com.au

Good luck! 🚀