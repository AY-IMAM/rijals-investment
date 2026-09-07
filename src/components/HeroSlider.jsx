import { useEffect, useState } from "react";
import { useProducts } from "../context/ProductContext";
import { Link } from "react-router-dom";
import "./HeroSlider.css";

const HeroSlider = () => {
  const { getFeaturedProducts } = useProducts();

  const slides = getFeaturedProducts();

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (slides.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  if (slides.length === 0) {
    return null;
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const previousSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const currentProduct = slides[currentSlide];

  return (
    <section className="hero-slider">
      <div className="hero-content">
        <div className="hero-text">
          <span className="hero-label">Featured Collection</span>

          <h1>{currentProduct.name}</h1>

          <p>{currentProduct.description}</p>

          <h2>₦{currentProduct.price.toLocaleString()}</h2>

          <Link to="/catalog" className="hero-button">
            Shop Now
          </Link>
        </div>

        <div className="hero-image">
          <img src={currentProduct.image} alt={currentProduct.name} />
        </div>
      </div>

      <button className="slider-button left" onClick={previousSlide}>
        ❮
      </button>

      <button className="slider-button right" onClick={nextSlide}>
        ❯
      </button>

      <div className="slider-dots">
        {slides.map((_, index) => (
          <button
            key={index}
            className={index === currentSlide ? "dot active" : "dot"}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSlider;
