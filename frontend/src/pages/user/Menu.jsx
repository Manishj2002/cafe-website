// src/pages/user/Menu.jsx - Menu with FIXED Filters
import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import menuService from '../../services/menuApi';
import categoryService from '../../services/categoryService';
import Loader from '../../components/common/Loader';

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart } = useCart();

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    isVeg: searchParams.get('isVeg') || '',
    sort: searchParams.get('sort') || ''
  });

  useEffect(() => {
    loadCategories();
    loadMenuItems();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, menuItems]);

  const loadCategories = async () => {
    try {
      const { data } = await categoryService.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadMenuItems = async () => {
    setLoading(true);
    try {
      // Get ALL items without filters from backend
      const { data } = await menuService.getMenuItems();
      setMenuItems(data);
    } catch (error) {
      console.error('Error loading menu:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let items = [...menuItems];

    // Search filter
    if (filters.search) {
      items = items.filter(item =>
        item.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.description.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Category filter
    if (filters.category) {
  items = items.filter(item => {
    if (!item.category) return false;

    return (
      item.category === filters.category ||
      item.category?._id === filters.category
    );
  });
}


    // Veg/Non-Veg filter
    if (filters.isVeg !== '') {
      const isVegBool = filters.isVeg === 'true';
      items = items.filter(item => item.isVeg === isVegBool);
    }

    // Sort
    if (filters.sort === 'price_asc') {
      items.sort((a, b) => a.price - b.price);
    } else if (filters.sort === 'price_desc') {
      items.sort((a, b) => b.price - a.price);
    } else if (filters.sort === 'rating') {
      items.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (filters.sort === 'popular') {
      items.sort((a, b) => (b.numReviews || 0) - (a.numReviews || 0));
    }

    setFilteredItems(items);
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Update URL params
    const params = new URLSearchParams();
    Object.keys(newFilters).forEach(k => {
      if (newFilters[k]) params.set(k, newFilters[k]);
    });
    setSearchParams(params);
  };

  const clearFilters = () => {
    setFilters({ search: '', category: '', isVeg: '', sort: '' });
    setSearchParams({});
  };

  const handleAddToCart = (item) => {
    addToCart(item);
    alert('✅ Added to cart!');
  };

  if (loading) return <Loader fullPage />;

  return (
    <div className="min-h-screen bg-light-bg py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8 text-primary">
          Our Menu 🍽️
        </h1>

        {/* Filters - Mobile Friendly */}
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-8">
          {/* Search Bar */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="🔍 Search for dishes..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Category Tabs - Horizontal Scroll on Mobile */}
          <div className="mb-4 overflow-x-auto">
            <div className="flex gap-2 pb-2 min-w-max sm:min-w-0 sm:flex-wrap">
              <button
                onClick={() => handleFilterChange('category', '')}
                className={`px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
                  !filters.category
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 text-dark hover:bg-gray-300'
                }`}
              >
                All ({menuItems.length})
              </button>
              {categories.map((cat) => {
                const count = menuItems.filter(item => {
  if (!item.category) return false;

  return (
    item.category === cat._id ||
    item.category?._id === cat._id
  );
}).length;

                return (
                  <button
                    key={cat._id}
                    onClick={() => handleFilterChange('category', cat._id)}
                    className={`px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
                      filters.category === cat._id
                        ? 'bg-primary text-white'
                        : 'bg-gray-200 text-dark hover:bg-gray-300'
                    }`}
                  >
                    {cat.name} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Additional Filters - Grid on Mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Veg/Non-Veg Filter */}
            <select
              value={filters.isVeg}
              onChange={(e) => handleFilterChange('isVeg', e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">All Items</option>
              <option value="true">🟢 Veg Only</option>
              <option value="false">🔴 Non-Veg Only</option>
            </select>

            {/* Sort */}
            <select
              value={filters.sort}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Sort By</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Rating</option>
              <option value="popular">Most Popular</option>
            </select>

            {/* Clear Filters */}
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-gray-200 text-dark rounded-lg hover:bg-gray-300 transition font-medium"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing <span className="font-bold text-primary">{filteredItems.length}</span> of {menuItems.length} items
          </p>
        </div>

        {/* Menu Items Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-2xl text-gray-500 mb-4">No items found 😔</p>
            <button
              onClick={clearFilters}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition transform hover:-translate-y-1"
              >
                <div className="h-48 bg-gradient-to-br from-accent to-primary flex items-center justify-center text-6xl">
                  {item.image ? (
                    <img src={`http://localhost:5000/${item.image}`} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    item.isVeg ? '🥗' : '🍖'
                  )}
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-dark line-clamp-1">
                      {item.name}
                    </h3>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full whitespace-nowrap ml-2">
                      {item.isVeg ? '🟢 Veg' : '🔴'}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xl font-bold text-primary">
                      ₹{item.price}
                    </span>
                    <div className="flex items-center gap-1 text-yellow-500 text-sm">
                      ⭐ {item.rating || 4.5}
                    </div>
                  </div>
                  {item.spicyLevel > 0 && (
                    <div className="mb-3 text-sm">
                      {'🌶️'.repeat(item.spicyLevel)} Spicy
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Link
                      to={`/menu/${item._id}`}
                      className="flex-1 bg-secondary text-primary text-center py-2 rounded-lg hover:bg-accent transition font-medium text-sm"
                    >
                      Details
                    </Link>
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-opacity-90 transition font-medium text-sm"
                    >
                      Add 🛒
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
};

export default Menu;