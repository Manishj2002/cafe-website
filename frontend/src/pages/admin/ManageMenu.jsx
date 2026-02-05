// src/pages/admin/ManageMenu.jsx - Menu Management with Image Upload (Fixed)
import { useState, useEffect } from 'react';
import menuService from '../../services/menuApi';
import categoryService from '../../services/categoryService';
import adminService from '../../services/adminService';
import API from '../../services/api'; // ✅ Use configured API instance instead of axios
import Loader from '../../components/common/Loader';

const ManageMenu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false); // ✅ Track upload state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    isVeg: true,
    spicyLevel: 0,
    stock: 0,
    isFeatured: false,
    preparationTime: 15
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [menuData, categoryData] = await Promise.all([
        menuService.getMenuItems(),
        categoryService.getCategories()
      ]);
      setMenuItems(menuData.data);
      setCategories(categoryData.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert('❌ Image size should be less than 5MB');
        return;
      }

      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        alert('❌ Please upload a valid image file (JPEG, PNG, GIF, or WebP)');
        return;
      }

      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      let imageUrl = editingItem?.image || ''; // ✅ Keep existing image if editing

      // Upload image if a new file was selected
      if (imageFile) {
        setUploading(true);
        const formDataImg = new FormData();
        formDataImg.append('image', imageFile);

        console.log('📤 Uploading image...');

        try {
          // ✅ Use configured API instance with /upload endpoint
          const uploadRes = await API.post('/upload', formDataImg, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });

          // ✅ Get Cloudinary URL from response
          imageUrl = uploadRes.data.imageUrl;
          console.log('✅ Image uploaded successfully:', imageUrl);
        } catch (uploadError) {
          console.error('❌ Upload error:', uploadError);
          alert('❌ Failed to upload image: ' + (uploadError.response?.data?.message || uploadError.message));
          setUploading(false);
          return; // Stop submission if upload fails
        }
        
        setUploading(false);
      }

      // Prepare submission data
      const submitData = { 
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        spicyLevel: Number(formData.spicyLevel),
        preparationTime: Number(formData.preparationTime)
      };

      // ✅ Only add image if we have one
      if (imageUrl) {
        submitData.image = imageUrl;
      }

      console.log('📝 Submitting menu item data:', submitData);

      // Create or update menu item
      if (editingItem) {
        await adminService.updateMenuItem(editingItem._id, submitData);
        alert('✅ Menu item updated successfully!');
      } else {
        await adminService.addMenuItem(submitData);
        alert('✅ Menu item added successfully!');
      }

      setShowModal(false);
      resetForm();
      loadData();
    } catch (error) {
      console.error('❌ Submit error:', error);
      alert('❌ ' + (error.response?.data?.message || error.message || 'Operation failed'));
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category._id || item.category,
      isVeg: item.isVeg,
      spicyLevel: item.spicyLevel || 0,
      stock: item.stock,
      isFeatured: item.isFeatured,
      preparationTime: item.preparationTime || 15
    });
    
    // ✅ Set preview to Cloudinary URL directly (no localhost prefix needed)
    if (item.image) {
      setImagePreview(item.image);
    }
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      await adminService.deleteMenuItem(id);
      alert('✅ Item deleted successfully!');
      loadData();
    } catch (error) {
      console.error('Delete error:', error);
      alert('❌ ' + (error.response?.data?.message || 'Delete failed'));
    }
  };

  const toggleAvailability = async (id) => {
    try {
      await adminService.toggleAvailability(id);
      loadData();
    } catch (error) {
      console.error('Toggle availability error:', error);
      alert('❌ ' + (error.response?.data?.message || 'Update failed'));
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      isVeg: true,
      spicyLevel: 0,
      stock: 0,
      isFeatured: false,
      preparationTime: 15
    });
    setEditingItem(null);
    setImageFile(null);
    setImagePreview(null);
    setUploading(false);
  };

  if (loading) return <Loader fullPage />;

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">Manage Menu 🍽️</h1>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition"
          >
            + Add New Item
          </button>
        </div>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {menuItems.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">No menu items found. Add your first item!</p>
            </div>
          ) : (
            menuItems.map((item) => (
              <div key={item._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
                <div className="h-40 bg-gradient-to-br from-accent to-primary flex items-center justify-center text-6xl overflow-hidden">
                  {item.image ? (
                    // ✅ Display Cloudinary image directly
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover" 
                      onError={(e) => {
                        // Fallback if image fails to load
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = item.isVeg ? '🥗' : '🍖';
                      }}
                    />
                  ) : (
                    item.isVeg ? '🥗' : '🍖'
                  )}
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg line-clamp-1">{item.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      item.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {item.isAvailable ? 'Active' : 'Hidden'}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xl font-bold text-primary">₹{item.price}</span>
                    <span className="text-sm text-gray-500">Stock: {item.stock}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => toggleAvailability(item._id)}
                      className="bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 transition text-sm font-medium"
                    >
                      {item.isAvailable ? 'Hide' : 'Show'}
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 my-8">
              <h2 className="text-2xl font-bold mb-6">
                {editingItem ? '✏️ Edit Menu Item' : '➕ Add New Menu Item'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Image Upload */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Product Image
                    <span className="text-sm text-gray-500 font-normal ml-2">(Max 5MB - JPEG, PNG, GIF, WebP)</span>
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    disabled={uploading}
                  />
                  {imagePreview && (
                    <div className="mt-4 relative">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-full h-48 object-cover rounded-lg shadow-md" 
                      />
                      {!uploading && (
                        <button
                          type="button"
                          onClick={() => {
                            setImageFile(null);
                            setImagePreview(null);
                          }}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  )}
                  {/* ✅ Upload progress indicator */}
                  {uploading && (
                    <div className="mt-2 flex items-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                      <p className="text-primary font-medium">Uploading image to cloud...</p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      disabled={uploading}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="e.g., Butter Chicken"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Category *</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                      disabled={uploading}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    disabled={uploading}
                    rows="3"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Describe the dish..."
                  ></textarea>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Price (₹) *</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      required
                      disabled={uploading}
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Stock *</label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      required
                      disabled={uploading}
                      min="0"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Prep Time (min)</label>
                    <input
                      type="number"
                      name="preparationTime"
                      value={formData.preparationTime}
                      onChange={handleChange}
                      disabled={uploading}
                      min="0"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="15"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Spicy Level (0-3)
                    <span className="text-sm text-gray-500 font-normal ml-2">
                      0 = Mild, 3 = Very Spicy
                    </span>
                  </label>
                  <input
                    type="number"
                    name="spicyLevel"
                    value={formData.spicyLevel}
                    onChange={handleChange}
                    disabled={uploading}
                    min="0"
                    max="3"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="isVeg"
                      checked={formData.isVeg}
                      onChange={handleChange}
                      disabled={uploading}
                      className="w-5 h-5 cursor-pointer"
                    />
                    <span className="text-gray-700 font-medium">🥗 Vegetarian</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="isFeatured"
                      checked={formData.isFeatured}
                      onChange={handleChange}
                      disabled={uploading}
                      className="w-5 h-5 cursor-pointer"
                    />
                    <span className="text-gray-700 font-medium">⭐ Featured</span>
                  </label>
                </div>

                <div className="flex gap-4 pt-4 border-t">
                  <button
                    type="submit"
                    disabled={uploading}
                    className={`flex-1 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-opacity-90 transition ${
                      uploading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {uploading ? '⏳ Uploading...' : editingItem ? '✅ Update Item' : '✅ Add Item'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    disabled={uploading}
                    className={`flex-1 bg-gray-300 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-400 transition ${
                      uploading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageMenu;