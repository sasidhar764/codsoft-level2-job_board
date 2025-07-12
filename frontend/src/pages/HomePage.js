import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import welcomeImg from '../assets/welcome.jpeg';
import './HomePage.css';

export default function HomePage({ user }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/jobs');
    }
  }, [user, navigate]);

  return (
    <div className="homepage-root">
      <div className="homepage-hero-flex">
        <div className="homepage-hero-text-half">
          <div>
            <h1 className="homepage-hero-title">Where Talent Meets Opportunity</h1>
            <h2 className="homepage-hero-tagline">
              Discover your next career move.
            </h2>
            <p className="homepage-hero-desc">
              JobBoard connects skilled professionals with top companies.<br />
              Explore thousands of openings, apply instantly, and take the next step towards your dream job.<br />
              <strong>Your opportunity starts here.</strong>
            </p>
          </div>
        </div>
        <div className="homepage-hero-image-half">
          <img src={welcomeImg} alt="Welcome" className="homepage-hero-image" />
        </div>
      </div>
    </div>
  );
}
