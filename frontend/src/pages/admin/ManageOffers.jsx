// src/pages/admin/ManageOffers.jsx - Manage Special Offers
import { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import Loader from '../../components/common/Loader';

const ManageOffers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    title: '',
    description: '',
    discountType: 'percentage',
    discountValue: '',
    minOrderAmount: 0,
    expiryDate: '',
    showOnHomepage: false,
    backgroundColor: '#FF6B35',
    textColor: '#FFFFFF'
  });

  useEffect(() => {
    loadOffers();
  }, []);

  const loadOffers = async () => {
    try {
      const { data } = await adminService.getAllOffers();
      setOffers(data);
    } catch (error) {
      console.error('Error loading offers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingOffer) {
        await adminService.updateOffer(editingOffer._id, formData);
        alert('✅ Offer updated successfully!');
      } else {
        await adminService.createOffer(formData);
        alert('✅ Offer created successfully!');
      }
      setShowModal(false);
      resetForm();
      loadOffers();
    } catch (error) {
      alert('❌ ' + (error.response?.data?.message || 'Operation failed'));
    }
  };

  const handleEdit = (offer) => {
    setEditingOffer(offer);
    setFormData({
      code: offer.code,
      title: offer.title,
      description: offer.description,
      discountType: offer.discountType,
      discountValue: offer.discountValue,
      minOrderAmount: offer.minOrderAmount,
      expiryDate: new Date(offer.expiryDate).toISOString().split('T')[0],
      showOnHomepage: offer.showOnHomepage,
      backgroundColor: offer.backgroundColor || '#FF6B35',
      textColor: offer.textColor || '#FFFFFF'
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this offer?')) return;
    try {
      await adminService.deleteOffer(id);
      alert('✅ Offer deleted!');
      loadOffers();
    } catch (error) {
      alert('❌ Delete failed');
    }
  };

  const resetForm = () => {
    setFormData({
      code: '',
      title: '',
      description: '',
      discountType: 'percentage',
      discountValue: '',
      minOrderAmount: 0,
      expiryDate: '',
      showOnHomepage: false,
      backgroundColor: '#FF6B35',
      textColor: '#FFFFFF'
    });
    setEditingOffer(null);
  };

  if (loading) return <Loader fullPage />;

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Manage Offers 🎁</h1>
          <button
            onClick={() => { resetForm(); setShowModal(true); }}
            className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90"
          >
            + Create Offer
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offers.map((offer) => (
            <div
              key={offer._id}
              className="rounded-xl p-6 shadow-lg"
              style={{ backgroundColor: offer.backgroundColor, color: offer.textColor }}
            >
              {offer.showOnHomepage && (
                <span className="inline-block bg-white text-gray-800 text-xs px-2 py-1 rounded-full mb-2">
                  📍 On Homepage
                </span>
              )}
              <h3 className="text-2xl font-bold mb-2">{offer.title}</h3>
              <p className="mb-4 opacity-90">{offer.description}</p>
              <div className="flex justify-between items-center mb-4">
                <span className="text-2xl font-bold">
                  {offer.discountType === 'percentage' && `${offer.discountValue}% OFF`}
                  {offer.discountType === 'fixed' && `₹${offer.discountValue} OFF`}
                  {offer.discountType === 'free_delivery' && 'FREE DELIVERY'}
                </span>
                <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full font-mono text-sm">
                  {offer.code}
                </span>
              </div>
              <p className="text-xs opacity-75 mb-4">
                Valid till: {new Date(offer.expiryDate).toLocaleDateString()}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(offer)}
                  className="flex-1 bg-white bg-opacity-20 py-2 rounded-lg hover:bg-opacity-30 font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(offer._id)}
                  className="flex-1 bg-red-500 bg-opacity-80 py-2 rounded-lg hover:bg-opacity-100 font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-8 my-8">
              <h2 className="text-2xl font-bold mb-6">
                {editingOffer ? 'Edit Offer' : 'Create New Offer'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium mb-2">Offer Code *</label>
                    <input
                      type="text"
                      name="code"
                      value={formData.code}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border rounded-lg uppercase"
                      placeholder="SAVE20"
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-2">Discount Type *</label>
                    <select
                      name="discountType"
                      value={formData.discountType}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg"
                    >
                      <option value="percentage">Percentage</option>
                      <option value="fixed">Fixed Amount</option>
                      <option value="free_delivery">Free Delivery</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-medium mb-2">Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="20% Off on All Orders"
                  />
                </div>

                <div>
                  <label className="block font-medium mb-2">Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows="3"
                    className="w-full px-4 py-2 border rounded-lg"
                  ></textarea>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium mb-2">Discount Value *</label>
                    <input
                      type="number"
                      name="discountValue"
                      value={formData.discountValue}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-2">Min Order Amount</label>
                    <input
                      type="number"
                      name="minOrderAmount"
                      value={formData.minOrderAmount}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-medium mb-2">Expiry Date *</label>
                  <input
                    type="date"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium mb-2">Background Color</label>
                    <input
                      type="color"
                      name="backgroundColor"
                      value={formData.backgroundColor}
                      onChange={handleChange}
                      className="w-full h-12 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-2">Text Color</label>
                    <input
                      type="color"
                      name="textColor"
                      value={formData.textColor}
                      onChange={handleChange}
                      className="w-full h-12 border rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="showOnHomepage"
                      checked={formData.showOnHomepage}
                      onChange={handleChange}
                      className="w-5 h-5"
                    />
                    <span className="font-medium">Show on Homepage</span>
                  </label>
                </div>

                <div className="flex gap-4 pt-4">
                  <button type="submit" className="flex-1 bg-primary text-white py-3 rounded-lg font-semibold">
                    {editingOffer ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowModal(false); resetForm(); }}
                    className="flex-1 bg-gray-300 py-3 rounded-lg font-semibold"
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

export default ManageOffers;