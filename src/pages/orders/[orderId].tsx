import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { apiClient } from '@/utils/api';
import { useUserStore } from '@/store';
import toast from 'react-hot-toast';

interface Order {
  _id: string;
  orderNumber: string;
  items: any[];
  total: number;
  orderStatus: string;
  paymentStatus: string;
  paymentMethod: string;
  shippingAddress: any;
  billingAddress: any;
  createdAt: string;
  estimatedDelivery?: string;
  trackingNumber?: string;
  notes?: string;
}

const statusSteps = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];

export default function OrderDetail() {
  const router = useRouter();
  const { orderId } = router.query;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = useUserStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (orderId) {
      fetchOrder();
    }
  }, [orderId, isAuthenticated, router]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/orders/${orderId}`);
      setOrder(response.data.data);
    } catch (error) {
      console.error('Error fetching order:', error);
      toast.error('Failed to load order');
      router.push('/orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'text-green-600';
      case 'shipped':
        return 'text-blue-600';
      case 'processing':
        return 'text-yellow-600';
      case 'confirmed':
        return 'text-purple-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return '⏳';
      case 'confirmed':
        return '✓';
      case 'processing':
        return '⚙️';
      case 'shipped':
        return '🚚';
      case 'delivered':
        return '✓✓';
      default:
        return '•';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary mb-4">Order not found</h1>
          <Link href="/orders" className="text-accent hover:text-accent-dark">
            Back to orders
          </Link>
        </div>
      </div>
    );
  }

  const currentStatusIndex = statusSteps.indexOf(order.orderStatus);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-soft py-8 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-display font-bold text-primary">
                Order #{order.orderNumber}
              </h1>
              <p className="text-gray-600 mt-2">
                Placed on {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <Link
              href="/orders"
              className="text-primary hover:text-accent font-semibold"
            >
              ← Back to Orders
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Order Status Timeline */}
            <div className="bg-cream p-8 rounded-lg">
              <h2 className="text-2xl font-bold text-primary mb-8">Order Status</h2>

              {/* Timeline */}
              <div className="relative">
                <div className="flex justify-between mb-8">
                  {statusSteps.map((step, idx) => (
                    <div key={step} className="flex flex-col items-center flex-1">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                          idx <= currentStatusIndex
                            ? 'bg-primary text-white'
                            : 'bg-gray-300 text-gray-600'
                        }`}
                      >
                        {getStatusIcon(step)}
                      </div>
                      <p
                        className={`text-sm mt-2 capitalize font-semibold ${
                          idx <= currentStatusIndex ? 'text-primary' : 'text-gray-500'
                        }`}
                      >
                        {step}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Progress Line */}
                <div className="absolute top-5 left-0 right-0 h-1 bg-gray-300 -z-10">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{
                      width: `${((currentStatusIndex + 1) / statusSteps.length) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* Status Details */}
              <div className="mt-8 p-4 bg-white rounded-lg border-l-4 border-primary">
                <p className="text-gray-700">
                  <span className="font-semibold text-primary">Current Status:</span> Your order
                  is {order.orderStatus}
                </p>
                {order.estimatedDelivery && (
                  <p className="text-gray-700 mt-2">
                    <span className="font-semibold text-primary">Estimated Delivery:</span>{' '}
                    {new Date(order.estimatedDelivery).toLocaleDateString()}
                  </p>
                )}
                {order.trackingNumber && (
                  <p className="text-gray-700 mt-2">
                    <span className="font-semibold text-primary">Tracking Number:</span>{' '}
                    {order.trackingNumber}
                  </p>
                )}
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-cream p-8 rounded-lg">
              <h2 className="text-2xl font-bold text-primary mb-6">Order Items</h2>

              <div className="space-y-4">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex gap-4 pb-4 border-b border-gray-300 last:border-b-0">
                    {/* Item Image */}
                    <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={item.image || 'https://images.unsplash.com/photo-1540932239986-a128078d0e21?w=100'}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Item Details */}
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-primary">{item.name}</h3>
                      <p className="text-gray-600 text-sm mt-1">Quantity: {item.quantity}</p>
                      <p className="text-primary font-semibold mt-2">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping & Billing Address */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Shipping Address */}
              <div className="bg-cream p-6 rounded-lg">
                <h3 className="text-xl font-bold text-primary mb-4">Shipping Address</h3>
                <div className="text-sm text-gray-700 space-y-1">
                  <p className="font-semibold text-primary">{order.shippingAddress.fullName}</p>
                  <p>{order.shippingAddress.addressLine1}</p>
                  {order.shippingAddress.addressLine2 && (
                    <p>{order.shippingAddress.addressLine2}</p>
                  )}
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                    {order.shippingAddress.pincode}
                  </p>
                  <p>{order.shippingAddress.phone}</p>
                </div>
              </div>

              {/* Billing Address */}
              <div className="bg-cream p-6 rounded-lg">
                <h3 className="text-xl font-bold text-primary mb-4">Billing Address</h3>
                <div className="text-sm text-gray-700 space-y-1">
                  <p className="font-semibold text-primary">{order.billingAddress.fullName}</p>
                  <p>{order.billingAddress.addressLine1}</p>
                  {order.billingAddress.addressLine2 && (
                    <p>{order.billingAddress.addressLine2}</p>
                  )}
                  <p>
                    {order.billingAddress.city}, {order.billingAddress.state}{' '}
                    {order.billingAddress.pincode}
                  </p>
                  <p>{order.billingAddress.phone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-cream p-6 rounded-lg sticky top-20 space-y-6">
              {/* Payment Status */}
              <div>
                <h3 className="text-lg font-bold text-primary mb-3">Payment Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Payment Method:</span>
                    <span className="font-semibold capitalize">{order.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Payment Status:</span>
                    <span
                      className={`font-semibold capitalize ${
                        order.paymentStatus === 'completed'
                          ? 'text-green-600'
                          : 'text-yellow-600'
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="border-t border-gray-300 pt-6">
                <h3 className="text-lg font-bold text-primary mb-3">Order Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal:</span>
                    <span>₹{order.total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Shipping:</span>
                    <span>FREE</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Tax:</span>
                    <span>Included</span>
                  </div>
                </div>
              </div>

              {/* Total */}
              <div className="border-t border-gray-300 pt-6">
                <div className="flex justify-between mb-6">
                  <span className="text-lg font-bold text-primary">Total</span>
                  <span className="text-2xl font-bold text-primary">
                    ₹{order.total.toLocaleString()}
                  </span>
                </div>

                {['pending', 'confirmed', 'processing'].includes(order.orderStatus) && (
                  <button className="w-full border-2 border-red-500 text-red-500 py-2 rounded-lg font-semibold hover:bg-red-50 transition-colors">
                    Cancel Order
                  </button>
                )}

                {order.orderStatus === 'delivered' && (
                  <button className="w-full border-2 border-primary text-primary py-2 rounded-lg font-semibold hover:bg-cream transition-colors">
                    Return Item
                  </button>
                )}
              </div>

              {/* Help */}
              <div className="bg-white p-4 rounded-lg border border-gray-300">
                <p className="text-sm text-gray-700 mb-3">
                  Need help with your order?
                </p>
                <Link
                  href="/contact"
                  className="text-primary hover:text-accent font-semibold text-sm"
                >
                  Contact Support →
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
