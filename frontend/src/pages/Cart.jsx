import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function Cart() {
  return (
    <>
      <Navbar />

      <section className="bg-light py-5 min-vh-100">
        <div className="container py-4">

          {/* Heading */}
          <div className="text-center mb-5">
            <p className="text-uppercase text-secondary fw-bold">
              Your Shopping Bag
            </p>

            <h1 className="fw-bold">
              Shopping Cart
            </h1>

            <p className="text-secondary">
              Review your items before checkout.
            </p>
          </div>

          <div className="row justify-content-center">

            {/* Cart Items */}
            <div className="col-lg-8">

              <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body p-4">

                  {/* Empty Cart */}
                  <div className="text-center py-5">

                    <div className="display-1 mb-4">
                      🛒
                    </div>

                    <h3 className="fw-bold">
                      Your cart is empty
                    </h3>

                    <p className="text-secondary mb-4">
                      Looks like you haven't added anything to your cart yet.
                    </p>

                    <Link
                      to="/products"
                      className="btn btn-dark btn-lg px-4"
                    >
                      Continue Shopping
                    </Link>

                  </div>

                </div>
              </div>

            </div>

            {/* Order Summary */}
            <div className="col-lg-4 mt-4 mt-lg-0">

              <div className="card border-0 shadow-sm rounded-4">

                <div className="card-body p-4">

                  <h4 className="fw-bold mb-4">
                    Order Summary
                  </h4>

                  <div className="d-flex justify-content-between mb-3">
                    <span className="text-secondary">
                      Subtotal
                    </span>

                    <span>
                      $0.00
                    </span>
                  </div>

                  <div className="d-flex justify-content-between mb-3">
                    <span className="text-secondary">
                      Shipping
                    </span>

                    <span>
                      $0.00
                    </span>
                  </div>

                  <hr />

                  <div className="d-flex justify-content-between mb-4">
                    <strong>
                      Total
                    </strong>

                    <strong>
                      $0.00
                    </strong>
                  </div>

                  <div className="d-grid">
                    <button
                      className="btn btn-dark btn-lg"
                      disabled
                    >
                      Proceed to Checkout
                    </button>
                  </div>

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

export default Cart;