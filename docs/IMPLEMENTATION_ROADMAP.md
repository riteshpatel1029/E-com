# 🗺️ Implementation Roadmap

This document outlines the step-by-step development phases for constructing the **Mini E-Commerce Demo Project (MERN Stack)** once the coding phase commences.

---

## 📋 Table of Contents

- [Phase 1: Project Scaffolding & Setup](#phase-1-project-scaffolding--setup)
- [Phase 2: Backend Development (Node.js + Express + MongoDB)](#phase-2-backend-development-nodejs--express--mongodb)
- [Phase 3: Frontend Infrastructure (React + Vite + Tailwind CSS)](#phase-3-frontend-infrastructure-react--vite--tailwind-css)
- [Phase 4: Storefront & Customer Features](#phase-4-storefront--customer-features)
- [Phase 5: Admin Panel & Order Lifecycle](#phase-5-admin-panel--order-lifecycle)
- [Phase 6: Testing, Edge Cases & Demo Verification](#phase-6-testing-edge-cases--demo-verification)

---

## Phase 1: Project Scaffolding & Setup

1. **Client Setup**:
   - Initialize React SPA using Vite: `npm create vite@latest client -- --template react`.
   - Install Tailwind CSS, PostCSS, and Autoprefixer: `npm install -D tailwindcss postcss autoprefixer`.
   - Configure `tailwind.config.js` and `src/index.css`.
   - Install dependencies: `axios`, `react-router-dom`, `lucide-react` (or icons).
2. **Server Setup**:
   - Initialize Node project inside `/server`: `npm init -y`.
   - Install runtime packages: `express`, `mongoose`, `dotenv`, `cors`, `jsonwebtoken`, `bcryptjs`.
   - Install dev dependency: `nodemon`.
   - Create `.env.example` with `PORT`, `MONGO_URI`, and `JWT_SECRET`.

---

## Phase 2: Backend Development (Node.js + Express + MongoDB)

1. **Database Configuration**:
   - Connect to MongoDB using Mongoose with resilient connection pooling.
2. **Models Creation**:
   - Create `User.js` with password hashing pre-save hook and `matchPassword` method.
   - Create `Category.js` with unique name indexing.
   - Create `Product.js` with category reference and text search indexing.
   - Create `Order.js` with embedded product snapshots and shipping details.
3. **Middleware**:
   - `authMiddleware.js`: Verify JWT bearer token, decode user id, and attach user to `req.user`.
   - `adminMiddleware.js`: Verify `req.user.role === 'admin'`.
   - `errorMiddleware.js`: Global exception and validation error handler.
4. **Controllers & Routes**:
   - `/api/auth`: Register and Login endpoints.
   - `/api/categories`: Public GET, Admin POST/PUT/DELETE.
   - `/api/products`: Public GET with query filters (`?category=` & `?search=`), GET by ID, Admin POST/PUT/DELETE.
   - `/api/orders`: Customer POST (with database price lookup and stock decrement), Customer GET `/my-orders`, Admin GET `/admin/orders`, Admin PATCH `/:id/status`.
5. **Initial Seed Script**:
   - Script to seed default categories, sample products, and an admin user.

---

## Phase 3: Frontend Infrastructure (React + Vite + Tailwind CSS)

1. **Design Tokens & Global Styles**:
   - Base typography, buttons, inputs, badge styles in Tailwind.
2. **Global State Contexts**:
   - `AuthContext.jsx`: Handles token storage in `localStorage`, user state, login, register, and logout.
   - `CartContext.jsx`: Handles cart items array, item add/remove/quantity update with stock ceiling, and `localStorage` sync.
3. **API Client**:
   - Setup Axios instance (`src/services/api.js`) with request interceptor attaching JWT token.
4. **Routing Structure**:
   - Public route wrappers.
   - Protected customer routes wrapper (`ProtectedRoute.jsx`).
   - Protected admin routes wrapper (`AdminRoute.jsx`).

---

## Phase 4: Storefront & Customer Features

1. **Common Layout Components**:
   - `Navbar`: Search input, category links, cart badge count, user profile dropdown.
   - `Footer`: Clean branding, COD notice, links.
2. **Home Page (`/`)**:
   - Hero banner, featured category cards, latest products carousel/grid.
3. **Product Catalog Page (`/products`)**:
   - Category filter pills (`All | Electronics | Fashion | Shoes`).
   - Keyword search bar.
   - Product cards grid with responsive layout.
4. **Product Details Page (`/products/:id`)**:
   - High-res product photo, category tag, price, description, live stock indicator, quantity counter, and Add to Cart button.
5. **Shopping Cart Page (`/cart`)**:
   - Line items table, quantity controls (+ / -) disabled at stock limit, trash/delete action, subtotal summary, "Proceed to Checkout" button.
6. **Checkout Page (`/checkout`)**:
   - Shipping address form (Name, Phone, Address, City, Pincode).
   - Cash on Delivery badge.
   - "Place Order" button.
7. **My Orders Page (`/my-orders`)**:
   - Visual cards showing historic orders, item breakdowns, total price, and color-coded status badges.

---

## Phase 5: Admin Panel & Order Lifecycle

1. **Admin Layout**:
   - Clean sidebar with Dashboard, Categories, Products, and Orders navigation.
2. **Admin Categories (`/admin/categories`)**:
   - List view with creation modal, edit modal, and delete confirmation dialog.
3. **Admin Products (`/admin/products`)**:
   - Inventory table with product thumbnails, category name, price, stock counts.
   - Add/Edit product modal with category selector and image URL preview.
   - Delete action with confirmation modal.
4. **Admin Orders (`/admin/orders`)**:
   - Customer orders table showing customer email, placed date, item count, total price, and status.
   - Instant status changer dropdown: `Pending` ➔ `Confirmed` ➔ `Shipped` ➔ `Delivered` ➔ `Cancelled`.

---

## Phase 6: Testing, Edge Cases & Demo Verification

1. **Price Manipulation Defense**:
   - Verify that altering cart price in frontend localStorage has zero impact on server order total.
2. **Stock Boundary Tests**:
   - Verify that ordering more than available stock is rejected with a 400 Bad Request.
   - Verify that stock decrements properly upon successful order placement.
3. **Role Guard Verification**:
   - Verify that non-admin accounts cannot access `/admin/*` or invoke `/api/admin/*` endpoints.
4. **Responsive Testing**:
   - Ensure mobile, tablet, and desktop views render cleanly without overflow or broken layouts.
