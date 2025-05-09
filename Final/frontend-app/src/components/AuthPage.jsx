import React, { useState, useEffect } from 'react'; // Removed useCallback as it's not directly used for particles init in the new way
import { useLocation, useNavigate } from 'react-router-dom';
import Particles, { initParticlesEngine } from "@tsparticles/react"; // Import Particles and initParticlesEngine
import { loadFull } from "tsparticles"; // Import engine
import Login from './Login';
import Register from './Register';
import './AuthPage.css';
import logo from '../assets/smartbizlogo.png';
// import overlayGif from '../assets/image1.gif'; // GIF will be applied via CSS background

const AuthPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // Determine initial form based on the path
  const [isLoginView, setIsLoginView] = useState(location.pathname.includes('login'));
  const [init, setInit] = useState(false); // State for particles engine initialization

  // Initialize particles engine
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      // you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
      // this loads the tsparticles package bundle, it's a sample, you can load whatever you need
      await loadFull(engine);
    }).then(() => {
      setInit(true);
    });
  }, []); // Empty dependency array to run once on mount

  useEffect(() => {
    setIsLoginView(location.pathname.includes('login'));
  }, [location.pathname]);

  const switchToRegister = () => {
    setIsLoginView(false);
    navigate('/register', { replace: true });
  };

  const switchToLogin = () => {
    setIsLoginView(true);
    navigate('/login', { replace: true });
  };

  // --- Particles Configuration (User Provided) ---
  const particlesOptions = {
    fpsLimit: 120,
    detectRetina: true,
    particles: {
      number: {
        value: 194,
        density: {
          enable: true,
          area: 868.0624057955
        }
      },
      color: {
        value: "#ffffff"
      },
      shape: {
        type: "circle",
        stroke: {
          width: 0,
          color: "#000000"
        },
        polygon: {
          sides: 5
        },
        image: {
          src: "img/github.svg", // This path needs to be valid (e.g., in public folder)
          width: 100,
          height: 100
        }
      },
      opacity: {
        value: 1,
        random: { enable: true, minimumValue: 0 },
        animation: {
          enable: true,
          speed: 1,
          minimumValue: 0,
          sync: false
        }
      },
      size: {
        value: 3.945738208161363,
        random: { enable: true, minimumValue: 0.3 },
        animation: {
          enable: false,
          speed: 4,
          minimumValue: 0.3,
          sync: false
        }
      },
      links: {
        enable: true, // Changed to true to show lines
        distance: 150,
        color: "#ffffff",
        opacity: 0.4,
        width: 1
      },
      move: {
        enable: true,
        speed: 1,
        direction: "none",
        random: true,
        straight: false,
        outModes: {
          default: "out"
        },
        attract: {
          enable: false,
          rotate: {
              x: 600,
              y: 600
          }
        }
      },
      collisions: { // Kept from previous, can be removed if not in user's original intent
          enable: true,
      }
    },
    interactivity: {
      detectsOn: "canvas",
      events: {
        onHover: {
          enable: true,
          mode: "repulse" // Changed to "repulse" for particle movement on hover
        },
        onClick: {
          enable: true,
          mode: "repulse"
        },
        resize: true
      },
      modes: {
        grab: {
          distance: 400,
          links: {
            opacity: 1
          }
        },
        bubble: {
          distance: 250,
          size: 0,
          duration: 2,
          opacity: 0,
        },
        repulse: {
          distance: 400,
          duration: 0.4
        },
        push: {
          quantity: 4
        },
        remove: {
          quantity: 2
        }
      }
    }
  };
  // --- End User Provided Particles Configuration ---


  return (
    <div className="auth-container-main">
       {init && (
            <Particles
                id="particles-js" /* Changed ID to match user's CSS */
                options={particlesOptions}
            />
        )}
      <div className={`auth-card-split-container ${!isLoginView ? 'show-register' : ''}`}>
        <div className="auth-forms-wrapper">
          {/* Login Form Container */}
          <div className="form-container login-form-container">
            <div className="auth-form-section">
              <Login onSwitchToRegister={switchToRegister} />
            </div>
          </div>

          {/* Register Form Container */}
          <div className="form-container register-form-container">
            <div className="auth-form-section">
              <Register onSwitchToLogin={switchToLogin} />
            </div>
          </div>
        </div>

        {/* Overlay Panels for Sliding Effect */}
        <div className="auth-overlay-container">
          <div className="auth-overlay">
            <div className="auth-overlay-panel auth-overlay-left">
              {/* Content for when Register is active (overlay is on the left) */}
              {/* Removed GIF img tag */}
              <h2>Welcome Back!</h2>
              <p>To keep connected with us please login with your personal info</p>
              <button className="auth-button ghost" onClick={switchToLogin}>
                Sign In
              </button>
            </div>
            <div className="auth-overlay-panel auth-overlay-right">
              {/* Content for when Login is active (overlay is on the right) */}
              {/* Removed GIF img tag */}
              <h2>Hello, Friend!</h2>
              <p>Enter your personal details and start journey with us</p>
              <button className="auth-button ghost" onClick={switchToRegister}>
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
