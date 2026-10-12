import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { Header } from '../../components/Header';
import { api, getAssetUrl } from '../../api';
import './TrackingPage.css';

export function TrackingPage({ cart, user, onLogout }) {
  const { orderId, productId } = useParams();
  const [orderProduct, setOrderProduct] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/api/orders/${orderId}?expand=products`)
      .then((response) => {
        const selectedProduct = response.data.products.find(
          (product) => product.productId === productId
        );
        if (!selectedProduct) {
          setError('The requested product could not be found in this order.');
          return;
        }
        setOrderProduct(selectedProduct);
      })
      .catch(() => {
        setError('Unable to load tracking information.');
      });
  }, [orderId, productId]);

  return (
    <>
      <title>Tracking</title>
      <Header cart={cart} user={user} onLogout={onLogout} />

      <main className="tracking-page">
        <Link className="back-to-orders-link link-primary" to="/orders">
          View all orders
        </Link>

        {error && <p className="tracking-error" role="alert">{error}</p>}

        {orderProduct && (
          <div className="order-tracking">
            <div className="delivery-date">
              Arriving on {dayjs(orderProduct.estimatedDeliveryTimeMs).format('dddd, MMMM D')}
            </div>
            <div className="product-info">{orderProduct.product.name}</div>
            <div className="product-info">Quantity: {orderProduct.quantity}</div>
            <img
              className="product-image"
              src={getAssetUrl(orderProduct.product.image)}
              alt={orderProduct.product.name}
            />

            <div className="progress-labels-container">
              <div className="progress-label">Preparing</div>
              <div className="progress-label current-status">Shipped</div>
              <div className="progress-label">Delivered</div>
            </div>
            <div className="progress-bar-container">
              <div className="progress-bar" />
            </div>
          </div>
        )}
      </main>
    </>
  );
}
