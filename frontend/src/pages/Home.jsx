// Import the Link component for navigation between React pages
import { Link } from "react-router-dom";

// Import the main ToxicTide styles
import "../App.css";

// Main homepage component for ToxicTide
function Home() {
  return (
    <div className="app">

      {/* ========================================== */}
      {/* Navigation Bar                             */}
      {/* ========================================== */}

      <nav className="navbar">

        {/* Website logo and project name */}
        <div className="logo">
          🌊 ToxicTide
        </div>

        {/* Main public navigation */}
        <div className="nav-links">

          {/* Home page */}
          <Link to="/">
            Home
          </Link>

          {/* Main monitoring dashboard */}
          <Link to="/dashboard">
            Dashboard
          </Link>

          {/* Interactive monitoring map */}
          <Link to="/map">
            Water Map
          </Link>

        </div>

      </nav>


      {/* ========================================== */}
      {/* Main Hero Section                          */}
      {/* ========================================== */}

      <main
        className="hero"
        id="home"
      >

        {/* ---------------------------------------- */}
        {/* Hero Text                                */}
        {/* ---------------------------------------- */}

        <div className="hero-content">

          {/* Section label */}
          <p className="eyebrow">
            WATER SAFETY MONITORING
          </p>

          {/* Main project heading */}
          <h1>
            Know Your Water.
            <br />
            <span>
              Stay Safe.
            </span>
          </h1>

          {/* Project introduction */}
          <p className="hero-description">
            ToxicTide helps you understand cyanotoxin and
            microcystin monitoring information from official
            water-quality records before using or visiting
            a water body.
          </p>


          {/* ======================================== */}
          {/* Main Homepage Actions                    */}
          {/* ======================================== */}

          <div className="hero-buttons">

            {/* Open monitoring dashboard */}
            <Link
              to="/dashboard"
              className="primary-button"
            >
              View Dashboard
            </Link>


            {/* Open interactive water map */}
            <Link
              to="/map"
              className="secondary-button"
            >
              Explore Water Map
            </Link>


            {/*
              Safety Check requires a monitoring station
              to be selected first.

              Therefore, the user is taken to the Water Map,
              where a station can be selected before opening
              the Safety Check.
            */}
            <Link
              to="/map"
              className="secondary-button"
            >
              Check Water Safety
            </Link>

          </div>

        </div>


        {/* ======================================== */}
        {/* Microcystin Monitoring Card              */}
        {/* ======================================== */}

        <div className="hero-card">

          {/* Water-quality testing icon */}
          <div className="card-icon">
            🧪
          </div>

          <h2>
            Microcystin Monitoring
          </h2>

          <p>
            View available microcystin measurements and
            compare recorded values with safety thresholds
            for different water-use purposes.
          </p>


          {/* Official monitoring data indicator */}
          <div className="card-status">

            <span></span>

            Official monitoring data

          </div>

        </div>

      </main>


      {/* ========================================== */}
      {/* Feature Cards                              */}
      {/* ========================================== */}

      <section className="features-section">

        {/* Section label */}
        <p className="section-label">
          EXPLORE TOXICTIDE
        </p>

        {/* Section heading */}
        <h2>
          Water-safety information in one place
        </h2>

        {/* Section description */}
        <p className="section-description">
          Explore monitoring stations, recorded measurements,
          safety information, and community observations
          through the ToxicTide system.
        </p>


        {/* Feature card container */}
        <div className="feature-cards">


          {/* ---------------------------------------- */}
          {/* Interactive Water Map                   */}
          {/* ---------------------------------------- */}

          <Link
            to="/map"
            className="feature-card"
          >

            <div className="feature-icon">
              🗺️
            </div>

            <h3>
              Interactive Water Map
            </h3>

            <p>
              Find monitoring stations and view available
              station and water-safety information on an
              interactive map.
            </p>

            <span className="feature-link">
              Explore Map →
            </span>

          </Link>


          {/* ---------------------------------------- */}
          {/* Station Details & Trends                */}
          {/* ---------------------------------------- */}

          <Link
            to="/map"
            className="feature-card"
          >

            <div className="feature-icon">
              📊
            </div>

            <h3>
              Station Details & Trends
            </h3>

            <p>
              Select a monitoring station to examine
              recorded microcystin measurements, dates,
              filters, and measurement trends.
            </p>

            <span className="feature-link">
              Find a Station →
            </span>

          </Link>


          {/* ---------------------------------------- */}
          {/* Water Safety Check                      */}
          {/* ---------------------------------------- */}

          <Link
            to="/map"
            className="feature-card"
          >

            <div className="feature-icon">
              🛡️
            </div>

            <h3>
              Water Safety Check
            </h3>

            <p>
              Select a station and user group to compare
              available measurements with the applicable
              safety threshold and advisory.
            </p>

            <span className="feature-link">
              Check Safety →
            </span>

          </Link>


          {/* ---------------------------------------- */}
          {/* Community Reporting                     */}
          {/* ---------------------------------------- */}

          <Link
            to="/report"
            className="feature-card"
          >

            <div className="feature-icon">
              📝
            </div>

            <h3>
              Community Reporting
            </h3>

            <p>
              Submit observations about unusual water
              conditions while keeping community reports
              separate from official monitoring data.
            </p>

            <span className="feature-link">
              Submit Report →
            </span>

          </Link>

        </div>

      </section>


      {/* ========================================== */}
      {/* Supported User Groups                      */}
      {/* ========================================== */}

      <section className="users-section">

        {/* Section label */}
        <p className="section-label">
          WHO IS IT FOR?
        </p>

        {/* Section heading */}
        <h2>
          Check water safety for your purpose
        </h2>

        {/* Section description */}
        <p className="section-description">
          ToxicTide provides safety information according
          to the intended water-use group selected during
          the safety check.
        </p>


        {/* Three supported user groups */}
        <div className="user-cards">


          {/* ---------------------------------------- */}
          {/* Pet Owners                              */}
          {/* ---------------------------------------- */}

          <div className="user-card">

            <div className="user-icon">
              🐕
            </div>

            <h3>
              Pet Owners
            </h3>

            <p>
              Check available microcystin safety information
              before taking pets near a monitored water body.
            </p>

          </div>


          {/* ---------------------------------------- */}
          {/* Swimmers & Families                     */}
          {/* ---------------------------------------- */}

          <div className="user-card">

            <div className="user-icon">
              🏊
            </div>

            <h3>
              Swimmers & Families
            </h3>

            <p>
              Understand available water-quality measurements
              before recreational use of a monitored water body.
            </p>

          </div>


          {/* ---------------------------------------- */}
          {/* Drinking Water                          */}
          {/* ---------------------------------------- */}

          <div className="user-card">

            <div className="user-icon">
              💧
            </div>

            <h3>
              Drinking Water
            </h3>

            <p>
              View available safety information according
              to the applicable water-safety standard.
            </p>

          </div>

        </div>

      </section>


      {/* ========================================== */}
      {/* Footer                                     */}
      {/* ========================================== */}

      <footer className="footer">

        <div className="footer-content">


          {/* -------------------------------------- */}
          {/* Footer Brand                           */}
          {/* -------------------------------------- */}

          <div className="footer-brand">

            <div className="logo">
              🌊 ToxicTide
            </div>

            <p>
              Harmful Algal Bloom and cyanobacteria
              recreational safety information.
            </p>

          </div>


          {/* -------------------------------------- */}
          {/* Footer Quick Links                     */}
          {/* -------------------------------------- */}

          <div className="footer-links">

            {/* Footer section title */}
            <p
              style={{
                margin: "0 0 8px 0",
                fontSize: "12px",
                fontWeight: "700",
                letterSpacing: "1.5px",
                color: "#7dd3fc"
              }}
            >
              QUICK LINKS
            </p>


            {/* Home */}
            <Link to="/">
              Home
            </Link>


            {/* Dashboard */}
            <Link to="/dashboard">
              Dashboard
            </Link>


            {/* Water Map */}
            <Link to="/map">
              Water Map
            </Link>


            {/* Data Center */}
            <Link to="/data">
              Data Center
            </Link>


            {/* Community Report */}
            <Link to="/report">
              Community Report
            </Link>

          </div>

        </div>


        {/* ======================================== */}
        {/* Footer Bottom                            */}
        {/* ======================================== */}

        <div className="footer-bottom">

          <p>
            ToxicTide © 2026
          </p>

          <p>
            Official monitoring information and
            community observations are kept separate.
          </p>

        </div>

      </footer>

    </div>
  );
}


// Export Home page
export default Home;