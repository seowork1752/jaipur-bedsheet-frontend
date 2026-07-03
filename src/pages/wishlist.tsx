import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { apiClient } from '@/utils/api';
import { useUserStore, useCartStore } from '@/store';
import toast from 'react-hot-toast';

interface WishlistItem {
  _id: string;
  name: string;
  slug: string;
  price: number;
  discountPrice?: number;
  images: { front: string };
  avgRating: number;
  stock: number;
}

export default function Wishlist() {
  const router = useRouter();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  const user = useUserStore((state) => state.user);
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const removeFromWishlist = useUserStore((state) => state.removeFromWishlist);
  const addToCart = useCartStore((state) => state.addItem);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    fetchWishlist();
  }, [isAuthenticated, router]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/wishlist');
      setItems(response.data.data || []);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      toast.error('Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      await apiClient.delete(`/wishlist/remove/${productId}`);
      setItems(items.filter((item) => item._id !== productId));
      removeFromWishlist(productId);
      toast.success('Removed from wishlist');
    } catch (error) {
      toast.error('Failed to remove from wishlist');
    }
  };

  const handleAddToCart = (item: WishlistItem) => {
    addToCart({
      productId: item._id,
      name: item.name,
      slug: item.slug,
      image: item.images.front,
      price: item.price,
      discountPrice: item.discountPrice,
      quantity: 1,
    });
    toast.success('Added to cart!');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-soft py-8 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-display font-bold text-primary">My Wishlist</h1>
          <p className="text-gray-600 mt-2">{items.length} items saved</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">❤️</div>
            <h2 className="text-3xl font-bold text-primary mb-4">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-8">
              Start adding products to your wishlist to save them for later
            </p>
            <Link
              href="/shop"
              className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-dark"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div key={item._id} className="bg-cream rounded-lg overflow-hidden hover:shadow-luxury transition-shadow">
                {/* Image */}
                <Link href={`/shop/${item.slug}`}>
                  <div className="relative h-64 overflow-hidden bg-gray-100 cursor-pointer group">
                    <Image
                      src={item.images.front}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                    {item.discountPrice && item.discountPrice < item.price && (
                      <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        Sale
                      </div>
                    )}
                  </div>
                </Link>

                {/* Content */}
                <div className="p-4">
                  <Link href={`/shop/${item.slug}`}>
                    <h3 className="text-lg font-semibold text-primary hover:text-accent transition-colors line-clamp-2">
                      {item.name}
                    </h3>
                  </Link>

                  {/* Rating */}
                  <div className="flex items-center my-2">
                    <div className="flex text-yellow-400 text-sm">
                      {[...Array(5)].map((_, i) => (
                        <span key={i}>★</span>
                      ))}
                    </div>
                    <span className="text-xs text-gray-600 ml-2">({item.avgRating})</span>
                  </div>

                  {/* Price */}
                  <div className="mb-4">
                    {item.discountPrice && item.discountPrice < item.price ? (
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-primary">
                          ₹{item.discountPrice}
                        </span>
                        <span className="text-sm text-gray-500 line-through">
                          ₹{item.price}
                        </span>
                      </div>
                    ) : (
                      <span className="text-2xl font-bold text-primary">₹{item.price}</span>
                    )}
                  </div>

                  {/* Stock Status */}
                  <p className={`text-sm font-semibold mb-4 ${item.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {item.stock > 0 ? '✓ In Stock' : '✗ Out of Stock'}
                  </p>

                  {/* Buttons */}
                  <div className="space-y-2">
                    <button
                      onClick={() => handleAddToCart(item)}
                      disabled={item.stock === 0}
                      className="w-full bg-primary text-white py-2 rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() => handleRemoveFromWishlist(item._id)}
                      className="w-full border-2 border-red-500 text-red-500 py-2 rounded-lg font-semibold hover:bg-red-50 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
