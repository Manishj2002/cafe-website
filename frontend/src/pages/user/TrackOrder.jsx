// src/pages/user/TrackOrder.jsx - Order Tracking
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import orderService from '../../services/orderApi';
import Loader from '../../components/common/Loader';
import socketService from '../../services/socket';
const TrackOrder = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  loadOrder();
  
  // Connect socket
  const socket = socketService.connect();
  socketService.joinOrder(orderId);

  // Listen for updates
  socketService.onOrderUpdate((data) => {
    console.log('Track order update:', data);
    if (data.orderId === orderId) {
      setOrder(prev => ({
        ...prev,
        status: data.status,
        deliveredAt: data.deliveredAt
      }));
    }
  });

  return () => {
    socketService.leaveOrder(orderId);
    socketService.offOrderUpdate();
  };
}, [orderId]);

  const loadOrder = async () => {
    try {
      const { data } = await orderService.trackOrder(orderId);
      setOrder(data);
    } catch (error) {
      console.error('Error tracking order:', error);
    } finally {
      setLoading(false);
    }
  };

  const orderSteps = [
    { key: 'pending', label: 'Order Placed', icon: '📝' },
    { key: 'confirmed', label: 'Confirmed', icon: '✅' },
    { key: 'preparing', label: 'Preparing', icon: '👨‍🍳' },
    { key: 'ready', label: 'Ready', icon: '🍽️' },
    { key: 'out_for_delivery', label: 'Out for Delivery', icon: '🚚' },
    { key: 'delivered', label: 'Delivered', icon: '🎉' }
  ];

  const getStepIndex = (status) => {
    return orderSteps.findIndex(step => step.key === status);
  };

  if (loading) return <Loader fullPage />;
  if (!order) return <div className="text-center py-16">Order not found</div>;

  const currentStepIndex = getStepIndex(order.status);

  return (
    <div className="min-h-screen bg-light-bg py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8 text-primary">
          Track Your Order 📦
        </h1>

        {/* Order ID */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8 text-center">
          <p className="text-gray-600 mb-2">Order ID</p>
          <p className="text-2xl font-bold text-primary">#{orderId.slice(-8).toUpperCase()}</p>
          <p className="text-sm text-gray-500 mt-2">
            {order.orderType === 'delivery' ? 'Delivery' : 'Pickup'} Order
          </p>
        </div>

        {/* Timeline - Desktop */}
        <div className="hidden md:block bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="relative">
            {/* Progress Bar */}
            <div className="absolute top-8 left-0 right-0 h-1 bg-gray-200 z-0">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${(currentStepIndex / (orderSteps.length - 1)) * 100}%` }}
              ></div>
            </div>

            {/* Steps */}
            <div className="relative z-10 flex justify-between">
              {orderSteps.map((step, index) => (
                <div key={step.key} className="flex flex-col items-center">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl mb-3 transition ${
                      index <= currentStepIndex
                        ? 'bg-primary text-white shadow-lg'
                        : 'bg-gray-200 text-gray-400'
                    }`}
                  >
                    {step.icon}
                  </div>
                  <p
                    className={`text-sm font-medium text-center ${
                      index <= currentStepIndex ? 'text-primary' : 'text-gray-400'
                    }`}
                  >
                    {step.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Timeline - Mobile */}
        <div className="md:hidden bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="space-y-4">
            {orderSteps.map((step, index) => (
              <div key={step.key} className="flex items-start">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-xl mr-4 flex-shrink-0 ${
                    index <= currentStepIndex
                      ? 'bg-primary text-white'
                      : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  {step.icon}
                </div>
                <div className="flex-1 pt-2">
                  <p
                    className={`font-medium ${
                      index <= currentStepIndex ? 'text-primary' : 'text-gray-400'
                    }`}
                  >
                    {step.label}
                  </p>
                  {index === currentStepIndex && (
                    <p className="text-sm text-gray-600 mt-1">Current Status</p>
                  )}
                </div>
                {index <= currentStepIndex && (
                  <div className="text-green-500 text-xl">✓</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Estimated Time */}
        {order.estimatedDeliveryTime && order.status !== 'delivered' && (
          <div className="bg-gradient-to-r from-primary to-accent text-white rounded-xl p-6 text-center mb-8">
            <p className="text-lg mb-2">⏱️ Estimated {order.orderType === 'delivery' ? 'Delivery' : 'Pickup'} Time</p>
            <p className="text-3xl font-bold">
              {new Date(order.estimatedDeliveryTime).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </p>
          </div>
        )}

        {/* Delivered Message */}
        {order.status === 'delivered' && (
          <div className="bg-green-100 border border-green-400 text-green-800 rounded-xl p-6 text-center mb-8">
            <div className="text-4xl mb-2">🎉</div>
            <p className="text-xl font-bold">Order Delivered Successfully!</p>
            {order.deliveredAt && (
              <p className="text-sm mt-2">
                Delivered on {new Date(order.deliveredAt).toLocaleString()}
              </p>
            )}
          </div>
        )}

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
    </div>
  );
};

export default TrackOrder;