import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function About() {
  return (
    <>
      <Navbar />

      <section
        className="py-5"
        style={{
          background: "linear-gradient(to right, #fff,#f8f5ff)"
        }}
      >
        <div className="container">

          {/* Hero */}

          <div className="text-center py-5">

            <h1
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: "3.2rem",
                fontWeight: "700",
                color: "#7C6EE6"
              }}
            >
              About GlowCart
            </h1>

            <p
              className="mt-4 mx-auto"
              style={{
                maxWidth: "700px",
                fontFamily: "'Poppins', sans-serif",
                fontSize: "1.15rem",
                color: "#666"
              }}
            >
              Beauty begins with confidence.
              GlowCart brings together premium skincare,
              makeup, fragrances, haircare and body care
              products to make your beauty journey
              effortless and enjoyable.
            </p>

            <Link
              to="/products"
              className="btn mt-4 px-5 py-3 rounded-pill"
              style={{
                backgroundColor: "#7C6EE6",
                color: "white"
              }}
            >
              Explore Products
            </Link>

          </div>

          {/* Story */}

          <div className="row align-items-center py-5">

            <div className="col-lg-6">

              <img
                src="/images/about.png"
                alt="About GlowCart"
                className="img-fluid rounded-4 shadow"
              />

            </div>

            <div className="col-lg-6 mt-4 mt-lg-0">

              <h2
                style={{
                  fontFamily: "'Cinzel', serif",
                  color: "#7C6EE6"
                }}
              >
                Our Story
              </h2>

              <p
                className="mt-3"
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  lineHeight: "32px",
                  color: "#555"
                }}
              >
                GlowCart was created with a simple vision—
                to make beauty shopping easy, authentic and
                affordable. We carefully curate trusted
                products so that every customer can shop with
                confidence and discover products that enhance
                their natural beauty.
              </p>

            </div>

          </div>

          {/* Mission */}

          <div className="text-center py-5">

            <h2
              style={{
                fontFamily: "'Cinzel', serif",
                color: "#7C6EE6"
              }}
            >
              Our Mission
            </h2>

            <div className="row mt-5">

              <div className="col-md-3">

                <div className="card border-0 shadow rounded-4 p-4 h-100">

                  <h1>💄</h1>

                  <h5>Authentic Products</h5>

                  <p className="text-secondary">
                    We provide only trusted and genuine
                    beauty products.
                  </p>

                </div>

              </div>

              <div className="col-md-3">

                <div className="card border-0 shadow rounded-4 p-4 h-100">

                  <h1>🚚</h1>

                  <h5>Fast Delivery</h5>

                  <p className="text-secondary">
                    Quick and secure delivery right to
                    your doorstep.
                  </p>

                </div>

              </div>

              <div className="col-md-3">

                <div className="card border-0 shadow rounded-4 p-4 h-100">

                  <h1>🔒</h1>

                  <h5>Secure Shopping</h5>

                  <p className="text-secondary">
                    Safe transactions and a trusted
                    shopping experience.
                  </p>

                </div>

              </div>

              <div className="col-md-3">

                <div className="card border-0 shadow rounded-4 p-4 h-100">

                  <h1>❤️</h1>

                  <h5>Customer First</h5>

                  <p className="text-secondary">
                    Every decision we make begins with
                    customer satisfaction.
                  </p>

                </div>

              </div>

            </div>

          </div>

          {/* Categories */}

          <div className="py-5">

            <h2
              className="text-center mb-5"
              style={{
                fontFamily: "'Cinzel', serif",
                color: "#7C6EE6"
              }}
            >
              What We Offer
            </h2>

            <div className="row text-center">

              {[
                "💄 Makeup",
                "🧴 Skincare",
                "💇 Hair Care",
                "🌸 Fragrances",
                "🧼 Body Care"
              ].map((item) => (

                <div className="col-md mb-3" key={item}>

                  <div
                    className="card border-0 shadow-sm rounded-4 py-4"
                    style={{
                      transition: "0.3s"
                    }}
                  >

                    <h5>{item}</h5>

                  </div>

                </div>

              ))}

            </div>

          </div>

          {/* Statistics */}

          <div className="py-5">

            <div className="row text-center">

              <div className="col-md-3">

                <h1 style={{ color: "#7C6EE6" }}>500+</h1>

                <p>Beauty Products</p>

              </div>

              <div className="col-md-3">

                <h1 style={{ color: "#7C6EE6" }}>100+</h1>

                <p>Happy Customers</p>

              </div>

              <div className="col-md-3">

                <h1 style={{ color: "#7C6EE6" }}>5+</h1>

                <p>Categories</p>

              </div>

              <div className="col-md-3">

                <h1 style={{ color: "#7C6EE6" }}>24/7</h1>

                <p>Support</p>

              </div>

            </div>

          </div>

          {/* Contact */}

          <div className="text-center py-5">

            <h2
              style={{
                fontFamily: "'Cinzel', serif",
                color: "#7C6EE6"
              }}
            >
              Contact Us
            </h2>

            <p className="mt-4">
              📧 support@glowcart.com
            </p>

            <p>
              📞 +91 9876543210
            </p>

            <p>
              📍 Vijayawada, Andhra Pradesh
            </p>

          </div>

        </div>

      </section>

      <footer className="bg-dark text-white py-4">

        <div className="container text-center">

          <h4
            style={{
              fontFamily: "'Cinzel', serif"
            }}
          >
            GlowCart
          </h4>

          <p className="text-secondary mb-0">
            Beauty Made Simple.
          </p>

        </div>

      </footer>

    </>
  );
}

export default About;