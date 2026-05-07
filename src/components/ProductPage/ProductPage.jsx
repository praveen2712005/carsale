import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "../../axios/axios";
import "./ProductPage.css";
import Navbar from "../Navbar/Navbar";

function ProductPage() {
  const [cars, setCars] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function carshere() {
      try {
        const response = await Axios.get("/viewproduct");
        console.log(response.data, "response data");
        setCars(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }
    carshere();
  }, []);

  return (
    <>
      <Navbar />
      <div>
       
        <div className="product-list">
          {cars.map((car) => (
            <div key={car._id} className="product-card" onClick={() => navigate(`/product/${car._id}`)}>
              <h2>{car.name}</h2>
             
              <img className="carimg" src={car.image} alt="" />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default ProductPage;
