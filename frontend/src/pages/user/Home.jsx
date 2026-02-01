// src/pages/user/Home.jsx - Enhanced Homepage with Dynamic Features
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import axios from 'axios';
import Loader from '../../components/common/Loader';

const Home = () => {
  const [featuredItems, setFeaturedItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [featuredData, categoriesData, offersData] = await Promise.all([
        axios.get('/api/menu/featured/items'),
        axios.get('/api/categories'),
        axios.get('/api/public/offers')
      ]);
      setFeaturedItems(featuredData.data.data);
      setCategories(categoriesData.data.data);
      setOffers(offersData.data.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (item) => {
    addToCart(item);
    alert('Added to cart! 🛒');
  };

  if (loading) return <Loader fullPage />;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-accent text-white py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 animate-fade-in">
            Welcome to Café Delight ☕
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl mb-6 sm:mb-8 max-w-2xl mx-auto">
            Delicious food, fresh coffee, and fast delivery right to your door!
          </p>
          <Link
            to="/menu"
            className="inline-block bg-white text-primary px-8 py-3 sm:px-10 sm:py-4 rounded-full text-lg font-semibold hover:bg-secondary transition transform hover:scale-105 shadow-lg"
          >
            Order Now 🍕
          </Link>
        </div>
      </section>

      {/* Dynamic Special Offers Carousel */}
      {offers.length > 0 && (
        <section className="py-12 sm:py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8 text-primary">
              🎉 Special Offers
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {offers.map((offer) => (
                <div
                  key={offer._id}
                  className="rounded-xl p-6 shadow-lg transform hover:scale-105 transition"
                  style={{
                    backgroundColor: offer.backgroundColor || '#FF6B35',
                    color: offer.textColor || '#FFFFFF'
                  }}
                >
                  <div className="text-4xl mb-3">
                    {offer.discountType === 'free_delivery' ? '🚚' : '🎁'}
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{offer.title}</h3>
                  <p className="mb-4 opacity-90">{offer.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold">
                      {offer.discountType === 'percentage' && `${offer.discountValue}% OFF`}
                      {offer.discountType === 'fixed' && `₹${offer.discountValue} OFF`}
                      {offer.discountType === 'free_delivery' && 'FREE DELIVERY'}
                    </span>
                    <span className="bg-white bg-opacity-20 px-4 py-2 rounded-full font-mono font-bold">
                      {offer.code}
                    </span>
                  </div>
                  {offer.minOrderAmount > 0 && (
                    <p className="mt-3 text-sm opacity-75">
                      Min order: ₹{offer.minOrderAmount}
                    </p>
                  )}
                  <p className="mt-2 text-xs opacity-75">
                    Valid till: {new Date(offer.expiryDate).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Categories Section */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8 sm:mb-12 text-primary">
            Browse Categories
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
            {categories.slice(0, 5).map((category) => (
              <Link
                key={category._id}
                to={`/menu?category=${category._id}`}
                className="bg-secondary rounded-xl p-6 text-center hover:bg-accent transition transform hover:scale-105 shadow-md"
              >
                <div className="text-4xl sm:text-5xl mb-3">
                  {category.name === 'Coffee' && '☕'}
                  {category.name === 'Pizza' && '🍕'}
                  {category.name === 'Desserts' && '🍰'}
                  {category.name === 'Beverages' && '🥤'}
                  {category.name === 'Snacks' && '🍟'}
                </div>
                <h3 className="font-semibold text-dark text-sm sm:text-base">
                  {category.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Menu Section */}
      <section className="py-12 sm:py-16 bg-light-bg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8 sm:mb-12 text-primary">
            Featured Menu
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {featuredItems.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition transform hover:-translate-y-2"
              >
                <div className="h-48 sm:h-56 bg-gradient-to-br from-accent to-primary flex items-center justify-center text-6xl sm:text-7xl">
                  {item.image ? (
                    <img src={`http://localhost:5000/${item.image}`} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    item.isVeg ? '🥗' : '🍖'
                  )}
                </div>
                <div className="p-4 sm:p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg sm:text-xl font-bold text-dark">
                      {item.name}
                    </h3>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      {item.isVeg ? '🟢 Veg' : '🔴 Non-Veg'}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">
                      ₹{item.price}
                    </span>
                    <div className="flex items-center gap-1 text-yellow-500">
                      ⭐ {item.rating || 4.5}
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Link
                      to={`/menu/${item._id}`}
                      className="flex-1 bg-secondary text-primary text-center py-2 rounded-lg hover:bg-accent transition font-medium text-sm sm:text-base"
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-opacity-90 transition font-medium text-sm sm:text-base"
                    >
                      Add to Cart 🛒
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8 sm:mt-12">
            <Link
              to="/menu"
              className="inline-block bg-primary text-white px-8 py-3 sm:px-10 sm:py-4 rounded-full text-base sm:text-lg font-semibold hover:bg-opacity-90 transition"
            >
              View Full Menu →
            </Link>
          </div>
        </div>
      </section>

      {/* Animated Testimonials */}
      <section className="py-12 sm:py-16 bg-white overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8 sm:mb-12 text-primary">
            What Our Customers Say
          </h2>
          <div className="relative">
            <div className="flex animate-scroll space-x-6">
              {[...Array(2)].map((_, setIndex) => (
                <div key={setIndex} className="flex space-x-6">
                  {[
                    { name: 'Rahul Sharma', review: 'Best coffee in town! Fast delivery and amazing taste.', rating: 5 },
                    { name: 'Priya Singh', review: 'Love the variety! Pizza is delicious and always fresh.', rating: 5 },
                    { name: 'Amit Kumar', review: 'Great service and quality. Highly recommended!', rating: 5 },
                    { name: 'Sneha Patel', review: 'Amazing food quality and quick delivery. Will order again!', rating: 5 },
                    { name: 'Vikram Reddy', review: 'Excellent taste and reasonable prices. Love it!', rating: 5 }
                  ].map((testimonial, idx) => (
                    <div key={`${setIndex}-${idx}`} className="bg-secondary p-6 rounded-xl shadow-md flex-shrink-0 w-80">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white text-xl font-bold">
                          {testimonial.name[0]}
                        </div>
                        <div className="ml-4">
                          <h4 className="font-bold text-dark">{testimonial.name}</h4>
                          <div className="text-yellow-500">{'⭐'.repeat(testimonial.rating)}</div>
                        </div>
                      </div>
                      <p className="text-gray-700 italic">"{testimonial.review}"</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Add animation CSS */}
      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        
        .animate-scroll:hover {
          animation-play-state: paused;
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Home;