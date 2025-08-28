# ☕ CoffeeCart MVP

A wholesale sourcing platform for coffee shops that allows owners to source everything they need from multiple suppliers in one place.

## Features

### Core Functionality

- **Product Catalog**: Browse 30+ products across 4 categories (Coffee Beans, Dairy/Alternatives, Bakery, Disposables)
- **Multi-Supplier Cart**: Add items from different suppliers to a single cart
- **Smart Filtering**: Filter by category, search products, sort by price/rating, and price range filtering
- **MOQ Validation**: Minimum Order Quantity validation with error states

### Cart & Checkout

- **Slide-out Cart Drawer**: Amazon-style cart drawer for quick cart management
- **Detailed Cart Page**: Full cart management grouped by supplier
- **Intelligent Delivery Calculations**:
  - Per-supplier delivery windows based on their schedules
  - Consolidated delivery window showing when all items will arrive
  - Optimal delivery day recommendations

### Order Management

- **Order Confirmation**: Complete order details with PDF invoice generation
- **Order History**: View past orders with expandable details
- **Reorder Functionality**: One-click reordering of previous orders
- **Quality Assurance**: Report issues with orders (missing, damaged, wrong items)

### Technical Features

- **100 Mock Suppliers**: Realistic supplier data with different delivery schedules and MOQs
- **Local Storage**: All data persisted locally (no backend required for MVP)
- **PDF Generation**: Invoice and order summary PDF downloads
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Getting Started

1. **Install Dependencies**:

   ```bash
   npm install
   ```

2. **Run Development Server**:

   ```bash
   npm run dev
   ```

3. **Open in Browser**: Navigate to `http://localhost:3000`

## User Flow

1. **Browse Catalog**: Start on the homepage to view products from multiple suppliers
2. **Add to Cart**: Select quantities (respecting MOQs) and add items to cart
3. **Review Cart**: Use the cart drawer for quick edits or go to the full cart page
4. **Checkout**: Review delivery windows and place your order
5. **Confirmation**: Download invoices and view delivery details
6. **Order History**: Track past orders and reorder items
7. **Quality Assurance**: Report any issues with delivered orders

## Key Components

- **CatalogPage**: Main product browsing with filtering and search
- **CartDrawer**: Slide-out cart with quick edit capabilities
- **CartPage**: Detailed cart management grouped by supplier
- **CheckoutPage**: Delivery window calculations and order placement
- **ConfirmationPage**: Order confirmation with PDF downloads
- **OrdersPage**: Order history with expandable details
- **ReportIssuePage**: Quality assurance issue reporting

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS
- **State Management**: React Context + localStorage
- **PDF Generation**: jsPDF
- **TypeScript**: Full type safety

## Mock Data

- **100 Suppliers**: Diverse suppliers with realistic delivery schedules
- **30 Products**: Covering all coffee shop essentials
- **Realistic MOQs**: Varying minimum order quantities
- **Delivery Schedules**: Different delivery days and cutoff times per supplier

## Value Proposition Test

This MVP tests the core value proposition:

- Does "one cart, one invoice, consolidated delivery window" resonate with café owners?
- Do they like seeing suppliers side-by-side with ratings?
- Does the flow feel simpler than juggling 5 supplier portals?

## Next Steps

For production, this MVP would need:

- Real supplier integrations
- Payment processing
- User authentication
- Backend API
- Real-time delivery tracking
- Supplier onboarding system

---

Built with ❤️ for coffee shop owners who deserve better wholesale sourcing tools.
