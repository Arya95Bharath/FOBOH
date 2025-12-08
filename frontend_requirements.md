# FOBOH Pricing Module - Frontend Requirements Document

## 1. PROJECT OVERVIEW

### 1.1 Purpose
Develop a React-based user interface that enables suppliers to create custom pricing profiles by searching/filtering products, selecting them, and configuring price adjustments with real-time preview capabilities.

### 1.2 Key Objectives
- Build intuitive product search and filter interface
- Enable flexible product selection (one, multiple, or all products)
- Provide real-time price calculation preview
- Display pricing adjustments clearly before saving
- Ensure responsive and user-friendly design

### 1.3 Time Allocation
- Approximately 1.5-2 hours of focused development

---

## 2. TECHNICAL STACK REQUIREMENTS

### 2.1 Core Technologies
- **Framework**: React 18+ (with Hooks)
- **Language**: TypeScript (recommended) or JavaScript
- **Build Tool**: Vite or Create React App
- **HTTP Client**: Axios or Fetch API

### 2.2 UI/Styling Options (Choose One)
- **Tailwind CSS** (recommended for rapid development)
- **Material-UI (MUI)** (component library)
- **Ant Design** (comprehensive UI library)
- **Bootstrap** (familiar framework)
- **Plain CSS/SCSS** (custom styling)

### 2.3 Recommended Libraries
- `axios` - HTTP requests
- `react-router-dom` - Routing (if multiple pages)
- State management: React Context or simple useState (no Redux needed for this scope)

---

## 3. APPLICATION STRUCTURE

### 3.1 Page/View Structure
```
App
└── Pricing Profile Creator
    ├── Profile Configuration Section
    │   ├── Product Selection Type (Radio buttons)
    │   ├── Search Bar
    │   ├── Filter Controls
    │   └── Based On Selector
    ├── Pricing Adjustment Section
    │   ├── Adjustment Type (Fixed/Dynamic)
    │   ├── Adjustment Mode (Increase/Decrease)
    │   └── Adjustment Value Input
    ├── Product Results Table
    │   ├── Product List with Checkboxes
    │   ├── Select All/Unselect All
    │   └── Price Preview Columns
    └── Action Buttons
        ├── Recalculate Prices
        ├── Save Profile
        └── Cancel/Reset
```

### 3.2 Recommended Component Structure
```
src/
├── App.tsx
├── components/
│   ├── PricingProfile/
│   │   ├── PricingProfileCreator.tsx       # Main container
│   │   ├── ProductSelectionType.tsx        # Radio buttons
│   │   ├── ProductSearch.tsx               # Search input
│   │   ├── ProductFilters.tsx              # Filter dropdowns
│   │   ├── PricingConfiguration.tsx        # Adjustment controls
│   │   ├── ProductTable.tsx                # Results table
│   │   └── ProductTableRow.tsx             # Table row component
│   └── shared/
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Select.tsx
│       └── Checkbox.tsx
├── services/
│   └── api.ts                              # API calls
├── types/
│   └── index.ts                            # TypeScript interfaces
├── utils/
│   ├── priceCalculation.ts                 # Price calc helper
│   └── validation.ts                       # Form validation
└── styles/
    └── globals.css
```

---

## 4. DATA MODELS (FRONTEND)

### 4.1 Product Interface
```typescript
interface Product {
  id: string;
  title: string;
  skuCode: string;
  brand: string;
  categoryId: string;
  subCategoryId: string;
  segmentId: string;
  globalWholesalePrice: number;
  selected?: boolean;  // UI state
}
```

### 4.2 Pricing Configuration Interface
```typescript
interface PricingConfiguration {
  profileName: string;
  basedOn: string;  // "global" or profile ID
  adjustmentType: "fixed" | "dynamic";
  adjustmentMode: "increase" | "decrease";
  adjustmentValue: number;
}
```

### 4.3 Calculated Price Interface
```typescript
interface CalculatedPrice {
  productId: string;
  productTitle: string;
  skuCode: string;
  category: string;
  basedOnPrice: number;
  adjustmentValue: number;
  newPrice: number;
}
```

### 4.4 Filter State Interface
```typescript
interface FilterState {
  searchQuery: string;
  brand: string;
  subCategory: string;
  segment: string;
}
```

---

## 5. USER INTERFACE SPECIFICATIONS

### 5.1 Product Selection Type Section

**Component**: Radio button group

**Options:**
- ○ One Product
- ○ Multiple Products
- ○ All Products

**Behavior:**
- Default: "Multiple Products" selected
- Selecting "One Product": Show search/filter, allow single selection
- Selecting "Multiple Products": Show search/filter, allow multi-selection with checkboxes
- Selecting "All Products": Auto-select all products, disable individual checkboxes (but allow "Unselect All")

**Visual Design:**
```
┌─────────────────────────────────────────────┐
│  Product Selection Type                     │
│  ○ One Product                              │
│  ● Multiple Products                        │
│  ○ All Products                             │
└─────────────────────────────────────────────┘
```

---

### 5.2 Search Section

**Component**: Text input with search icon

**Specifications:**
- Placeholder: "Search by product name or SKU..."
- Live search (debounced 300ms) or search on Enter key
- Clear button (×) when text is present
- Search icon on the left side

**Behavior:**
- Case-insensitive matching
- Searches both `title` and `skuCode` fields
- Updates product table in real-time

**Visual Design:**
```
┌─────────────────────────────────────────────┐
│  🔍 [Search by product name or SKU...]  ×   │
└─────────────────────────────────────────────┘
```

---

### 5.3 Filter Section

**Component**: Dropdown selects (3 filters side by side)

**Filters:**

1. **Sub-Category**
   - Options: All, Wine, Beer, Liquor & Spirits, Cider, Premixed & Ready-to-Drink, Other
   - Default: "All"

2. **Segment**
   - Options: All, Red, White, Rose, Orange, Sparkling, Port/Dessert
   - Default: "All"
   - Disabled when subCategory !== "Wine"

3. **Brand**
   - Options: All, High Garden, Koyama Wines, LacourteGodbillon
   - Default: "All"

**Behavior:**
- Filters work together (AND logic)
- Dynamically update product count
- Show "No products found" if filters return empty result

**Visual Design:**
```
┌────────────────┬────────────────┬────────────────┐
│  Sub-Category ▼│  Segment      ▼│  Brand        ▼│
│  [Wine       ] │  [Sparkling  ] │  [All        ] │
└────────────────┴────────────────┴────────────────┘
```

---

### 5.4 Based On Profile Section

**Component**: Dropdown select

**Options:**
- Global Wholesale Price (default)
- [Any existing pricing profiles]

**Specifications:**
- Label: "Based On"
- Tooltip: "Select the price profile to base calculations on"
- Initially shows only "Global Wholesale Price"

**Visual Design:**
```
┌─────────────────────────────────────────────┐
│  Based On                                   │
│  [Global Wholesale Price              ▼]   │
└─────────────────────────────────────────────┘
```

---

### 5.5 Pricing Adjustment Section

**Components**: Radio buttons + Number inputs

**Section A: Adjustment Type**
- ○ Fixed ($)
- ○ Dynamic (%)
- Default: Dynamic selected

**Section B: Adjustment Mode**
- ○ Increase (+)
- ○ Decrease (-)
- Default: Decrease selected

**Section C: Adjustment Value**
- Number input field
- Min value: 0.01
- Step: 0.01 for Fixed, 1 for Dynamic
- Placeholder: "Enter amount" or "Enter percentage"

**Validation:**
- Required field
- Must be positive number
- For Dynamic: typically 0-100% (but allow > 100%)
- Show error message if invalid

**Visual Design:**
```
┌─────────────────────────────────────────────┐
│  Price Adjustment                           │
│                                             │
│  Adjustment Type                            │
│  ○ Fixed ($)      ● Dynamic (%)            │
│                                             │
│  Adjustment Mode                            │
│  ○ Increase (+)   ● Decrease (-)           │
│                                             │
│  Adjustment Value                           │
│  [10                                    ]   │
│  └─ Enter percentage to adjust              │
└─────────────────────────────────────────────┘
```

---

### 5.6 Product Results Table

**Component**: Table with selection checkboxes

**Columns:**
1. ☐ (Checkbox) - Selection
2. Product Title
3. SKU Code
4. Category
5. Based On Price (AUD)
6. Adjustment
7. New Price (AUD)

**Features:**
- Sortable columns (optional, bonus)
- Row hover effect
- Selected row highlighting
- Checkbox in header for "Select All / Unselect All"
- Show product count: "Showing X of Y products"

**Initial State:**
- "Adjustment" and "New Price" columns show "-" or empty
- After clicking "Recalculate", show calculated values

**Visual Design:**
```
┌──────────────────────────────────────────────────────────────────────────────┐
│  ☐  Product Title          SKU         Category  Based On   Adjustment  New  │
│                                                   Price                   Price│
├──────────────────────────────────────────────────────────────────────────────┤
│  ☑  High Garden Pinot Noir HGVPIN216   Wine      $279.06    -$27.91    $251.15│
│  ☐  Koyama Methode Brut    KOYBRUNV6   Wine      $120.00    -           -     │
│  ☐  Koyama Riesling 2018   KOYNR1837   Wine      $215.04    -           -     │
└──────────────────────────────────────────────────────────────────────────────┘
     Showing 3 of 5 products | 1 selected
```

**Empty State:**
```
┌─────────────────────────────────────────────┐
│                                             │
│           No products found                 │
│     Try adjusting your filters              │
│                                             │
└─────────────────────────────────────────────┘
```

---

### 5.7 Action Buttons Section

**Buttons:**

1. **Recalculate Prices** (Primary button)
   - Position: Bottom right
   - Action: Calculate and display new prices in table
   - Disabled when: No products selected OR no adjustment value
   - Color: Blue/Primary
   - Text: "Recalculate Prices"

2. **Save Profile** (Primary button)
   - Position: Next to Recalculate
   - Action: Save pricing profile via API
   - Disabled when: No calculated prices OR no profile name
   - Color: Green/Success
   - Text: "Save Profile"

3. **Reset** (Secondary button)
   - Position: Left side
   - Action: Clear all selections and reset form
   - Color: Gray/Secondary
   - Text: "Reset"

**Visual Design:**
```
┌─────────────────────────────────────────────┐
│                                             │
│  [Reset]              [Recalculate Prices]  │
│                       [Save Profile]        │
└─────────────────────────────────────────────┘
```

---

## 6. USER FLOWS

### 6.1 Basic Flow: Create Pricing Profile

**Steps:**
1. User lands on Pricing Profile Creator page
2. User selects product selection type (default: Multiple Products)
3. User searches or filters products
4. User selects one or more products via checkboxes
5. User selects "Based On" profile (default: Global)
6. User configures adjustment (type, mode, value)
7. User clicks "Recalculate Prices"
8. System displays calculated prices in table
9. User reviews prices
10. User clicks "Save Profile"
11. System saves profile and shows success message

### 6.2 Search & Filter Flow

**Scenario A: Search by Product Name**
1. User types "Pinot" in search box
2. Table filters to show only "High Garden Pinot Noir 2021"
3. User can select and proceed

**Scenario B: Filter by Multiple Criteria**
1. User selects "Wine" from Sub-Category dropdown
2. User selects "Sparkling" from Segment dropdown
3. Table shows only sparkling wines (2 products)
4. User can select and proceed

**Scenario C: Combined Search + Filter**
1. User types "Koyama" in search
2. User selects "White" from Segment
3. Table shows "Koyama Tussock Riesling 2019" only

### 6.3 Select All Products Flow

**Steps:**
1. User clicks "All Products" radio button
2. System automatically selects all products
3. Checkboxes in table are checked
4. Individual checkboxes are disabled (or user can click "Unselect All")
5. User proceeds with pricing configuration

### 6.4 Price Calculation Flow

**Example 1: 10% Discount**
1. User selects products with base price $279.06
2. User selects Dynamic, Decrease, 10%
3. User clicks "Recalculate"
4. Table shows:
   - Based On Price: $279.06
   - Adjustment: -$27.91
   - New Price: $251.15

**Example 2: $5 Increase**
1. User selects products with base price $120.00
2. User selects Fixed, Increase, $5
3. User clicks "Recalculate"
4. Table shows:
   - Based On Price: $120.00
   - Adjustment: +$5.00
   - New Price: $125.00

### 6.5 Error Handling Flow

**Scenario A: No Products Selected**
1. User clicks "Recalculate Prices" without selecting products
2. System shows error message: "Please select at least one product"
3. Button remains disabled

**Scenario B: Invalid Adjustment Value**
1. User enters "0" or negative number
2. System shows error: "Adjustment value must be positive"
3. Input field shows red border

**Scenario C: API Error**
1. User clicks "Save Profile"
2. API request fails
3. System shows error notification: "Failed to save profile. Please try again."
4. Profile is not saved

---

## 7. API INTEGRATION REQUIREMENTS

### 7.1 API Service Module

Create a centralized API service:

```typescript
// services/api.ts
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const productsAPI = {
  getAll: (params?: {
    search?: string;
    brand?: string;
    subCategory?: string;
    segment?: string;
  }) => apiClient.get('/products', { params }),
  
  getById: (id: string) => apiClient.get(`/products/${id}`),
};

export const pricingAPI = {
  calculatePrices: (data: {
    basedOn: string;
    adjustmentType: string;
    adjustmentMode: string;
    adjustmentValue: number;
    productIds: string[];
  }) => apiClient.post('/pricing-profiles/calculate', data),
  
  createProfile: (data: any) => apiClient.post('/pricing-profiles', data),
  
  getProfiles: () => apiClient.get('/pricing-profiles'),
};

export const referenceAPI = {
  getCategories: () => apiClient.get('/reference/categories'),
};
```

### 7.2 API Calls Mapping

| User Action | API Endpoint | Method | Purpose |
|-------------|-------------|--------|---------|
| Page load | `/api/products` | GET | Fetch all products |
| Search products | `/api/products?search={query}` | GET | Filter by search |
| Filter by brand | `/api/products?brand={brand}` | GET | Filter by brand |
| Combined filter | `/api/products?brand={brand}&segment={segment}` | GET | Multiple filters |
| Recalculate prices | `/api/pricing-profiles/calculate` | POST | Preview prices |
| Save profile | `/api/pricing-profiles` | POST | Save pricing profile |
| Load profiles | `/api/pricing-profiles` | GET | Populate "Based On" dropdown |

### 7.3 Loading States

**Requirements:**
- Show loading spinner when fetching products
- Disable buttons during API calls
- Show inline loading for price calculations
- Display progress for save operations

**Loading UI Examples:**
```typescript
// Button loading state
<button disabled={isLoading}>
  {isLoading ? 'Calculating...' : 'Recalculate Prices'}
</button>

// Table loading state
{isLoading ? <LoadingSpinner /> : <ProductTable products={products} />}
```

### 7.4 Error Handling

**Display Errors:**
- Toast notifications (recommended)
- Inline error messages
- Form validation errors

**Error Types:**
- Network errors: "Unable to connect to server"
- Validation errors: Show specific field errors
- Server errors: "Something went wrong. Please try again."

---

## 8. STATE MANAGEMENT

### 8.1 Component State Structure

```typescript
// Main component state
interface PricingProfileState {
  // Product data
  products: Product[];
  filteredProducts: Product[];
  selectedProductIds: string[];
  
  // Filters
  searchQuery: string;
  filters: {
    brand: string;
    subCategory: string;
    segment: string;
  };
  
  // Pricing configuration
  pricingConfig: {
    profileName: string;
    basedOn: string;
    adjustmentType: 'fixed' | 'dynamic';
    adjustmentMode: 'increase' | 'decrease';
    adjustmentValue: number;
  };
  
  // Calculated results
  calculatedPrices: CalculatedPrice[];
  
  // UI state
  selectionType: 'one' | 'multiple' | 'all';
  isLoading: boolean;
  isCalculating: boolean;
  isSaving: boolean;
  error: string | null;
}
```

### 8.2 State Management Recommendations

**Option 1: useState + useReducer (Recommended for this scope)**
```typescript
const [products, setProducts] = useState<Product[]>([]);
const [selectedIds, setSelectedIds] = useState<string[]>([]);
const [pricingConfig, dispatchPricing] = useReducer(pricingReducer, initialState);
```

**Option 2: React Context (If sharing state across multiple components)**
```typescript
const PricingContext = createContext<PricingContextType | undefined>(undefined);
```

**Not Recommended:**
- Redux (overkill for this scope)
- MobX (unnecessary complexity)

---

## 9. CLIENT-SIDE VALIDATION

### 9.1 Form Validation Rules

**Product Selection:**
- At least 1 product must be selected
- Error: "Please select at least one product"

**Profile Name:**
- Required field
- Min length: 3 characters
- Max length: 100 characters
- Error: "Profile name must be between 3-100 characters"

**Adjustment Value:**
- Required field
- Must be positive number (> 0)
- For Fixed: Any positive number
- For Dynamic: Typically 0-100, but allow higher
- Error: "Adjustment value must be greater than 0"

**Based On:**
- Must select a valid option
- Default to "global" if none selected

### 9.2 Real-Time Validation

**Implement validation on:**
- `onBlur` for text inputs
- `onChange` for immediate feedback (optional)
- `onSubmit` before API calls

**Visual Indicators:**
- Red border for invalid fields
- Error message below field
- Green checkmark for valid fields (optional)

---

## 10. PRICE CALCULATION (CLIENT-SIDE)

### 10.1 Calculation Helper Function

```typescript
// utils/priceCalculation.ts
export function calculateNewPrice(
  basedOnPrice: number,
  adjustmentType: 'fixed' | 'dynamic',
  adjustmentMode: 'increase' | 'decrease',
  adjustmentValue: number
): { adjustment: number; newPrice: number } {
  let adjustment: number;
  let newPrice: number;

  if (adjustmentType === 'fixed') {
    adjustment = adjustmentMode === 'increase' ? adjustmentValue : -adjustmentValue;
    newPrice = basedOnPrice + adjustment;
  } else {
    // Dynamic (percentage)
    const percentageAmount = basedOnPrice * (adjustmentValue / 100);
    adjustment = adjustmentMode === 'increase' ? percentageAmount : -percentageAmount;
    newPrice = basedOnPrice + adjustment;
  }

  // Prevent negative prices
  if (newPrice < 0) {
    throw new Error('Calculated price cannot be negative');
  }

  // Round to 2 decimal places
  return {
    adjustment: Math.round(adjustment * 100) / 100,
    newPrice: Math.round(newPrice * 100) / 100,
  };
}
```

### 10.2 Usage in Component

```typescript
const handleRecalculate = async () => {
  setIsCalculating(true);
  
  try {
    const response = await pricingAPI.calculatePrices({
      basedOn: pricingConfig.basedOn,
      adjustmentType: pricingConfig.adjustmentType,
      adjustmentMode: pricingConfig.adjustmentMode,
      adjustmentValue: pricingConfig.adjustmentValue,
      productIds: selectedProductIds,
    });
    
    setCalculatedPrices(response.data.data);
  } catch (error) {
    setError('Failed to calculate prices. Please try again.');
  } finally {
    setIsCalculating(false);
  }
};
```

---

## 11. RESPONSIVE DESIGN REQUIREMENTS

### 11.1 Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

### 11.2 Mobile Adaptations

**Search & Filters:**
- Stack vertically on mobile
- Full-width dropdowns
- Collapsible filter section (optional)

**Product Table:**
- Horizontal scroll on mobile
- Or convert to card layout
- Show essential columns only (Title, SKU, New Price)

**Action Buttons:**
- Stack vertically on mobile
- Full-width buttons

### 11.3 Tablet Adaptations
- Two-column layout for filters
- Table with horizontal scroll if needed
- Buttons remain side-by-side

---

## 12. ACCESSIBILITY REQUIREMENTS

### 12.1 Keyboard Navigation
- All interactive elements accessible via Tab key
- Logical tab order
- Enter key submits forms
- Escape key closes modals/dropdowns

### 12.2 ARIA Labels
```tsx
<input
  type="text"
  aria-label="Search products by name or SKU"
  placeholder="Search..."
/>

<button aria-label="Recalculate prices">
  Recalculate
</button>

<table aria-label="Product pricing table">
  ...
</table>
```

### 12.3 Screen Reader Support
- Meaningful labels for all inputs
- Status announcements for loading/success/error
- Table headers properly associated with cells

---

## 13. USER FEEDBACK & NOTIFICATIONS

### 13.1 Success Messages
- "Pricing profile created successfully"
- "Prices recalculated"
- Auto-dismiss after 3 seconds

### 13.2 Error Messages
- "Failed to load products"
- "Invalid adjustment value"
- "No products selected"
- "Failed to save profile. Please try again."

### 13.3 Loading Indicators
- Spinner for page load
- Button loading state ("Calculating...")
- Progress bar for long operations

### 13.4 Confirmation Dialogs
- "Are you sure you want to reset?" (optional)
- "Unsaved changes will be lost" (if navigating away)

---

## 14. STYLING GUIDELINES

### 14.1 Color Scheme
**Primary Colors:**
- Primary: #2563eb (Blue)
- Success: #10b981 (Green)
- Danger: #ef4444 (Red)
- Warning: #f59e0b (Amber)
- Neutral: #6b7280 (Gray)

**Usage:**
- Primary buttons: Primary color
- Success messages: Success color
- Error messages: Danger color
- Disabled state: Neutral color with opacity

### 14.2 Typography
- **Font Family**: System fonts or Inter, Roboto
- **Headings**: 
  - H1: 24px, bold
  - H2: 20px, semibold
  - H3: 16px, semibold
- **Body**: 14px, regular
- **Labels**: 12px, medium

### 14.3 Spacing
- Section spacing: 24px
- Component spacing: 16px
- Input padding: 12px
- Button padding: 12px 24px

### 14.4 Components
- **Inputs**: 
  - Border: 1px solid #d1d5db
  - Border radius: 6px
  - Focus: 2px solid primary color
- **Buttons**:
  - Border radius: 6px
  - Height: 40px
  - Shadow on hover
- **Table**:
  - Striped rows (optional)
  - Hover effect
  - Border: 1px solid #e5e7eb

---

## 15. PERFORMANCE OPTIMIZATION

### 15.1 React Best Practices
- Use `useMemo` for expensive calculations
- Use `useCallback` for event handlers passed to children
- Debounce search input (300ms)
- Virtualize long product lists (optional, if >100 products)

### 15.2 Example: Debounced Search
```typescript
import { useState, useEffect } from 'react';

const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

// Usage
const debouncedSearch = useDebounce(searchQuery, 300);
```

### 15.3 Bundle Size
- Use tree-shaking
- Import only needed components from UI libraries
- Code splitting (if multiple routes)

---

## 16. TESTING CONSIDERATIONS (BONUS)

### 16.1 Unit Tests
- Price calculation function
- Form validation logic
- Filter/search functions

### 16.2 Component Tests
- Product table rendering
- Button click handlers
- Form submission

### 16.3 Integration Tests
- End-to-end user flow
- API integration
- Error handling

### 16.4 Test Examples
```typescript
// Price calculation test
test('calculates 10% decrease correctly', () => {
  const result = calculateNewPrice(100, 'dynamic', 'decrease', 10);
  expect(result.newPrice).toBe(90);
  expect(result.adjustment).toBe(-10);
});

// Component test
test('disables Recalculate button when no products selected', () => {
  render(<PricingProfileCreator />);
  const button = screen.getByText('Recalculate Prices');
  expect(button).toBeDisabled();
});
```

---

## 17. BROWSER COMPATIBILITY

### 17.1 Target Browsers
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### 17.2 Polyfills (if needed)
- Not required for modern React apps
- Use Create React App or Vite defaults

---

## 18. DELIVERABLES CHECKLIST

### 18.1 Code
- [ ] React app with all components
- [ ] Product search and filter functionality
- [ ] Product selection (one/multiple/all)
- [ ] Pricing configuration UI
- [ ] Price calculation and preview
- [ ] API integration
- [ ] Form validation
- [ ] Error handling
- [ ] Responsive design

### 18.2 User Experience
- [ ] Clear visual hierarchy
- [ ] Intuitive flow
- [ ] Helpful error messages
- [ ] Loading states
- [ ] Success feedback

### 18.3 Documentation
- [ ] README with setup instructions
- [ ] Component documentation (comments)
- [ ] API integration notes

---

## 19. TECHNICAL NOTES & TRADEOFFS

### 19.1 Client-Side vs Server-Side Calculation

**Current Approach**: Call API for calculation

**Pros:**
- Single source of truth
- Consistent calculation logic
- Backend validation

**Cons:**
- Network latency
- Additional API call

**Alternative**: Calculate on client, validate on server
- Faster preview
- Still validate when saving

### 19.2 State Management Choice

**Recommendation**: useState + Context (if needed)

**For this scope:**
- Component state is sufficient
- No global state needed
- Context only if sharing across multiple components

**Future consideration:**
- Redux/Zustand if app grows
- React Query for server state

### 19.3 CSS Framework Choice

**Tailwind CSS** (Recommended):
- Rapid development
- Utility-first
- Small bundle size

**Material-UI** (Good alternative):
- Pre-built components
- Consistent design
- Accessibility built-in

**Plain CSS** (If time permits):
- Full control
- Lighter weight
- Requires more effort

---

## 20. FUTURE ENHANCEMENTS (DOCUMENT BUT DON'T IMPLEMENT)

These should be mentioned in your README as "what I'd do with more time":

1. **Advanced Search**
   - Fuzzy search with highlighting
   - Search history
   - Autocomplete suggestions

2. **Batch Operations**
   - Bulk select by filter
   - Apply adjustments to multiple profiles
   - Export to CSV

3. **Visualization**
   - Price change charts
   - Comparison graphs
   - Profit margin calculator

4. **UX Improvements**
   - Drag-and-drop product selection
   - Keyboard shortcuts
   - Dark mode
   - Undo/redo functionality

5. **Performance**
   - Virtual scrolling for large datasets
   - Optimistic UI updates
   - Caching with React Query

6. **Offline Support**
   - Service workers
   - Local storage
   - Sync when online

---

## 21. GETTING STARTED

### 21.1 Initial Setup with Vite (Recommended)
```bash
npm create vite@latest foboh-pricing-frontend -- --template react-ts
cd foboh-pricing-frontend
npm install
npm install axios
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm run dev
```

### 21.2 Initial Setup with Create React App
```bash
npx create-react-app foboh-pricing-frontend --template typescript
cd foboh-pricing-frontend
npm install axios
npm start
```

### 21.3 Development Workflow
1. Set up project structure
2. Create API service layer
3. Build product search & filter components
4. Implement product table
5. Add pricing configuration UI
6. Integrate price calculation
7. Add form validation
8. Polish UI and responsiveness
9. Test all features
10. Write README

---

## 22. SUCCESS CRITERIA

Your frontend will be evaluated on:

1. **Functionality** (40%)
   - All features work as specified
   - Search and filters function correctly
   - Price calculations are accurate
   - API integration works properly

2. **User Experience** (30%)
   - Intuitive interface
   - Clear visual feedback
   - Smooth interactions
   - Helpful error messages

3. **Code Quality** (20%)
   - Clean, organized code
   - Proper component structure
   - Good naming conventions
   - Error handling

4. **Design** (10%)
   - Professional appearance
   - Responsive layout
   - Consistent styling
   - Accessibility considerations
