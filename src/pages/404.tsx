import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-luxury flex items-center justify-center px-4">
      <div className="text-center">
        {/* 404 Text */}
        <div className="mb-8">
          <h1 className="text-9xl font-display font-bold text-accent mb-4">404</h1>
          <h2 className="text-4xl font-display font-bold text-white mb-2">
            Page Not Found
          </h2>
          <p className="text-xl text-gray-200">
            Oops! The page you're looking for doesn't exist.
          </p>
        </div>

        {/* Illustration */}
        <div className="mb-12 text-8xl animate-bounce">
          🛍️
        </div>

        {/* Description */}
        <p className="text-gray-100 text-lg mb-8 max-w-md mx-auto">
          It looks like you've wandered off the path. Let's get you back to finding
          beautiful Jaipur bedsheets!
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-8 py-3 bg-white text-primary rounded-lg font-bold hover:bg-cream transition-colors"
          >
            Go Home
          </Link>
          <Link
            href="/shop"
            className="px-8 py-3 border-2 border-white text-white rounded-lg font-bold hover:bg-white hover:text-primary transition-colors"
          >
            Continue Shopping
          </Link>
        </div>

        {/* Quick Links */}
        <div className="mt-16 pt-8 border-t border-white border-opacity-20">
          <p className="text-gray-200 text-sm mb-4">Quick Links:</p>
          <div className="flex flex-wrap gap-4 justify-center">
            {[
              { label: 'Home', href: '/' },
              { label: 'Shop', href: '/shop' },
              { label: 'About', href: '/about' },
              { label: 'Contact', href: '/contact' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-200 hover:text-white underline text-sm"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
