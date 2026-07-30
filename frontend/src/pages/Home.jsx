import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function Home() {
  return (
    <>
      <Navbar />

      {/* HERO SECTION */}
      <section className="bg-light py-5">
        <div className="container py-5">
          <div className="row align-items-center">

            <div className="col-lg-6 mb-4 mb-lg-0">
              <p className="text-uppercase text-secondary fw-bold">
                Welcome to GlowCart
              </p>

              <h1 className="display-2 fw-bold">
                Beauty That
                <br />
                Feels Like You
              </h1>

              <p className="lead text-secondary my-4">
                Discover makeup, skincare, haircare and
                fragrances for your everyday beauty.
              </p>

              <Link
                to="/products"
                className="btn btn-dark btn-lg px-4"
              >
                Shop Now
              </Link>

              <Link
                to="/products"
                className="btn btn-outline-dark btn-lg px-4 ms-2"
              >
                Explore
              </Link>
            </div>

            <div className="col-lg-6">
              <div className="bg-white rounded-4 shadow-sm p-5 text-center">
                <div className="display-1">💄</div>
                <h3 className="mt-4">Your Beauty Store</h3>
                <p className="text-secondary">
                  Makeup • Skincare • Haircare • Fragrance
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* CATEGORY SECTION */}
      <section className="py-5">
        <div className="container py-4">

          <div className="text-center mb-5">
            <p className="text-uppercase text-secondary fw-bold">
              Discover
            </p>

            <h2 className="fw-bold">
              Shop By Category
            </h2>
          </div>

          <div className="row g-4">

            <div className="col-12 col-sm-6 col-lg-3">
              <div className="card border-0 shadow-sm rounded-4 h-100">
                <div className="card-body text-center p-4">
                  <div className="display-4">💄</div>
                  <h5 className="fw-bold mt-3">Makeup</h5>
                  <p className="text-secondary">
                    Lipsticks, foundations and more
                  </p>

                  <Link
                    to="/products"
                    className="btn btn-outline-dark"
                  >
                    Explore
                  </Link>
                </div>
              </div>
            </div>


            <div className="col-12 col-sm-6 col-lg-3">
              <div className="card border-0 shadow-sm rounded-4 h-100">
                <div className="card-body text-center p-4">
                  <div className="display-4">🧴</div>
                  <h5 className="fw-bold mt-3">Skincare</h5>
                  <p className="text-secondary">
                    Serums, cleansers and moisturizers
                  </p>

                  <Link
                    to="/products"
                    className="btn btn-outline-dark"
                  >
                    Explore
                  </Link>
                </div>
              </div>
            </div>


            <div className="col-12 col-sm-6 col-lg-3">
              <div className="card border-0 shadow-sm rounded-4 h-100">
                <div className="card-body text-center p-4">
                  <div className="display-4">💇</div>
                  <h5 className="fw-bold mt-3">Haircare</h5>
                  <p className="text-secondary">
                    Products for healthy hair
                  </p>

                  <Link
                    to="/products"
                    className="btn btn-outline-dark"
                  >
                    Explore
                  </Link>
                </div>
              </div>
            </div>


            <div className="col-12 col-sm-6 col-lg-3">
              <div className="card border-0 shadow-sm rounded-4 h-100">
                <div className="card-body text-center p-4">
                  <div className="display-4">🌸</div>
                  <h5 className="fw-bold mt-3">Fragrance</h5>
                  <p className="text-secondary">
                    Fresh and beautiful fragrances
                  </p>

                  <Link
                    to="/products"
                    className="btn btn-outline-dark"
                  >
                    Explore
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* FEATURED PRODUCTS */}
      <section className="bg-light py-5">
        <div className="container py-4">

          <div className="text-center mb-5">
            <p className="text-uppercase text-secondary fw-bold">
              Our Picks
            </p>

            <h2 className="fw-bold">
              Featured Products
            </h2>
          </div>


          <div className="row g-4">

            {/* Product 1 */}
            <div className="col-12 col-sm-6 col-lg-3">
              <div className="card border-0 shadow-sm h-100">

                <div className="bg-secondary-subtle text-center py-5 display-3">
                  💄
                </div>

                <div className="card-body">
                  <small className="text-secondary">
                    MAKEUP
                  </small>

                  <h5 className="fw-bold mt-2">
                    Matte Lipstick
                  </h5>

                  <p className="text-secondary">
                    Smooth long-lasting finish
                  </p>

                  <div className="d-flex justify-content-between align-items-center">
                    <strong>$19.99</strong>

                    <button className="btn btn-dark btn-sm">
                      Add to Cart
                    </button>
                  </div>
                </div>

              </div>
            </div>


            {/* Product 2 */}
            <div className="col-12 col-sm-6 col-lg-3">
              <div className="card border-0 shadow-sm h-100">

                <div className="bg-success-subtle text-center py-5 display-3">
                  🧴
                </div>

                <div className="card-body">
                  <small className="text-secondary">
                    SKINCARE
                  </small>

                  <h5 className="fw-bold mt-2">
                    Vitamin C Serum
                  </h5>

                  <p className="text-secondary">
                    Daily brightening serum
                  </p>

                  <div className="d-flex justify-content-between align-items-center">
                    <strong>$24.99</strong>

                    <button className="btn btn-dark btn-sm">
                      Add to Cart
                    </button>
                  </div>
                </div>

              </div>
            </div>


            {/* Product 3 */}
            <div className="col-12 col-sm-6 col-lg-3">
              <div className="card border-0 shadow-sm h-100">

                <div className="bg-warning-subtle text-center py-5 display-3">
                  💇
                </div>

                <div className="card-body">
                  <small className="text-secondary">
                    HAIRCARE
                  </small>

                  <h5 className="fw-bold mt-2">
                    Hair Serum
                  </h5>

                  <p className="text-secondary">
                    Smooth and shiny hair
                  </p>

                  <div className="d-flex justify-content-between align-items-center">
                    <strong>$17.99</strong>

                    <button className="btn btn-dark btn-sm">
                      Add to Cart
                    </button>
                  </div>
                </div>

              </div>
            </div>


            {/* Product 4 */}
            <div className="col-12 col-sm-6 col-lg-3">
              <div className="card border-0 shadow-sm h-100">

                <div className="bg-info-subtle text-center py-5 display-3">
                  🌸
                </div>

                <div className="card-body">
                  <small className="text-secondary">
                    FRAGRANCE
                  </small>

                  <h5 className="fw-bold mt-2">
                    Bloom Perfume
                  </h5>

                  <p className="text-secondary">
                    Fresh floral fragrance
                  </p>

                  <div className="d-flex justify-content-between align-items-center">
                    <strong>$29.99</strong>

                    <button className="btn btn-dark btn-sm">
                      Add to Cart
                    </button>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>


      {/* WHY GLOWCART */}
      <section className="py-5">
        <div className="container py-4">

          <div className="text-center mb-5">
            <h2 className="fw-bold">
              Why Choose GlowCart?
            </h2>
          </div>

          <div className="row g-4 text-center">

            <div className="col-md-3">
              <div className="p-4">
                <div className="display-5">✓</div>
                <h5 className="fw-bold mt-3">
                  Quality Products
                </h5>
                <p className="text-secondary">
                  Carefully selected beauty products.
                </p>
              </div>
            </div>

            <div className="col-md-3">
              <div className="p-4">
                <div className="display-5">🔒</div>
                <h5 className="fw-bold mt-3">
                  Secure Shopping
                </h5>
                <p className="text-secondary">
                  Safe and secure shopping experience.
                </p>
              </div>
            </div>

            <div className="col-md-3">
              <div className="p-4">
                <div className="display-5">🚚</div>
                <h5 className="fw-bold mt-3">
                  Fast Delivery
                </h5>
                <p className="text-secondary">
                  Quick and reliable delivery.
                </p>
              </div>
            </div>

            <div className="col-md-3">
              <div className="p-4">
                <div className="display-5">↩️</div>
                <h5 className="fw-bold mt-3">
                  Easy Returns
                </h5>
                <p className="text-secondary">
                  Simple and convenient returns.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* FOOTER */}
      <footer className="bg-dark text-white py-5">
        <div className="container">

          <div className="row">

            <div className="col-md-4">
              <h3 className="fw-bold">GlowCart</h3>
              <p className="text-secondary">
                Beauty made simple.
              </p>
            </div>

            <div className="col-md-4">
              <h5>Quick Links</h5>
              <p>Home</p>
              <p>Products</p>
              <p>Categories</p>
            </div>

            <div className="col-md-4">
              <h5>Contact</h5>
              <p>support@glowcart.com</p>
              <p>+91 9876543210</p>
            </div>

          </div>

          <hr />

          <p className="text-center mb-0">
            © 2026 GlowCart. All Rights Reserved.
          </p>

        </div>
      </footer>
    </>
  );
}

export default Home;