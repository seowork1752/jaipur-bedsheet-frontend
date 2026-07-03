import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { apiClient } from '@/utils/api';
import toast from 'react-hot-toast';

interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  discountPrice?: number;
  images: { front: string };
  avgRating: number;
  totalReviews: number;
}

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const [featuredRes, bestSellersRes] = await Promise.all([
        apiClient.get('/products/featured?limit=6'),
        apiClient.get('/products/bestsellers?limit=6'),
      ]);

      setFeaturedProducts(featuredRes.data.data || []);
      setBestSellers(bestSellersRes.data.data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Hero Banner */}
      <section className="relative h-screen w-full overflow-hidden bg-gradient-luxury flex items-center justify-center text-center text-white">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1540932239986-a128078d0e21?w=1600&h=900&fit=crop"
            alt="Hero Banner"
            fill
            className="object-cover opacity-40"
            priority
          />
        </div>
        <div className="relative z-10 px-4 max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
            Premium Jaipur Bedsheets
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-100">
            Experience the luxury of authentic Jaipur heritage and craftsmanship
          </p>
          <Link
            href="/shop"
            className="inline-block bg-accent text-primary px-8 py-4 rounded-lg font-semibold hover:bg-accent-dark transition-colors"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-primary mb-4">
              Featured Collection
            </h2>
            <p className="text-gray-600 text-lg">
              Handpicked premium bedsheets curated for your comfort
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-xl h-96 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-display font-bold text-primary mb-12 text-center">
            Shop by Category
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Cotton Bedsheets', slug: 'cotton-bedsheets', color: 'royal-blue' },
              { name: 'Hand Block Print', slug: 'hand-block-print', color: 'maroon' },
              { name: 'Sanganeri Print', slug: 'sanganeri-print', color: 'mustard' },
              { name: 'Premium Collection', slug: 'premium-collection', color: 'gold' },
            ].map((category) => (
              <Link
                key={category.slug}
                href={`/shop?category=${category.slug}`}
                className="group relative overflow-hidden rounded-xl h-64 cursor-pointer"
              >
                <div className={`absolute inset-0 bg-${category.color} opacity-60 group-hover:opacity-80 transition-all`} />
                <div className="relative h-full flex items-center justify-center text-center z-10">
                  <h3 className="text-2xl font-bold text-white group-hover:scale-110 transition-transform">
                    {category.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-primary mb-4">
              Best Sellers
            </h2>
            <p className="text-gray-600 text-lg">
              Most loved by our customers
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-xl h-96 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {bestSellers.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-display font-bold mb-12 text-center">
            Why Choose Jaipur Bedsheets?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: '🧵', title: 'Premium Quality', desc: '100% authentic cotton' },
              { icon: '🎨', title: 'Hand-Crafted', desc: 'Traditional Jaipur designs' },
              { icon: '🚚', title: 'Fast Shipping', desc: 'Free shipping above ₹500' },
              { icon: '💯', title: 'Satisfaction', desc: '30-day return guarantee' },
            ].map((feature, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-200">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-cream">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-display font-bold text-primary mb-4">
            Subscribe to Our Newsletter
          </h2>
          <p className="text-gray-600 mb-8">
            Get exclusive offers and updates about new collections
          </p>
          <form className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-primary"
              required
            />
            <button
              type="submit"
              className="px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/shop/${product.slug}`}>
      <div className="card-product cursor-pointer group">
        <div className="relative h-64 overflow-hidden">
          <Image
            src={product.images.front}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {product.discountPrice && product.discountPrice < product.price && (
            <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              Sale
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-primary mb-2 line-clamp-2">
            {product.name}
          </h3>
          <div className="flex items-center mb-3">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <span key={i}>★</span>
              ))}
            </div>
            <span className="text-sm text-gray-600 ml-2">
              {product.totalReviews} reviews
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              {product.discountPrice && product.discountPrice < product.price ? (
                <>
                  <p className="text-2xl font-bold text-primary">
                    ₹{product.discountPrice}
                  </p>
                  <p className="text-sm text-gray-500 line-through">
                    ₹{product.price}
                  </p>
                </>
              ) : (
                <p className="text-2xl font-bold text-primary">₹{product.price}</p>
              )}
            </div>
            <button className="bg-accent text-primary px-4 py-2 rounded-lg font-semibold hover:bg-accent-dark transition-colors">
              Add
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
