import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((previousData) => ({
      ...previousData,
      [e.target.name]: e.target.value,
    }));

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await login(formData.email, formData.password);

      // Return customer to the page they originally wanted
      const redirectTo = location.state?.from || "/account";

      navigate(redirectTo, {
        replace: true,
        state: location.state?.checkout ? { checkout: true } : {},
      });
    } catch (error) {
      console.error(error);

      if (
        error.code === "auth/invalid-credential" ||
        error.code === "auth/wrong-password" ||
        error.code === "auth/user-not-found"
      ) {
        setError("Invalid email or password.");
      } else if (error.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else if (error.code === "auth/too-many-requests") {
        setError("Too many unsuccessful attempts. Please try again later.");
      } else {
        setError("Unable to sign in. Please try again.");
      }
    }
  };

  return (
    <main className="customer-login-page">
      <section className="customer-login-card">
        <div className="customer-login-header">
          <span className="customer-login-brand">RIJALS INVESTMENT</span>

          <h1>Welcome Back</h1>

          <p>
            Sign in to your account to view your orders and manage your shopping
            experience.
          </p>
        </div>

        <form className="customer-login-form" onSubmit={handleSubmit}>
          <div className="customer-form-group">
            <label htmlFor="email">Email Address</label>

            <input
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </div>

          <div className="customer-form-group">
            <label htmlFor="password">Password</label>

            <input
              id="password"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
            />
          </div>

          {error && <div className="customer-login-error">{error}</div>}

          <button type="submit" className="customer-login-button">
            Sign In
          </button>
        </form>

        <div className="customer-login-footer">
          <p>
            Don't have an account?{" "}
            <Link
              to="/register"
              state={{
                from: location.state?.from || "/account",
                checkout: location.state?.checkout === true,
              }}
            >
              Create an account
            </Link>
          </p>

          <Link to="/" className="back-to-store">
            ← Back to Store
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Login;
