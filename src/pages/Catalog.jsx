import { useEffect, useMemo, useState } from "react";

import { useSearchParams } from "react-router-dom";

import { useProducts } from "../context/ProductContext";

import { useCart } from "../context/CartContext";

import "./Catalog.css";

const Catalog = () => {
  const { products, categories, loading } = useProducts();

  const { addToCart } = useCart();

  const [searchParams] = useSearchParams();

  const [activeCategory, setActiveCategory] = useState("All");

  const [activeSubCategory, setActiveSubCategory] = useState("All");

  const [searchTerm, setSearchTerm] = useState("");

  // ==========================================
  // GET CATEGORY FROM URL
  // ==========================================

  useEffect(() => {
    const category = searchParams.get("category");

    if (category && categories[category]) {
      setActiveCategory(category);

      setActiveSubCategory("All");
    }
  }, [searchParams, categories]);

  // ==========================================
  // FILTER PRODUCTS
  // ==========================================

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Main category filter

      const matchesCategory =
        activeCategory === "All" ? true : product.category === activeCategory;

      // Sub-category filter

      const matchesSubCategory =
        activeSubCategory === "All"
          ? true
          : product.subCategory === activeSubCategory;

      // Search filter

      const searchValue = searchTerm.toLowerCase();

      const matchesSearch =
        product.name?.toLowerCase().includes(searchValue) ||
        product.description?.toLowerCase().includes(searchValue);

      return matchesCategory && matchesSubCategory && matchesSearch;
    });
  }, [products, activeCategory, activeSubCategory, searchTerm]);

  // ==========================================
  // CHANGE CATEGORY
  // ==========================================

  const handleCategoryClick = (category) => {
    setActiveCategory(category);

    // Reset sub-category when
    // main category changes

    setActiveSubCategory("All");
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return <div className="catalog-loading">Loading products...</div>;
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <main className="catalog-page">
      {/* ======================================
          HEADER
      ====================================== */}

      <section className="catalog-hero">
        <div className="catalog-eyebrow">RIJALS COLLECTION</div>

        <h1>
          Premium Fashion
          <span> & Lifestyle</span>
        </h1>

        <p className="catalog-description">
          Explore our exclusive collection of premium fashion, fragrances, and
          accessories carefully selected for your lifestyle.
        </p>

        {/* SEARCH */}

        <div className="catalog-search">
          <span className="search-icon">🔍</span>

          <input
            type="text"
            placeholder="Search for products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {searchTerm && (
            <button
              className="clear-search"
              type="button"
              onClick={() => setSearchTerm("")}
            >
              ×
            </button>
          )}
        </div>
      </section>

      {/* ======================================
          MAIN CATEGORIES
      ====================================== */}

      <section className="catalog-filters">
        <div className="filter-label">Browse Categories</div>

        <div className="category-buttons">
          {/* ALL */}

          <button
            type="button"
            className={
              activeCategory === "All" ? "category-btn active" : "category-btn"
            }
            onClick={() => handleCategoryClick("All")}
          >
            All
          </button>

          {/* CATEGORIES */}

          {Object.keys(categories).map((category) => (
            <button
              key={category}
              type="button"
              className={
                activeCategory === category
                  ? "category-btn active"
                  : "category-btn"
              }
              onClick={() => handleCategoryClick(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* ======================================
            SUB-CATEGORIES
        ====================================== */}

        {activeCategory !== "All" && (
          <div className="sub-category-wrapper">
            <div className="sub-category-buttons">
              {/* ALL SUB-CATEGORIES */}

              <button
                type="button"
                className={
                  activeSubCategory === "All"
                    ? "sub-category-btn active"
                    : "sub-category-btn"
                }
                onClick={() => setActiveSubCategory("All")}
              >
                All
              </button>

              {/* SUB-CATEGORIES */}

              {categories[activeCategory]?.map((subCategory) => (
                <button
                  key={subCategory}
                  type="button"
                  className={
                    activeSubCategory === subCategory
                      ? "sub-category-btn active"
                      : "sub-category-btn"
                  }
                  onClick={() => setActiveSubCategory(subCategory)}
                >
                  {subCategory}
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ======================================
          PRODUCTS
      ====================================== */}

      <section className="catalog-products-section">
        {/* PRODUCT HEADER */}

        <div className="catalog-products-header">
          <div>
            <span>OUR COLLECTION</span>

            <h2>
              {activeSubCategory !== "All"
                ? activeSubCategory
                : activeCategory !== "All"
                ? activeCategory
                : "Featured Products"}
            </h2>
          </div>

          <p>
            {filteredProducts.length} product
            {filteredProducts.length !== 1 && "s"} found
          </p>
        </div>

        {/* ======================================
            NO PRODUCTS
        ====================================== */}

        {filteredProducts.length === 0 ? (
          <div className="no-products">
            <h3>No products found</h3>

            <p>Try another category or search term.</p>

            <button
              type="button"
              onClick={() => {
                setSearchTerm("");

                setActiveCategory("All");

                setActiveSubCategory("All");
              }}
            >
              View All Products
            </button>
          </div>
        ) : (
          /* ======================================
              PRODUCT GRID
          ====================================== */

          <div className="products-grid">
            {filteredProducts.map((product) => (
              <article className="product-card" key={product.id}>
                {/* Product Image */}

                <div className="product-image-wrapper">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="product-image"
                  />

                  {product.subCategory && (
                    <span className="product-badge">{product.subCategory}</span>
                  )}

                  <button
                    className="quick-cart-button"
                    type="button"
                    onClick={() => addToCart(product)}
                    aria-label={`Add ${product.name} to cart`}
                  >
                    🛒
                  </button>
                </div>

                {/* Product Details */}

                <div className="product-content">
                  <div className="product-category-name">
                    {product.category}
                  </div>

                  <h3 className="product-name">{product.name}</h3>

                  <p className="product-description">{product.description}</p>

                  <div className="product-footer">
                    <div className="product-price-section">
                      <span className="price-label">PRICE</span>

                      <span className="product-price">
                        ₦{Number(product.price).toLocaleString()}
                      </span>
                    </div>

                    <button
                      className="add-to-cart-button"
                      type="button"
                      onClick={() => addToCart(product)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default Catalog;
