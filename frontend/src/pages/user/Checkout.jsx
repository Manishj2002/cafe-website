// src/pages/user/Checkout.jsx - Checkout Page
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import orderService from '../../services/orderApi';

const Checkout = () => {
  const { cartItems, itemsPrice, deliveryFee, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    street: user?.address?.street || '',
    city: user?.address?.city || 'Jaipur',
    state: user?.address?.state || 'Rajasthan',
    zipCode: user?.address?.zipCode || '',
    country: 'India',
    orderType: 'delivery',
    paymentMethod: 'cash',
    notes: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  try {
    const orderData = {
      orderItems: cartItems.map(item => ({
        menuItem: item._id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        image: item.image
      })),
      deliveryAddress: {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country
      },
      orderType: formData.orderType,
      paymentMethod: formData.paymentMethod,
      notes: formData.notes
    };

    console.log('📦 Placing order...');
    const response = await orderService.createOrder(orderData);
    console.log('✅ Order created:', response);
    
    clearCart();
    
    // Navigate to order success page
    if (response.success && response.data && response.data._id) {
      navigate(`/order-success/${response.data._id}`);
    } else {
      throw new Error('Invalid response from server');
    }
    
  } catch (error) {
    console.error('❌ Order error:', error);
    setError(error.response?.data?.message || 'Failed to place order');
  } finally {
    setLoading(false);
  }
};

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-light-bg py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8 text-primary">
          Checkout 🛍️
        </h1>

        {error && (
          <div className="max-w-4xl mx-auto mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Left Side - Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Type */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold mb-4 text-dark">Order Type</h2>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, orderType: 'delivery' })}
                    className={`p-4 rounded-lg border-2 transition ${
                      formData.orderType === 'delivery'
                        ? 'border-primary bg-secondary'
                        : 'border-gray-300 hover:border-primary'
                    }`}
                  >
                    <div className="text-3xl mb-2">🚚</div>
                    <div className="font-semibold">Delivery</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, orderType: 'pickup' })}
                    className={`p-4 rounded-lg border-2 transition ${
                      formData.orderType === 'pickup'
                        ? 'border-primary bg-secondary'
                        : 'border-gray-300 hover:border-primary'
                    }`}
                  >
                    <div className="text-3xl mb-2">🏪</div>
                    <div className="font-semibold">Pickup</div>
                  </button>
                </div>
              </div>

              {/* Delivery Address */}
              {formData.orderType === 'delivery' && (
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h2 className="text-xl font-bold mb-4 text-dark">Delivery Address</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-dark font-medium mb-2">Street Address *</label>
                      <input
                        type="text"
                        name="street"
                        value={formData.street}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="123 Main Street"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-dark font-medium mb-2">City *</label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-dark font-medium mb-2">State *</label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-dark font-medium mb-2">ZIP Code *</label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="302001"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Method */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold mb-4 text-dark">Payment Method</h2>
                <div className="space-y-3">
                  {[
                    { value: 'cash', label: 'Cash on Delivery', icon: '💵' },
                    { value: 'card', label: 'Credit/Debit Card', icon: '💳' },
                    { value: 'upi', label: 'UPI Payment', icon: '📱' },
                    { value: 'online', label: 'Net Banking', icon: '🏦' }
                  ].map((method) => (
                    <label
                      key={method.value}
                      className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition ${
                        formData.paymentMethod === method.value
                          ? 'border-primary bg-secondary'
                          : 'border-gray-300 hover:border-primary'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.value}
                        checked={formData.paymentMethod === method.value}
                        onChange={handleChange}
                        className="mr-3"
                      />
                      <span className="text-2xl mr-3">{method.icon}</span>
                      <span className="font-medium">{method.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Special Instructions */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold mb-4 text-dark">Special Instructions</h2>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Any special requests? (optional)"
                ></textarea>
              </div>
            </div>

            {/* Right Side - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 lg:sticky lg:top-24">
                <h2 className="text-xl font-bold mb-6 text-dark">Order Summary</h2>
                
                {/* Items */}
                <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
                  {cartItems.map((item) => (
                    <div key={item._id} className="flex justify-between text-sm">
                      <span className="text-gray-700">
                        {item.name} × {item.quantity}
                      </span>
                      <span className="font-medium">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-3">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal</span>
                    <span className="font-medium">₹{itemsPrice}</span>
                  </div>
                  {formData.orderType === 'delivery' && (
                    <div className="flex justify-between text-gray-700">
                      <span>Delivery Fee</span>
                      <span className="font-medium">₹{deliveryFee}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xl font-bold text-primary border-t pt-3">
                    <span>Total</span>
                    <span>₹{formData.orderType === 'delivery' ? totalPrice : itemsPrice}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-white py-4 rounded-lg font-bold text-lg hover:bg-opacity-90 transition disabled:opacity-50 mt-6"
                >
                  {loading ? 'Placing Order...' : 'Place Order'}
                </button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  By placing this order, you agree to our terms and conditions.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;