import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
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

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export default function Shop() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    limit: 12,
    pages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 5000,
    category: '',
    search: '',
  });

  useEffect(() => {
    fetchProducts();
  }, [filters, router.query]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const page = Number(router.query.page) || 1;

      const response = await apiClient.get('/products', {
        params: {
          page,
          limit: 12,
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice,
          category: filters.category,
          search: filters.search,
        },
      });

      setProducts(response.data.data || []);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-soft py-12 border-b-2 border-gold">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-display font-bold text-primary">
            Shop Premium Bedsheets
          </h1>
          <p className="text-gray-600 mt-2">
            {pagination.total} products available
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-cream p-6 rounded-xl sticky top-20">
              <h3 className="text-xl font-bold text-primary mb-6">Filters</h3>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-primary mb-2">
                  Search
                </label>
                <input
                  type="text"
                  placeholder="Product name..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange({ search: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-primary mb-2">
                  Price Range
                </label>
                <div className="space-y-2">
                  <div>
                    <label className="text-xs text-gray-600">Min: ₹{filters.minPrice}</label>
                    <input
                      type="range"
                      min="0"
                      max="5000"
                      value={filters.minPrice}
                      onChange={(e) =>
                        handleFilterChange({ minPrice: Number(e.target.value) })
                      }
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600">Max: ₹{filters.maxPrice}</label>
                    <input
                      type="range"
                      min="0"
                      max="5000"
                      value={filters.maxPrice}
                      onChange={(e) =>
                        handleFilterChange({ maxPrice: Number(e.target.value) })
                      }
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-primary mb-2">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange({ category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="">All Categories</option>
                  <option value="cotton-bedsheets">Cotton Bedsheets</option>
                  <option value="hand-block-print">Hand Block Print</option>
                  <option value="sanganeri-print">Sanganeri Print</option>
                  <option value="premium-collection">Premium Collection</option>
                </select>
              </div>

              {/* Reset Filters */}
              <button
                onClick={() =>
                  setFilters({
                    minPrice: 0,
                    maxPrice: 5000,
                    category: '',
                    search: '',
                  })
                }
                className="w-full bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-dark"
              >
                Reset Filters
              </button>
            </div>
          </aside>

          {/* Products Grid */}
          <main className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-gray-200 rounded-xl h-96 animate-pulse" />
                ))}
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-12">
                    {pagination.page > 1 && (
                      <Link
                        href={`/shop?page=${pagination.page - 1}`}
                        className="px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white"
                      >
                        Previous
                      </Link>
                    )}

                    {[...Array(pagination.pages)].map((_, i) => (
                      <Link
                        key={i + 1}
                        href={`/shop?page=${i + 1}`}
                        className={`px-3 py-2 rounded-lg ${
                          pagination.page === i + 1
                            ? 'bg-primary text-white'
                            : 'border border-primary text-primary hover:bg-primary hover:text-white'
                        }`}
                      >
                        {i + 1}
                      </Link>
                    ))}

                    {pagination.page < pagination.pages && (
                      <Link
                        href={`/shop?page=${pagination.page + 1}`}
                        className="px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white"
                      >
                        Next
                      </Link>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-xl text-gray-600">No products found</p>
                <Link
                  href="/shop"
                  className="mt-4 inline-block bg-primary text-white px-6 py-2 rounded-lg"
                >
                  Reset Filters
                </Link>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const { useCartStore } = require('@/store');
  const addToCart = useCartStore((state: any) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart({
      productId: product._id,
      name: product.name,
      slug: product.slug,
      image: product.images.front,
      price: product.price,
      discountPrice: product.discountPrice,
      quantity: 1,
    });
    toast.success('Added to cart!');
  };

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
              {Math.round((1 - product.discountPrice / product.price) * 100)}% OFF
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-primary mb-2 line-clamp-2">
            {product.name}
          </h3>
          <div className="flex items-center mb-3">
            <div className="flex text-yellow-400 text-sm">
              {[...Array(5)].map((_, i) => (
                <span key={i}>★</span>
              ))}
            </div>
            <span className="text-xs text-gray-600 ml-2">
              {product.totalReviews}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              {product.discountPrice && product.discountPrice < product.price ? (
                <>
                  <p className="text-2xl font-bold text-primary">
                    ₹{product.discountPrice}
                  </p>
                  <p className="text-xs text-gray-500 line-through">
                    ₹{product.price}
                  </p>
                </>
              ) : (
                <p className="text-2xl font-bold text-primary">₹{product.price}</p>
              )}
            </div>
            <button
              onClick={handleAddToCart}
              className="bg-accent text-primary px-3 py-2 rounded-lg font-semibold hover:bg-accent-dark transition-colors text-sm"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
