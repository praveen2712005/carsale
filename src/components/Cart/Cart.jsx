import { useEffect, useState } from "react";
import "./Cart.css";
import { useNavigate } from "react-router-dom";
import Axios from "../../axios/axios";
import Navbar from "../Navbar/Navbar";

function Cart() {
  const [cart, setCart] = useState(null);
  const navigate = useNavigate();

  const userId = JSON.parse(localStorage.getItem("userdata"))?._id;
   
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
      console.log("Cart data:", response.data);
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
      data: { userId, productId }
    });

    
    setCart(prev => ({
      ...prev,
      items: prev.items.filter(
        item => item.productId._id !== productId
      )
    }));

  } catch (error) {
    console.error("Remove error:", error);
    alert("Failed to remove item ❌");
  }
};
const updateQuantity = async (productId, action) => {
  try {
    const userData = JSON.parse(localStorage.getItem("userdata") || "null");
    const userId = userData?._id;

    const res = await Axios.put("/updatequantity", {
      userId,
      productId,
      action
    });
    setCart(res.data);

  } catch (error) {
    console.error("Quantity update error:", error);
  }
};

  return (
    <>
      <Navbar />
      <h2>My Cart</h2>

      {/* ✅ FIXED CONDITION */}
      {!cart || !cart.items || cart.items.length === 0 ? (
        <div className="empty-cart">
          <h2>Your Cart is Empty 🛒</h2>
          <p>Add items to get started</p>
          <button
            className="shop-button"
            onClick={() => navigate("/products")}
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="cart-container">
          {cart.items.map((item, index) => (
            <div className="cart-card" key={index}>
              
              {/* Product Image */}
              <img
                src={item.productId?.image}
                alt={item.productId?.name}
                className="cart-image"
              />

              {/* Details */}
              <div className="cart-details">
                <h2>{item.productId?.name}</h2>
                <p>₹{item.productId?.price}</p>

                <div className="quantity-controls">
                    <button
                        className="quantity-btn"
                        onClick={() => updateQuantity(item.productId._id, "decrease")}
                    >
                        -
                    </button>

                    <span className="quantity">{item.quantity}</span>

                    <button
                        className="quantity-btn"
                        onClick={() => updateQuantity(item.productId._id, "increase")}
                    >
                        +
                    </button>
                    </div>

                <p className="item-total">
                  Total: ₹
                  {item.quantity * (item.productId?.price || 0)}
                </p>
              </div>

              {/* Remove Button */}
                <button
                    className="remove-btn"
                    onClick={() => removeFromCart(item.productId?._id)}>Remove </button>
                
            </div>
          ))}
          <button 
                    className="remove-btn"
                    onClick={() => navigate(`/checkout/${cart.productId?._id}`)}>
                         Order Now
                      </button>
        </div>
      )}
    </>
  );
}

export default Cart;