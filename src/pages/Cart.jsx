import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

import "./Cart.css";

const Cart = () => {
  const {
    cartItems,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    cartTotal,
    placeOrder,
  } = useCart();

  const { currentUser } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [showCheckout, setShowCheckout] = useState(false);

  const [customerDetails, setCustomerDetails] = useState({
    customerName: "",
    phoneNumber: "",
    shippingAddress: "",
  });

  // ================================
  // OPEN CHECKOUT AFTER LOGIN
  // ================================

  useEffect(() => {
    if (currentUser && location.state?.checkout === true) {
      setCustomerDetails((previousDetails) => ({
        ...previousDetails,
        customerName: currentUser.name || "",
      }));

      setShowCheckout(true);

      // Remove checkout state from the URL/navigation history
      navigate("/cart", {
        replace: true,
        state: {},
      });
    }
  }, [currentUser, location.state, navigate]);

  // ================================
  // HANDLE FORM CHANGES
  // ================================

  const handleChange = (e) => {
    setCustomerDetails((previousDetails) => ({
      ...previousDetails,
      [e.target.name]: e.target.value,
    }));
  };

  // ================================
  // PROCEED TO CHECKOUT
  // ================================

  const handleProceedToCheckout = () => {
    // Customer is not logged in
    if (!currentUser) {
      navigate("/login", {
        state: {
          from: "/cart",
          checkout: true,
        },
      });

      return;
    }

    // Customer is already logged in
    setCustomerDetails((previousDetails) => ({
      ...previousDetails,
      customerName: currentUser.name || "",
    }));

    setShowCheckout(true);
  };

  // ================================
  // PLACE ORDER
  // ================================

  const handleCheckout = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      navigate("/login", {
        state: {
          from: "/cart",
          checkout: true,
        },
      });

      return;
    }

    try {
      const order = await placeOrder(customerDetails);

      if (!order) {
        alert("Unable to place order. Please try again.");
        return;
      }

      alert(`Order placed successfully! Order ID: ${order.id}`);

      setCustomerDetails({
        customerName: "",
        phoneNumber: "",
        shippingAddress: "",
      });

      setShowCheckout(false);
    } catch (error) {
      console.error("Order error:", error);

      alert("Unable to place order. Please try again.");
    }
  };

  // ================================
  // WHATSAPP ORDER
  // ================================

  const sendWhatsAppOrder = () => {
    if (!currentUser) {
      navigate("/login", {
        state: {
          from: "/cart",
          checkout: true,
        },
      });

      return;
    }

    const businessNumber = "2349029337532";

    const itemsMessage = cartItems
      .map(
        (item) =>
          `• ${item.name} x${item.quantity} - ₦${(
            Number(item.price) * Number(item.quantity)
          ).toLocaleString()}`
      )
      .join("\n");

    const message = `
Hello Rijals Investment,

I would like to place an order.

Items:

${itemsMessage}

Total:

₦${cartTotal.toLocaleString()}

Customer Name:

${customerDetails.customerName}

Phone Number:

${customerDetails.phoneNumber}

Address:

${customerDetails.shippingAddress}
`;

    const whatsappURL = `https://wa.me/${businessNumber}?text=${encodeURIComponent(
      message
    )}`;

    window.open(whatsappURL, "_blank");
  };

  // ================================
  // EMPTY CART
  // ================================

  if (cartItems.length === 0) {
    return (
      <main className="empty-cart">
        <h1>Your Cart is Empty</h1>

        <p>Start exploring our premium collection.</p>

        <Link to="/catalog" className="shop-button">
          Continue Shopping
        </Link>
      </main>
    );
  }

  // ================================
  // MAIN CART
  // ================================

  return (
    <main className="cart-page">
      <h1>Shopping Cart</h1>

      <div className="cart-layout">
        {/* ================================
            CART ITEMS
        ================================= */}

        <section className="cart-items">
          {cartItems.map((item) => (
            <article className="cart-item" key={item.id}>
              <img src={item.image} alt={item.name} />

              <div className="cart-item-info">
                <h3>{item.name}</h3>

                <p>₦{Number(item.price).toLocaleString()}</p>
              </div>

              {/* QUANTITY */}

              <div className="quantity-controls">
                <button type="button" onClick={() => decreaseQuantity(item.id)}>
                  −
                </button>

                <span>{item.quantity}</span>

                <button type="button" onClick={() => increaseQuantity(item.id)}>
                  +
                </button>
              </div>

              {/* ITEM TOTAL */}

              <div className="cart-item-total">
                ₦{(Number(item.price) * Number(item.quantity)).toLocaleString()}
              </div>

              {/* REMOVE */}

              <button
                type="button"
                className="remove-button"
                onClick={() => removeFromCart(item.id)}
              >
                Remove
              </button>
            </article>
          ))}
        </section>

        {/* ================================
            CART SUMMARY
        ================================= */}

        <aside className="cart-summary">
          <h2>Order Summary</h2>

          <div className="summary-row">
            <span>Total</span>

            <strong>₦{cartTotal.toLocaleString()}</strong>
          </div>

          <button
            type="button"
            className="checkout-button"
            onClick={handleProceedToCheckout}
          >
            Proceed to Checkout
          </button>
        </aside>
      </div>

      {/* ================================
          CHECKOUT FORM
      ================================= */}

      {showCheckout && (
        <div className="checkout-overlay">
          <div className="checkout-modal">
            {/* CLOSE */}

            <button
              type="button"
              className="close-button"
              onClick={() => setShowCheckout(false)}
            >
              ×
            </button>

            <h2>Checkout</h2>

            {currentUser && (
              <p className="checkout-account-info">
                Signed in as <strong>{currentUser.email}</strong>
              </p>
            )}

            <form onSubmit={handleCheckout}>
              {/* NAME */}

              <input
                type="text"
                name="customerName"
                placeholder="Full Name"
                value={customerDetails.customerName}
                onChange={handleChange}
                required
              />

              {/* PHONE */}

              <input
                type="tel"
                name="phoneNumber"
                placeholder="Phone Number"
                value={customerDetails.phoneNumber}
                onChange={handleChange}
                required
              />

              {/* ADDRESS */}

              <textarea
                name="shippingAddress"
                placeholder="Shipping Address"
                value={customerDetails.shippingAddress}
                onChange={handleChange}
                required
              />

              {/* PLACE ORDER */}

              <button type="submit" className="place-order-button">
                Place Order
              </button>

              {/* WHATSAPP */}

              <button
                type="button"
                className="whatsapp-order-button"
                onClick={sendWhatsAppOrder}
              >
                Order via WhatsApp
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default Cart;
