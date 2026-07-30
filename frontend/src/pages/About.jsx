import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function About() {
  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="bg-light py-5">
        <div className="container py-5">
          <div className="row align-items-center">

            <div className="col-lg-6">
              <p className="text-uppercase text-secondary fw-bold">
                About GlowCart
              </p>

              <h1 className="display-4 fw-bold">
                Beauty made simple.
              </h1>

              <p className="lead text-secondary mt-4">
                GlowCart is a modern online beauty store designed
                to make discovering and shopping for beauty products
                simple, convenient and enjoyable.
              </p>

              <Link
                to="/products"
                className="btn btn-dark btn-lg mt-3"
              >
                Explore Products
              </Link>
            </div>

            <div className="col-lg-6 mt-5 mt-lg-0">
              <div className="bg-white rounded-4 shadow-sm p-5 text-center">

                <div className="display-1">
                  ✨
                </div>

                <h3 className="fw-bold mt-4">
                  Your Beauty Destination
                </h3>

                <p className="text-secondary mb-0">
                  Makeup • Skincare • Haircare • Fragrance
                </p>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-5">
        <div className="container py-4">

          <div className="row align-items-center">

            <div className="col-lg-5 mb-4 mb-lg-0">
              <div className="bg-secondary-subtle rounded-4 p-5 text-center">

                <div className="display-1">
                  💄
                </div>

                <h3 className="fw-bold mt-4">
                  Glow With Confidence
                </h3>

              </div>
            </div>

            <div className="col-lg-7">

              <p className="text-uppercase text-secondary fw-bold">
                Our Story
              </p>

              <h2 className="fw-bold mb-4">
                A better way to shop for beauty
              </h2>

              <p className="text-secondary lh-lg">
                GlowCart was created with a simple idea:
                make beauty shopping easier. Instead of searching
                through different stores, customers can discover
                makeup, skincare, haircare and fragrances in one
                convenient place.
              </p>

              <p className="text-secondary lh-lg">
                Our goal is to provide a smooth shopping experience
                with easy product discovery, simple navigation,
                secure checkout and reliable delivery.
              </p>

            </div>

          </div>

        </div>
      </section>

      {/* Mission */}
      <section className="bg-light py-5">
        <div className="container py-4">

          <div className="text-center mb-5">

            <p className="text-uppercase text-secondary fw-bold">
              What We Believe
            </p>

            <h2 className="fw-bold">
              Our Mission
            </h2>

            <p className="text-secondary">
              Making your beauty shopping experience better.
            </p>

          </div>

          <div className="row g-4">

            <div className="col-md-4">
              <div className="card border-0 shadow-sm rounded-4 h-100">

                <div className="card-body text-center p-4">

                  <div className="display-5">
                    ✨
                  </div>

                  <h5 className="fw-bold mt-3">
                    Quality
                  </h5>

                  <p className="text-secondary">
                    We aim to provide a collection of
                    quality beauty products.
                  </p>

                </div>

              </div>
            </div>

            <div className="col-md-4">
              <div className="card border-0 shadow-sm rounded-4 h-100">

                <div className="card-body text-center p-4">

                  <div className="display-5">
                    🛍️
                  </div>

                  <h5 className="fw-bold mt-3">
                    Convenience
                  </h5>

                  <p className="text-secondary">
                    Find and explore beauty products
                    easily from one place.
                  </p>

                </div>

              </div>
            </div>

            <div className="col-md-4">
              <div className="card border-0 shadow-sm rounded-4 h-100">

                <div className="card-body text-center p-4">

                  <div className="display-5">
                    ❤️
                  </div>

                  <h5 className="fw-bold mt-3">
                    Customer First
                  </h5>

                  <p className="text-secondary">
                    We focus on creating a simple and
                    enjoyable customer experience.
                  </p>

                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Why GlowCart */}
      <section className="py-5">
        <div className="container py-4">

          <div className="text-center mb-5">
            <h2 className="fw-bold">
              Why Choose GlowCart?
            </h2>
          </div>

          <div className="row text-center g-4">

            <div className="col-md-3">
              <div className="p-3">
                <div className="display-6">🔍</div>
                <h5 className="fw-bold mt-3">
                  Easy Discovery
                </h5>
                <p className="text-secondary">
                  Find products quickly.
                </p>
              </div>
            </div>

            <div className="col-md-3">
              <div className="p-3">
                <div className="display-6">🛒</div>
                <h5 className="fw-bold mt-3">
                  Easy Shopping
                </h5>
                <p className="text-secondary">
                  Simple cart and checkout.
                </p>
              </div>
            </div>

            <div className="col-md-3">
              <div className="p-3">
                <div className="display-6">🔒</div>
                <h5 className="fw-bold mt-3">
                  Secure
                </h5>
                <p className="text-secondary">
                  Safe shopping experience.
                </p>
              </div>
            </div>

            <div className="col-md-3">
              <div className="p-3">
                <div className="display-6">🚚</div>
                <h5 className="fw-bold mt-3">
                  Reliable Delivery
                </h5>
                <p className="text-secondary">
                  Convenient delivery experience.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Contact CTA */}
      <section className="bg-dark text-white py-5">
        <div className="container text-center py-4">

          <h2 className="fw-bold">
            Ready to find your glow?
          </h2>

          <p className="text-secondary">
            Explore our beauty collection today.
          </p>

          <Link
            to="/products"
            className="btn btn-light btn-lg mt-3"
          >
            Shop Now
          </Link>

        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-4">

        <div className="container text-center">

          <h5 className="fw-bold">
            GlowCart
          </h5>

          <p className="text-secondary mb-0">
            Beauty made simple.
          </p>

          <p className="text-secondary mt-2 mb-0">
            © 2026 GlowCart. All Rights Reserved.
          </p>

        </div>

      </footer>
    </>
  );
}

export default About;