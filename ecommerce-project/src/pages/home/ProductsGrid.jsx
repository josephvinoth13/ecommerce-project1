import { Product } from './Product';

export function ProductsGrid({ products, loadCart, searchQuery = '' }) {
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredProducts = products.filter((product) => {
    if (!normalizedQuery) return true;
    const searchableText = [
      product.name,
      ...(product.keywords || [])
    ].join(' ').toLowerCase();
    return searchableText.includes(normalizedQuery);
  });

  if (products.length > 0 && filteredProducts.length === 0) {
    return (
      <p className="no-products-message">
        No products found for &quot;{searchQuery}&quot;.
      </p>
    );
  }

  return (
    <div className="products-grid">
      {filteredProducts.map((product) => {
        return (
          <Product key={product.id} product={product} loadCart={loadCart} />
        );
      })}
    </div>
  );
}
