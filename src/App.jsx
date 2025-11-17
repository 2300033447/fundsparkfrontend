import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import "./App.css";
import axios from "axios";

import yourCauseIcon from "./assets/Your Cause.png";
import medicalIcon from "./assets/Medical.png";
import emergencyIcon from "./assets/Emergency.png";
import educationIcon from "./assets/Education.png";
import animalIcon from "./assets/Animal.png";
import businessIcon from "./assets/Business.png";

const API_BASE = "http://localhost:8080";

/* ----------------------------------
   CATEGORY FLOAT OBJECTS
---------------------------------- */
const categories = [
  { name: "Your cause", icon: yourCauseIcon, top: "10%", left: "18%", speed: 0.2 },
  { name: "Medical", icon: medicalIcon, top: "28%", left: "8%", speed: 0.3 },
  { name: "Emergency", icon: emergencyIcon, top: "62%", left: "18%", speed: 0.15 },
  { name: "Education", icon: educationIcon, top: "10%", left: "72%", speed: 0.25 },
  { name: "Animal", icon: animalIcon, top: "28%", left: "82%", speed: 0.35 },
  { name: "Business", icon: businessIcon, top: "62%", left: "72%", speed: 0.2 },
];

/* ----------------------------------
   CAMPAIGN CARD COMPONENT
---------------------------------- */
function CampaignCard({ project, img, onDonateClick }) {
  const raised = project.currentAmount || 0;
  const goal = project.targetAmount || 0;
  const percentage = goal > 0 ? Math.min((raised / goal) * 100, 100) : 0;

  return (
    <div className="campaign-card">
      {img && <img src={img} alt={project.title} />}
      <h3>{project.title}</h3>
      {project.description && <p className="campaign-desc">{project.description}</p>}

      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${percentage}%` }}></div>
      </div>

      <p className="raised-text">
        ₹{raised.toLocaleString("en-IN")} raised of ₹{goal.toLocaleString("en-IN")}
      </p>

      <button className="cta small" onClick={() => onDonateClick(project)}>
        Donate Now
      </button>
    </div>
  );
}

/* ----------------------------------
   HOME PAGE
---------------------------------- */
function HomePage({ setShowSignUp }) {
  const [scrollY, setScrollY] = useState(0);
  const [amountRaised, setAmountRaised] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // animate counter once
  useEffect(() => {
    const target = 2340000;
    let current = 0;
    const increment = target / 150;
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

          <button className="cta" onClick={() => setShowSignUp(true)}>
            Start a Fundspark
          </button>

          <div className="counter">
            💰 Over ₹{amountRaised.toLocaleString("en-IN")} raised by our community!
          </div>
        </header>
      </main>
    </div>
  );
}

/* ----------------------------------
   DONATE PAGE — LIVE FROM BACKEND
---------------------------------- */
function DonatePage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const [donorName, setDonorName] = useState("");
  const [donationAmount, setDonationAmount] = useState("");
  const activeRef = useRef(null);

  const imagePool = [medicalIcon, educationIcon, emergencyIcon, animalIcon, businessIcon];

  useEffect(() => {
    axios
      .get(`${API_BASE}/api/projects`)
      .then((res) => setProjects(res.data))
      .catch(() => setError("Failed to load campaigns"))
      .finally(() => setLoading(false));
  }, []);

  const scrollToActive = () => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const openDonateModal = (project) => {
    setSelectedProject(project);
    setDonorName("");
    setDonationAmount("");
  };

  const closeDonateModal = () => {
    setSelectedProject(null);
  };

  const handleDonate = async () => {
    if (!selectedProject) return;
    const amount = parseFloat(donationAmount);
    if (!donorName || isNaN(amount) || amount <= 0) {
      alert("Please enter a valid name and amount.");
      return;
    }

    try {
      const res = await axios.post(
        `${API_BASE}/api/donations/${selectedProject.id}`,
        {
          donorName,
          amount,
        }
      );
      alert(res.data);

      // update UI currentAmount locally
      setProjects((prev) =>
        prev.map((p) =>
          p.id === selectedProject.id
            ? { ...p, currentAmount: (p.currentAmount || 0) + amount }
            : p
        )
      );
      closeDonateModal();
    } catch (err) {
      console.error(err);
      alert("Donation failed. Please try again.");
    }
  };

  return (
    <div className="page-layout">
      <div className="page-hero">
        <h1>💜 Donate to a Cause</h1>
        <p>Explore verified fundraisers and make a real impact today.</p>

        <button className="cta" onClick={scrollToActive}>
          View Active Campaigns
        </button>
      </div>

      <div className="campaign-grid" ref={activeRef}>
        {loading && <p>Loading campaigns...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {!loading &&
          !error &&
          projects.map((p, index) => (
            <CampaignCard
              key={p.id}
              project={p}
              img={imagePool[index % imagePool.length]}
              onDonateClick={openDonateModal}
            />
          ))}
      </div>

      {/* Donation Modal */}
      {selectedProject && (
        <div className="modal-overlay" onClick={closeDonateModal}>
          <div className="glass-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeDonateModal}>
              ×
            </button>
            <h2>Donate to {selectedProject.title}</h2>
            <p>
              Current: ₹{(selectedProject.currentAmount || 0).toLocaleString("en-IN")} of ₹
              {(selectedProject.targetAmount || 0).toLocaleString("en-IN")}
            </p>

            <input
              type="text"
              className="modern-input"
              placeholder="Your name"
              value={donorName}
              onChange={(e) => setDonorName(e.target.value)}
            />
            <input
              type="number"
              className="modern-input"
              placeholder="Amount (₹)"
              value={donationAmount}
              onChange={(e) => setDonationAmount(e.target.value)}
            />

            <button className="modern-btn" onClick={handleDonate}>
              Confirm Donation
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ----------------------------------
   FUNDRAISE PAGE — CREATE NEW PROJECT
---------------------------------- */
function FundraisePage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();
    const target = parseFloat(targetAmount);

    if (!title || !description || isNaN(target) || target <= 0) {
      alert("Please fill all fields with a valid goal amount.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${API_BASE}/api/projects`, {
        title,
        description,
        targetAmount: target,
      });
      alert("Fundraiser created! ID: " + res.data.id);

      setTitle("");
      setDescription("");
      setTargetAmount("");
    } catch (err) {
      console.error(err);
      alert("Failed to create fundraiser. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-layout">
      <div className="page-hero">
        <h1>🚀 Start a Fundraiser</h1>
        <p>Begin your journey to raise funds for a cause you care about.</p>

        <form onSubmit={handleCreate} style={{ marginTop: "20px" }}>
          <input
            type="text"
            className="modern-input"
            placeholder="Fundraiser title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="modern-input"
            placeholder="Describe your cause"
            style={{ minHeight: "80px", resize: "vertical" }}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            type="number"
            className="modern-input"
            placeholder="Target amount (₹)"
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
          />

          <button className="modern-btn" type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Fundraiser"}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ----------------------------------
   APP ROUTER + AUTH MODALS
---------------------------------- */
export default function App() {
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [userName, setUserName] = useState("");

  // auth form state
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");

  const [signUpName, setSignUpName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpConfirm, setSignUpConfirm] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("userName");
    if (storedUser) setUserName(storedUser);
  }, []);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.removeItem("userName");
      setUserName("");
    }
  };

  const handleSignIn = async () => {
    try {
      const res = await axios.post(`${API_BASE}/api/auth/signin`, {
        email: signInEmail,
        password: signInPassword,
      });
      alert(res.data);

      if (res.data === "Login successful!") {
        const namePart = signInEmail.split("@")[0];
        setUserName(namePart);
        localStorage.setItem("userName", namePart);
        setShowSignIn(false);
      }
    } catch (err) {
      console.error(err);
      alert("Login failed. Check your backend or credentials.");
    }
  };

  const handleSignUp = async () => {
    if (signUpPassword !== signUpConfirm) {
      alert("Passwords do not match!");
      return;
    }
    try {
      const res = await axios.post(`${API_BASE}/api/auth/signup`, {
        fullName: signUpName,
        email: signUpEmail,
        password: signUpPassword,
      });
      alert(res.data);
      setShowSignUp(false);
      setShowSignIn(true);
    } catch (err) {
      console.error(err);
      alert("Sign-up failed. Check your backend.");
    }
  };

  return (
    <Router>
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="nav-left">
          <span className="nav-item">🔍 Search</span>
          <NavLink
            to="/donate"
            className={({ isActive }) => `nav-item ${isActive ? "active-link" : ""}`}
          >
            Donate
          </NavLink>
          <NavLink
            to="/fundraise"
            className={({ isActive }) => `nav-item ${isActive ? "active-link" : ""}`}
          >
            Fundraise
          </NavLink>
        </div>

        <div className="nav-center">
          <NavLink to="/" className="logo">
            Fundspark
          </NavLink>
        </div>

        <div className="nav-right">
          <span className="nav-item">About ▾</span>
          {userName ? (
            <>
              <span className="nav-item">👋 {userName}</span>
              <button className="sign-btn" onClick={handleLogout}>
                Log out
              </button>
            </>
          ) : (
            <>
              <button
                className="sign-btn"
                onClick={() => {
                  setShowSignIn(true);
                  setShowSignUp(false);
                }}
              >
                Sign in
              </button>
              <button
                className="start-fund outline"
                onClick={() => {
                  setShowSignUp(true);
                  setShowSignIn(false);
                }}
              >
                Start a Fundspark
              </button>
            </>
          )}
        </div>
      </nav>

      {/* ROUTES */}
      <Routes>
        <Route path="/" element={<HomePage setShowSignUp={setShowSignUp} />} />
        <Route path="/donate" element={<DonatePage />} />
        <Route path="/fundraise" element={<FundraisePage />} />
      </Routes>

      {/* SIGN-IN MODAL */}
      {showSignIn && (
        <div className="modal-overlay" onClick={() => setShowSignIn(false)}>
          <div className="glass-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowSignIn(false)}>
              ×
            </button>
            <h2>Welcome Back</h2>

            <input
              type="email"
              placeholder="Email address"
              className="modern-input"
              value={signInEmail}
              onChange={(e) => setSignInEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="modern-input"
              value={signInPassword}
              onChange={(e) => setSignInPassword(e.target.value)}
            />

            <button className="modern-btn" onClick={handleSignIn}>
              Sign in
            </button>
            <p>
              Don’t have an account?{" "}
              <span
                className="link-text"
                onClick={() => {
                  setShowSignIn(false);
                  setShowSignUp(true);
                }}
              >
                Sign up
              </span>
            </p>
          </div>
        </div>
      )}

      {/* SIGN-UP MODAL */}
      {showSignUp && (
        <div className="modal-overlay" onClick={() => setShowSignUp(false)}>
          <div className="glass-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowSignUp(false)}>
              ×
            </button>
            <h2>Create Account</h2>

            <input
              type="text"
              placeholder="Full name"
              className="modern-input"
              value={signUpName}
              onChange={(e) => setSignUpName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email address"
              className="modern-input"
              value={signUpEmail}
              onChange={(e) => setSignUpEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="modern-input"
              value={signUpPassword}
              onChange={(e) => setSignUpPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm password"
              className="modern-input"
              value={signUpConfirm}
              onChange={(e) => setSignUpConfirm(e.target.value)}
            />

            <button className="modern-btn" onClick={handleSignUp}>
              Sign up
            </button>
            <p>
              Already have an account?{" "}
              <span
                className="link-text"
                onClick={() => {
                  setShowSignUp(false);
                  setShowSignIn(true);
                }}
              >
                Sign in
              </span>
            </p>
          </div>
        </div>
      )}
    </Router>
  );
}
