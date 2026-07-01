import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Axios from "../../axios/axios";
import Navbar from "../Navbar/Navbar";
import "./ProductDetail.css";





// Hash helper to choose elements from pools
function getFeatureHashCode(str) {
  let hash = 0;
  if (!str) return hash;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

// Curated pools of features for different types of cars
const FEATURES_POOL = {
  electric: [
    { icon: "🔋", label: "Lithium Core", desc: "High density lithium battery pack" },
    { icon: "⚡", label: "Dual Motor AWD", desc: "Instantaneous torque distribution" },
    { icon: "🌱", label: "Zero Emission", desc: "Eco-friendly silent travel signature" },
    { icon: "📡", label: "Autopilot Pilot", desc: "Autonomous driving capability" },
    { icon: "🎵", label: "Studio Acoustics", desc: "Premium active noise cancelling audio" },
    { icon: "🧊", label: "Pre-Cooling", desc: "Smart cabin thermal preconditioning" },
    { icon: "🔌", label: "Supercharging", desc: "10% to 80% charge in 15 minutes" },
    { icon: "🖥️", label: "Infotainment Hub", desc: "Over-the-air updates & giant console" },
    { icon: "🚀", label: "Ludicrous Mode", desc: "Unmatched electric launch acceleration" },
    { icon: "💡", label: "Matrix LED", desc: "Intelligent automatic light path projection" }
  ],
  sports: [
    { icon: "🏁", label: "Twin-Turbo V8", desc: "Forced induction high RPM engine" },
    { icon: "🏎️", label: "Launch Control", desc: "Optimised traction off-the-line start" },
    { icon: "⚙️", label: "Active Spoiler", desc: "Speed-sensitive aerodynamic downforce" },
    { icon: "🛡️", label: "Brembo Carbon", desc: "Reinforced high-performance brake discs" },
    { icon: "🎵", label: "Valved Exhaust", desc: "Adjustable sporty engine soundtrack" },
    { icon: "🛋️", label: "Carbon Buckets", desc: "Track-ready Alcantara sport seats" },
    { icon: "📈", label: "Track Telemetry", desc: "Real-time lap timing & G-force data" },
    { icon: "🏁", label: "R-Tuning", desc: "Stiffened race-tuned suspension setup" },
    { icon: "🏎️", label: "Paddle Shifters", desc: "Lightning fast dual-clutch transmission" },
    { icon: "🎯", label: "Torque Vectoring", desc: "Precision cornering traction controls" }
  ],
  offroad: [
    { icon: "⛰️", label: "Terrain Select", desc: "Active mud, sand, rock terrain modes" },
    { icon: "🏋️", label: "Heavy Towing", desc: "Reinforced chassis towing integration" },
    { icon: "🛡️", label: "Air Suspension", desc: "Height-adjustable ground clearance" },
    { icon: "📦", label: "Cargo Utility", desc: "Weatherproof high volume cargo bay" },
    { icon: "📡", label: "Off-Grid GPS", desc: "Satellite navigation without signal" },
    { icon: "🧊", label: "All-Weather Pack", desc: "Heated & ventilated elements" },
    { icon: "🛞", label: "All-Terrain Tires", desc: "Deep tread high endurance tires" },
    { icon: "🪵", label: "Differential Lock", desc: "Mechanical locking front/rear axles" },
    { icon: "💡", label: "Roof Lightbar", desc: "High intensity trail lighting array" },
    { icon: "⚓", label: "Recovery Winch", desc: "Heavy duty integrated front winch pull" }
  ],
  standard: [
    { icon: "🛋️", label: "Plush Leather", desc: "Ergonomically stitched premium cabin" },
    { icon: "🌿", label: "Eco-Drive Mode", desc: "Intelligent fuel efficiency profiling" },
    { icon: "🛡️", label: "ADAS Safety Suite", desc: "Adaptive Cruise & Lane-Keep Assist" },
    { icon: "🎵", label: "Hi-Fi Sound", desc: "Multi-channel surround audio system" },
    { icon: "📡", label: "Smart Link", desc: "Wireless Apple CarPlay & Android Auto" },
    { icon: "🧊", label: "Dual Zone Climate", desc: "Automatic driver/passenger temp zones" },
    { icon: "🔆", label: "Panoramic Sunroof", desc: "Slide-to-open wide panoramic view" },
    { icon: "🔑", label: "Smart Access", desc: "Hands-free proximity lock & push start" },
    { icon: "💡", label: "Adaptive LEDs", desc: "Self-leveling automatic headlights" },
    { icon: "🚗", label: "Ride Comfort", desc: "Multi-link smooth absorbsion system" }
  ]
};

function getCarFeatures(category, productId) {
  const cleanCat = (category || "").toLowerCase();
  let pool = FEATURES_POOL.standard;
  if (cleanCat.includes("electric")) {
    pool = FEATURES_POOL.electric;
  } else if (cleanCat.includes("sport")) {
    pool = FEATURES_POOL.sports;
  } else if (cleanCat.includes("pickup") || cleanCat.includes("truck") || cleanCat.includes("suv")) {
    pool = FEATURES_POOL.offroad;
  }

  const hash = getFeatureHashCode(productId || category || "");
  const selected = [];
  for (let i = 0; i < 6; i++) {
    const index = (hash + i * 3) % pool.length;
    let finalIndex = index;
    while (selected.includes(pool[finalIndex])) {
      finalIndex = (finalIndex + 1) % pool.length;
    }
    selected.push(pool[finalIndex]);
  }
  return selected;
}

function ProductDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [toast, setToast] = useState(null);

  const user = JSON.parse(localStorage.getItem("userdata") ?? "null");

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const addToCart = async () => {
    const token = localStorage.getItem("token");

    if (!user?._id || !token) {
      showToast("Please sign in first", "error");
      setTimeout(() => navigate("/login"), 1200);
      return;
    }
    try {
      setLoading(true);
      await Axios.post("/addtocart", { productId: product._id });
      showToast("Added to cart!");
      setTimeout(() => navigate("/Cart"), 1000);
    } catch (err) {
      showToast(err.response?.data?.message ?? "Failed to add to cart", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function fetchProduct() {
      try {
        setFetching(true);
        const { data } = await Axios.get(`/viewproduct/${id}`);
        setProduct(data);
      } catch (err) {
        console.error(err);
        showToast("Could not load product", "error");
      } finally {
        setFetching(false);
      }
    }
    fetchProduct();
  }, [id]);

  const fmt = (n) =>
    n != null ? "₹ " + Number(n).toLocaleString("en-IN") : null;



  if (fetching) {
    return (
      <>
        <Navbar />
        <div className="ad-loading">
          <div className="ad-loading-spinner" />
          <p>Loading…</p>
        </div>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="ad-empty">
          <p>Product not found.</p>
          <Link to="/products" className="ad-btn-back">Browse all cars</Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      {toast && (
        <div className={`ad-toast ad-toast--${toast.type}`} role="alert">
          {toast.type === "success" ? <CheckIcon /> : <AlertIcon />}
          {toast.msg}
        </div>
      )}

      <div className="ad-page">

        {/* ── HERO ── */}
        <section className="ad-hero">
          <div
            className="ad-hero-bg"
            style={{ backgroundImage: `url(${product.image})` }}
          />
          <div className="ad-hero-overlay" />
          <div className="ad-hero-container">
            <h1 className="ad-hero-title">{product.name}</h1>
            <p className="ad-hero-price">{fmt(product.price)}</p>
          </div>
          <div className="ad-hero-scroll-hint">
            <span>SCROLL</span>
            <div className="ad-scroll-line" />
          </div>
        </section>



        {/* ── ABOUT THIS CAR ── */}
        <section className="ad-about-section">
          <div className="ad-about-inner">
            <div className="ad-section-label">ABOUT THIS CAR</div>
            <h2 className="ad-about-name">{product.name}</h2>
            <div className="ad-about-meta">
              <span className="ad-about-badge">{product.category}</span>
              <span className="ad-about-price-tag">{fmt(product.price)}</span>
            </div>
            <p className="ad-about-desc">{product.description}</p>
          </div>
        </section>

        {/* ── FEATURES GRID ── */}
        <section className="ad-features-section">
          <div className="ad-section-label">WHAT'S INSIDE</div>
          <h2 className="ad-features-title">Built Different</h2>
          <div className="ad-features-grid">
            {getCarFeatures(product.category, product._id).map((f, i) => (
              <div className="ad-feature-card" key={i}>
                <div className="ad-feature-icon">{f.icon}</div>
                <h3>{f.label}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>


        {/* ── FULL-WIDTH CLOSING BANNER ── */}
        <section className="ad-closing-section">
          <div
            className="ad-closing-bg"
            style={{ backgroundImage: `url(${product.image})` }}
          />
          <div className="ad-closing-overlay" />
          <div className="ad-closing-content">
            <p className="ad-closing-eyebrow">YOUR NEXT DRIVE AWAITS</p>
            <h2 className="ad-closing-headline">{product.name}</h2>
            <button
              className={`ad-cta-primary${loading ? " loading" : ""}`}
              onClick={addToCart}
              disabled={loading}
            >
              {loading ? <><Spinner /> Adding…</> : <><CartIcon /> Add to Cart</>}
            </button>
          </div>
        </section>

      </div>
    </>
  );
}

/* ── Icons ───────────────────────────────────── */
function CartIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}
function ShieldIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
function AlertIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}
function Spinner() {
  return <span className="ad-spinner" aria-hidden="true" />;
}

export default ProductDetail;
