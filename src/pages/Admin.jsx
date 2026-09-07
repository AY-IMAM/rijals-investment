import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";

import { useProducts } from "../context/ProductContext";
import { auth } from "../firebase";

import "./Admin.css";

const IMAGE_SIZE = 1200;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const Admin = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const { products, categories, addProduct, updateProduct, deleteProduct } =
    useProducts();

  const [activeTab, setActiveTab] = useState("addProduct");
  const [orders, setOrders] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);

  const [imagePreview, setImagePreview] = useState("");
  const [imageProcessing, setImageProcessing] = useState(false);
  const [imageError, setImageError] = useState("");

  const [savingProduct, setSavingProduct] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    subCategory: "",
    price: "",
    image: "",
    description: "",
    featured: false,
  });

  // ==========================================
  // LOAD ORDERS
  // ==========================================

  useEffect(() => {
    const savedOrders = localStorage.getItem("rijals_orders");

    if (savedOrders) {
      try {
        setOrders(JSON.parse(savedOrders));
      } catch (error) {
        console.error("Could not load orders:", error);
      }
    }
  }, []);

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/admin-login");
    } catch (error) {
      console.error("Logout error:", error);
      alert("Unable to logout. Please try again.");
    }
  };

  // ==========================================
  // HANDLE FORM CHANGES
  // ==========================================

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "category") {
      setFormData((previousData) => ({
        ...previousData,
        category: value,
        subCategory: "",
      }));

      return;
    }

    setFormData((previousData) => ({
      ...previousData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ==========================================
  // PROCESS PRODUCT IMAGE
  // ==========================================

  const processProductImage = (file) => {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject(new Error("No image selected."));
        return;
      }

      if (!file.type.startsWith("image/")) {
        reject(new Error("Please select a valid image file."));
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        reject(
          new Error("Image is too large. Please use an image below 10MB.")
        );

        return;
      }

      const reader = new FileReader();

      reader.onload = () => {
        const image = new Image();

        image.onload = () => {
          const canvas = document.createElement("canvas");

          canvas.width = IMAGE_SIZE;
          canvas.height = IMAGE_SIZE;

          const context = canvas.getContext("2d");

          if (!context) {
            reject(new Error("Could not process this image."));
            return;
          }

          // Neutral background
          context.fillStyle = "#f7f7f7";
          context.fillRect(0, 0, IMAGE_SIZE, IMAGE_SIZE);

          // Padding around product
          const padding = 90;
          const availableSize = IMAGE_SIZE - padding * 2;

          const scale = Math.min(
            availableSize / image.width,
            availableSize / image.height
          );

          const newWidth = image.width * scale;
          const newHeight = image.height * scale;

          const x = (IMAGE_SIZE - newWidth) / 2;
          const y = (IMAGE_SIZE - newHeight) / 2;

          // High quality rendering
          context.imageSmoothingEnabled = true;
          context.imageSmoothingQuality = "high";

          context.drawImage(image, x, y, newWidth, newHeight);

          // Compress image
          const processedImage = canvas.toDataURL("image/jpeg", 0.92);

          resolve(processedImage);
        };

        image.onerror = () => {
          reject(new Error("Could not read this image."));
        };

        image.src = reader.result;
      };

      reader.onerror = () => {
        reject(new Error("Could not load the selected image."));
      };

      reader.readAsDataURL(file);
    });
  };

  // ==========================================
  // IMAGE UPLOAD
  // ==========================================

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setImageError("");
    setImageProcessing(true);

    try {
      const processedImage = await processProductImage(file);

      setImagePreview(processedImage);

      setFormData((previousData) => ({
        ...previousData,
        image: processedImage,
      }));
    } catch (error) {
      console.error(error);

      setImageError(error.message);
      setImagePreview("");
    } finally {
      setImageProcessing(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // ==========================================
  // REMOVE IMAGE
  // ==========================================

  const removeImage = () => {
    setImagePreview("");

    setFormData((previousData) => ({
      ...previousData,
      image: "",
    }));

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // ==========================================
  // RESET FORM
  // ==========================================

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      subCategory: "",
      price: "",
      image: "",
      description: "",
      featured: false,
    });

    setImagePreview("");
    setImageError("");
    setEditingProduct(null);
    setSavingProduct(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // ==========================================
  // ADD / UPDATE PRODUCT
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setImageError("");

    if (!formData.name.trim()) {
      alert("Please enter a product name.");
      return;
    }

    if (!formData.category) {
      alert("Please select a category.");
      return;
    }

    if (!formData.subCategory) {
      alert("Please select a sub-category.");
      return;
    }

    if (!formData.price || Number(formData.price) < 0) {
      alert("Please enter a valid product price.");
      return;
    }

    if (!formData.image) {
      setImageError("Please upload a product image.");
      return;
    }

    if (!formData.description.trim()) {
      alert("Please enter a product description.");
      return;
    }

    const productData = {
      name: formData.name.trim(),
      category: formData.category,
      subCategory: formData.subCategory,
      price: Number(formData.price),
      image: formData.image,
      description: formData.description.trim(),
      featured: Boolean(formData.featured),
    };

    try {
      setSavingProduct(true);

      // UPDATE EXISTING PRODUCT
      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);

        alert("Product updated successfully!");

        resetForm();
        setActiveTab("products");

        return;
      }

      // ADD NEW PRODUCT
      await addProduct(productData);

      alert("Product added successfully!");

      resetForm();

      setActiveTab("products");
    } catch (error) {
      console.error("Product save error:", error);

      let message = "Unable to save product. Please try again.";

      if (error?.code === "permission-denied") {
        message =
          "Permission denied. Make sure you are logged in with the Firebase admin account.";
      }

      if (error?.code === "unauthenticated") {
        message = "You are not authenticated. Please log in again.";
      }

      alert(message);
    } finally {
      setSavingProduct(false);
    }
  };

  // ==========================================
  // EDIT PRODUCT
  // ==========================================

  const handleEdit = (product) => {
    setEditingProduct(product);

    setFormData({
      name: product.name || "",
      category: product.category || "",
      subCategory: product.subCategory || "",
      price: product.price ?? "",
      image: product.image || "",
      description: product.description || "",
      featured: Boolean(product.featured),
    });

    setImagePreview(product.image || "");
    setImageError("");
    setActiveTab("addProduct");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==========================================
  // DELETE PRODUCT
  // ==========================================

  const handleDeleteProduct = async (product) => {
    const confirmed = window.confirm(
      `Delete "${product.name}"?\n\nThis action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      await deleteProduct(product.id);

      alert("Product deleted successfully.");
    } catch (error) {
      console.error("Delete product error:", error);

      alert("Unable to delete product. Please try again.");
    }
  };

  // ==========================================
  // UPDATE ORDER STATUS
  // ==========================================

  const updateOrderStatus = (orderId, status) => {
    const updatedOrders = orders.map((order) =>
      order.id === orderId
        ? {
            ...order,
            status,
          }
        : order
    );

    setOrders(updatedOrders);

    localStorage.setItem("rijals_orders", JSON.stringify(updatedOrders));
  };

  // ==========================================
  // FORMAT PRICE
  // ==========================================

  const formatPrice = (price) => {
    return Number(price || 0).toLocaleString();
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <main className="admin-page">
      {/* ======================================
          HEADER
      ======================================= */}

      <header className="admin-header">
        <div>
          <span className="admin-brand">RIJALS INVESTMENT</span>

          <h1>Admin Dashboard</h1>

          <p>Manage your products and customer orders.</p>
        </div>

        <button type="button" className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </header>

      {/* ======================================
          TABS
      ======================================= */}

      <nav className="admin-tabs">
        <button
          type="button"
          className={activeTab === "addProduct" ? "tab active" : "tab"}
          onClick={() => {
            setActiveTab("addProduct");

            if (!editingProduct) {
              resetForm();
            }
          }}
        >
          <span>＋</span>

          {editingProduct ? "Edit Product" : "Add Product"}
        </button>

        <button
          type="button"
          className={activeTab === "products" ? "tab active" : "tab"}
          onClick={() => setActiveTab("products")}
        >
          <span>▦</span>
          Products ({products.length})
        </button>

        <button
          type="button"
          className={activeTab === "orders" ? "tab active" : "tab"}
          onClick={() => setActiveTab("orders")}
        >
          <span>▤</span>
          Orders ({orders.length})
        </button>
      </nav>

      {/* ======================================
          ADD / EDIT PRODUCT
      ======================================= */}

      {activeTab === "addProduct" && (
        <section className="admin-card">
          <div className="form-heading">
            <div>
              <span className="section-eyebrow">PRODUCT MANAGEMENT</span>

              <h2>{editingProduct ? "Edit Product" : "Add New Product"}</h2>

              <p>Add a product to your Rijals Investment collection.</p>
            </div>

            {editingProduct && (
              <button type="button" className="cancel-edit" onClick={resetForm}>
                Cancel Editing
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="product-form">
            <div className="form-grid">
              {/* PRODUCT NAME */}

              <div className="form-group full-width">
                <label htmlFor="name">Product Name</label>

                <input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="e.g. Premium Black Cap"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* CATEGORY */}

              <div className="form-group">
                <label htmlFor="category">Category</label>

                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Category</option>

                  {Object.keys(categories).map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* SUB CATEGORY */}

              <div className="form-group">
                <label htmlFor="subCategory">Sub-Category</label>

                <select
                  id="subCategory"
                  name="subCategory"
                  value={formData.subCategory}
                  onChange={handleChange}
                  disabled={!formData.category}
                  required
                >
                  <option value="">Select Sub-Category</option>

                  {formData.category &&
                    categories[formData.category]?.map((subCategory) => (
                      <option key={subCategory} value={subCategory}>
                        {subCategory}
                      </option>
                    ))}
                </select>
              </div>

              {/* PRICE */}

              <div className="form-group">
                <label htmlFor="price">Price (₦)</label>

                <input
                  id="price"
                  type="number"
                  name="price"
                  placeholder="e.g. 25000"
                  min="0"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* FEATURED */}

              <div className="form-group featured-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleChange}
                  />

                  <span>
                    <strong>Featured Product</strong>

                    <small>Show this product as featured.</small>
                  </span>
                </label>
              </div>
            </div>

            {/* ==================================
                IMAGE SECTION
            =================================== */}

            <div className="image-upload-section">
              <div className="image-upload-heading">
                <div>
                  <span className="section-eyebrow">PRODUCT IMAGE</span>

                  <h3>Upload Product Photo</h3>

                  <p>
                    Your image will automatically be placed inside a consistent
                    square frame.
                  </p>
                </div>

                <span className="image-spec">1200 × 1200</span>
              </div>

              <div className="image-upload-layout">
                {/* UPLOAD AREA */}

                <div className="upload-area">
                  <div className="upload-icon">↑</div>

                  <h4>Upload a high-quality product image</h4>

                  <p>JPG, PNG or WebP · Maximum 10MB</p>

                  <label htmlFor="product-image" className="upload-button">
                    {imageProcessing ? "Processing..." : "Choose Image"}
                  </label>

                  <input
                    ref={fileInputRef}
                    id="product-image"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageUpload}
                    disabled={imageProcessing}
                    hidden
                  />

                  <small className="upload-tip">
                    For best results, use a clear photo with the product visible
                    from all sides.
                  </small>
                </div>

                {/* PREVIEW */}

                <div className="image-preview-area">
                  <div className="preview-label">
                    <span>Preview</span>

                    {imagePreview && (
                      <button
                        type="button"
                        onClick={removeImage}
                        className="remove-image"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="image-preview-frame">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Product preview" />
                    ) : (
                      <div className="empty-preview">
                        <span>IMAGE</span>

                        <small>Your product preview will appear here</small>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {imageError && <div className="image-error">{imageError}</div>}
            </div>

            {/* ==================================
                DESCRIPTION
            =================================== */}

            <div className="form-group full-width">
              <label htmlFor="description">Product Description</label>

              <textarea
                id="description"
                name="description"
                placeholder="Describe the product..."
                value={formData.description}
                onChange={handleChange}
                rows="5"
                required
              />
            </div>

            {/* ==================================
                SUBMIT
            =================================== */}

            <div className="form-submit-row">
              <button
                type="submit"
                className="submit-button"
                disabled={imageProcessing || savingProduct}
              >
                {savingProduct
                  ? editingProduct
                    ? "Updating Product..."
                    : "Adding Product..."
                  : editingProduct
                  ? "Update Product"
                  : "Add Product"}
              </button>

              {editingProduct && (
                <button
                  type="button"
                  className="secondary-button"
                  onClick={resetForm}
                  disabled={savingProduct}
                >
                  Clear Form
                </button>
              )}
            </div>
          </form>
        </section>
      )}

      {/* ======================================
          PRODUCTS
      ======================================= */}

      {activeTab === "products" && (
        <section className="admin-products">
          <div className="admin-section-header">
            <div>
              <span className="section-eyebrow">INVENTORY</span>

              <h2>Manage Products</h2>
            </div>

            <button
              type="button"
              className="new-product-button"
              onClick={() => {
                resetForm();
                setActiveTab("addProduct");
              }}
            >
              + Add Product
            </button>
          </div>

          {products.length === 0 ? (
            <div className="empty-admin-state">
              <h3>No products yet</h3>

              <p>Add your first product to your store.</p>
            </div>
          ) : (
            <div className="admin-products-grid">
              {products.map((product) => (
                <article className="admin-product-card" key={product.id}>
                  <div className="admin-product-image">
                    <img src={product.image} alt={product.name} />

                    {product.featured && (
                      <span className="featured-badge">Featured</span>
                    )}
                  </div>

                  <div className="admin-product-content">
                    <span className="admin-product-category">
                      {product.category}
                    </span>

                    <h3>{product.name}</h3>

                    <p className="admin-product-price">
                      ₦{formatPrice(product.price)}
                    </p>

                    <div className="product-actions">
                      <button
                        type="button"
                        className="edit-button"
                        onClick={() => handleEdit(product)}
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="delete-button"
                        onClick={() => handleDeleteProduct(product)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      )}

      {/* ======================================
          ORDERS
      ======================================= */}

      {activeTab === "orders" && (
        <section className="orders-section">
          <div className="admin-section-header">
            <div>
              <span className="section-eyebrow">SALES</span>

              <h2>Customer Orders</h2>
            </div>
          </div>

          {orders.length === 0 ? (
            <div className="empty-admin-state">
              <h3>No orders yet</h3>

              <p>Customer orders will appear here.</p>
            </div>
          ) : (
            <div className="orders-list">
              {orders.map((order) => (
                <article className="order-card" key={order.id}>
                  <div className="order-header">
                    <div>
                      <span className="order-label">ORDER</span>

                      <h3>{order.customerName}</h3>

                      <p>{order.phoneNumber}</p>
                    </div>

                    <select
                      value={order.status || "Pending"}
                      onChange={(e) =>
                        updateOrderStatus(order.id, e.target.value)
                      }
                    >
                      <option value="Pending">Pending</option>

                      <option value="Processing">Processing</option>

                      <option value="Shipped">Shipped</option>

                      <option value="Delivered">Delivered</option>

                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div className="order-details">
                    <p>
                      <strong>Address:</strong> {order.shippingAddress}
                    </p>

                    <h4>Ordered Items</h4>

                    <ul>
                      {order.items?.map((item) => (
                        <li key={item.id}>
                          <span>{item.name}</span>

                          <span>× {item.quantity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="order-total">
                    Total: ₦{formatPrice(order.totalPrice ?? order.total)}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      )}
    </main>
  );
};

export default Admin;
