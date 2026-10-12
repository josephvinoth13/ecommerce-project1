import {Link} from 'react-router';
import { useState } from 'react';
import { getAssetUrl } from '../api';

import './header.css';

export function Header({ cart, user, onLogout, searchValue = '', onSearchChange }) {
  let totalQuantity = 0;
  const [searchText, setSearchText] = useState(searchValue);

  cart.forEach((cartItem)=> {
    totalQuantity += cartItem.quantity;


  });

  function handleSearchChange(event) {
    const value = event.target.value;
    setSearchText(value);
    onSearchChange?.(value);
  }

  return (
    <div className="header">
      <div className="left-section">
        <Link to="/" className="header-link">
          <img className="logo"
            src={getAssetUrl('public/images/logo-white.png')} />
          <img className="mobile-logo"
            src={getAssetUrl('public/images/mobile-logo-white.png')} />
        </Link>
      </div>

      <form className="middle-section" onSubmit={(event) => event.preventDefault()}>
        <input
          className="search-bar"
          type="search"
          placeholder="Search products"
          value={searchText}
          onChange={handleSearchChange}
          aria-label="Search products"
        />

        <button className="search-button" type="submit" aria-label="Search products">
          <img className="search-icon" src={getAssetUrl('images/icons/search-icon.png')} alt="" />
        </button>
      </form>
      <div className="right-section">
        {user ? (
          <button className="logout-button header-link" type="button" onClick={onLogout}>
            <span className="login-text">Logout</span>
          </button>
        ) : (
          <Link className="login-link header-link" to="/login">
            <span className="login-text">Login</span>
          </Link>
        )}


        <Link className="orders-link header-link" to="/orders">

          <span className="orders-text">Orders</span>
        </Link>

        <Link className="cart-link header-link" to="/checkout">
          <img className="cart-icon" src={getAssetUrl('images/icons/cart-icon.png')} alt="" />
          <div className="cart-quantity">{totalQuantity}</div>
          <div className="cart-text">Cart</div>
        </Link>
      </div>
    </div>


  );
}