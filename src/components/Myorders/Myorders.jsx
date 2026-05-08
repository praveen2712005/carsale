import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Axios from "../../axios/axios";
import "./MyOrders.css";

function MyOrders() {

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {

    fetchOrders();

    if (location.state?.orderPlaced) {

      setTimeout(() => {
        alert("🎉 Order placed successfully!");
      }, 100);

    }

  }, [location.state]);

  // FETCH ORDERS
  const fetchOrders = async () => {

    try {

      const userData = JSON.parse(
        localStorage.getItem("userdata") || "null"
      );

      const userId = userData?._id;

      if (!userId) {

        alert("Please login first");

        navigate("/login");

        return;
      }

      const response = await Axios.get(
        `/myorders/${userId}`
      );

      console.log(response.data);
       
      setOrders(response.data);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }
  };

  // STATUS BADGE
  const getStatusBadge = (status) => {

    switch (status?.toLowerCase()) {

      case "booked":
        return (
          <span className="status confirmed">
            ✅ Booked
          </span>
        );

      case "confirmed":
        return (
          <span className="status confirmed">
            ✅ Confirmed
          </span>
        );

      case "shipped":
        return (
          <span className="status shipped">
            🚚 Shipped
          </span>
        );

      case "delivered":
        return (
          <span className="status delivered">
            🎉 Delivered
          </span>
        );

      case "cancelled":
        return (
          <span className="status cancelled">
            ❌ Cancelled
          </span>
        );

      default:
        return (
          <span className="status pending">
            ⏳ Pending
          </span>
        );
    }
  };

  // FORMAT PRICE
  const formatCurrency = (amount) => {

    if (!amount && amount !== 0) return "0";

    const numAmount =
      typeof amount === "string"
        ? parseFloat(amount)
        : amount;

    if (isNaN(numAmount)) return "0";

    return numAmount.toLocaleString("en-IN");
  };

  // CANCEL ORDER
 const handleCancelOrder = async (orderId) => {

  const confirmCancel = window.confirm(
    "Are you sure you want to cancel this order?"
  );

  if (!confirmCancel) return;

  try {

    // API CALL
    const response = await Axios.put(
      `/orders/${orderId}/cancel`
    );

    console.log(response.data);

    // UPDATE UI
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order._id === orderId
          ? {
              ...order,
              status: "Cancelled"
            }
          : order
      )
    );

    alert("Order cancelled successfully!");

  } catch (error) {

    console.log(error);

    alert("Failed to cancel order");

  }
};

  // LOADING
  if (loading) {

    return (
      <>
        <Navbar />

        <div className="orders-loading">

          <div className="spinner"></div>

          <h2>Loading your orders...</h2>

        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="myorders-container">

        <h2 className="orders-title">
        </h2>

        {orders.length === 0 ? (

          <div className="no-orders">

            <h3>No orders yet</h3>

            <p>
              Start shopping to see your orders here
            </p>

            <button
              onClick={() => navigate("/products")}
              className="browse-btn"
            >
              Browse Cars
            </button>

          </div>

        ) : (

          <div className="orders-list">

            {orders.map((order, index) => (

              <div
                key={order._id}
                className="order-card"
              >

                {/* HEADER */}
                <div className="order-header">

                  <div className="order-info">

                    <span className="order-id">

                      Order #

                      {order._id?.slice(-8) || index + 1}

                    </span>

                    <span className="order-date">

                      {new Date(
                        order.createdAt
                      ).toLocaleString()}

                    </span>

                  </div>

                  {getStatusBadge(order.status)}

                </div>

                {/* ITEMS */}
                <div className="order-items">

                  {(order.items || []).map((item, idx) => {

                    const itemPrice =
                      item.price ||
                      item.productId?.price ||
                      0;

                    const itemName =
                      item.productName ||
                      item.productId?.name ||
                      "Product";

                    const itemImage =
                      item.productImage ||
                      item.productId?.image;

                    return (

                      <div
                        key={idx}
                        className="order-item"
                      >

                        <img
                          src={itemImage}
                          alt={itemName}
                        />

                        <div className="item-details">

                          <h4>{itemName}</h4>

                          <p className="item-price">

                            ₹{formatCurrency(itemPrice)}

                          </p>

                          <p className="item-quantity">

                            Quantity:
                            {item.quantity || 1}

                          </p>

                        </div>

                        <div className="item-subtotal">

                          ₹
                          {formatCurrency(
                            itemPrice *
                              (item.quantity || 1)
                          )}

                        </div>

                      </div>
                    );
                  })}
                </div>

                {/* FOOTER */}
                <div className="order-footer">

                  <div className="total-amount">

                    <strong>Total Amount:</strong>

                    <span>

                      ₹
                      {formatCurrency(
                        order.totalAmount
                      )}

                    </span>

                  </div>

                  <button
                    className="cancel-order-btn"
                    onClick={() =>
                      handleCancelOrder(order._id)
                    }
                    disabled={
                      order.status?.toLowerCase() ===
                        "delivered" ||

                      order.status?.toLowerCase() ===
                        "cancelled"
                    }
                  >
                    Cancel Order
                  </button>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default MyOrders;