import { useEffect, useState } from "react";
import "./Cart.css";
import { useNavigate } from "react-router-dom";
import Axios from "../../axios/axios";
import Navbar from "../Navbar/Navbar";

function Cart() {
  const [cart, setCart] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCart() {
      try {
        const userData = JSON.parse(localStorage.getItem("userdata") || "null");
        const userId = userData?._id;

        if (!userId) {
          alert("Please login first");
          navigate("/login");
          return;
        }

        const response = await Axios.get(`/viewcart/${userId}`);
        setCart(response.data);
      } catch (error) {
        console.error("Fetch cart error:", error);
      }
    }
    fetchCart();
  }, [navigate]);

  const removeFromCart = async (productId) => {
    try {
      const userData = JSON.parse(localStorage.getItem("userdata") || "null");
      const userId = userData?._id;

      await Axios.delete("/removefromcart", {
        data: { userId, productId },
      });

      setCart((prev) => ({
        ...prev,
        items: prev.items.filter((item) => item.productId._id !== productId),
      }));
    } catch (error) {
      console.error("Remove error:", error);
      alert("Failed to remove item");
    }
  };

  const updateQuantity = async (productId, action) => {
    try {
      const userData = JSON.parse(localStorage.getItem("userdata") || "null");
      const userId = userData?._id;

      const res = await Axios.put("/updatequantity", {
        userId,
        productId,
        action,
      });
      setCart(res.data);
    } catch (error) {
      console.error("Quantity update error:", error);
    }
  };

  const totalAmount = cart?.items?.reduce(
    (sum, item) => sum + item.quantity * (item.productId?.price || 0),
    0
  );

  const isEmpty = !cart || !cart.items || cart.items.length === 0;

  return (
    <div className="cart-page">
      <Navbar />

      {isEmpty ? (
        <div className="empty-cart">
          <div className="empty-cart-icon">
            <CartIcon />
          </div>
          <h2>Your Cart is Empty</h2>
          <p>Add items to get started</p>
          <button className="shop-button" onClick={() => navigate("/products")}>
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="cart-wrapper">

          {/* Header */}
          <div className="cart-header">
            <h1 className="cart-title">Your Cart</h1>
            <span className="cart-count">
              {cart.items.length} {cart.items.length === 1 ? "item" : "items"}
            </span>
          </div>

          {/* Items */}
          <div className="cart-items">
            {cart.items.map((item, index) => (
              <div className="cart-card" key={index}>

                {item.productId?.image ? (
                  <img
                    src={item.productId.image}
                    alt={item.productId.name}
                    className="cart-image"
                  />
                ) : (
                  <div className="cart-image-placeholder">
                    <CarIcon />
                  </div>
                )}

                <div className="cart-details">
                  <h2>{item.productId?.name}</h2>
                  <p className="cart-unit-price">
                    ₹{Number(item.productId?.price).toLocaleString("en-IN")} each
                  </p>

                  <div className="quantity-controls">
                    <button
                      className="quantity-btn"
                      onClick={() => updateQuantity(item.productId._id, "decrease")}
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="quantity">{item.quantity}</span>
                    <button
                      className="quantity-btn"
                      onClick={() => updateQuantity(item.productId._id, "increase")}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  <p className="cart-item-total">
                    ₹{Number(item.quantity * (item.productId?.price || 0)).toLocaleString("en-IN")}
                  </p>
                </div>

                <button
                  className="remove-btn"
                  onClick={() => removeFromCart(item.productId?._id)}
                  aria-label="Remove item"
                >
                  <CloseIcon />
                </button>

              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="cart-summary">
            <p className="summary-title">Order Summary</p>

            <div className="summary-row">
              <span>Subtotal ({cart.items.length} items)</span>
              <span>₹{Number(totalAmount).toLocaleString("en-IN")}</span>
            </div>
            <div className="summary-row">
              <span>RC Transfer</span>
              <span style={{ color: "#4caf8a" }}>Free</span>
            </div>
            <div className="summary-row">
              <span>Delivery</span>
              <span style={{ color: "#4caf8a" }}>Free</span>
            </div>

            <div className="summary-divider" />

            <div className="summary-total-row">
              <span className="summary-total-label">Total</span>
              <span className="summary-total-amount">
                ₹{Number(totalAmount).toLocaleString("en-IN")}
              </span>
            </div>

            <button
              className="order-btn"
              onClick={() => navigate(`/checkout/${cart._id}`)}
            >
              Place Order
              <ArrowIcon />
            </button>

            <p className="summary-note">
              <ShieldIcon />
              Secure checkout · Free RC transfer assistance
            </p>
          </div>

        </div>
      )}
    </div>
  );
}

/* ── Icons ───────────────────────────────────── */
function CartIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}

function CarIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 17H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h13l4 4v4a2 2 0 0 1-2 2h-2" />
      <circle cx="7.5" cy="17.5" r="2.5" />
      <circle cx="17.5" cy="17.5" r="2.5" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

export default Cart;
