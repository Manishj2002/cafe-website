// src/pages/user/Register.jsx - Register (No Email Verification)
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Basic client-side validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    
    // Remove confirmPassword before sending
    const { confirmPassword, ...registerData } = formData;

    try {
      const { data } = await axios.post('/api/auth/register', registerData);

      // Assuming the backend returns token in data.token (adjust if your sendTokenResponse sets it differently)
      const token = data.token;

      if (token) {
        // Save token (choose ONE method below – use what your app already uses)
        localStorage.setItem('token', token);           // ← most common
        // OR: sessionStorage.setItem('token', token);
        // OR: update your auth context / zustand / redux store here

        // Optional: you can also save user info if returned
        // localStorage.setItem('user', JSON.stringify(data.user));

        // Redirect to home / dashboard / menu page
        navigate('/');           // ← change to '/dashboard', '/menu', etc. as needed
      } else {
        // Fallback if token not returned in body (rare)
        setError('Registration successful but login failed. Please try logging in.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-light-bg py-8 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-6 sm:p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-2">
            Create Account 🎉
          </h2>
          <p className="text-gray-600">Join us for delicious food delivery</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-dark font-medium mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="John Doe"
            />
          </div>

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

          {/* Phone */}
          <div>
            <label className="block text-dark font-medium mb-2">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="+91 98765 43210"
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
              minLength="6"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="••••••••"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-dark font-medium mb-2">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
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
            className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-opacity-90 transition disabled:opacity-50 mt-6"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        {/* Login Link */}
        <div className="mt-6 text-center text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-semibold hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;