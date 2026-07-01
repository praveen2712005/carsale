import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "../../axios/axios";
import "./ProductPage.css";
import Navbar from "../Navbar/Navbar";

function ProductPage() {
  const [cars, setCars] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCars() {
      try {
        const response = await Axios.get("/viewproduct");
        setCars(response.data);
      } catch (error) {
        console.log(error);
      }
    }

    fetchCars();
  }, []);

  return (
    <>
      <Navbar />

      <div className="product-page">

        <div className="heading-section">
          <h1>Our Collection</h1>
          <p>Explore our range of premium, high-performance vehicles</p>
        </div>

        <div className="product-list">
          {cars.map((car) => (
            <div
              key={car._id}
              className="product-card"
              onClick={() => navigate(`/product/${car._id}`)}
            >
              <div className="image-container">
                <img className="carimg" src={car.image} alt={car.name} />
              </div>

              <div className="card-content">
                <h2>{car.name}</h2>

                <button className="view-btn">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </>
  );
}

export default ProductPage;