import { useState } from "react";

import { Link, useParams } from "react-router-dom";

import { useProducts } from "../context/ProductContext";

import { useCart } from "../context/CartContext";

import "./ProductDetails.css";

const ProductDetails = () => {
  const { id } = useParams();

  const { products } = useProducts();

  const { addToCart } = useCart();

  const product = products.find((item) => String(item.id) === id);

  const [activeImage, setActiveImage] = useState(product?.image || "");

  if (!product) {
    return (
      <main className="product-not-found">
        <h1>Product Not Found</h1>

        <Link to="/catalog">Back to Shop</Link>
      </main>
    );
  }

  /*
    Supports multiple images later.

    Example product object:

    images: [
      "image1.jpg",
      "image2.jpg",
      "image3.jpg"
    ]
  */

  const images = product.images?.length ? product.images : [product.image];

  const relatedProducts = products
    .filter(
      (item) => item.category === product.category && item.id !== product.id
    )
    .slice(0, 4);

  return (
    <main className="product-details-page">
      <div className="product-details-container">
        {/* IMAGE GALLERY */}

        <section className="product-gallery">
          <div className="main-product-image">
            <img src={activeImage} alt={product.name} />
          </div>

          <div className="thumbnail-list">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setActiveImage(image)}
                className={
                  activeImage === image ? "thumbnail active" : "thumbnail"
                }
              >
                <img src={image} alt={`${product.name} ${index + 1}`} />
              </button>
            ))}
          </div>
        </section>

        {/* PRODUCT INFORMATION */}

        <section className="product-details-info">
          <span className="details-category">{product.category}</span>

          <h1>{product.name}</h1>

          <h2>₦{product.price.toLocaleString()}</h2>

          <p className="details-description">{product.description}</p>

          <div className="product-meta">
            <p>
              <strong>Category:</strong> {product.category}
            </p>

            <p>
              <strong>Type:</strong> {product.subCategory}
            </p>
          </div>

          <button
            className="details-cart-button"
            onClick={() => addToCart(product)}
          >
            Add to Cart
          </button>

          <Link to="/catalog" className="continue-shopping">
            ← Continue Shopping
          </Link>
        </section>
      </div>

      {/* RELATED PRODUCTS */}

      {relatedProducts.length > 0 && (
        <section className="related-products">
          <h2>You May Also Like</h2>

          <div className="related-grid">
            {relatedProducts.map((item) => (
              <Link
                key={item.id}
                to={`/product/${item.id}`}
                className="related-card"
              >
                <img src={item.image} alt={item.name} />

                <h3>{item.name}</h3>

                <p>₦{item.price.toLocaleString()}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
};

export default ProductDetails;
