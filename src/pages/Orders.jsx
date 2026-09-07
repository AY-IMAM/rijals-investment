import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import "./Orders.css";

const Orders = () => {
  const navigate = useNavigate();

  const { currentUser } = useAuth();

  const allOrders = JSON.parse(localStorage.getItem("rijals_orders") || "[]");

  // Only show orders belonging to the logged-in customer
  const customerOrders = allOrders
    .filter((order) => {
      return (
        order.customerId === currentUser?.id ||
        order.customerEmail?.toLowerCase() === currentUser?.email?.toLowerCase()
      );
    })
    .sort((a, b) => {
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });

  // ================================
  // NOT LOGGED IN
  // ================================

  if (!currentUser) {
    return (
      <main className="orders-page">
        <section className="orders-login-message">
          <h1>My Orders</h1>

          <p>Please sign in to view your orders.</p>

          <Link to="/login" className="orders-login-button">
            Sign In
          </Link>
        </section>
      </main>
    );
  }

  // ================================
  // LOGGED IN
  // ================================

  return (
    <main className="orders-page">
      <section className="orders-container">
        {/* HEADER */}
        <div className="orders-header">
          <div>
            <span className="orders-eyebrow">RIJALS INVESTMENT</span>

            <h1>My Orders</h1>

            <p>View your previous purchases and track your orders.</p>
          </div>

          <Link to="/account" className="orders-account-link">
            ← My Account
          </Link>
        </div>

        {/* NO ORDERS */}
        {customerOrders.length === 0 ? (
          <div className="orders-empty">
            <div className="orders-empty-icon">📦</div>

            <h2>No orders yet</h2>

            <p>
              You haven't placed an order yet. Explore our collection and find
              something you love.
            </p>

            <Link to="/catalog" className="orders-shop-button">
              Start Shopping
            </Link>
          </div>
        ) : (
          /* ORDERS */
          <div className="orders-list">
            {customerOrders.map((order) => {
              const totalItems =
                order.items?.reduce(
                  (total, item) => total + Number(item.quantity || 1),
                  0
                ) || 0;

              const status = order.status || "Pending";

              // Support both old and new orders
              const orderTotal = Number(order.total ?? order.totalPrice ?? 0);

              return (
                <article className="order-card" key={order.id}>
                  {/* ORDER TOP */}
                  <div className="order-card-top">
                    <div>
                      <span className="order-label">ORDER NUMBER</span>

                      <h2>#{order.id}</h2>
                    </div>

                    <span
                      className={`order-status status-${status
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                    >
                      {status}
                    </span>
                  </div>

                  {/* ORDER DETAILS */}
                  <div className="order-card-details">
                    <div>
                      <span>DATE</span>

                      <strong>
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString()
                          : "—"}
                      </strong>
                    </div>

                    <div>
                      <span>ITEMS</span>

                      <strong>
                        {totalItems} {totalItems === 1 ? "item" : "items"}
                      </strong>
                    </div>

                    <div>
                      <span>TOTAL</span>

                      <strong>₦{orderTotal.toLocaleString()}</strong>
                    </div>
                  </div>

                  {/* ORDER BOTTOM */}
                  <div className="order-card-bottom">
                    <div className="order-preview">
                      {order.items?.slice(0, 3).map((item, index) => (
                        <div
                          className="order-preview-item"
                          key={`${item.id || item.name}-${index}`}
                        >
                          <img src={item.image} alt={item.name} />
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      className="view-order-button"
                      onClick={() => navigate(`/orders/${order.id}`)}
                    >
                      View Order →
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
};

export default Orders;
