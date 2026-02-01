// src/pages/user/OrderSuccess.jsx - Enhanced Order Success with Live Tracking
import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import orderService from '../../services/orderApi';
import Loader from '../../components/common/Loader';
import socketService from '../../services/socket';
const OrderSuccess = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  loadOrder();
  
  // Connect socket and join order room
  const socket = socketService.connect();
  socketService.joinOrder(orderId);

  // Listen for real-time updates
  socketService.onOrderUpdate((data) => {
    console.log('Order update received:', data);
    if (data.orderId === orderId) {
      setOrder(prev => ({
        ...prev,
        status: data.status,
        deliveredAt: data.deliveredAt
      }));
    }
  });

  // Cleanup
  return () => {
    socketService.leaveOrder(orderId);
    socketService.offOrderUpdate();
  };
}, [orderId]);
 const loadOrder = async () => {
    try {
      const { data } = await orderService.getOrder(orderId);
      setOrder(data);
    } catch (error) {
      console.error('Error loading order:', error);
    } finally {
      setLoading(false);
    }
  };

  const getOrderProgress = (status) => {
    const steps = ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered'];
    const currentIndex = steps.indexOf(status);
    return ((currentIndex + 1) / steps.length) * 100;
  };

  const getStatusEmoji = (status) => {
    const emojis = {
      pending: '⏳',
      confirmed: '✅',
      preparing: '👨‍🍳',
      ready: '🍽️',
      out_for_delivery: '🚚',
      delivered: '🎉',
      cancelled: '❌'
    };
    return emojis[status] || '📦';
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-500',
      confirmed: 'bg-blue-500',
      preparing: 'bg-purple-500',
      ready: 'bg-green-500',
      out_for_delivery: 'bg-orange-500',
      delivered: 'bg-green-600',
      cancelled: 'bg-red-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  const getEstimatedTime = (status) => {
    const times = {
      pending: '5 minutes',
      confirmed: '10 minutes',
      preparing: '20-30 minutes',
      ready: 'Ready for pickup/delivery',
      out_for_delivery: '10-15 minutes',
      delivered: 'Delivered!'
    };
    return times[status] || 'Calculating...';
  };

  if (loading) return <Loader fullPage />;
  if (!order) return <div className="text-center py-16">Order not found</div>;

  const progress = getOrderProgress(order.status);

  return (
    <div className="min-h-screen bg-light-bg py-8 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        {/* Success Header */}
        <div className="text-center mb-8 animate-bounce-in">
          <div className="inline-block bg-green-100 rounded-full p-6 mb-4">
            <div className="text-6xl sm:text-8xl">{getStatusEmoji(order.status)}</div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-dark mb-2">
            {order.status === 'delivered' ? 'Order Delivered!' : 'Order Placed Successfully!'}
          </h1>
          <p className="text-gray-600 text-lg">
            {order.status === 'delivered' 
              ? 'Enjoy your meal! 🍽️'
              : 'Thank you! Your order is being processed'
            }
          </p>
        </div>

        {/* Live Progress Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-dark">Live Tracking</h2>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Live</span>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="relative mb-8">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full ${getStatusColor(order.status)} transition-all duration-500 ease-out`}
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Current Status */}
          <div className="text-center mb-6">
            <div className={`inline-block ${getStatusColor(order.status)} text-white px-6 py-3 rounded-full text-lg font-bold mb-2`}>
              {getStatusEmoji(order.status)} {order.status.replace('_', ' ').toUpperCase()}
            </div>
            <p className="text-gray-600">
              Estimated time: <span className="font-bold text-primary">{getEstimatedTime(order.status)}</span>
            </p>
          </div>

          {/* Timeline Steps */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
            {[
              { key: 'pending', label: 'Order Placed', icon: '📝' },
              { key: 'confirmed', label: 'Confirmed', icon: '✅' },
              { key: 'preparing', label: 'Preparing', icon: '👨‍🍳' },
              { key: 'ready', label: 'Ready', icon: '🍽️' },
              { key: 'out_for_delivery', label: 'On the Way', icon: '🚚' },
              { key: 'delivered', label: 'Delivered', icon: '🎉' }
            ].map((step) => {
              const steps = ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered'];
              const currentIndex = steps.indexOf(order.status);
              const stepIndex = steps.indexOf(step.key);
              const isActive = stepIndex <= currentIndex;
              const isCurrent = step.key === order.status;

              return (
                <div
                  key={step.key}
                  className={`p-4 rounded-lg border-2 text-center transition ${
                    isActive 
                      ? isCurrent 
                        ? 'border-primary bg-secondary scale-105'
                        : 'border-green-500 bg-green-50'
                      : 'border-gray-200 bg-gray-50 opacity-50'
                  }`}
                >
                  <div className="text-3xl mb-2">{step.icon}</div>
                  <p className={`text-sm font-medium ${isActive ? 'text-dark' : 'text-gray-400'}`}>
                    {step.label}
                  </p>
                  {isCurrent && (
                    <div className="mt-2">
                      <span className="inline-block w-2 h-2 bg-primary rounded-full animate-ping"></span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Details Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-6">
          <div className="border-b pb-6 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 text-sm mb-1">Order ID</p>
                <p className="font-bold text-primary text-lg">#{order._id.slice(-8).toUpperCase()}</p>
              </div>
              <div className="sm:text-right">
                <p className="text-gray-600 text-sm mb-1">Order Date</p>
                <p className="font-medium">{new Date(order.createdAt).toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-6">
            <h3 className="font-bold text-lg mb-4">Order Items</h3>
            <div className="space-y-3">
              {order.orderItems.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center py-3 border-b last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{item.isVeg ? '🥗' : '🍖'}</span>
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-bold text-primary">₹{item.price * item.quantity}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Info */}
          <div className="mb-6 p-4 bg-light-bg rounded-lg">
            <h3 className="font-bold mb-3">
              {order.orderType === 'delivery' ? '📍 Delivery Address' : '🏪 Pickup Location'}
            </h3>
            {order.orderType === 'delivery' ? (
              <p className="text-gray-700">
                {order.deliveryAddress.street}, {order.deliveryAddress.city}<br />
                {order.deliveryAddress.state} - {order.deliveryAddress.zipCode}
              </p>
            ) : (
              <p className="text-gray-700">
                Café Delight, Jaipur, Rajasthan
              </p>
            )}
          </div>

          {/* Payment & Total */}
          <div className="space-y-2">
            <div className="flex justify-between text-gray-700">
              <span>Payment Method</span>
              <span className="font-medium capitalize">{order.paymentMethod}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Items Total</span>
              <span className="font-medium">₹{order.itemsPrice}</span>
            </div>
            {order.deliveryFee > 0 && (
              <div className="flex justify-between text-gray-700">
                <span>Delivery Fee</span>
                <span className="font-medium">₹{order.deliveryFee}</span>
              </div>
            )}
            <div className="flex justify-between text-xl font-bold text-primary pt-3 border-t">
              <span>Total Paid</span>
              <span>₹{order.totalPrice}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <button
            onClick={loadOrder}
            className="bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition flex items-center justify-center gap-2"
          >
            <span>🔄</span> Refresh Status
          </button>
          <Link
            to="/menu"
            className="bg-secondary text-primary py-3 rounded-lg font-semibold text-center hover:bg-accent transition"
          >
            Order Again 🍕
          </Link>
        </div>

        {/* Help Section */}
        <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <p className="text-gray-600 mb-4">Need help with your order?</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="tel:+919876543210"
              className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-opacity-90 transition"
            >
              📞 Call Support
            </a>
            <a
              href="mailto:support@cafedelight.com"
              className="bg-secondary text-primary px-6 py-3 rounded-lg font-medium hover:bg-accent transition"
            >
              📧 Email Us
            </a>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes bounce-in {
          0% {
            transform: scale(0.3);
            opacity: 0;
          }
          50% {
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-bounce-in {
          animation: bounce-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

export default OrderSuccess;