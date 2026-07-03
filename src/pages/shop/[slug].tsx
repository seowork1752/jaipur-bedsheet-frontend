import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { apiClient } from '@/utils/api';
import { useCartStore, useUserStore } from '@/store';
import toast from 'react-hot-toast';

interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  discountPrice?: number;
  stock: number;
  images: {
    front: string;
    back: string;
    folded: string;
    closeup: string;
    bedroom: string;
    gallery: string[];
  };
  specifications: {
    fabric: string;
    weave: string;
    thread_count: number;
    gsm: number;
    washcare: string[];
    care_instructions: string;
    dimensions: string;
    weight: string;
  };
  reviews: any[];
  avgRating: number;
  totalReviews: number;
  variants: any[];
  relatedProducts: Product[];
}

export default function ProductDetail() {
  const router = useRouter();
  const { slug } = router.query;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  const addToCart = useCartStore((state) => state.addItem);
  const addToWishlist = useUserStore((state) => state.addToWishlist);
  const user = useUserStore((state) => state.user);
  const wishlist = useUserStore((state) => state.user?.wishlist || []);

  useEffect(() => {
    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/products/slug/${slug}`);
      setProduct(response.data.data);
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        productId: product._id,
        name: product.name,
        slug: product.slug,
        image: product.images.front,
        price: product.price,
        discountPrice: product.discountPrice,
        quantity,
      });
      toast.success('Added to cart!');
    }
  };

  const handleAddToWishlist = async () => {
    if (!user) {
      toast.error('Please login to add to wishlist');
      router.push('/login');
      return;
    }

    try {
      await apiClient.post(`/wishlist/add/${product?._id}`);
      addToWishlist(product?._id || '');
      toast.success('Added to wishlist!');
    } catch (error) {
      toast.error('Failed to add to wishlist');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary mb-4">Product not found</h1>
          <Link href="/shop" className="text-accent hover:text-accent-dark">
            Back to shop
          </Link>
        </div>
      </div>
    );
  }

  const images = [
    product.images.front,
    product.images.back,
    product.images.folded,
    product.images.closeup,
    product.images.bedroom,
    ...product.images.gallery,
  ].filter(Boolean);

  const discount = product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const isInWishlist = wishlist.includes(product._id);

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-cream border-b border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-primary">
              Home
            </Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-primary">
              Shop
            </Link>
            <span>/</span>
            <span className="text-primary font-semibold">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div>
            <div className="relative bg-cream rounded-xl overflow-hidden mb-4 h-96 md:h-[500px]">
              <Image
                src={images[selectedImage]}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
              {discount > 0 && (
                <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full font-semibold">
                  -{discount}%
                </div>
              )}
            </div>
            <div className="grid grid-cols-5 gap-2">
              {images.map((image, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === idx ? 'border-primary' : 'border-gray-300'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`Product view ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-primary mb-4">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center mb-6">
              <div className="flex text-yellow-400 text-lg">
                {[...Array(5)].map((_, i) => (
                  <span key={i}>★</span>
                ))}
              </div>
              <span className="text-gray-600 ml-3">
                {product.avgRating.toFixed(1)} ({product.totalReviews} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="mb-6 pb-6 border-b border-gray-200">
              <div className="flex items-baseline gap-4">
                {product.discountPrice && product.discountPrice < product.price ? (
                  <>
                    <span className="text-4xl font-bold text-primary">
                      ₹{product.discountPrice}
                    </span>
                    <span className="text-2xl text-gray-500 line-through">
                      ₹{product.price}
                    </span>
                  </>
                ) : (
                  <span className="text-4xl font-bold text-primary">
                    ₹{product.price}
                  </span>
                )}
              </div>
              <p className="text-green-600 font-semibold mt-2">
                {product.stock > 0 ? '✓ In Stock' : '✗ Out of Stock'}
              </p>
            </div>

            {/* Description */}
            <p className="text-gray-700 text-lg mb-8">{product.description}</p>

            {/* Add to Cart & Wishlist */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 text-primary font-semibold hover:bg-cream"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 text-center border-0 focus:outline-none"
                    min="1"
                    max={product.stock}
                  />
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-4 py-2 text-primary font-semibold hover:bg-cream"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 bg-primary text-white py-3 rounded-lg font-bold text-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add to Cart
                </button>
              </div>

              <button
                onClick={handleAddToWishlist}
                className={`w-full py-3 rounded-lg font-semibold border-2 transition-colors ${
                  isInWishlist
                    ? 'bg-red-50 border-red-500 text-red-500'
                    : 'border-gray-300 text-gray-700 hover:border-red-500 hover:text-red-500'
                }`}
              >
                {isInWishlist ? '❤ Added to Wishlist' : '🤍 Add to Wishlist'}
              </button>
            </div>

            {/* Specifications */}
            <div className="bg-cream p-6 rounded-lg">
              <h3 className="text-lg font-bold text-primary mb-4">Specifications</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Fabric</p>
                  <p className="font-semibold text-primary">{product.specifications.fabric}</p>
                </div>
                <div>
                  <p className="text-gray-600">Weave</p>
                  <p className="font-semibold text-primary">{product.specifications.weave}</p>
                </div>
                <div>
                  <p className="text-gray-600">Thread Count</p>
                  <p className="font-semibold text-primary">{product.specifications.thread_count}</p>
                </div>
                <div>
                  <p className="text-gray-600">GSM</p>
                  <p className="font-semibold text-primary">{product.specifications.gsm}</p>
                </div>
                <div>
                  <p className="text-gray-600">Dimensions</p>
                  <p className="font-semibold text-primary">{product.specifications.dimensions}</p>
                </div>
                <div>
                  <p className="text-gray-600">Weight</p>
                  <p className="font-semibold text-primary">{product.specifications.weight}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-16 border-t border-gray-200 pt-8">
          <div className="flex gap-8 border-b border-gray-200 mb-8">
            {['description', 'washcare', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 font-semibold text-lg transition-colors capitalize ${
                  activeTab === tab
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-600 hover:text-primary'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === 'description' && (
            <div className="prose max-w-none">
              <p className="text-gray-700">{product.description}</p>
            </div>
          )}

          {activeTab === 'washcare' && (
            <div>
              <h3 className="text-lg font-bold text-primary mb-4">Care Instructions</h3>
              <p className="text-gray-700 mb-4">{product.specifications.care_instructions}</p>
              <h4 className="font-semibold text-primary mb-2">Wash Care:</h4>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {product.specifications.washcare.map((care, idx) => (
                  <li key={idx}>{care}</li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              <h3 className="text-lg font-bold text-primary mb-6">Customer Reviews</h3>
              {product.reviews.length > 0 ? (
                <div className="space-y-6">
                  {product.reviews.map((review, idx) => (
                    <div key={idx} className="pb-6 border-b border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex text-yellow-400">
                          {[...Array(review.rating)].map((_, i) => (
                            <span key={i}>★</span>
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h4 className="font-semibold text-primary mb-1">{review.title}</h4>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No reviews yet. Be the first to review!</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
