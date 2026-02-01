// src/pages/user/VerifyEmail.jsx - Email Verification Page (FIXED)
import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Loader from '../../components/common/Loader';

const VerifyEmail = () => {
  const { token } = useParams();
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('');
  const hasVerified = useRef(false); // Prevent double verification

  useEffect(() => {
    // Only verify once (prevent React strict mode double render)
    if (!hasVerified.current) {
      hasVerified.current = true;
      verifyEmail();
    }
  }, [token]);

  const verifyEmail = async () => {
    try {
      const { data } = await axios.get(`/api/auth/verify-email/${token}`);
      setStatus('success');
      setMessage(data.message);
    } catch (error) {
      setStatus('error');
      setMessage(error.response?.data?.message || 'Email verification failed');
    }
  };

  if (status === 'verifying') {
    return (
      <div className="min-h-screen bg-light-bg flex items-center justify-center px-4">
        <div className="text-center">
          <Loader />
          <p className="mt-4 text-lg text-gray-600">Verifying your email...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-bg flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {status === 'success' ? (
          <>
            <div className="text-6xl mb-6">✅</div>
            <h2 className="text-3xl font-bold text-green-600 mb-4">Email Verified!</h2>
            <p className="text-gray-600 mb-8">{message}</p>
            <Link
              to="/login"
              className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition"
            >
              Login to Your Account
            </Link>
          </>
        ) : (
          <>
            <div className="text-6xl mb-6">❌</div>
            <h2 className="text-3xl font-bold text-red-600 mb-4">Verification Failed</h2>
            <p className="text-gray-600 mb-8">{message}</p>
            <div className="space-y-3">
              <Link
                to="/resend-verification"
                className="block bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition"
              >
                Resend Verification Email
              </Link>
              <Link
                to="/register"
                className="block bg-secondary text-primary px-8 py-3 rounded-lg font-semibold hover:bg-accent transition"
              >
                Back to Register
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;