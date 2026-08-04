import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

function Cart() {

  const [cartItems, setCartItems] = useState([]);

  const navigate = useNavigate();

  const customerId = localStorage.getItem("customerId");

  useEffect(() => {

    if (!customerId) {
      alert("Please login first.");
      navigate("/login");
      return;
    }

    fetch(`http://127.0.0.1:5000/cart/${customerId}`)
      .then((response) => response.json())
      .then((data) => {
        setCartItems(data);
      })
      .catch((error) => {
        console.error(error);
      });

  }, [customerId, navigate]);

  async function removeItem(cartId) {

    const confirmDelete = window.confirm(
      "Are you sure you want to remove this product?"
    );

    if (!confirmDelete) {
      return;
    }

    try {

      const response = await fetch(
        `http://127.0.0.1:5000/remove-cart-item/${cartId}`,
        {
          method: "DELETE"
        }
      );

      const result = await response.json();

      if (response.ok) {

        alert(result.message);

        setCartItems((prevItems) =>
          prevItems.filter((item) => item.cart_id !== cartId)
        );

      } else {

        alert(result.message);

      }

    } catch (error) {

      console.error(error);
      alert("Something went wrong.");

    }

  }

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  async function updateQuantity(cartId, action) {

  try {

    const response = await fetch(
      "http://127.0.0.1:5000/update-cart",
      {
        method: "PUT",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          cart_id: cartId,
          action: action
        })

      }
    );

    if (response.ok) {

      fetch(`http://127.0.0.1:5000/cart/${customerId}`)
        .then((response) => response.json())
        .then((data) => {
          setCartItems(data);
        });

    }

  } catch (error) {

    console.error(error);

  }

}

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

                  {cartItems.length === 0 ? (

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

                  ) : (

                    cartItems.map((item) => (

                      <div
                        key={item.cart_id}
                        className="row align-items-center border-bottom py-3"
                      >

                        <div className="col-md-2">

                          <img
                            src={`/images/${item.image}`}
                            alt={item.product_name}
                            className="img-fluid rounded"
                            style={{
                              width: "80px",
                              height: "80px",
                              objectFit: "cover"
                            }}
                          />

                        </div>

                        <div className="col-md-4">

                          <h5>{item.product_name}</h5>

                          <p className="text-secondary mb-0">
                            ₹{item.price}
                          </p>

                        </div>

                        <div className="col-md-2">

                      <div className="d-flex justify-content-center align-items-center">

                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => updateQuantity(item.cart_id, "decrease")}
                        >
                          −
                        </button>

                        <span className="mx-3 fw-bold">
                          {item.quantity}
                        </span>

                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => updateQuantity(item.cart_id, "increase")}
                        >
                          +
                        </button>

                      </div>

                    </div>

                        <div className="col-md-2 text-center">

                          <p className="fw-bold mb-1">
                            ₹{item.price}
                          </p>

                          

                        </div>

                        <div className="col-md-2 text-end">

                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => removeItem(item.cart_id)}
                          >
                            🗑 Remove
                          </button>

                        </div>

                      </div>

                    ))

                  )}

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
                      ₹{subtotal}
                    </span>

                  </div>

                  <div className="d-flex justify-content-between mb-3">

                    <span className="text-secondary">
                      Shipping
                    </span>

                    <span>
                      FREE
                    </span>

                  </div>

                  <hr />

                  <div className="d-flex justify-content-between mb-4">

                    <strong>
                      Total
                    </strong>

                    <strong>
                      ₹{subtotal}
                    </strong>

                  </div>

                  <div className="d-grid">

                   

                  <button
                    className="btn btn-dark btn-lg"
                    disabled={cartItems.length === 0}
                    onClick={() => navigate("/checkout")}
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