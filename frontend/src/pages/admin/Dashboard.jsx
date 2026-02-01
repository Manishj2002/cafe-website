// src/pages/admin/Dashboard.jsx - Admin Dashboard
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import adminService from '../../services/adminService';
import Loader from '../../components/common/Loader';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const { data } = await adminService.getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader fullPage />;

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
            Admin Dashboard 📊
          </h1>
          <p className="text-gray-600">Welcome back! Here's what's happening today.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-blue-100 text-sm mb-1">Total Orders</p>
                <h3 className="text-3xl font-bold">{stats?.totalOrders || 0}</h3>
              </div>
              <div className="text-4xl opacity-80">📦</div>
            </div>
            <p className="text-blue-100 text-sm">All time orders</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-green-100 text-sm mb-1">Total Revenue</p>
                <h3 className="text-3xl font-bold">₹{stats?.totalRevenue || 0}</h3>
              </div>
              <div className="text-4xl opacity-80">💰</div>
            </div>
            <p className="text-green-100 text-sm">Total earnings</p>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-orange-100 text-sm mb-1">Today's Orders</p>
                <h3 className="text-3xl font-bold">{stats?.todayOrders || 0}</h3>
              </div>
              <div className="text-4xl opacity-80">📋</div>
            </div>
            <p className="text-orange-100 text-sm">Orders placed today</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-purple-100 text-sm mb-1">Total Users</p>
                <h3 className="text-3xl font-bold">{stats?.totalUsers || 0}</h3>
              </div>
              <div className="text-4xl opacity-80">👥</div>
            </div>
            <p className="text-purple-100 text-sm">Registered customers</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Orders */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Recent Orders</h2>
              <Link to="/admin/orders" className="text-primary hover:underline text-sm font-medium">
                View All →
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Order ID</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Customer</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Total</th>
                    <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stats?.recentOrders?.slice(0, 5).map((order) => (
                    <tr key={order._id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-2 text-sm">#{order._id.slice(-6).toUpperCase()}</td>
                      <td className="py-3 px-2 text-sm">{order.user?.name}</td>
                      <td className="py-3 px-2 text-sm font-semibold">₹{order.totalPrice}</td>
                      <td className="py-3 px-2">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Popular Items */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Top Selling Items</h2>
            <div className="space-y-4">
              {stats?.popularItems?.map((item, idx) => (
                <div key={item._id} className="flex items-center gap-3 pb-4 border-b last:border-0">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-accent to-primary rounded-lg flex items-center justify-center text-2xl">
                    {item.isVeg ? '🥗' : '🍖'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-gray-800 truncate">{item.name}</p>
                    <p className="text-xs text-gray-500">₹{item.price}</p>
                  </div>
                  <div className="flex items-center gap-1 text-yellow-500 text-sm">
                    ⭐ {item.rating || 4.5}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link
            to="/admin/menu"
            className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition group"
          >
            <div className="text-4xl mb-3 group-hover:scale-110 transition">🍽️</div>
            <p className="font-semibold text-gray-800">Manage Menu</p>
          </Link>
          <Link
            to="/admin/categories"
            className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition group"
          >
            <div className="text-4xl mb-3 group-hover:scale-110 transition">📂</div>
            <p className="font-semibold text-gray-800">Categories</p>
          </Link>
          <Link
            to="/admin/orders"
            className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition group"
          >
            <div className="text-4xl mb-3 group-hover:scale-110 transition">📦</div>
            <p className="font-semibold text-gray-800">Orders</p>
          </Link>
          <Link
            to="/admin/users"
            className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition group"
          >
            <div className="text-4xl mb-3 group-hover:scale-110 transition">👥</div>
            <p className="font-semibold text-gray-800">Users</p>
          </Link>
           <Link
            to="/admin/offers"
            className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition group"
          >
            <div className="text-4xl mb-3 group-hover:scale-110 transition">🎁</div>
            <p className="font-semibold text-gray-800">offers</p>
          </Link>
           <Link
            to="/admin/settings"
            className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition group"
          >
            <div className="text-4xl mb-3 group-hover:scale-110 transition">⚙</div>
            <p className="font-semibold text-gray-800">setting</p>
          </Link>
          <Link
            to="/admin/messages"
            className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition group"
          >
            <div className="text-4xl mb-3 group-hover:scale-110 transition">💬</div>
            <p className="font-semibold text-gray-800">messages</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;