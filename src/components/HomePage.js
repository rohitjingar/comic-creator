// HomePage.js
import React from 'react';
import Header from './Header';
import { Link } from 'react-router-dom';
import Footer  from './Footer';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="HomePage">
      <Header />

      <section className="hero-section">
        <div className="hero-content">
          <h1>Create Comics with AI</h1>
          <p>Unleash your creativity with our text-to-image AI and bring your stories to life.</p>
          <Link to="/generate">
            <button>Get Started for Free</button>
          </Link>
        </div>
      </section>
      <Footer/>
    </div>
  );
};

export default HomePage;
