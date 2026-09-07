import { Link, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./OrderDetails.css";

const OrderDetails = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();

  const allOrders = JSON.parse(localStorage.getItem("rijals_orders") || "[]");

  // Find the order
  const order = allOrders.find((item) => {
    const belongsToCustomer =
      item.customerId === currentUser?.id ||
      item.customerEmail?.toLowerCase() === currentUser?.email?.toLowerCase();

    return String(item.id) === String(id) && belongsToCustomer;
  });

  if (!currentUser) {
    return (
      <main className="order-details-page">
        <section className="order-details-message">
          <h1>Sign In Required</h1>
          <p>Please sign in to view your order.</p>

          <Link to="/login" className="order-details-button">
            Sign In
          </Link>
        </section>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="order-details-page">
        <section className="order-details-message">
          <h1>Order Not Found</h1>

          <p>We couldn't find this order in your account.</p>

          <Link to="/orders" className="order-details-button">
            ← Back to My Orders
          </Link>
        </section>
      </main>
    );
  }

  const status = order.status || "Pending";

  const totalItems =
    order.items?.reduce(
      (total, item) => total + Number(item.quantity || 1),
      0
    ) || 0;

  return (
    <main className="order-details-page">
      <section className="order-details-container">
        <div className="order-details-header">
          <div>
            <Link to="/orders" className="back-orders-link">
              ← Back to My Orders
            </Link>

            <span className="order-details-eyebrow">ORDER DETAILS</span>

            <h1>Order #{order.id}</h1>

            <p>
              {order.createdAt
                ? `Placed on ${new Date(order.createdAt).toLocaleDateString()}`
                : "Order date unavailable"}
            </p>
          </div>

          <span
            className={`order-details-status status-${status
              .toLowerCase()
              .replace(/\s+/g, "-")}`}
          >
            {status}
          </span>
        </div>

        {/* Order Progress */}
        <section className="order-progress-card">
          <h2>Order Status</h2>

          <div className="order-progress">
            <div
              className={`progress-step ${
                ["Pending", "Processing", "Shipped", "Delivered"].includes(
                  status
                )
                  ? "completed"
                  : ""
              }`}
            >
              <span>1</span>
              <strong>Order Placed</strong>
            </div>

            <div
              className={`progress-line ${
                ["Processing", "Shipped", "Delivered"].includes(status)
                  ? "completed"
                  : ""
              }`}
            />

            <div
              className={`progress-step ${
                ["Processing", "Shipped", "Delivered"].includes(status)
                  ? "completed"
                  : ""
              }`}
            >
              <span>2</span>
              <strong>Processing</strong>
            </div>

            <div
              className={`progress-line ${
                ["Shipped", "Delivered"].includes(status) ? "completed" : ""
              }`}
            />

            <div
              className={`progress-step ${
                ["Shipped", "Delivered"].includes(status) ? "completed" : ""
              }`}
            >
              <span>3</span>
              <strong>Shipped</strong>
            </div>

            <div
              className={`progress-line ${
                status === "Delivered" ? "completed" : ""
              }`}
            />

            <div
              className={`progress-step ${
                status === "Delivered" ? "completed" : ""
              }`}
            >
              <span>4</span>
              <strong>Delivered</strong>
            </div>
          </div>
        </section>

        {/* Products */}
        <section className="order-products-card">
          <div className="section-heading">
            <h2>Items in Your Order</h2>

            <span>
              {totalItems} {totalItems === 1 ? "item" : "items"}
            </span>
          </div>

          <div className="order-items-list">
            {order.items?.map((item, index) => (
              <div
                className="order-detail-item"
                key={`${item.id || item.name}-${index}`}
              >
                <div className="order-detail-image">
                  <img src={item.image} alt={item.name} />
                </div>

                <div className="order-detail-info">
                  <h3>{item.name}</h3>

                  {item.category && <span>{item.category}</span>}

                  <p>Quantity: {Number(item.quantity || 1)}</p>
                </div>

                <strong className="order-detail-price">
                  ₦
                  {(
                    Number(item.price || 0) * Number(item.quantity || 1)
                  ).toLocaleString()}
                </strong>
              </div>
            ))}
          </div>

          <div className="order-total">
            <span>Total</span>

            <strong>₦{Number(order.total || 0).toLocaleString()}</strong>
          </div>
        </section>

        {/* Customer Information */}
        <section className="order-information-grid">
          <div className="order-info-card">
            <h2>Customer Information</h2>

            <p>
              <strong>Name</strong>
              {currentUser.name}
            </p>

            <p>
              <strong>Email</strong>
              {currentUser.email}
            </p>
          </div>

          <div className="order-info-card">
            <h2>Order Information</h2>

            <p>
              <strong>Order Number</strong>#{order.id}
            </p>

            <p>
              <strong>Status</strong>
              {status}
            </p>

            <p>
              <strong>Total Items</strong>
              {totalItems}
            </p>
          </div>
        </section>
      </section>
    </main>
  );
};

export default OrderDetails;
