import { Link } from "react-router-dom";

import { FaInstagram, FaWhatsapp, FaFacebook } from "react-icons/fa";

import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* BRAND */}

        <div className="footer-brand">
          <h2>
            RIJALS
            <span>INVESTMENT</span>
          </h2>

          <p>
            Premium fashion, fragrances and accessories selected for your
            lifestyle.
          </p>
        </div>

        {/* SHOP */}

        <div className="footer-column">
          <h3>Shop</h3>

          <Link to="/catalog?category=Caps">Caps</Link>

          <Link to="/catalog?category=Perfumes">Perfumes</Link>

          <Link to="/catalog?category=Jallabiya">Jallabiya</Link>

          <Link to="/catalog?category=Wristwatches">Wristwatches</Link>
        </div>

        {/* QUICK LINKS */}

        <div className="footer-column">
          <h3>Quick Links</h3>

          <Link to="/">Home</Link>

          <Link to="/catalog">Shop</Link>

          <Link to="/cart">Shopping Cart</Link>
        </div>

        {/* CONTACT */}

        <div className="footer-column">
          <h3>Contact</h3>

          <p>Abuja, Nigeria</p>

          <p>Rijals Investment</p>

          <div className="social-links">
            <a href="#instagram" aria-label="Instagram">
              <FaInstagram />
            </a>

            <a href="#facebook" aria-label="Facebook">
              <FaFacebook />
            </a>

            <a href="#whatsapp" aria-label="WhatsApp">
              <FaWhatsapp />
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} Rijals Investment. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
