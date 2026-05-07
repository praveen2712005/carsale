import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; 
import Navbar from "../Navbar/Navbar";
import Axios from "../../axios/axios";
import "./Checkout.css";

function Checkout() {
  const { id } = useParams();
  const navigate = useNavigate(); 
  const [cart, setCart] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [updatingItem, setUpdatingItem] = useState(null);

  useEffect(() => {
    async function fetchProduct() {
      const userData = JSON.parse(localStorage.getItem("userdata") || "null");
      const userId = userData?._id;

      if (!userId) {
        alert("Please login first");
        navigate("/login");
        return;
      }

      try {
        const res = await Axios.get(`/checkout/${userId}`);
        console.log("Cart data:", res.data);
        setCart(res.data);
      } catch (error) {
        console.error("Error fetching product:", error);
        alert("Failed to load cart");
      }
    }

    fetchProduct();
  }, [id, navigate]);

  // Increase quantity
  const increaseQuantity = async (index, productId, currentQuantity) => {
    setUpdatingItem(index);
    
    try {
      const userData = JSON.parse(localStorage.getItem("userdata") || "null");
      const userId = userData?._id;

      // Call your backend endpoint with action "increase"
      const response = await Axios.put("/updatequantity", {
        userId: userId,
        productId: productId,
        action: "increase"
      });

      // Update local cart state with the response
      setCart(response.data);
      console.log("Quantity increased:", response.data);

    } catch (error) {
      console.error("Error increasing quantity:", error);
      alert("Failed to update quantity");
    } finally {
      setUpdatingItem(null);
    }
  };

  // Decrease quantity
  const decreaseQuantity = async (index, productId, currentQuantity) => {
    if (currentQuantity <= 1) {
      // If quantity is 1, ask if user wants to remove the item
      if (window.confirm("Remove this item from cart?")) {
        await removeItem(index, productId);
      }
      return;
    }
    
    setUpdatingItem(index);
    
    try {
      const userData = JSON.parse(localStorage.getItem("userdata") || "null");
      const userId = userData?._id;

      // Call your backend endpoint with action "decrease"
      const response = await Axios.put("/updatequantity", {
        userId: userId,
        productId: productId,
        action: "decrease"
      });

      // Update local cart state with the response
      setCart(response.data);
      console.log("Quantity decreased:", response.data);

    } catch (error) {
      console.error("Error decreasing quantity:", error);
      alert("Failed to update quantity");
    } finally {
      setUpdatingItem(null);
    }
  };

  // Remove item from cart
  const removeItem = async (index, productId) => {
    if (!window.confirm("Remove this item from cart?")) return;
    
    setUpdatingItem(index);
    
    try {
      const userData = JSON.parse(localStorage.getItem("userdata") || "null");
      const userId = userData?._id;

      // Call your backend delete endpoint
      const response = await Axios.delete("/removefromcart", {
        data: { 
          userId: userId, 
          productId: productId 
        }
      });

      // Update local cart state
      setCart(response.data.cart);
      console.log("Item removed:", response.data);

    } catch (error) {
      console.error("Error removing item:", error);
      alert("Failed to remove item");
    } finally {
      setUpdatingItem(null);
    }
  };

  // Calculate total amount
  const calculateTotal = () => {
    if (!cart?.items) return 0;
    return cart.items.reduce(
      (acc, item) => acc + (item.productId.price * item.quantity),
      0
    );
  };

  const handleBooking = async () => {
    if (isProcessing) return;
    
    try {
      setIsProcessing(true);
      const userData = JSON.parse(localStorage.getItem("userdata") || "null");
      const userId = userData?._id;

      if (!userId) {
        alert("Please login first");
        navigate("/login");
        return;
      }

      if (!cart?.items || cart.items.length === 0) {
        alert("Your cart is empty");
        return;
      }

      const totalAmount = calculateTotal();

      // Prepare items for order (only productId and quantity)
      const orderItems = cart.items.map(item => ({
        productId: item.productId._id,
        quantity: item.quantity
      }));

      // Send to backend placeorder endpoint
      const response = await Axios.post("/placeorder", {
        userId: userId,
        items: orderItems,
        totalAmount: totalAmount
      });

      console.log("Order placed:", response.data);

      // Store order in localStorage for MyOrders page
      const existingOrders = JSON.parse(localStorage.getItem("myOrders") || "[]");
      const newOrder = {
        orderId: response.data.order._id,
        userId: userId,
        items: cart.items.map(item => ({
          productId: item.productId._id,
          productName: item.productId.name,
          productImage: item.productId.image,
          price: item.productId.price,
          quantity: item.quantity
        })),
        totalAmount: totalAmount,
        status: response.data.order.status,
        orderDate: new Date().toLocaleString()
      };
      existingOrders.unshift(newOrder);
      localStorage.setItem("myOrders", JSON.stringify(existingOrders));

      alert("Your order is Booked ✅");

      // Clear cart state
      setCart({ items: [] });
      
      // Navigate to MyOrders
      navigate("/myorders", { 
        state: { 
          newOrder: newOrder,
          orderPlaced: true 
        } 
      });

    } catch (error) {
      console.error("Order error:", error);
      alert("Failed to place order: " + (error.response?.data?.message || error.message));
    } finally {
      setIsProcessing(false);
    }
  };

  if (!cart) {
    return (
      <>
        <Navbar />
        <div className="loading-container">
          <div className="spinner"></div>
          <h2>Loading your cart...</h2>
        </div>
      </>
    );
  }

  if (!cart.items || cart.items.length === 0) {
    return (
      <>
        <Navbar />
        <div className="empty-checkout">
          <i className="fas fa-shopping-cart"></i>
          <h2>Your cart is empty</h2>
          <p>Add some cars to your cart before checking out</p>
          <button onClick={() => navigate("/products")} className="shop-now-btn">
            Shop Now
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="checkout-container">
        <h2>
          <i className="fas fa-shopping-bag"></i> 
          Checkout
        </h2>
        
        <div className="checkout-summary">
          <h3>Order Summary ({cart.items.length} {cart.items.length === 1 ? 'item' : 'items'})</h3>
          
          <div className="order-items">
            {cart.items.map((item, index) => (
              <div className="product-details" key={item.productId._id}>
                <img 
                  src={item.productId.image} 
                  alt={item.productId.name}
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/120x120?text=Car";
                  }}
                />
                
                <div className="product-info">
                  <h3>{item.productId.name}</h3>
                  <p className="product-price">₹{item.productId.price.toLocaleString()}</p>
                  
                  <div className="quantity-controls">
                    <button 
                      onClick={() => decreaseQuantity(index, item.productId._id, item.quantity)}
                      disabled={updatingItem === index}
                      className="qty-btn"
                    >
                      <i className="fas fa-minus"></i>
                    </button>
                    
                    <span className="quantity-value">
                      {updatingItem === index ? (
                        <i className="fas fa-spinner fa-spin"></i>
                      ) : (
                        item.quantity
                      )}
                    </span>
                    
                    <button 
                      onClick={() => increaseQuantity(index, item.productId._id, item.quantity)}
                      disabled={updatingItem === index}
                      className="qty-btn"
                    >
                      <i className="fas fa-plus"></i>
                    </button>
                  </div>
                </div>
                
                <div className="item-total">
                  <div className="total-price">
                    ₹{(item.productId.price * item.quantity).toLocaleString()}
                  </div>
                  <button 
                    onClick={() => removeItem(index, item.productId._id)}
                    className="remove-btn"
                    disabled={updatingItem === index}
                  >
                    <i className="fas fa-trash-alt"></i> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="order-total">
          <div className="total-details">
            <h3>Total Amount:</h3>
            <p className="total-breakdown">
              Subtotal: ₹{calculateTotal().toLocaleString()}
            </p>
            <p className="total-breakdown delivery">
              Delivery: <span className="free">FREE</span>
            </p>
          </div>
          <div className="grand-total">
            ₹{calculateTotal().toLocaleString()}
          </div>
        </div>

        <button 
          onClick={handleBooking} 
          className="place-order-btn"
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <i className="fas fa-spinner fa-spin"></i> Processing...
            </>
          ) : (
            <>
              <i className="fas fa-check-circle"></i> Confirm Booking
            </>
          )}
        </button>
      </div>
    </>
  );
}

export default Checkout;