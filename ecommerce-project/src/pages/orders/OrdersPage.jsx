import axios from 'axios';
import dayjs from 'dayjs';
import { useState, useEffect, Fragment } from 'react';
import { Header } from '../../components/Header';
import { Link } from 'react-router';
import { formatMoney } from '../../utils/money';
import './OrdersPage.css';

export function OrdersPage({ cart, user, onLogout }) {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('/api/orders?expand=products')
      .then((response) => {
        setOrders(response.data);
      })
      .catch(() => {
        setError('Unable to load your orders. Please try again.');
      });
  }, []);

  return (
    <>
      <title>Orders</title>

      <Header cart={cart} user={user} onLogout={onLogout} />

      <div className="orders-page">
        <div className="page-title">Your Orders</div>
        {error && <p role="alert">{error}</p>}

        <div className="orders-grid">
          {orders.map((order) => {
            return (
              <div key={order.id} className="order-container">

                <div className="order-header">
                  <div className="order-header-left-section">
                    <div className="order-date">
                      <div className="order-header-label">Order Placed:</div>
                      <div>{dayjs(order.orderTimeMs).format('MMMM D')}</div>
                    </div>
                    <div className="order-total">
                      <div className="order-header-label">Total:</div>
                      <div>{formatMoney(order.totalCostCents)}</div>
                    </div>
                  </div>

                  <div className="order-header-right-section">
                    <div className="order-header-label">Order ID:</div>
                    <div>{order.id}</div>
                  </div>
                </div>

                <div className="order-details-grid">
                  {order.products.map((orderProduct) => {
                    if (!orderProduct.product) return null;

                    return (
                      <Fragment key={orderProduct.product.id}>
                        <div className="product-image-container">
                          <img src={orderProduct.product.image} />
                        </div>

                        <div className="product-details">
                          <div className="product-name">
                            {orderProduct.product.name}
                          </div>
                          <div className="product-delivery-date">
                            Arriving on: {dayjs(orderProduct.estimatedDeliveryTimeMs).format('MMMM D')}
                          </div>
                          <div className="product-quantity">
                            Quantity: {orderProduct.quantity}
                          </div>
                          <button className="buy-again-button button-primary">
                            <img className="buy-again-icon" src="images/icons/buy-again.png" />
                            <span className="buy-again-message">Add to Cart</span>
                          </button>
                        </div>

                        <div className="product-actions">
                          <Link
                            className="track-package-button button-secondary"
                            to={`/tracking/${order.id}/${orderProduct.productId}`}
                          >
                            Track package
                          </Link>
                        </div>
                      </Fragment>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}