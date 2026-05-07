import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Axios from "../../axios/axios";
import Navbar from "../Navbar/Navbar";
import "./ProductDetail.css";

function ProductDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("userdata"));

  const addToCart = async () => {
    try {
      if (!user?._id) {
        alert("Please login first");
        navigate("/login");
        return;
      }

      if (!product?._id) {
        alert("Product not loaded yet");
        return;
      }
      setLoading(true);

      const res = await Axios.post("/addtocart", {
        userId: user._id,
        productId: product._id
      });
      console.log(res, "add to cart response");
      navigate("/Cart");

    } catch (error) {
      console.error("Add to cart error:", error);
      alert("Failed to add to cart ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await Axios.get(`/viewproduct/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchProduct();
  }, [id]);

  return (
    <>
      <Navbar />
      <div className="product-detail">
        {product.image && (
          <img src={product.image} alt={product.name} />
        )}

        <div className="product-info">
          <h1>{product.name}</h1>
          <p>{product.description}</p>
          <h3>Price: ₹{product.price}</h3>

          <button
            className="enquire-button"
            onClick={addToCart}
            disabled={loading}
          >
            {loading ? "Adding..." : "Add to Cart"}
          </button>
        </div>
      </div>
    </>
  );
}

export default ProductDetail;