import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import Navbar from "../Navbar/Navbar"
import Footer from "../Footer/Footer";

function Home() {
  const navigate = useNavigate();
  const categories = [
    { name: "Sedan", image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=600&q=80", description: "Comfortable family cars" },
    { name: "SUV", image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80", description: "Powerful off-road vehicles" },
    { name: "Sports Cars", image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80", description: "High-performance speed machines" },
    { name: "Electric Cars", image: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=600&q=80", description: "Eco-friendly electric vehicles" },
    { name: "Hatchback", image: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=600&q=80", description: "Premium comfort and style" },
    { name: "Pickup Trucks", image: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=600&q=80", description: "Heavy duty performance" },
  ];

  const brandLogos = [
    { 
      name: "Toyota", 
      render: () => (
        <svg viewBox="0 0 100 60" fill="none" stroke="currentColor" strokeWidth="3" className="brand-svg">
          <ellipse cx="50" cy="30" rx="45" ry="25" />
          <ellipse cx="50" cy="30" rx="14" ry="25" />
          <ellipse cx="50" cy="18" rx="32" ry="11" />
        </svg>
      )
    },
    { 
      name: "BMW", 
      render: () => (
        <svg viewBox="0 0 60 60" fill="none" stroke="currentColor" strokeWidth="2.5" className="brand-svg">
          <circle cx="30" cy="30" r="28" />
          <circle cx="30" cy="30" r="20" fill="currentColor" fillOpacity="0.15" />
          <line x1="30" y1="10" x2="30" y2="50" />
          <line x1="10" y1="30" x2="50" y2="30" />
          <path d="M 30,30 L 30,10 A 20,20 0 0,1 50,30 Z" fill="currentColor" fillOpacity="0.4" stroke="none" />
          <path d="M 30,30 L 30,50 A 20,20 0 0,1 10,30 Z" fill="currentColor" fillOpacity="0.4" stroke="none" />
        </svg>
      )
    },
    { 
      name: "Ford", 
      render: () => (
        <svg viewBox="0 0 100 50" fill="none" stroke="currentColor" strokeWidth="3" className="brand-svg">
          <ellipse cx="50" cy="25" rx="45" ry="20" />
          <ellipse cx="50" cy="25" rx="40" ry="16" />
          <text x="50" y="32" fontSize="18" fontWeight="bold" fontFamily="Georgia, serif" fontStyle="italic" textAnchor="middle" fill="currentColor" stroke="none">Ford</text>
        </svg>
      )
    },
    { 
      name: "Tesla", 
      render: () => (
        <svg viewBox="0 0 60 60" fill="currentColor" className="brand-svg">
          <path d="M 10,10 C 25,18 35,18 50,10 C 48,15 45,15 42,16 C 36,25 34,35 34,50 L 26,50 C 26,35 24,25 18,16 C 15,15 12,15 10,10 Z" />
          <path d="M 10,5 C 25,12 35,12 50,5 C 50,5 30,8 10,5 Z" />
        </svg>
      )
    },
    { 
      name: "Mercedes", 
      render: () => (
        <svg viewBox="0 0 60 60" fill="none" stroke="currentColor" strokeWidth="2.5" className="brand-svg">
          <circle cx="30" cy="30" r="27" />
          <path d="M 30,30 L 30,5 M 30,30 L 8,42 M 30,30 L 52,42" strokeWidth="3" />
        </svg>
      )
    },
    { 
      name: "Audi", 
      render: () => (
        <svg viewBox="0 0 100 40" fill="none" stroke="currentColor" strokeWidth="3" className="brand-svg">
          <circle cx="20" cy="20" r="14" />
          <circle cx="40" cy="20" r="14" />
          <circle cx="60" cy="20" r="14" />
          <circle cx="80" cy="20" r="14" />
        </svg>
      )
    },
    { 
      name: "Porsche", 
      render: () => (
        <svg viewBox="0 0 50 60" fill="none" stroke="currentColor" strokeWidth="2.5" className="brand-svg">
          <path d="M 5,5 L 45,5 L 45,30 C 45,45 30,55 25,58 C 20,55 5,45 5,30 Z" />
          <line x1="25" y1="5" x2="25" y2="58" />
          <line x1="5" y1="30" x2="45" y2="30" />
          <path d="M 12,12 H 18 M 12,18 H 18 M 12,24 H 18" strokeWidth="2" />
          <path d="M 32,12 H 38 M 32,18 H 38 M 32,24 H 38" strokeWidth="2" />
          <rect x="21" y="26" width="8" height="10" rx="1" fill="currentColor" stroke="none" />
        </svg>
      )
    },
    { 
      name: "Honda", 
      render: () => (
        <svg viewBox="0 0 50 50" fill="none" stroke="currentColor" strokeWidth="3" className="brand-svg">
          <rect x="4" y="4" width="42" height="42" rx="8" />
          <path d="M 14,12 V 38 M 36,12 V 38 M 14,25 H 36" strokeLinecap="round" />
        </svg>
      )
    },
  ];

  const handleclick = (categoryName) => {
    navigate(`/category/${categoryName}`);
  }

  return (

    <>
      <Navbar />
      <div className="home">
        <div className="bg-glow bg-glow-1"></div>
        <div className="bg-glow bg-glow-2"></div>

        <section className="banner">
          <div className="banner-content">
            <h1> Car 4 Sale</h1>
            <p>Wheels to your dream  </p>
            <button className="cta-button" onClick={() => navigate("/products")}>Explore Cars</button>
          </div>
        </section>

        <section className="categories-section">
          <h2>Browse by Category</h2>
          <div className="categories">
            {categories.map((cat, index) => (
              <div
                key={cat.name}
                className="category-card"
                style={{
                  backgroundImage: `url(${cat.image})`,
                  animationDelay: `${0.1 + index * 0.1}s`
                }}
                onClick={() => handleclick(cat.name)}
              >
                <div className="category-overlay"></div>
                <h3 className="category-name">{cat.name}</h3>
              </div>
            ))}
          </div>
        </section>

        <section className="brands-section">
          <h2>Popular Brands</h2>
          <div className="marquee-container">
            <div className="marquee-content">
              {brandLogos.map((logo, index) => (
                <div key={index} className="brand-logo-card">
                  <div className="brand-logo-icon">{logo.render()}</div>
                  <span>{logo.name}</span>
                </div>
              ))}
            </div>
            <div className="marquee-content" aria-hidden="true">
              {brandLogos.map((logo, index) => (
                <div key={`dup-${index}`} className="brand-logo-card">
                  <div className="brand-logo-icon">{logo.render()}</div>
                  <span>{logo.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>

      <Footer />
    </>

  );
}

export default Home;
