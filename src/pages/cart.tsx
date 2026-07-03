import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCartStore, useUserStore } from '@/store';
import toast from 'react-hot-toast';

interface CartItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  discountPrice?: number;
  quantity: number;
}

export default function Cart() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const items = useCartStore((state) => state.items);
  const total = useCartStore((state) => state.total);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const setDiscount = useCartStore((state) => state.setDiscount);
  const discount = useCartStore((state) => state.discount);
  const tax = useCartStore((state) => state.tax);
  const shippingCost = useCartStore((state) => state.shippingCost);
  const setShippingCost = useCartStore((state) => state.setShippingCost);
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState('');

  useEffect(() => {
    setMounted(true);
    // Calculate shipping
    const subtotal = items.reduce(
      (sum, item) => sum + (item.discountPrice || item.price) * item.quantity,
      0
    );
    setShippingCost(subtotal > 500 ? 0 : 100);
  }, [items, setShippingCost]);

  const subtotal = items.reduce(
    (sum, item) => sum + (item.discountPrice || item.price) * item.quantity,
    0
  );

  const applyCoupon = () => {
    if (couponCode === 'WELCOME10') {
      const discountAmount = Math.round(subtotal * 0.1);
      setDiscount(discountAmount, couponCode);
      setAppliedCoupon(couponCode);
      toast.success('Coupon applied! 10% discount');
      setCouponCode('');
    } else if (couponCode) {
      toast.error('Invalid coupon code');
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error('Please login to continue');
      router.push('/login');
      return;
    }
    router.push('/checkout');
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-soft py-8 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-display font-bold text-primary">Shopping Cart</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {items.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-3xl font-bold text-primary mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">
              Looks like you haven't added any products yet
            </p>
            <Link
              href="/shop"
              className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-dark"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-cream rounded-lg overflow-hidden">
                {items.map((item, idx) => (
                  <div
                    key={idx}
                    className={`flex gap-4 p-6 ${idx !== items.length - 1 ? 'border-b border-gray-300' : ''}`}
                  >
                    {/* Product Image */}
                    <Link href={`/shop/${item.slug}`}>
                      <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </Link>

                    {/* Product Details */}
                    <div className="flex-1">
                      <Link
                        href={`/shop/${item.slug}`}
                        className="text-lg font-semibold text-primary hover:text-accent transition"
                      >
                        {item.name}
                      </Link>
                      <p className="text-gray-600 text-sm mt-1">
                        {item.discountPrice ? (
                          <>
                            <span className="text-primary font-semibold">
                              ₹{item.discountPrice}
                            </span>
                            <span className="text-gray-500 line-through ml-2">
                              ₹{item.price}
                            </span>
                          </>
                        ) : (
                          <span className="text-primary font-semibold">₹{item.price}</span>
                        )}
                      </p>

                      {/* Quantity */}
                      <div className="flex items-center gap-2 mt-3 border border-gray-300 rounded w-fit">
                        <button
                          onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                          className="px-2 py-1 text-primary hover:bg-white"
                        >
                          −
                        </button>
                        <span className="px-3 py-1 text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="px-2 py-1 text-primary hover:bg-white"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Total & Remove */}
                    <div className="text-right flex flex-col justify-between">
                      <div>
                        <p className="text-xl font-bold text-primary">
                          ₹{((item.discountPrice || item.price) * item.quantity).toLocaleString()}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          removeItem(item.productId);
                          toast.success('Item removed');
                        }}
                        className="text-red-500 hover:text-red-700 font-semibold text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon Section */}
              <div className="mt-8 p-6 bg-cream rounded-lg">
                <h3 className="font-bold text-primary mb-4">Apply Coupon</h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                  />
                  <button
                    onClick={applyCoupon}
                    className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-dark"
                  >
                    Apply
                  </button>
                </div>
                {appliedCoupon && (
                  <p className="text-green-600 font-semibold mt-2">
                    ✓ {appliedCoupon} applied
                  </p>
                )}
                <p className="text-gray-600 text-sm mt-2">Try code: WELCOME10</p>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-cream p-6 rounded-lg sticky top-20">
                <h3 className="text-xl font-bold text-primary mb-6">Order Summary</h3>

                <div className="space-y-3 mb-6 pb-6 border-b border-gray-300">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600 font-semibold">
                      <span>Discount ({appliedCoupon})</span>
                      <span>-₹{discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-700">
                    <span>Shipping</span>
                    <span>
                      {shippingCost === 0 ? (
                        <span className="text-green-600 font-semibold">FREE</span>
                      ) : (
                        `₹${shippingCost}`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Tax (18% GST)</span>
                    <span>₹{Math.round(tax).toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex justify-between mb-6">
                  <span className="text-xl font-bold text-primary">Total</span>
                  <span className="text-3xl font-bold text-primary">
                    ₹{Math.round(total).toLocaleString()}
                  </span>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-primary text-white py-3 rounded-lg font-bold text-lg hover:bg-primary-dark transition-colors mb-3"
                >
                  Proceed to Checkout
                </button>

                <Link
                  href="/shop"
                  className="block w-full text-center text-primary border-2 border-primary py-2 rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors"
                >
                  Continue Shopping
                </Link>

                {/* Free Shipping Info */}
                {subtotal < 500 && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg text-sm text-blue-700 border border-blue-200">
                    <p className="font-semibold mb-1">Free Shipping!</p>
                    <p>
                      Add ₹{(500 - subtotal).toLocaleString()} more for free shipping
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
