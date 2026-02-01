// src/components/common/ProtectedRoute.jsx - FIXED with Debug
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loader from './Loader';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin, loading, user } = useAuth();

  // Show loader while checking authentication
  if (loading) {
    return <Loader fullPage />;
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    console.log('Not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // If admin route but user is not admin, redirect to home
  if (adminOnly && !isAdmin) {
    console.log('User is not admin:', user);
    alert('⛔ Access Denied! Admin privileges required.');
    return <Navigate to="/" replace />;
  }

  // If everything is okay, render the children
  return children;
};

export default ProtectedRoute;