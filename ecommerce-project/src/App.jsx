import axios from 'axios';
import { useState, useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router';
import { clearAuthSession, initializeAuth } from './auth';
import { HomePage } from './pages/home/HomePage';
import { CheckoutPage } from './pages/checkout/CheckoutPage';
import { OrdersPage } from './pages/orders/OrdersPage';
import './App.css'
import { LoginPage } from './pages/login/LoginPage';
import { TrackingPage } from './pages/tracking/TrackingPage';

function App() {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  const loadCart = async () => {
    const response = await axios.get('/api/cart-items?expand=product');
    setCart(response.data);
  };

  useEffect(() => {
    loadCart();
    const token = initializeAuth();
    if (!token) {
      setAuthChecked(true);
      return;
    }
    axios.get('/api/auth/me')
      .then((response) => setUser(response.data.user))
      .catch(() => clearAuthSession())
      .finally(() => setAuthChecked(true));
  }, []);

  function logout() {
    clearAuthSession();
    setUser(null);
  }

  if (!authChecked) return null;

  return (
    <Routes>
      <Route path="login" element={<LoginPage onAuthenticated={setUser} />} />
      <Route index element={<HomePage cart={cart} loadCart={loadCart} user={user} onLogout={logout} />} />
      <Route path="checkout" element={<CheckoutPage cart={cart} loadCart={loadCart} />} />
      <Route path="orders" element={<ProtectedRoute user={user}><OrdersPage cart={cart} user={user} onLogout={logout} /></ProtectedRoute>} />
      <Route path="tracking/:orderId/:productId" element={<ProtectedRoute user={user}><TrackingPage cart={cart} user={user} onLogout={logout} /></ProtectedRoute>} />
    </Routes>
  )
}

function ProtectedRoute({ user, children }) {
  const location = useLocation();
  return user ? children : <Navigate to="/login" replace state={{ from: location.pathname }} />;
}

export default App