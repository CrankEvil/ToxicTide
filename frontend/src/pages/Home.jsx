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
          {/* Interactive Water Map                    */}
          {/*                                          */}
          {/* Station details, measurement history and */}
          {/* trends are opened from a station on the  */}
          {/* map, so they are described here instead  */}
          {/* of using a separate duplicate map link.  */}
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
              Find monitoring stations on the map, then open a
              station to view its details, recorded microcystin
              measurements, date filters, and measurement trends.
            </p>

            <span className="feature-link">
              Explore Map →
            </span>

          </Link>


          {/* ---------------------------------------- */}
          {/* Water Safety Check                       */}
          {/*                                          */}
          {/* Safety Check requires a monitoring       */}
          {/* station to be selected first.            */}
          {/*                                          */}
          {/* Therefore, the user is taken to the      */}
          {/* Water Map, where a station can be        */}
          {/* selected before opening the Safety       */}
          {/* Check.                                   */}
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
              Select a station on the Water Map, then choose your
              user group to compare available measurements with
              the applicable safety threshold and advisory.
            </p>

            <span className="feature-link">
              Check Safety →
            </span>

          </Link>


          {/* ---------------------------------------- */}
          {/* Data Center                              */}
          {/*                                          */}
          {/* Gives this card its own destination      */}
          {/* instead of repeating another Water Map   */}
          {/* link.                                    */}
          {/* ---------------------------------------- */}

          <Link
            to="/data"
            className="feature-card"
          >

            <div className="feature-icon">
              📊
            </div>

            <h3>
              Data Center
            </h3>

            <p>
              Browse the water types, counties, monitoring
              stations, recorded measurements, and safety
              standards stored in the ToxicTide database.
            </p>

            <span className="feature-link">
              Explore Data →
            </span>

          </Link>


          {/* ---------------------------------------- */}
          {/* Community Reporting                      */}
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
              Swimmers &amp; Families
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

        <div className="footer-content" style={{ display: "flex", justifyContent: "flex-start" }}>


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