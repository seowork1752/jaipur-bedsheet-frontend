import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useUserStore } from '@/store';

export default function AdminDashboard() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    totalProducts: 0,
  });

  useEffect(() => {
    // Check if user is admin
    if (!user?.role || user.role !== 'admin') {
      router.push('/');
      return;
    }

    // TODO: Fetch stats from API
    // For now, show placeholder
    setStats({
      totalOrders: 1250,
      totalRevenue: 2500000,
      totalCustomers: 8450,
      totalProducts: 245,
    });
  }, [user, router]);

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-primary text-white p-8">
        <h1 className="text-4xl font-display font-bold">Admin Dashboard</h1>
        <p className="text-gray-200 mt-2">Manage your store and view analytics</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            {
              label: 'Total Orders',
              value: stats.totalOrders,
              icon: '📦',
              color: 'blue',
            },
            {
              label: 'Total Revenue',
              value: `₹${(stats.totalRevenue / 100000).toFixed(1)}L`,
              icon: '💰',
              color: 'green',
            },
            {
              label: 'Total Customers',
              value: stats.totalCustomers,
              icon: '👥',
              color: 'purple',
            },
            {
              label: 'Total Products',
              value: stats.totalProducts,
              icon: '📋',
              color: 'orange',
            },
          ].map((stat, idx) => (
            <div key={idx} className="bg-white p-6 rounded-lg shadow">
              <div className="text-3xl mb-2">{stat.icon}</div>
              <p className="text-gray-600 text-sm">{stat.label}</p>
              <p className="text-3xl font-bold text-primary">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Admin Menu */}
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold text-primary mb-8">Admin Tools</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: '📦',
                title: 'Manage Products',
                description: 'Add, edit, or delete products',
                href: '/admin/products',
              },
              {
                icon: '📋',
                title: 'View Orders',
                description: 'Manage customer orders',
                href: '/admin/orders',
              },
              {
                icon: '👥',
                title: 'Manage Customers',
                description: 'View customer information',
                href: '/admin/customers',
              },
              {
                icon: '💰',
                title: 'Coupons',
                description: 'Create and manage discounts',
                href: '/admin/coupons',
              },
              {
                icon: '📊',
                title: 'Analytics',
                description: 'View detailed analytics',
                href: '/admin/analytics',
              },
              {
                icon: '⚙️',
                title: 'Settings',
                description: 'Configure store settings',
                href: '/admin/settings',
              },
            ].map((item, idx) => (
              <Link
                key={idx}
                href={item.href}
                className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-primary mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
                <div className="text-primary font-semibold mt-4">Go →</div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow p-8 mt-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-primary">Recent Orders</h2>
            <Link href="/admin/orders" className="text-primary hover:text-accent font-semibold">
              View All →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left">Order ID</th>
                  <th className="px-4 py-3 text-left">Customer</th>
                  <th className="px-4 py-3 text-left">Amount</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    id: '#JBX001',
                    customer: 'Rajesh Kumar',
                    amount: '₹2,499',
                    status: 'Shipped',
                  },
                  {
                    id: '#JBX002',
                    customer: 'Priya Singh',
                    amount: '₹1,999',
                    status: 'Delivered',
                  },
                  {
                    id: '#JBX003',
                    customer: 'Amit Verma',
                    amount: '₹3,499',
                    status: 'Processing',
                  },
                ].map((order, idx) => (
                  <tr key={idx} className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3 font-semibold text-primary">{order.id}</td>
                    <td className="px-4 py-3">{order.customer}</td>
                    <td className="px-4 py-3 font-semibold">{order.amount}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          order.status === 'Delivered'
                            ? 'bg-green-100 text-green-800'
                            : order.status === 'Shipped'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">Today</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-primary text-white rounded-lg p-8 mt-12">
          <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 text-left font-semibold transition-all">
              + Add New Product
            </button>
            <button className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 text-left font-semibold transition-all">
              + Create Coupon
            </button>
            <button className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 text-left font-semibold transition-all">
              📧 Send Newsletter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
