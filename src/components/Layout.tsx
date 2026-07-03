import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useUserStore, useCartStore } from '@/store';
import { FiShoppingCart, FiUser, FiMenu, FiX } from 'react-icons/fi';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);
  const cartItemCount = useCartStore((state) => state.getItemCount());

  const handleLogout = () => {
    logout();
    localStorage.removeItem('authToken');
    router.push('/');
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-elevation-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="text-2xl font-display font-bold text-primary">
                🛍️ Jaipur
              </div>
              <span className="hidden sm:inline text-xl font-display font-bold text-accent">
                Bedsheets
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-700 hover:text-primary font-medium">
                Home
              </Link>
              <Link href="/shop" className="text-gray-700 hover:text-primary font-medium">
                Shop
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-primary font-medium">
                About
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-primary font-medium">
                Contact
              </Link>
            </nav>

            {/* Right Icons */}
            <div className="flex items-center space-x-4">
              {/* Cart */}
              <Link
                href="/cart"
                className="relative p-2 text-gray-700 hover:text-primary transition-colors"
              >
                <FiShoppingCart size={24} />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Link>

              {/* User Menu */}
              <div className="relative group hidden sm:block">
                <button className="p-2 text-gray-700 hover:text-primary transition-colors">
                  <FiUser size={24} />
                </button>
                <div className="absolute right-0 mt-0 w-48 bg-white border border-gray-200 rounded-lg shadow-luxury opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  {user ? (
                    <>
                      <Link
                        href="/account"
                        className="block px-4 py-2 text-gray-700 hover:bg-cream hover:text-primary"
                      >
                        👤 My Account
                      </Link>
                      <Link
                        href="/orders"
                        className="block px-4 py-2 text-gray-700 hover:bg-cream hover:text-primary"
                      >
                        📦 My Orders
                      </Link>
                      <Link
                        href="/wishlist"
                        className="block px-4 py-2 text-gray-700 hover:bg-cream hover:text-primary"
                      >
                        ❤️ Wishlist
                      </Link>
                      <hr className="my-1" />
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-cream hover:text-primary"
                      >
                        🚪 Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        className="block px-4 py-2 text-gray-700 hover:bg-cream hover:text-primary"
                      >
                        Login / Sign Up
                      </Link>
                    </>
                  )}
                </div>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-gray-700 hover:text-primary"
              >
                {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <nav className="md:hidden pb-4 space-y-2 border-t border-gray-200">
              <Link
                href="/"
                className="block px-4 py-2 text-gray-700 hover:bg-cream rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/shop"
                className="block px-4 py-2 text-gray-700 hover:bg-cream rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                Shop
              </Link>
              <Link
                href="/about"
                className="block px-4 py-2 text-gray-700 hover:bg-cream rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/contact"
                className="block px-4 py-2 text-gray-700 hover:bg-cream rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              {!user && (
                <Link
                  href="/login"
                  className="block px-4 py-2 text-primary hover:bg-cream rounded-lg font-semibold"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login / Sign Up
                </Link>
              )}
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-primary text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <h3 className="text-2xl font-display font-bold mb-4">Jaipur Bedsheets</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Premium authentic Jaipur bedsheets with traditional craftsmanship and modern comfort.
              </p>
              <div className="flex gap-4 mt-4">
                <a href="#" className="text-gray-300 hover:text-white text-xl">
                  📘
                </a>
                <a href="#" className="text-gray-300 hover:text-white text-xl">
                  📷
                </a>
                <a href="#" className="text-gray-300 hover:text-white text-xl">
                  𝕏
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>
                  <Link href="/" className="hover:text-white">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/shop" className="hover:text-white">
                    Shop
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-white">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-white">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h4 className="font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>
                  <Link href="/contact" className="hover:text-white">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-white">
                    FAQs
                  </Link>
                </li>
                <li>
                  <Link href="/shipping" className="hover:text-white">
                    Shipping Info
                  </Link>
                </li>
                <li>
                  <Link href="/returns" className="hover:text-white">
                    Returns
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li>
                  <Link href="/privacy" className="hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/refund" className="hover:text-white">
                    Refund Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="border-t border-primary-dark pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center text-gray-300 text-sm">
              <p>
                &copy; 2024 Jaipur Bedsheets. All rights reserved. Made with ❤️ in Jaipur.
              </p>
              <div className="flex gap-6 mt-4 md:mt-0">
                <img src="/payment/visa.svg" alt="Visa" className="h-6 opacity-75" />
                <img src="/payment/mastercard.svg" alt="Mastercard" className="h-6 opacity-75" />
                <img src="/payment/razorpay.svg" alt="Razorpay" className="h-6 opacity-75" />
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
