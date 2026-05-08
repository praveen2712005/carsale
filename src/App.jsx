import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import Home from "./components/Home/Home";
import ProductPage from "./components/ProductPage/ProductPage";
import ProductDetail from "./components/ProductDetail/ProductDetail";
import Cart from "./components/Cart/Cart";
import Checkout from "./components/Checkout/Checkout";
import MyOrders from "./components/Myorders/Myorders";
import Profile from "./components/Profile/Profile";
import Footer from "./components/Footer/Footer";
import Category from "./components/Category/Category";
import Settings from "./components/Settings/Settings";
import "./body.css";


function Layout() {
  const location = useLocation();

  return (
    <>
     
      <Routes>
        <Route path="/register" element={<Register/>}/>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/products" element={<ProductPage />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout/:id" element={<Checkout />} />
        <Route path="/myorders" element={<MyOrders />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/category/:categoryName" element={<Category />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>

    
      {location.pathname === "/Home" && <Footer />}
    </>
  );
}

function App() {
  
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;




