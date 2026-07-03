import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { apiClient } from '@/utils/api';
import { useCartStore, useUserStore } from '@/store';
import toast from 'react-hot-toast';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function Checkout() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedPayment, setSelectedPayment] = useState('razorpay');
  const [giftWrap, setGiftWrap] = useState(false);

  const items = useCartStore((state) => state.items);
  const total = useCartStore((state) => state.total);
  const user = useUserStore((state) => state.user);

  const [formData, setFormData] = useState({
    fullName: user?.firstName + ' ' + user?.lastName || '',
    phone: user?.phone || '',
    email: user?.email || '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    giftMessage: '',
  });

  useEffect(() => {
    if (items.length === 0) {
      toast.error('Cart is empty');
      router.push('/shop');
    }

    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  }, [items.length, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateAddress = () => {
    const required = ['fullName', 'phone', 'email', 'addressLine1', 'city', 'state', 'pincode'];
    for (const field of required) {
      if (!formData[field as keyof typeof formData]) {
        toast.error(`Please fill ${field}`);
        return false;
      }
    }
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateAddress()) return;

    setLoading(true);
    try {
      // Create order
      const orderResponse = await apiClient.post('/orders', {
        items: items.map((item) => ({
          productId: item.productId,
          price: item.discountPrice || item.price,
          quantity: item.quantity,
        })),
        shippingAddress: formData,
        billingAddress: formData,
        paymentMethod: selectedPayment,
        giftWrap,
        giftMessage: giftWrap ? formData.giftMessage : undefined,
      });

      const order = orderResponse.data.data;

      if (selectedPayment === 'razorpay') {
        // Create Razorpay order
        const razorpayOrderResponse = await apiClient.post(
          `/payments/razorpay/order/${order._id}`
        );

        const razorpayOrder = razorpayOrderResponse.data.data;

        // Open Razorpay checkout
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
          amount: Math.round(order.total * 100),
          currency: 'INR',
          name: 'Jaipur Bedsheets',
          description: 'Premium Bedsheets',
          order_id: razorpayOrder.razorpayOrderId,
          handler: async (response: any) => {
            try {
              // Verify payment
              const verifyResponse = await apiClient.post('/payments/razorpay/verify', {
                orderId: order._id,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              });

              if (verifyResponse.data.success) {
                toast.success('Payment successful!');
                router.push(`/orders/${order._id}`);
              }
            } catch (error) {
              toast.error('Payment verification failed');
            }
          },
          prefill: {
            name: formData.fullName,
            email: formData.email,
            contact: formData.phone,
          },
          theme: {
            color: '#0F3A6B',
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else if (selectedPayment === 'cod') {
        toast.success('Order placed successfully!');
        router.push(`/orders/${order._id}`);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const subtotal = items.reduce(
    (sum, item) => sum + (item.discountPrice || item.price) * item.quantity,
    0
  );
  const tax = Math.round(subtotal * 0.18);
  const shipping = subtotal > 500 ? 0 : 100;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-soft py-8 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-display font-bold text-primary">Checkout</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Step 1: Shipping Address */}
            <div className="bg-cream p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-primary mb-6 flex items-center">
                <span className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center mr-3 text-sm">
                  1
                </span>
                Shipping Address
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="col-span-2 px-4 py-3 border border-gray-300 rounded-lg"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="px-4 py-3 border border-gray-300 rounded-lg"
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="px-4 py-3 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  name="addressLine1"
                  placeholder="Address Line 1"
                  value={formData.addressLine1}
                  onChange={handleInputChange}
                  className="col-span-2 px-4 py-3 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  name="addressLine2"
                  placeholder="Address Line 2 (Optional)"
                  value={formData.addressLine2}
                  onChange={handleInputChange}
                  className="col-span-2 px-4 py-3 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="px-4 py-3 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="px-4 py-3 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  name="pincode"
                  placeholder="Pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  className="px-4 py-3 border border-gray-300 rounded-lg"
                />
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="px-4 py-3 border border-gray-300 rounded-lg"
                >
                  <option>India</option>
                  <option>UAE</option>
                  <option>USA</option>
                  <option>UK</option>
                </select>
              </div>
            </div>

            {/* Step 2: Payment Method */}
            <div className="bg-cream p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-primary mb-6 flex items-center">
                <span className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center mr-3 text-sm">
                  2
                </span>
                Payment Method
              </h2>

              <div className="space-y-3">
                {[
                  { id: 'razorpay', label: 'Razorpay (UPI, Cards, Wallets)', icon: '💳' },
                  { id: 'cod', label: 'Cash on Delivery', icon: '🚚' },
                ].map((method) => (
                  <label
                    key={method.id}
                    className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors"
                    style={{
                      borderColor: selectedPayment === method.id ? '#0F3A6B' : '#e5e7eb',
                      backgroundColor:
                        selectedPayment === method.id ? '#FFFBF0' : 'transparent',
                    }}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={method.id}
                      checked={selectedPayment === method.id}
                      onChange={(e) => setSelectedPayment(e.target.value)}
                      className="w-4 h-4"
                    />
                    <span className="ml-3 text-lg">{method.icon}</span>
                    <span className="ml-3 font-semibold text-primary">{method.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Step 3: Gift Wrapping */}
            <div className="bg-cream p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-primary mb-6 flex items-center">
                <span className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center mr-3 text-sm">
                  3
                </span>
                Gift Options
              </h2>

              <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-primary transition-colors">
                <input
                  type="checkbox"
                  checked={giftWrap}
                  onChange={(e) => setGiftWrap(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="ml-3 text-lg">🎁</span>
                <span className="ml-3 font-semibold">Wrap as gift (₹50)</span>
              </label>

              {giftWrap && (
                <textarea
                  name="giftMessage"
                  placeholder="Add a gift message (optional)"
                  value={formData.giftMessage}
                  onChange={handleInputChange}
                  className="w-full mt-4 px-4 py-3 border border-gray-300 rounded-lg h-24"
                />
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-cream p-6 rounded-lg sticky top-20">
              <h3 className="text-xl font-bold text-primary mb-6">Order Summary</h3>

              {/* Items */}
              <div className="space-y-3 mb-6 pb-6 border-b border-gray-300 max-h-64 overflow-y-auto">
                {items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-gray-700 line-clamp-1">{item.name}</span>
                    <span className="text-primary font-semibold">
                      ₹{((item.discountPrice || item.price) * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-3 mb-6 pb-6 border-b border-gray-300">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (18%)</span>
                  <span>₹{tax.toLocaleString()}</span>
                </div>
                {giftWrap && (
                  <div className="flex justify-between">
                    <span>Gift Wrap</span>
                    <span>₹50</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between mb-6">
                <span className="text-lg font-bold text-primary">Total</span>
                <span className="text-2xl font-bold text-primary">
                  ₹{Math.round(total).toLocaleString()}
                </span>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-primary-dark transition-colors disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Place Order'}
              </button>

              <p className="text-xs text-gray-600 text-center mt-4">
                🔒 Your payment information is secure
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
