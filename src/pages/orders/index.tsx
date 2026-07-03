import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { apiClient } from '@/utils/api';
import { useUserStore } from '@/store';
import toast from 'react-hot-toast';

interface Order {
  _id: string;
  orderNumber: string;
  total: number;
  orderStatus: string;
  paymentStatus: string;
  createdAt: string;
  items: any[];
}

export default function Orders() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const user = useUserStore((state) => state.user);
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    fetchOrders();
  }, [isAuthenticated, router]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/orders');
      setOrders(response.data.data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentBadgeColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 text-green-700';
      case 'pending':
        return 'bg-yellow-50 text-yellow-700';
      case 'failed':
        return 'bg-red-50 text-red-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-soft py-8 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-display font-bold text-primary">My Orders</h1>
          <p className="text-gray-600 mt-2">Track and manage your orders</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-3xl font-bold text-primary mb-4">No orders yet</h2>
            <p className="text-gray-600 mb-8">
              You haven't placed any orders yet. Start shopping to see your orders here.
            </p>
            <Link
              href="/shop"
              className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-dark"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-cream p-6 rounded-lg border border-gray-200 hover:shadow-luxury transition-shadow"
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                  {/* Order Number */}
                  <div>
                    <p className="text-xs text-gray-600 uppercase font-semibold mb-1">
                      Order Number
                    </p>
                    <p className="text-lg font-bold text-primary">{order.orderNumber}</p>
                  </div>

                  {/* Order Date */}
                  <div>
                    <p className="text-xs text-gray-600 uppercase font-semibold mb-1">
                      Order Date
                    </p>
                    <p className="text-lg font-semibold">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Status */}
                  <div>
                    <p className="text-xs text-gray-600 uppercase font-semibold mb-1">
                      Status
                    </p>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadgeColor(
                        order.orderStatus
                      )}`}
                    >
                      {order.orderStatus.charAt(0).toUpperCase() +
                        order.orderStatus.slice(1)}
                    </span>
                  </div>

                  {/* Total */}
                  <div>
                    <p className="text-xs text-gray-600 uppercase font-semibold mb-1">
                      Total
                    </p>
                    <p className="text-2xl font-bold text-primary">
                      ₹{order.total.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Items Preview */}
                <div className="mb-6 pb-6 border-t border-gray-300">
                  <p className="text-sm font-semibold text-gray-700 mb-3">
                    Items ({order.items.length})
                  </p>
                  <div className="space-y-2">
                    {order.items.slice(0, 2).map((item, idx) => (
                      <p key={idx} className="text-sm text-gray-600">
                        • {item.name} × {item.quantity}
                      </p>
                    ))}
                    {order.items.length > 2 && (
                      <p className="text-sm text-gray-600">
                        • +{order.items.length - 2} more items
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Link
                    href={`/orders/${order._id}`}
                    className="flex-1 text-center bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
                  >
                    View Details
                  </Link>
                  {['pending', 'confirmed', 'processing'].includes(order.orderStatus) && (
                    <button
                      onClick={() => {
                        // Handle cancel order
                        toast.success('Order cancellation initiated');
                      }}
                      className="flex-1 border-2 border-red-500 text-red-500 px-4 py-2 rounded-lg font-semibold hover:bg-red-50 transition-colors"
                    >
                      Cancel Order
                    </button>
                  )}
                </div>

                {/* Payment Status */}
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="text-gray-600">Payment Status:</span>
                  <span
                    className={`px-3 py-1 rounded-full font-semibold ${getPaymentBadgeColor(
                      order.paymentStatus
                    )}`}
                  >
                    {order.paymentStatus.charAt(0).toUpperCase() +
                      order.paymentStatus.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
