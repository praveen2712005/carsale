import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Axios from "../../axios/axios";
import "./MyOrders.css";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    fetchOrders();
    if (location.state?.orderPlaced) {
      setTimeout(() => showToast("Order placed successfully!"), 200);
    }
  }, [location.state]);

  const fetchOrders = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("userdata") || "null");
      const userId = userData?._id;
      if (!userId) {
        navigate("/login");
        return;
      }
      const response = await Axios.get(`/myorders/${userId}`);
      setOrders(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      await Axios.put(`/orders/${orderId}/cancel`);
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status: "Cancelled" } : order
        )
      );
      showToast("Order cancelled successfully.");
    } catch (error) {
      console.error(error);
      showToast("Failed to cancel order.", "error");
    }
  };

  const formatCurrency = (amount) => {
    const n = typeof amount === "string" ? parseFloat(amount) : amount;
    if (!n && n !== 0) return "0";
    return isNaN(n) ? "0" : n.toLocaleString("en-IN");
  };

  const statusConfig = {
    booked:    { label: "Booked",    cls: "status--confirmed" },
    confirmed: { label: "Confirmed", cls: "status--confirmed" },
    shipped:   { label: "Shipped",   cls: "status--shipped"   },
    delivered: { label: "Delivered", cls: "status--delivered" },
    cancelled: { label: "Cancelled", cls: "status--cancelled" },
  };

  const getStatus = (status) => {
    const key = status?.toLowerCase();
    return statusConfig[key] || { label: "Pending", cls: "status--pending" };
  };

  if (loading) {
    return (
      <div className="mo-page">
        <Navbar />
        <div className="mo-loading">
          <div className="mo-spinner" />
          <p>Loading your orders…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mo-page">
      <Navbar />

      {toast && (
        <div className={`mo-toast mo-toast--${toast.type}`} role="alert">
          {toast.type === "success" ? <CheckIcon /> : <AlertIcon />}
          {toast.msg}
        </div>
      )}

      <div className="mo-wrapper">
        <div className="mo-header">
          <h1 className="mo-title">My Orders</h1>
          {orders.length > 0 && (
            <span className="mo-count">{orders.length} {orders.length === 1 ? "order" : "orders"}</span>
          )}
        </div>

        {orders.length === 0 ? (
          <div className="mo-empty">
            <div className="mo-empty-icon"><BoxIcon /></div>
            <h2>No orders yet</h2>
            <p>Your orders will appear here once you make a purchase.</p>
            <button className="mo-browse-btn" onClick={() => navigate("/products")}>
              Browse Cars
            </button>
          </div>
        ) : (
          <div className="mo-list">
            {orders.map((order, index) => {
              const { label, cls } = getStatus(order.status);
              const isFinal =
                order.status?.toLowerCase() === "delivered" ||
                order.status?.toLowerCase() === "cancelled";

              return (
                <div key={order._id} className="mo-card">

                  {/* Card header */}
                  <div className="mo-card-header">
                    <div className="mo-card-meta">
                      <span className="mo-order-id">
                        Order #{order._id?.slice(-8) || index + 1}
                      </span>
                      <span className="mo-order-date">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric", month: "short", year: "numeric",
                        })}
                      </span>
                    </div>
                    <span className={`mo-status ${cls}`}>{label}</span>
                  </div>

                  {/* Items */}
                  <div className="mo-items">
                    {(order.items || []).map((item, idx) => {
                      const price = item.price || item.productId?.price || 0;
                      const name  = item.productName || item.productId?.name || "Product";
                      const image = item.productImage || item.productId?.image;
                      const qty   = item.quantity || 1;

                      return (
                        <div key={idx} className="mo-item">
                          {image ? (
                            <img src={image} alt={name} className="mo-item-img" />
                          ) : (
                            <div className="mo-item-img-placeholder"><CarIcon /></div>
                          )}
                          <div className="mo-item-details">
                            <h4>{name}</h4>
                            <p className="mo-item-unit">₹{formatCurrency(price)} · Qty {qty}</p>
                          </div>
                          <div className="mo-item-subtotal">
                            ₹{formatCurrency(price * qty)}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Card footer */}
                  <div className="mo-card-footer">
                    <div className="mo-total">
                      <span className="mo-total-label">Total</span>
                      <span className="mo-total-amount">
                        ₹{formatCurrency(order.totalAmount)}
                      </span>
                    </div>
                    <button
                      className="mo-cancel-btn"
                      onClick={() => handleCancelOrder(order._id)}
                      disabled={isFinal}
                    >
                      {isFinal ? "Order " + label : "Cancel Order"}
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Icons ───────────────────────────────────── */
function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
function AlertIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}
function BoxIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );
}
function CarIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 17H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h13l4 4v4a2 2 0 0 1-2 2h-2" />
      <circle cx="7.5" cy="17.5" r="2.5" /><circle cx="17.5" cy="17.5" r="2.5" />
    </svg>
  );
}

export default MyOrders;
