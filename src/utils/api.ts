import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

class ApiClient {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_URL,
      timeout: 30000,
    });

    // Add request interceptor
    this.api.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add response interceptor
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          this.removeToken();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Token management
  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('authToken');
  }

  private setToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('authToken', token);
  }

  private removeToken(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('authToken');
  }

  // Auth endpoints
  async register(data: any): Promise<any> {
    return this.api.post('/auth/register', data);
  }

  async login(email: string, password: string): Promise<any> {
    const response = await this.api.post('/auth/login', { email, password });
    if (response.data.data?.token) {
      this.setToken(response.data.data.token);
    }
    return response;
  }

  async logout(): Promise<void> {
    this.removeToken();
  }

  async getCurrentUser(): Promise<any> {
    return this.api.get('/auth/me');
  }

  // Product endpoints
  async getProducts(params?: any): Promise<any> {
    return this.api.get('/products', { params });
  }

  async getProductBySlug(slug: string): Promise<any> {
    return this.api.get(`/products/slug/${slug}`);
  }

  async getProductById(id: string): Promise<any> {
    return this.api.get(`/products/${id}`);
  }

  async getFeaturedProducts(limit: number = 8): Promise<any> {
    return this.api.get('/products/featured', { params: { limit } });
  }

  async getBestSellers(limit: number = 8): Promise<any> {
    return this.api.get('/products/bestsellers', { params: { limit } });
  }

  // Cart endpoints
  async getCart(): Promise<any> {
    return this.api.get('/cart');
  }

  async addToCart(productId: string, quantity: number, variantId?: string): Promise<any> {
    return this.api.post('/cart/add', { productId, quantity, variantId });
  }

  async removeFromCart(productId: string): Promise<any> {
    return this.api.delete(`/cart/remove/${productId}`);
  }

  async updateCartItem(productId: string, quantity: number): Promise<any> {
    return this.api.put(`/cart/update/${productId}`, { quantity });
  }

  async clearCart(): Promise<any> {
    return this.api.delete('/cart/clear');
  }

  // Wishlist endpoints
  async getWishlist(): Promise<any> {
    return this.api.get('/wishlist');
  }

  async addToWishlist(productId: string): Promise<any> {
    return this.api.post(`/wishlist/add/${productId}`);
  }

  async removeFromWishlist(productId: string): Promise<any> {
    return this.api.delete(`/wishlist/remove/${productId}`);
  }

  // Order endpoints
  async createOrder(data: any): Promise<any> {
    return this.api.post('/orders', data);
  }

  async getOrders(page: number = 1, limit: number = 10): Promise<any> {
    return this.api.get('/orders', { params: { page, limit } });
  }

  async getOrderById(orderId: string): Promise<any> {
    return this.api.get(`/orders/${orderId}`);
  }

  async cancelOrder(orderId: string): Promise<any> {
    return this.api.put(`/orders/${orderId}/cancel`);
  }

  async initiateReturn(orderId: string, reason: string): Promise<any> {
    return this.api.post(`/orders/${orderId}/return`, { returnReason: reason });
  }

  // Payment endpoints
  async createRazorpayOrder(orderId: string): Promise<any> {
    return this.api.post(`/payments/razorpay/order/${orderId}`);
  }

  async verifyRazorpayPayment(data: any): Promise<any> {
    return this.api.post('/payments/razorpay/verify', data);
  }

  async getPaymentStatus(orderId: string): Promise<any> {
    return this.api.get(`/payments/status/${orderId}`);
  }

  async getPaymentMethods(): Promise<any> {
    return this.api.get('/payments/methods');
  }

  async applyCoupon(orderId: string, couponCode: string): Promise<any> {
    return this.api.post('/payments/coupon', { orderId, couponCode });
  }

  // User endpoints
  async updateProfile(data: any): Promise<any> {
    return this.api.put('/auth/profile', data);
  }

  async changePassword(data: any): Promise<any> {
    return this.api.post('/auth/change-password', data);
  }

  async addAddress(data: any): Promise<any> {
    return this.api.post('/auth/addresses', data);
  }

  async updateAddress(addressId: string, data: any): Promise<any> {
    return this.api.put(`/auth/addresses/${addressId}`, data);
  }

  async deleteAddress(addressId: string): Promise<any> {
    return this.api.delete(`/auth/addresses/${addressId}`);
  }

  // Category endpoints
  async getCategories(): Promise<any> {
    return this.api.get('/categories');
  }

  async getCategoryBySlug(slug: string): Promise<any> {
    return this.api.get(`/categories/${slug}`);
  }

  // Generic methods
  async get(endpoint: string, config?: AxiosRequestConfig): Promise<any> {
    return this.api.get(endpoint, config);
  }

  async post(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<any> {
    return this.api.post(endpoint, data, config);
  }

  async put(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<any> {
    return this.api.put(endpoint, data, config);
  }

  async delete(endpoint: string, config?: AxiosRequestConfig): Promise<any> {
    return this.api.delete(endpoint, config);
  }
}

export const apiClient = new ApiClient();
