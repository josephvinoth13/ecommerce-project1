import axios from 'axios';
import { useEffect, useState } from 'react';
import { Header } from '../../components/Header';
import { ProductsGrid } from './ProductsGrid';
import './HomePage.css';

export function HomePage({ cart, loadCart, user, onLogout }) {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const getHomeData = async () => {
      const response = await axios.get('/api/products');
      setProducts(response.data);
    };

    getHomeData();
  }, []);

  return (
    <>
      <title>Ecommerce Project</title>

      <Header
        cart={cart}
        user={user}
        onLogout={onLogout}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="home-page">
        <ProductsGrid
          products={products}
          loadCart={loadCart}
          searchQuery={searchQuery}
        />
      </div>
    </>
  );
}
