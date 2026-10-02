import axios from 'axios';

// Base API URL from environment or default to local backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 8000,
});

// Request Interceptor: automatically attach JWT Bearer token from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// In-memory mock storage for standalone demo mode (when backend is offline)
const getStoredMockOrders = () => {
  try {
    const raw = localStorage.getItem('mock_orders');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveMockOrders = (orders) => {
  localStorage.setItem('mock_orders', JSON.stringify(orders));
};

// Response Interceptor: handle 401 auth errors + seamless fallback for local demo
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;

    // Handle token expiration / unauthorized
    if (response && response.status === 401) {
      // Clear invalid credentials
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.dispatchEvent(new Event('auth-logout'));
    }

    // If backend is unreachable (Network Error or connection refused), provide seamless mock simulation
    const isNetworkError = !response && (error.code === 'ERR_NETWORK' || error.message.includes('Network Error') || error.code === 'ECONNABORTED');

    if (isNetworkError && config) {
      console.warn(`[API] Backend server unreachable at ${config.baseURL}. Serving mock response for demo.`);

      // Mock Auth: Login
      if (config.url?.endsWith('/auth/login') && config.method === 'post') {
        const { email, password } = JSON.parse(config.data || '{}');
        const isAdmin = email.toLowerCase().includes('admin');
        const mockUser = {
          _id: isAdmin ? '65b8e92f1b4a92c3a4f89999' : '65b8e92f1b4a92c3a4f89101',
          name: isAdmin ? 'Store Administrator' : 'Demo Customer',
          email: email || 'customer@demo.com',
          role: isAdmin ? 'admin' : 'customer',
        };
        const mockToken = `mock_jwt_token_${isAdmin ? 'admin' : 'cust'}_${Date.now()}`;
        return {
          data: {
            success: true,
            message: 'Login successful (Demo Mode)',
            data: {
              user: mockUser,
              token: mockToken,
            },
          },
        };
      }

      // Mock Auth: Register
      if (config.url?.endsWith('/auth/register') && config.method === 'post') {
        const { name, email } = JSON.parse(config.data || '{}');
        const mockUser = {
          _id: `user_${Date.now()}`,
          name: name || 'Registered Customer',
          email: email || 'user@example.com',
          role: 'customer',
        };
        const mockToken = `mock_jwt_token_cust_${Date.now()}`;
        return {
          data: {
            success: true,
            message: 'User registered successfully (Demo Mode)',
            data: {
              user: mockUser,
              token: mockToken,
            },
          },
        };
      }

      // Mock Orders: Place Order
      if (config.url?.endsWith('/orders') && config.method === 'post') {
        const payload = JSON.parse(config.data || '{}');
        const existingOrders = getStoredMockOrders();
        const newOrderId = `ORD-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

        // Calculate total from items
        const calculatedTotal = (payload.items || []).reduce((acc, item) => {
          const itemPrice = item.price || 199.99;
          return acc + (itemPrice * item.quantity);
        }, 0);

        const newOrder = {
          _id: newOrderId,
          user: JSON.parse(localStorage.getItem('user') || '{}'),
          products: (payload.items || []).map((i) => ({
            product: i.product || i._id || 'prod_default',
            name: i.name || 'Premium Audio Headphones',
            price: i.price || 199.99,
            quantity: i.quantity || 1,
            image: i.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
          })),
          totalAmount: calculatedTotal || 199.99,
          shippingAddress: payload.shippingAddress,
          paymentMethod: 'Cash on Delivery (COD)',
          status: 'Pending',
          createdAt: new Date().toISOString(),
        };

        existingOrders.unshift(newOrder);
        saveMockOrders(existingOrders);

        return {
          data: {
            success: true,
            message: 'Order placed successfully (Cash on Delivery)',
            data: newOrder,
          },
        };
      }

      // Mock Orders: Get Customer Orders
      if (config.url?.endsWith('/orders/my-orders') && config.method === 'get') {
        const storedOrders = getStoredMockOrders();
        // If empty, supply an initial realistic sample order
        if (storedOrders.length === 0) {
          const sampleOrder = {
            _id: 'ORD-DEMO-9482',
            totalAmount: 249.98,
            status: 'Confirmed',
            paymentMethod: 'Cash on Delivery (COD)',
            products: [
              {
                product: 'prod_1',
                name: 'Wireless Noise-Cancelling Headphones',
                price: 199.99,
                quantity: 1,
                image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
              },
              {
                product: 'prod_2',
                name: 'Fast Wireless Charging Pad',
                price: 49.99,
                quantity: 1,
                image: 'https://images.unsplash.com/photo-1622445262464-84b1456045b6?w=500&q=80',
              },
            ],
            shippingAddress: {
              name: 'John Doe',
              phone: '+1 234 567 8900',
              address: '456 Market Street, Apt 3B',
              city: 'Metropolis',
              pincode: '10001',
            },
            createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
          };
          storedOrders.push(sampleOrder);
          saveMockOrders(storedOrders);
        }

        return {
          data: {
            success: true,
            count: storedOrders.length,
            data: storedOrders,
          },
        };
      }

      // Mock Products
      if (config.url?.includes('/products') && config.method === 'get') {
        return {
          data: {
            success: true,
            data: [
              {
                _id: '65b8ee901b4a92c3a4f89125',
                name: 'Smartphone Pro Max',
                description: 'Flagship 5G smartphone with 120Hz OLED display & high-grade triple camera',
                price: 899.99,
                image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02560?w=600&q=80',
                category: { _id: 'cat_1', name: 'Electronics' },
                stock: 15,
                createdAt: new Date().toISOString(),
              },
              {
                _id: '65b8ef201b4a92c3a4f89140',
                name: 'Wireless Noise-Cancelling Headphones',
                description: 'Premium over-ear headphones with active noise cancellation and 40h battery',
                price: 199.99,
                image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
                category: { _id: 'cat_1', name: 'Electronics' },
                stock: 25,
                createdAt: new Date().toISOString(),
              },
              {
                _id: '65b8ef301b4a92c3a4f89141',
                name: 'Urban Streetwear Hoodie',
                description: 'Heavyweight organic cotton pullover hoodie for casual streetwear comfort',
                price: 79.99,
                image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&q=80',
                category: { _id: 'cat_2', name: 'Fashion' },
                stock: 40,
                createdAt: new Date().toISOString(),
              },
              {
                _id: '65b8ef401b4a92c3a4f89142',
                name: 'Minimalist Athletic Sneakers',
                description: 'Breathable lightweight running sneakers with cushioned impact absorption',
                price: 129.99,
                image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
                category: { _id: 'cat_3', name: 'Shoes' },
                stock: 18,
                createdAt: new Date().toISOString(),
              },
            ],
          },
        };
      }
    }

    return Promise.reject(error);
  }
);

export default api;
