import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";

function ProductDetails() {
  const { id } = useParams();

  return (
    <>
      <Navbar />

      <section className="bg-light py-5 min-vh-100">
        <div className="container py-5">

          {/* Breadcrumb */}
          <nav className="mb-4">
            <Link
              to="/products"
              className="text-dark text-decoration-none"
            >
              Products
            </Link>

            <span className="mx-2 text-secondary">
              /
            </span>

            <span className="text-secondary">
              Product Details
            </span>
          </nav>

          <div className="card border-0 shadow-sm rounded-4 overflow-hidden">

            <div className="row g-0">

              {/* Product Image */}
              <div className="col-lg-6">

                <div className="bg-secondary-subtle h-100 d-flex align-items-center justify-content-center p-5">

                  <div className="text-center">

                    <div className="display-1 mb-4">
                      💄
                    </div>

                    <p className="text-secondary mb-0">
                      Product Image
                    </p>

                  </div>

                </div>

              </div>

              {/* Product Information */}
              <div className="col-lg-6">

                <div className="p-4 p-md-5">

                  <small className="text-uppercase text-secondary fw-bold">
                    Makeup
                  </small>

                  <h1 className="fw-bold mt-3">
                    Velvet Matte Lipstick
                  </h1>

                  <div className="d-flex align-items-center gap-2 my-3">

                    <span className="text-warning fs-5">
                      ★★★★★
                    </span>

                    <span className="text-secondary">
                      4.8 (120 Reviews)
                    </span>

                  </div>

                  <h2 className="fw-bold mb-4">
                    $19.99
                  </h2>

                  <p className="text-secondary lh-lg">
                    A premium matte lipstick designed for a
                    smooth and comfortable finish. Perfect for
                    everyday beauty and special occasions.
                  </p>

                  <hr className="my-4" />

                  {/* Quantity */}
                  <div className="mb-4">

                    <label className="form-label fw-semibold">
                      Quantity
                    </label>

                    <div className="input-group" style={{ maxWidth: "150px" }}>

                      <button
                        className="btn btn-outline-dark"
                        type="button"
                      >
                        −
                      </button>

                      <input
                        type="text"
                        className="form-control text-center"
                        value="1"
                        readOnly
                      />

                      <button
                        className="btn btn-outline-dark"
                        type="button"
                      >
                        +
                      </button>

                    </div>

                  </div>

                  {/* Buttons */}
                  <div className="d-grid gap-2">

                    <button className="btn btn-dark btn-lg">
                      🛒 Add to Cart
                    </button>

                    <button className="btn btn-outline-dark btn-lg">
                      ♡ Add to Wishlist
                    </button>

                  </div>

                  {/* Product Info */}
                  <div className="row mt-5 g-3">

                    <div className="col-6">
                      <div className="border rounded-3 p-3 text-center">
                        <strong>🚚</strong>
                        <p className="mb-0 mt-2 small">
                          Fast Delivery
                        </p>
                      </div>
                    </div>

                    <div className="col-6">
                      <div className="border rounded-3 p-3 text-center">
                        <strong>↩️</strong>
                        <p className="mb-0 mt-2 small">
                          Easy Returns
                        </p>
                      </div>
                    </div>

                    <div className="col-6">
                      <div className="border rounded-3 p-3 text-center">
                        <strong>🔒</strong>
                        <p className="mb-0 mt-2 small">
                          Secure Payment
                        </p>
                      </div>
                    </div>

                    <div className="col-6">
                      <div className="border rounded-3 p-3 text-center">
                        <strong>✓</strong>
                        <p className="mb-0 mt-2 small">
                          Quality Product
                        </p>
                      </div>
                    </div>

                  </div>

                  <p className="text-secondary small mt-4">
                    Product ID: {id}
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white py-4">

        <div className="container text-center">

          <h5 className="fw-bold">
            GlowCart
          </h5>

          <p className="text-secondary mb-0">
            Beauty made simple.
          </p>

        </div>

      </footer>
    </>
  );
}

export default ProductDetails;