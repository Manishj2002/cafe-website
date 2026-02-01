// src/pages/user/ProductDetails.jsx - Product Detail Page
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import menuService from "../../services/menuApi";
import Loader from "../../components/common/Loader";

const ProductDetails = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [relatedItems, setRelatedItems] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    setLoading(true);
    try {
      const { data } = await menuService.getMenuItem(id);
      setItem(data);

      // Load related items
      if (data.category) {
        const { data: related } = await menuService.getMenuByCategory(
          data.category._id,
        );
        setRelatedItems(related.filter((i) => i._id !== id).slice(0, 4));
      }
    } catch (error) {
      console.error("Error loading product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(item);
    }
    alert(`✅ Added ${quantity} ${item.name} to cart!`);
    navigate("/cart");
  };

  if (loading) return <Loader fullPage />;
  if (!item) return <div className="text-center py-16">Product not found</div>;

  return (
    <div className="min-h-screen bg-light-bg py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-gray-600">
          <Link to="/" className="hover:text-primary">
            Home
          </Link>
          {" > "}
          <Link to="/menu" className="hover:text-primary">
            Menu
          </Link>
          {" > "}
          <span className="text-dark">{item.name}</span>
        </div>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
          {/* Image Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="bg-gradient-to-br from-accent to-primary rounded-xl flex items-center justify-center h-80 sm:h-96 text-9xl">
              <img
                src={item.image ? `http://localhost:5000/${item.image}` : ""}
                alt={item.name}
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
          </div>

          {/* Info Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium mb-3">
                  {item.isVeg ? "🟢 Vegetarian" : "🔴 Non-Vegetarian"}
                </span>
                <h1 className="text-3xl sm:text-4xl font-bold text-dark mb-2">
                  {item.name}
                </h1>
                <p className="text-gray-600">{item.category?.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <span className="text-4xl font-bold text-primary">
                ₹{item.price}
              </span>
              <div className="flex items-center gap-1 text-yellow-500 text-lg">
                ⭐ {item.rating || 4.5}
                <span className="text-gray-500 text-sm ml-1">
                  ({item.numReviews || 0} reviews)
                </span>
              </div>
            </div>

            <p className="text-gray-700 mb-6 leading-relaxed">
              {item.description}
            </p>

            {/* Additional Info */}
            <div className="space-y-3 mb-6 pb-6 border-b">
              {item.spicyLevel > 0 && (
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-dark">Spicy Level:</span>
                  <span>{"🌶️".repeat(item.spicyLevel)}</span>
                </div>
              )}
              {item.preparationTime && (
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-dark">Prep Time:</span>
                  <span>{item.preparationTime} mins</span>
                </div>
              )}
              {item.ingredients && item.ingredients.length > 0 && (
                <div>
                  <span className="font-semibold text-dark block mb-2">
                    Ingredients:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {item.ingredients.map((ing, idx) => (
                      <span
                        key={idx}
                        className="bg-secondary px-3 py-1 rounded-full text-sm"
                      >
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="mb-6">
              <label className="block font-semibold text-dark mb-3">
                Quantity:
              </label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 bg-gray-200 rounded-full hover:bg-gray-300 transition font-bold text-xl"
                >
                  -
                </button>
                <span className="text-2xl font-bold w-12 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 bg-primary text-white rounded-full hover:bg-opacity-90 transition font-bold text-xl"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <div className="space-y-3">
              <button
                onClick={handleAddToCart}
                className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-opacity-90 transition shadow-lg"
              >
                Add to Cart - ₹{item.price * quantity}
              </button>
              <Link
                to="/menu"
                className="block w-full text-center bg-secondary text-primary py-4 rounded-xl font-semibold hover:bg-accent transition"
              >
                Continue Shopping
              </Link>
            </div>

            {/* Stock Status */}
            {item.stock > 0 ? (
              <p className="text-green-600 font-medium mt-4">
                ✓ In Stock ({item.stock} available)
              </p>
            ) : (
              <p className="text-red-600 font-medium mt-4">✗ Out of Stock</p>
            )}
          </div>
        </div>

        {/* Related Items */}
        {relatedItems.length > 0 && (
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-6">
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedItems.map((relatedItem) => (
                <Link
                  key={relatedItem._id}
                  to={`/menu/${relatedItem._id}`}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition transform hover:-translate-y-1"
                >
                  <div className="h-32 sm:h-40 bg-gradient-to-br from-accent to-primary flex items-center justify-center text-5xl">
                    {relatedItem.isVeg ? "🥗" : "🍖"}
                  </div>
                  <div className="p-3 sm:p-4">
                    <h3 className="font-bold text-dark text-sm sm:text-base line-clamp-1 mb-1">
                      {relatedItem.name}
                    </h3>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-primary">
                        ₹{relatedItem.price}
                      </span>
                      <span className="text-xs text-yellow-500">
                        ⭐ {relatedItem.rating || 4.5}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
