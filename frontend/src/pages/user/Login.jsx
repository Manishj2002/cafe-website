// src/pages/user/Login.jsx - Login (No Email Verification)
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(formData);
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message || 'Login failed. Please check your credentials.');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-light-bg py-8 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-6 sm:p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-2">
            Welcome Back! ☕
          </h2>
          <p className="text-gray-600">Login to order your favorite food</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-dark font-medium mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="your@email.com"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-dark font-medium mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="••••••••"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-opacity-90 transition disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 text-center text-gray-500">
          <span>Don't have an account?</span>
        </div>

        {/* Register Link */}
        <Link
          to="/register"
          className="block w-full text-center bg-secondary text-primary py-3 rounded-lg font-semibold hover:bg-accent transition"
        >
          Create Account
        </Link>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-700 mb-2 font-semibold">Demo Credentials:</p>
          <p className="text-xs text-gray-600">👤 User: user@example.com / User@123</p>
          <p className="text-xs text-gray-600">👨‍💼 Admin: admin@cafe.com / Admin@123</p>
        </div>
      </div>
    </div>
  );
};

export default Login;