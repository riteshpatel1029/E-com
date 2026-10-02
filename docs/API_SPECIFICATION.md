# 📡 REST API Specification

This document provides the complete API contract for the **Mini E-Commerce Demo Backend Service**, specifying all endpoints, HTTP methods, headers, authentication requirements, query parameters, request bodies, and JSON responses.

---

## 📋 Table of Contents

- [General Conventions](#general-conventions)
- [1. Authentication Endpoints](#1-authentication-endpoints)
  - [1.1 Register Customer](#11-register-customer)
  - [1.2 Login User / Admin](#12-login-user--admin)
- [2. Category Management Endpoints](#2-category-management-endpoints)
  - [2.1 List All Categories](#21-list-all-categories)
  - [2.2 Create Category (Admin)](#22-create-category-admin)
  - [2.3 Update Category (Admin)](#23-update-category-admin)
  - [2.4 Delete Category (Admin)](#24-delete-category-admin)
- [3. Product Catalog Endpoints](#3-product-catalog-endpoints)
  - [3.1 List Products (Filter & Search)](#31-list-products-filter--search)
  - [3.2 Get Single Product Details](#32-get-single-product-details)
  - [3.3 Create Product (Admin)](#33-create-product-admin)
  - [3.4 Update Product (Admin)](#34-update-product-admin)
  - [3.5 Delete Product (Admin)](#35-delete-product-admin)
- [4. Order Management Endpoints](#4-order-management-endpoints)
  - [4.1 Place Order (Customer)](#41-place-order-customer)
  - [4.2 Get Logged-in Customer Orders](#42-get-logged-in-customer-orders)
  - [4.3 Get All Customer Orders (Admin)](#43-get-all-customer-orders-admin)
  - [4.4 Update Order Status (Admin)](#44-update-order-status-admin)
- [5. Standard Error Responses](#5-standard-error-responses)

---

## General Conventions

- **Base URL**: `http://localhost:5000/api`
- **Content-Type**: `application/json`
- **Authorization Header**:
  ```http
  Authorization: Bearer <jwt_token>
  ```
- **Standard Success Wrapper**:
  ```json
  {
    "success": true,
    "data": ...
  }
  ```

---

## 1. Authentication Endpoints

### 1.1 Register Customer

Registers a new customer account.

- **Method**: `POST`
- **Endpoint**: `/api/auth/register`
- **Access**: Public
- **Request Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securePassword123",
    "confirmPassword": "securePassword123"
  }
  ```
- **Validation Rules**:
  - `name`: Required, trimmed string.
  - `email`: Required, valid email format, unique.
  - `password`: Required, minimum 6 characters.
  - `confirmPassword`: Required, must exactly match `password`.
- **Response `201 Created`**:
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "data": {
      "user": {
        "_id": "65b8e92f1b4a92c3a4f89101",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "customer"
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
  ```
- **Error Responses**:
  - `400 Bad Request`: Passwords do not match or email already exists.

---

### 1.2 Login User / Admin

Authenticates an existing user (customer or admin) and returns a signed JWT.

- **Method**: `POST`
- **Endpoint**: `/api/auth/login`
- **Access**: Public
- **Request Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "securePassword123"
  }
  ```
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "user": {
        "_id": "65b8e92f1b4a92c3a4f89101",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "customer"
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
  ```
- **Error Responses**:
  - `401 Unauthorized`: Invalid email or password.

---

## 2. Category Management Endpoints

### 2.1 List All Categories

Retrieves all available product categories.

- **Method**: `GET`
- **Endpoint**: `/api/categories`
- **Access**: Public
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "data": [
      {
        "_id": "65b8ec121b4a92c3a4f89110",
        "name": "Electronics",
        "description": "Smartphones, Laptops, and Gadgets",
        "createdAt": "2026-10-01T10:00:00.000Z"
      },
      {
        "_id": "65b8ec151b4a92c3a4f89111",
        "name": "Fashion",
        "description": "Clothing, Apparel and Accessories",
        "createdAt": "2026-10-01T10:05:00.000Z"
      }
    ]
  }
  ```

---

### 2.2 Create Category (Admin)

Creates a new category.

- **Method**: `POST`
- **Endpoint**: `/api/categories`
- **Access**: Private (Admin Only)
- **Headers**: `Authorization: Bearer <admin_token>`
- **Request Body**:
  ```json
  {
    "name": "Shoes",
    "description": "Footwear, sneakers, and sports shoes"
  }
  ```
- **Validation Rules**:
  - `name`: Required, unique string.
  - `description`: Optional / required string.
- **Response `201 Created`**:
  ```json
  {
    "success": true,
    "message": "Category created successfully",
    "data": {
      "_id": "65b8ec301b4a92c3a4f89112",
      "name": "Shoes",
      "description": "Footwear, sneakers, and sports shoes",
      "createdAt": "2026-10-02T12:00:00.000Z"
    }
  }
  ```

---

### 2.3 Update Category (Admin)

Updates an existing category.

- **Method**: `PUT`
- **Endpoint**: `/api/categories/:id`
- **Access**: Private (Admin Only)
- **Headers**: `Authorization: Bearer <admin_token>`
- **Request Body**:
  ```json
  {
    "name": "Footwear & Shoes",
    "description": "Updated category description"
  }
  ```
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "message": "Category updated successfully",
    "data": {
      "_id": "65b8ec301b4a92c3a4f89112",
      "name": "Footwear & Shoes",
      "description": "Updated category description",
      "updatedAt": "2026-10-02T12:30:00.000Z"
    }
  }
  ```

---

### 2.4 Delete Category (Admin)

Deletes an existing category.

- **Method**: `DELETE`
- **Endpoint**: `/api/categories/:id`
- **Access**: Private (Admin Only)
- **Headers**: `Authorization: Bearer <admin_token>`
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "message": "Category deleted successfully"
  }
  ```

---

## 3. Product Catalog Endpoints

### 3.1 List Products (Filter & Search)

Retrieves products with optional search query and category filtering.

- **Method**: `GET`
- **Endpoint**: `/api/products`
- **Query Parameters**:
  - `category`: (Optional) Category ID or Category name (case-insensitive)
  - `search`: (Optional) Search term matched against product title or description
- **Example URL**: `/api/products?category=Electronics&search=phone`
- **Access**: Public
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "count": 1,
    "data": [
      {
        "_id": "65b8ee901b4a92c3a4f89125",
        "name": "Smartphone Pro Max",
        "description": "Flagship 5G smartphone with 120Hz OLED display",
        "price": 899.99,
        "image": "https://images.unsplash.com/photo-1511707171634-5f897ff02560",
        "category": {
          "_id": "65b8ec121b4a92c3a4f89110",
          "name": "Electronics"
        },
        "stock": 15,
        "createdAt": "2026-10-01T11:00:00.000Z"
      }
    ]
  }
  ```

---

### 3.2 Get Single Product Details

Retrieves detailed information for a specific product.

- **Method**: `GET`
- **Endpoint**: `/api/products/:id`
- **Access**: Public
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "data": {
      "_id": "65b8ee901b4a92c3a4f89125",
      "name": "Smartphone Pro Max",
      "description": "Flagship 5G smartphone with 120Hz OLED display",
      "price": 899.99,
      "image": "https://images.unsplash.com/photo-1511707171634-5f897ff02560",
      "category": {
        "_id": "65b8ec121b4a92c3a4f89110",
        "name": "Electronics",
        "description": "Smartphones, Laptops, and Gadgets"
      },
      "stock": 15,
      "createdAt": "2026-10-01T11:00:00.000Z"
    }
  }
  ```
- **Error Responses**:
  - `404 Not Found`: Product not found.

---

### 3.3 Create Product (Admin)

Creates a new product in the catalog.

- **Method**: `POST`
- **Endpoint**: `/api/products`
- **Access**: Private (Admin Only)
- **Headers**: `Authorization: Bearer <admin_token>`
- **Request Body**:
  ```json
  {
    "name": "Wireless Noise-Cancelling Headphones",
    "description": "Premium over-ear headphones with active noise cancellation",
    "price": 199.99,
    "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
    "category": "65b8ec121b4a92c3a4f89110",
    "stock": 25
  }
  ```
- **Validation Rules**:
  - `name`: Required string.
  - `description`: Required string.
  - `price`: Required, number greater than 0.
  - `image`: Required valid URL.
  - `category`: Required valid Mongoose Category `ObjectId`.
  - `stock`: Required, integer >= 0.
- **Response `201 Created`**:
  ```json
  {
    "success": true,
    "message": "Product created successfully",
    "data": {
      "_id": "65b8ef201b4a92c3a4f89140",
      "name": "Wireless Noise-Cancelling Headphones",
      "description": "Premium over-ear headphones with active noise cancellation",
      "price": 199.99,
      "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
      "category": "65b8ec121b4a92c3a4f89110",
      "stock": 25,
      "createdAt": "2026-10-02T12:15:00.000Z"
    }
  }
  ```

---

### 3.4 Update Product (Admin)

Updates an existing product's information or inventory level.

- **Method**: `PUT`
- **Endpoint**: `/api/products/:id`
- **Access**: Private (Admin Only)
- **Headers**: `Authorization: Bearer <admin_token>`
- **Request Body**:
  ```json
  {
    "price": 179.99,
    "stock": 20
  }
  ```
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "message": "Product updated successfully",
    "data": {
      "_id": "65b8ef201b4a92c3a4f89140",
      "name": "Wireless Noise-Cancelling Headphones",
      "price": 179.99,
      "stock": 20,
      "updatedAt": "2026-10-02T12:35:00.000Z"
    }
  }
  ```

---

### 3.5 Delete Product (Admin)

Removes a product from the database.

- **Method**: `DELETE`
- **Endpoint**: `/api/products/:id`
- **Access**: Private (Admin Only)
- **Headers**: `Authorization: Bearer <admin_token>`
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "message": "Product deleted successfully"
  }
  ```

---

## 4. Order Management Endpoints

### 4.1 Place Order (Customer)

Creates an order for the authenticated customer. **The server recalculates the total amount directly from MongoDB to prevent client-side price manipulation.**

- **Method**: `POST`
- **Endpoint**: `/api/orders`
- **Access**: Private (Customer)
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "items": [
      {
        "product": "65b8ee901b4a92c3a4f89125",
        "quantity": 1
      },
      {
        "product": "65b8ef201b4a92c3a4f89140",
        "quantity": 2
      }
    ],
    "shippingAddress": {
      "name": "John Doe",
      "phone": "+1234567890",
      "address": "456 Market Street, Apt 3B",
      "city": "Metropolis",
      "pincode": "10001"
    }
  }
  ```
- **Backend Verification Steps**:
  1. For each item in `items`, fetch `Product.findById(item.product)`.
  2. If product not found or `product.stock < item.quantity`, return `400 Bad Request`.
  3. Compute item price = `product.price * item.quantity`.
  4. Snapshot product details (`name`, `price`, `image`).
  5. Calculate `totalAmount = sum(item prices)`.
  6. Decrement `product.stock` atomically by `item.quantity`.
  7. Save `Order` with `status: "Pending"`.
- **Response `201 Created`**:
  ```json
  {
    "success": true,
    "message": "Order placed successfully",
    "data": {
      "_id": "65b8f0501b4a92c3a4f89160",
      "user": "65b8e92f1b4a92c3a4f89101",
      "products": [
        {
          "product": "65b8ee901b4a92c3a4f89125",
          "name": "Smartphone Pro Max",
          "price": 899.99,
          "quantity": 1,
          "image": "https://images.unsplash.com/photo-1511707171634-5f897ff02560"
        },
        {
          "product": "65b8ef201b4a92c3a4f89140",
          "name": "Wireless Noise-Cancelling Headphones",
          "price": 179.99,
          "quantity": 2,
          "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e"
        }
      ],
      "totalAmount": 1259.97,
      "shippingAddress": {
        "name": "John Doe",
        "phone": "+1234567890",
        "address": "456 Market Street, Apt 3B",
        "city": "Metropolis",
        "pincode": "10001"
      },
      "status": "Pending",
      "createdAt": "2026-10-02T12:40:00.000Z"
    }
  }
  ```

---

### 4.2 Get Logged-in Customer Orders

Fetches all orders placed by the currently logged-in customer.

- **Method**: `GET`
- **Endpoint**: `/api/orders/my-orders`
- **Access**: Private (Customer)
- **Headers**: `Authorization: Bearer <token>`
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "count": 1,
    "data": [
      {
        "_id": "65b8f0501b4a92c3a4f89160",
        "totalAmount": 1259.97,
        "status": "Pending",
        "products": [
          {
            "product": "65b8ee901b4a92c3a4f89125",
            "name": "Smartphone Pro Max",
            "price": 899.99,
            "quantity": 1,
            "image": "https://images.unsplash.com/photo-1511707171634-5f897ff02560"
          }
        ],
        "shippingAddress": {
          "name": "John Doe",
          "city": "Metropolis"
        },
        "createdAt": "2026-10-02T12:40:00.000Z"
      }
    ]
  }
  ```

---

### 4.3 Get All Customer Orders (Admin)

Retrieves all orders in the system for administrative inspection.

- **Method**: `GET`
- **Endpoint**: `/api/admin/orders`
- **Access**: Private (Admin Only)
- **Headers**: `Authorization: Bearer <admin_token>`
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "count": 1,
    "data": [
      {
        "_id": "65b8f0501b4a92c3a4f89160",
        "user": {
          "_id": "65b8e92f1b4a92c3a4f89101",
          "name": "John Doe",
          "email": "john@example.com"
        },
        "totalAmount": 1259.97,
        "status": "Pending",
        "products": [...],
        "shippingAddress": {
          "name": "John Doe",
          "phone": "+1234567890",
          "address": "456 Market Street, Apt 3B",
          "city": "Metropolis",
          "pincode": "10001"
        },
        "createdAt": "2026-10-02T12:40:00.000Z"
      }
    ]
  }
  ```

---

### 4.4 Update Order Status (Admin)

Updates the status of an existing order.

- **Method**: `PATCH`
- **Endpoint**: `/api/admin/orders/:id/status`
- **Access**: Private (Admin Only)
- **Headers**: `Authorization: Bearer <admin_token>`
- **Request Body**:
  ```json
  {
    "status": "Confirmed"
  }
  ```
- **Allowed Status Values**:
  - `"Pending"`
  - `"Confirmed"`
  - `"Shipped"`
  - `"Delivered"`
  - `"Cancelled"`
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "message": "Order status updated successfully",
    "data": {
      "_id": "65b8f0501b4a92c3a4f89160",
      "status": "Confirmed",
      "updatedAt": "2026-10-02T12:50:00.000Z"
    }
  }
  ```

---

## 5. Standard Error Responses

```json
// 400 Bad Request
{
  "success": false,
  "message": "Product Smartphone Pro Max is out of stock (Available: 0, Requested: 1)"
}

// 401 Unauthorized
{
  "success": false,
  "message": "Not authorized, token missing or failed verification"
}

// 403 Forbidden
{
  "success": false,
  "message": "Access denied: Administrator privileges required"
}

// 404 Not Found
{
  "success": false,
  "message": "Requested resource was not found"
}

// 500 Internal Server Error
{
  "success": false,
  "message": "An unexpected error occurred on the server"
}
```
