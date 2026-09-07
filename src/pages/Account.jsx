import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import {
  FaBoxOpen,
  FaShoppingBag,
  FaMoneyBillWave,
  FaUser,
  FaArrowRight,
  FaSignOutAlt,
  FaStore,
  FaChevronRight,
} from "react-icons/fa";

import "./Account.css";

const Account = () => {
  const navigate = useNavigate();

  const { currentUser, logout } = useAuth();

  // Get all saved orders
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

  // Show only the 3 most recent orders
  const recentOrders = customerOrders.slice(0, 3);

  // Calculate total number of items purchased
  const totalItemsPurchased = customerOrders.reduce((total, order) => {
    return (
      total +
      (order.items?.reduce(
        (itemTotal, item) => itemTotal + Number(item.quantity || 1),
        0
      ) || 0)
    );
  }, 0);

  // Calculate total amount spent
  const totalSpent = customerOrders.reduce((total, order) => {
    return total + Number(order.total ?? order.totalPrice ?? 0);
  }, 0);

  // Logout
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // ==========================================
  // NOT LOGGED IN
  // ==========================================

  if (!currentUser) {
    return (
      <main className="account-page">
        <section className="account-login-message">
          <div className="account-login-icon">
            <FaUser />
          </div>

          <span className="account-eyebrow">RIJALS INVESTMENT</span>

          <h1>Welcome to Rijals</h1>

          <p>
            Please sign in to view your account, orders and shopping activity.
          </p>

          <div className="account-login-actions">
            <Link to="/login" className="account-primary-button">
              <FaUser />
              Sign In
            </Link>

            <Link to="/register" className="account-secondary-button">
              Create Account
            </Link>
          </div>
        </section>
      </main>
    );
  }

  // ==========================================
  // LOGGED IN
  // ==========================================

  return (
    <main className="account-page">
      <section className="account-container">
        {/* =====================================
            ACCOUNT HEADER
        ====================================== */}

        <div className="account-header">
          <div>
            <span className="account-eyebrow">MY ACCOUNT</span>

            <h1>Welcome, {currentUser.name}</h1>

            <p>Manage your account and keep track of your Rijals orders.</p>
          </div>

          <button
            type="button"
            className="account-logout-button"
            onClick={handleLogout}
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>

        {/* =====================================
            ACCOUNT STATISTICS
        ====================================== */}

        <div className="account-stats">
          {/* TOTAL ORDERS */}

          <div className="account-stat-card">
            <div className="account-stat-icon">
              <FaBoxOpen />
            </div>

            <div className="account-stat-content">
              <span>Total Orders</span>

              <strong>{customerOrders.length}</strong>
            </div>
          </div>

          {/* ITEMS PURCHASED */}

          <div className="account-stat-card">
            <div className="account-stat-icon">
              <FaShoppingBag />
            </div>

            <div className="account-stat-content">
              <span>Items Purchased</span>

              <strong>{totalItemsPurchased}</strong>
            </div>
          </div>

          {/* TOTAL SPENT */}

          <div className="account-stat-card">
            <div className="account-stat-icon">
              <FaMoneyBillWave />
            </div>

            <div className="account-stat-content">
              <span>Total Spent</span>

              <strong>₦{totalSpent.toLocaleString()}</strong>
            </div>
          </div>
        </div>

        {/* =====================================
            QUICK ACTIONS
        ====================================== */}

        <div className="account-grid">
          {/* MY ORDERS */}

          <Link to="/orders" className="account-card">
            <div className="account-card-icon">
              <FaBoxOpen />
            </div>

            <div className="account-card-content">
              <h2>My Orders</h2>

              <p>View your orders and track their status.</p>
            </div>

            <span className="account-card-arrow">
              <FaArrowRight />
            </span>
          </Link>

          {/* ACCOUNT INFORMATION */}

          <div className="account-card account-info-card">
            <div className="account-card-icon">
              <FaUser />
            </div>

            <div className="account-card-content">
              <h2>Account Information</h2>

              <p>
                <strong>Name:</strong> {currentUser.name}
              </p>

              <p>
                <strong>Email:</strong> {currentUser.email}
              </p>
            </div>
          </div>

          {/* CONTINUE SHOPPING */}

          <Link to="/catalog" className="account-card">
            <div className="account-card-icon">
              <FaStore />
            </div>

            <div className="account-card-content">
              <h2>Continue Shopping</h2>

              <p>Explore our latest Rijals collection.</p>
            </div>

            <span className="account-card-arrow">
              <FaArrowRight />
            </span>
          </Link>
        </div>

        {/* =====================================
            RECENT ORDERS
        ====================================== */}

        <section className="recent-orders-section">
          <div className="recent-orders-header">
            <div>
              <span className="account-eyebrow">ORDER HISTORY</span>

              <h2>Recent Orders</h2>
            </div>

            {customerOrders.length > 0 && (
              <Link to="/orders">
                View All Orders
                <FaArrowRight />
              </Link>
            )}
          </div>

          {/* ==================================
              NO ORDERS
          =================================== */}

          {recentOrders.length === 0 ? (
            <div className="recent-orders-empty">
              <div className="recent-orders-empty-icon">
                <FaBoxOpen />
              </div>

              <h3>No orders yet</h3>

              <p>
                Your recent orders will appear here after you make a purchase.
              </p>

              <Link to="/catalog" className="account-primary-button">
                <FaShoppingBag />
                Start Shopping
              </Link>
            </div>
          ) : (
            /* =================================
               RECENT ORDER LIST
            ================================== */

            <div className="recent-orders-list">
              {recentOrders.map((order) => {
                const totalItems =
                  order.items?.reduce(
                    (total, item) => total + Number(item.quantity || 1),
                    0
                  ) || 0;

                const orderTotal = Number(order.total ?? order.totalPrice ?? 0);

                const status = order.status || "Pending";

                return (
                  <article className="recent-order-card" key={order.id}>
                    {/* PRODUCT IMAGES */}

                    <div className="recent-order-images">
                      {order.items?.slice(0, 3).map((item, index) => (
                        <div
                          className="recent-order-image"
                          key={`${item.id || item.name}-${index}`}
                        >
                          <img src={item.image} alt={item.name} />
                        </div>
                      ))}
                    </div>

                    {/* ORDER INFORMATION */}

                    <div className="recent-order-info">
                      <span>ORDER #{order.id}</span>

                      <h3>
                        {totalItems} {totalItems === 1 ? "item" : "items"}
                      </h3>

                      <p>
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString()
                          : "—"}
                      </p>
                    </div>

                    {/* ORDER TOTAL + STATUS */}

                    <div className="recent-order-right">
                      <strong>₦{orderTotal.toLocaleString()}</strong>

                      <span
                        className={`recent-order-status status-${status
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`}
                      >
                        {status}
                      </span>
                    </div>

                    {/* VIEW ORDER */}

                    <Link
                      to={`/orders/${order.id}`}
                      className="recent-order-view"
                    >
                      <span>View</span>
                      <FaChevronRight />
                    </Link>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </section>
    </main>
  );
};

export default Account;
