import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { Star, ShoppingCart, Heart, Share2 } from 'lucide-react';
import { useProduct } from '../hooks/useProducts';
import { useCartStore } from '../stores/cartStore';
import ReviewSection from '../components/Product/ReviewSection';
import RelatedProducts from '../components/Product/RelatedProducts';

export default function ProductPage() {
  const { slug } = useParams();
  const { product, isLoading } = useProduct(slug);
  const addItem = useCartStore((s) => s.addItem);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  if (isLoading) return <LoadingSpinner />;
  if (!product) return <div>Product not found</div>;

  const discount = product.compareAtPrice 
    ? Math.round((1 - product.price / product.compareAtPrice) * 100)
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-square rounded-2xl overflow-hidden bg-white shadow-sm">
            <img 
              src={product.images[selectedImage]} 
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex gap-2">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                  selectedImage === i ? 'border-brand-teal' : 'border-transparent'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              {discount > 0 && (
                <span className="bg-red-500 text-white text-sm px-2 py-1 rounded">
                  -{discount}%
                </span>
              )}
              <span className="text-gray-500 text-sm">{product.category}</span>
            </div>
            <h1 className="text-3xl font-bold text-slate-900">{product.name}</h1>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex">
                {[1,2,3,4,5].map((star) => (
                  <Star 
                    key={star} 
                    className={`w-5 h-5 ${star <= product.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">({product.reviewCount} reviews)</span>
            </div>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-brand-teal">
              ₦{product.price}
            </span>
            {product.compareAtPrice && (
              <span className="text-xl text-gray-400 line-through">
                ₦{product.compareAtPrice}
              </span>
            )}
          </div>

          <p className="text-gray-600 leading-relaxed">{product.description}</p>

          {/* Quantity & Add to Cart */}
          <div className="flex items-center gap-4">
            <div className="flex items-center border border-gray-200 rounded-lg">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-2 hover:bg-gray-50"
              >-</button>
              <span className="px-4 py-2 font-medium">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="px-4 py-2 hover:bg-gray-50"
              >+</button>
            </div>
            
            <button
              onClick={() => addItem(product, quantity)}
              className="flex-1 flex items-center justify-center gap-2 bg-brand-teal hover:bg-brand-teal-dark text-white py-3 px-6 rounded-lg font-medium transition"
            >
              <ShoppingCart className="w-5 h-5" />
              Add to Cart
            </button>
            
            <button className="p-3 border border-gray-200 rounded-lg hover:border-brand-teal transition">
              <Heart className="w-5 h-5" />
            </button>
          </div>

          {/* Shipping Info */}
          <div className="bg-brand-peach-dark rounded-lg p-4 space-y-2">
            <p className="text-sm font-medium">Shipping</p>
            <p className="text-sm text-gray-600">
              Free shipping on orders over ₦50,000. Delivery within 3-5 business days.
            </p>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <ReviewSection productId={product.id} />

      {/* Related Products */}
      <RelatedProducts categoryId={product.categoryId} excludeId={product.id} />
    </div>
  );
}