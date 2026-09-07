import { Link } from "react-router-dom";
import HeroSlider from "../components/HeroSlider";
import { useProducts } from "../context/ProductContext";
import { useCart } from "../context/CartContext";

import "./Home.css";

const Home = () => {
  const { products, categories } = useProducts();

  const { addToCart } = useCart();

  const featuredProducts = products.filter((product) => product.featured);

  return (
    <main>
      <HeroSlider />

      {/* CATEGORY SECTION */}

      <section className="home-section">
        <div className="section-heading">
          <h2>Shop By Category</h2>

          <p>Discover our carefully selected collections.</p>
        </div>

        <div className="category-grid">
          {Object.keys(categories).map((category) => (
            <Link
              key={category}
              to={`/catalog?category=${category}`}
              className="category-card"
            >
              <h3>{category}</h3>

              <span>Explore Collection →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}

      <section className="home-section">
        <div className="section-heading">
          <h2>Featured Products</h2>

          <p>Our most popular premium products.</p>
        </div>

        <div className="home-products-grid">
          {featuredProducts.slice(0, 8).map((product) => (
            <article key={product.id} className="home-product-card">
              <img src={product.image} alt={product.name} />

              <div className="home-product-info">
                <span>{product.category}</span>

                <h3>{product.name}</h3>

                <p>₦{product.price.toLocaleString()}</p>

                <button onClick={() => addToCart(product)}>Add to Cart</button>
              </div>
            </article>
          ))}
        </div>

        <div className="view-all-container">
          <Link to="/catalog" className="view-all-button">
            View All Products
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Home;
