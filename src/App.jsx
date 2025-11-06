import React, { useState, useEffect } from 'react';
import './App.css';

// Import assets so Vite bundles them correctly
import logoImg from './assets/logo.svg';
import googleIcon from './assets/google-icon.svg';
import appleIcon from './assets/apple-icon.svg';
import babyOllie from './assets/baby_ollie.svg';
import guillermo from './assets/guillermo.svg';
import floodRelief from './assets/flood_relief.svg';
import animalShelter from './assets/animal_shelter.svg';
import classroomResources from './assets/classroom_resources.svg';
import googlePlay from './assets/google_play.svg';
import appStore from './assets/app_store.svg';

const categories = [
  { name: 'Your cause', image: '/assets/your_cause.jpg', top: '8%', left: '18%', speed: 0.2 },
  { name: 'Medical', image: '/assets/medical.jpg', top: '26%', left: '8%', speed: 0.3 },
  { name: 'Emergency', image: '/assets/emergency.jpg', top: '60%', left: '18%', speed: 0.15 },
  { name: 'Education', image: '/assets/education.jpg', top: '8%', left: '72%', speed: 0.25 },
  { name: 'Animal', image: '/assets/animal.jpg', top: '26%', left: '82%', speed: 0.35 },
  { name: 'Business', image: '/assets/business.jpg', top: '60%', left: '72%', speed: 0.2 },
];

function App() {
  const [scrollY, setScrollY] = useState(0);
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // close modal on Escape key, lock body scroll when modals open
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setShowSignIn(false);
        setShowSignUp(false);
      }
    };
    window.addEventListener('keydown', onKey);
    if (showSignIn || showSignUp) document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [showSignIn, showSignUp]);

  return (
    <div className="homepage">
      <nav className="navbar">
        <div className="nav-left">
          <span className="nav-item">🔍 Search</span>
          <span className="nav-item">Donate ▾</span>
          <span className="nav-item">Fundraise ▾</span>
        </div>
        <div className="nav-center">
          <div className="logo">Fundspark</div>
        </div>
        <div className="nav-right">
          <span className="nav-item">About ▾</span>
          <button className="nav-item sign-btn" onClick={() => { setShowSignIn(true); setShowSignUp(false); }}>Sign in</button>
          <button className="start-fund outline">Start a Fundspark</button>
        </div>
      </nav>

      {showSignIn && (
        <div className="modal-overlay" onClick={() => setShowSignIn(false)}>
          <div className="sign-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowSignIn(false)}>×</button>
            <div className="modal-content">
              <div className="modal-logo">
                <img src={logoImg} alt="Fundspark" />
              </div>
              <h2>Welcome</h2>
              <p className="modal-sub">Sign in to Fundspark or create an account to continue.</p>

              <div className="auth-form">
                <input type="email" className="auth-input" placeholder="Email address" />
                <input type="password" className="auth-input" placeholder="Password" />

                <div className="auth-actions">
                  <button className="btn-primary">Sign in</button>
                  <button className="btn-outline" onClick={() => {
                    setShowSignIn(false);
                    setShowSignUp(true);
                  }}>Sign up</button>
                </div>
              </div>

              <p className="recaptcha">This site is protected by reCAPTCHA and the Google <a href="#">Privacy Policy</a> and <a href="#">Terms of Service</a> apply.</p>
            </div>
          </div>
        </div>
      )}

      {showSignUp && (
        <div className="modal-overlay" onClick={() => setShowSignUp(false)}>
          <div className="sign-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowSignUp(false)}>×</button>
            <div className="modal-content">
              <div className="modal-logo">
                <img src={logoImg} alt="Fundspark" />
              </div>
              <h2>Create Account</h2>
              <p className="modal-sub">Sign up for Fundspark to start fundraising or donating.</p>

              <div className="auth-form">
                <input type="text" className="auth-input" placeholder="Full name" />
                <input type="email" className="auth-input" placeholder="Email address" />
                <input type="password" className="auth-input" placeholder="Password" />
                <input type="password" className="auth-input" placeholder="Confirm password" />

                <div className="auth-actions">
                  <button className="btn-primary">Sign up</button>
                  <button className="btn-outline" onClick={() => {
                    setShowSignUp(false);
                    setShowSignIn(true);
                  }}>Back to Sign in</button>
                </div>
              </div>

              <p className="recaptcha">This site is protected by reCAPTCHA and the Google <a href="#">Privacy Policy</a> and <a href="#">Terms of Service</a> apply.</p>
            </div>
          </div>
        </div>
      )}

      <main className="hero-wrap">
        {/* Floating category circles positioned around the hero */}
        {categories.map((cat) => (
          <div
            key={cat.name}
            className="floating-cat"
            style={{
              top: cat.top,
              left: cat.left,
              transform: `translateY(${scrollY * cat.speed}px)`
            }}
            aria-hidden="true"
          >
            <div className="ring" aria-hidden>
              {/* decorative image: keep alt empty so missing images don't display text inside the ring */}
              <img src={cat.image} alt="" aria-hidden />
            </div>
            {/* visible label for sighted users (not hidden) */}
            <span className="cat-label">{cat.name}</span>
          </div>
        ))}

        <header className="center-message">
          <h2 className="eyebrow">#1 crowdfunding platform</h2>
          <h1 className="hero-title">Successful<br />fundraisers<br />start here</h1>
          <button className="cta">Start a Fundspark</button>
        </header>
      </main>

      <section className="how-it-works">
        <h2 className="section-title">Fundraising on Fundspark is easy, powerful, and trusted</h2>
      
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h3>Use our tools to create your fundraiser</h3>
              <p>You'll be guided by prompts to add fundraiser details and set your goal. Make updates anytime.</p>
              <a href="#" className="tip-link">Get tips for starting your fundraiser</a>
            </div>
          </div>

          <div className="step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h3>Reach donors by sharing</h3>
              <p>Share your fundraiser link and use the resources in your dashboard to gain momentum.</p>
            </div>
          </div>

          <div className="step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h3>Start receiving donations</h3>
              <p>Donors can contribute easily and securely through our trusted platform.</p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="discover">
        <div className="discover-inner">
          <div className="discover-header">
            <h2>Discover fundraisers inspired by what you care about</h2>
            <div className="discover-controls">
              <button className="filter-pill">Happening worldwide ▾</button>
              <div className="carousel-arrows">
                <button className="arrow">←</button>
                <button className="arrow">→</button>
              </div>
            </div>
          </div>

          <div className="discover-grid">
            <div className="card large">
              <div className="card-media">
                <img src={babyOllie} alt="Help Save Baby Ollie's Heart" />
              </div>
              <div className="card-body">
                <h3>Help Save Baby Ollie's Heart</h3>
                <div className="meta">82.7K donations</div>
                <div className="progress"><div className="progress-fill" style={{width: '78%'}}></div></div>
                <div className="amount">£1,426,577 raised</div>
              </div>
            </div>

            <div className="card">
              <div className="card-media"><img src={guillermo} alt="Ayuda para la recuperación clínica de Guillermo Hernández" /></div>
              <div className="card-body">
                <h3>Ayuda para la recuperación clínica de Guillermo Hernández</h3>
                <div className="meta">1.6K donations</div>
                <div className="progress"><div className="progress-fill" style={{width: '52%'}}></div></div>
                <div className="amount">€18,741 raised</div>
              </div>
            </div>

            <div className="card">
              <div className="card-media"><img src={floodRelief} alt="Community relief after flood" /></div>
              <div className="card-body">
                <h3>Community relief after flood</h3>
                <div className="meta">3.2K donations</div>
                <div className="progress"><div className="progress-fill" style={{width: '44%'}}></div></div>
                <div className="amount">$24,812 raised</div>
              </div>
            </div>

            <div className="card">
              <div className="card-media"><img src={animalShelter} alt="Help local animal shelter" /></div>
              <div className="card-body">
                <h3>Help local animal shelter</h3>
                <div className="meta">760 donations</div>
                <div className="progress"><div className="progress-fill" style={{width: '61%'}}></div></div>
                <div className="amount">£6,431 raised</div>
              </div>
            </div>

            <div className="card">
              <div className="card-media"><img src={classroomResources} alt="Support classroom resources" /></div>
              <div className="card-body">
                <h3>Support classroom resources</h3>
                <div className="meta">420 donations</div>
                <div className="progress"><div className="progress-fill" style={{width: '27%'}}></div></div>
                <div className="amount">£2,110 raised</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="tips-section">
        <div className="tips-inner">
          <div className="tips-header">
            <h2>Top crowdfunding tips</h2>
            <button className="view-all">View all</button>
          </div>

          <div className="tips-grid">
            <article className="tip-card">
              <div className="tip-icon">💡</div>
              <div className="tip-text">
                <h3>Top tips for your Fundspark fundraiser</h3>
              </div>
              <div className="tip-arrow">→</div>
            </article>

            <article className="tip-card">
              <div className="tip-icon">✏️</div>
              <div className="tip-text">
                <h3>Tips for telling a great fundraiser story</h3>
              </div>
              <div className="tip-arrow">→</div>
            </article>

            <article className="tip-card">
              <div className="tip-icon">🔗</div>
              <div className="tip-text">
                <h3>Tips for sharing your fundraiser</h3>
              </div>
              <div className="tip-arrow">→</div>
            </article>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-columns">
            <div className="col">
              <h4>Donate</h4>
              <ul>
                <li>Categories</li>
                <li>Crisis relief</li>
                <li>Social Impact Funds</li>
                <li>Supporter Space</li>
              </ul>
            </div>
            <div className="col">
              <h4>Fundraise</h4>
              <ul>
                <li>How to start a Fundspark</li>
                <li>Fundraising categories</li>
                <li>Team fundraising</li>
                <li>Fundraising Blog</li>
              </ul>
            </div>
            <div className="col">
              <h4>About</h4>
              <ul>
                <li>How Fundspark works</li>
                <li>Giving Guarantee</li>
                <li>Supported countries</li>
                <li>Pricing</li>
              </ul>
            </div>
            <div className="col">
              <h4>More</h4>
              <ul>
                <li>Newsroom</li>
                <li>Careers</li>
                <li>Partners</li>
              </ul>
            </div>
          </div>

          <div className="footer-links">
            <a href="#">Terms</a>
            <a href="#">Privacy Notice</a>
            <a href="#">Legal</a>
            <a href="#">Accessibility Statement</a>
            <a href="#">Cookie Policy</a>
            <a href="#">Manage Cookie Preferences</a>
            <a href="#">Your Privacy Choices</a>
          </div>

          <div className="footer-bottom">
            <div className="locale">🇺🇸 United States · English</div>
            <div className="copyright">© 2010-2025 Fundspark</div>
            <div className="badges-and-social">
              <div className="social">
                <span className="icon">f</span>
                <span className="icon">▶</span>
                <span className="icon">✕</span>
                <span className="icon">🖼</span>
              </div>
              <div className="store-badges">
                <img src={googlePlay} alt="Get it on Google Play" />
                <img src={appStore} alt="Download on the App Store" />
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
