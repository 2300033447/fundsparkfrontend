import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import "./App.css";
import axios from "axios";

import yourCauseIcon from "./assets/Your Cause.png";
import medicalIcon from "./assets/Medical.png";
import emergencyIcon from "./assets/Emergency.png";
import educationIcon from "./assets/Education.png";
import animalIcon from "./assets/Animal.png";
import businessIcon from "./assets/Business.png";

const categories = [
  { name: "Your cause", icon: yourCauseIcon, top: "10%", left: "18%", speed: 0.2 },
  { name: "Medical", icon: medicalIcon, top: "28%", left: "8%", speed: 0.3 },
  { name: "Emergency", icon: emergencyIcon, top: "62%", left: "18%", speed: 0.15 },
  { name: "Education", icon: educationIcon, top: "10%", left: "72%", speed: 0.25 },
  { name: "Animal", icon: animalIcon, top: "28%", left: "82%", speed: 0.35 },
  { name: "Business", icon: businessIcon, top: "62%", left: "72%", speed: 0.2 },
];

function HomePage({ userName, setShowSignIn, setShowSignUp }) {
  const [scrollY, setScrollY] = useState(0);
  const [amountRaised, setAmountRaised] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Animate donation counter
  useEffect(() => {
    const target = 2340000; // target ₹ amount
    let current = 0;
    const increment = target / 150; // smooth animation
    const interval = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(interval);
      }
      setAmountRaised(Math.floor(current));
    }, 20);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="homepage">
      <main className="hero-wrap">
        {categories.map((cat) => (
          <div
            key={cat.name}
            className="floating-cat"
            style={{
              top: cat.top,
              left: cat.left,
              transform: `translateY(${scrollY * cat.speed}px)`,
            }}
          >
            <div className="ring small-ring">
              <img src={cat.icon} alt={cat.name} className="category-img" />
            </div>
            <span className="cat-label">{cat.name}</span>
          </div>
        ))}

        <header className="center-message">
          <h2 className="eyebrow">#1 crowdfunding platform</h2>
          <h1 className="hero-title">
            Successful <br /> fundraisers <br /> start here
          </h1>
          <button className="cta" onClick={() => setShowSignUp(true)}>Start a Fundspark</button>

          {/* 💰 Animated Counter */}
          <div className="counter">
            💰 Over ₹{amountRaised.toLocaleString("en-IN")} raised by our community!
          </div>
        </header>
      </main>
    </div>
  );
}

function DonatePage() {
  return (
    <div className="page-layout">
      <div className="page-hero">
        <h1>💜 Donate to a Cause</h1>
        <p>Explore verified fundraisers and make a real impact today.</p>
        <button className="cta">View Active Campaigns</button>
      </div>
    </div>
  );
}

function FundraisePage() {
  return (
    <div className="page-layout">
      <div className="page-hero">
        <h1>🚀 Start a Fundraiser</h1>
        <p>Begin your journey to raise funds for a cause you care about.</p>
        <button className="cta">Create a Fundraiser</button>
      </div>
    </div>
  );
}

export default function App() {
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("userName");
    if (storedUser) setUserName(storedUser);
  }, []);

  const handleLogout = () => {
    if (confirm("Are you sure you want to log out?")) {
      localStorage.removeItem("userName");
      setUserName("");
    }
  };

  return (
    <Router>
      <nav className="navbar">
        <div className="nav-left">
          <span className="nav-item">🔍 Search</span>
          <NavLink to="/donate" className={({ isActive }) => `nav-item ${isActive ? "active-link" : ""}`}>
            Donate
          </NavLink>
          <NavLink to="/fundraise" className={({ isActive }) => `nav-item ${isActive ? "active-link" : ""}`}>
            Fundraise
          </NavLink>
        </div>

        <div className="nav-center">
          <NavLink to="/" className="logo">Fundspark</NavLink>
        </div>

        <div className="nav-right">
          <span className="nav-item">About ▾</span>
          {userName ? (
            <>
              <span className="nav-item">👋 {userName}</span>
              <button className="nav-item sign-btn" onClick={handleLogout}>Log out</button>
            </>
          ) : (
            <>
              <button className="nav-item sign-btn" onClick={() => { setShowSignIn(true); setShowSignUp(false); }}>
                Sign in
              </button>
              <button className="start-fund outline" onClick={() => { setShowSignUp(true); setShowSignIn(false); }}>
                Start a Fundspark
              </button>
            </>
          )}
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage userName={userName} setShowSignIn={setShowSignIn} setShowSignUp={setShowSignUp} />} />
        <Route path="/donate" element={<DonatePage />} />
        <Route path="/fundraise" element={<FundraisePage />} />
      </Routes>

      {/* === Sign-In Modal === */}
      {showSignIn && (
        <div className="modal-overlay" onClick={() => setShowSignIn(false)}>
          <div className="glass-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowSignIn(false)}>×</button>
            <h2>Welcome Back</h2>
            <input type="email" placeholder="Email address" className="modern-input" />
            <input type="password" placeholder="Password" className="modern-input" />
            <button className="modern-btn" onClick={() => alert("Logged in!")}>Sign in</button>
            <p>
              Don’t have an account?{" "}
              <span className="link-text" onClick={() => { setShowSignIn(false); setShowSignUp(true); }}>
                Sign up
              </span>
            </p>
          </div>
        </div>
      )}

      {/* === Sign-Up Modal === */}
      {showSignUp && (
        <div className="modal-overlay" onClick={() => setShowSignUp(false)}>
          <div className="glass-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowSignUp(false)}>×</button>
            <h2>Create Account</h2>
            <input type="text" placeholder="Full name" className="modern-input" />
            <input type="email" placeholder="Email address" className="modern-input" />
            <input type="password" placeholder="Password" className="modern-input" />
            <input type="password" placeholder="Confirm password" className="modern-input" />
            <button className="modern-btn" onClick={() => alert("Signed up!")}>Sign up</button>
            <p>
              Already have an account?{" "}
              <span className="link-text" onClick={() => { setShowSignUp(false); setShowSignIn(true); }}>
                Sign in
              </span>
            </p>
          </div>
        </div>
      )}
    </Router>
  );
}
