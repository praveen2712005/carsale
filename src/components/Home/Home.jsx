import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import Navbar from "../Navbar/Navbar"
import Footer from "../Footer/Footer";

function Home() {
  const navigate = useNavigate();
  const categories = [
    { name: "Sedan", icon: "🚗", description: "Comfortable family cars" },
    { name: "SUV", icon: "🚙", description: "Powerful off-road vehicles" },
    { name: "Sports Cars", icon: "🏎️", description: "High-performance speed machines" },
    { name: "Electric Cars", icon: "🔋", description: "Eco-friendly electric vehicles" },
    { name: "Hatchback", icon: "✨", description: "Premium comfort and style" },
    { name: "Pickup Trucks", icon: "🛻", description: "Heavy duty performance" },
  ];

  const handleclick=(categoryName)=>{
    navigate(`/category/${categoryName}`);
  }

  return (
     
    <>
     <Navbar />
    <div className="home">
      <section className="banner">
        <div className="banner-content">
          <h1>PowerUp Car Store</h1>
          <p>Your Dream Car Awaits You</p>
          <button className="cta-button" onClick={() => navigate("/products")}>Explore Cars</button>
        </div>
      </section>

      <section className="categories-section">
        <h2>Browse by Category</h2>
        <div className="categories">
          {categories.map((cat) => (
            <div key={cat.name} className="category-card" onClick={() => handleclick(cat.name)}>
              <span className="category-icon">{cat.icon}</span>
              <h3 className="category-name">{cat.name}</h3>
              
            </div>
          ))}
        </div>

      </section>

    
    </div>

   
    </>
    
  );
}

export default Home;
