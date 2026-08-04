import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function Checkout() {

  const navigate = useNavigate();

  const customerId = localStorage.getItem("customerId");

  const [customer, setCustomer] = useState({});
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);

  const [houseNo, setHouseNo] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");

  useEffect(() => {

    if (!customerId) {

      alert("Please login first.");
      navigate("/login");
      return;

    }

    fetch(`http://127.0.0.1:5000/checkout/${customerId}`)
      .then((response) => response.json())
      .then((data) => {

        setCustomer(data.customer);
        setItems(data.items);
        setTotal(data.total);

      })
      .catch((error) => {

        console.error(error);

      });

  }, [customerId, navigate]);

async function handlePlaceOrder() {

  if (
    !houseNo.trim() ||
    !street.trim() ||
    !city.trim() ||
    !state.trim() ||
    !pincode.trim()
  ) {

    alert("Please fill the delivery address.");

    return;

  }

  const shippingAddress =
    `${houseNo}, ${street}, ${city}, ${state} - ${pincode}`;

  try {

    const response = await fetch(
      "http://127.0.0.1:5000/place-order",
      {

        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({

          customer_id: customerId,
          shipping_address: shippingAddress

        })

      }
    );

    const result = await response.json();

    if (response.ok) {

      alert(result.message);

      navigate("/orders");

    } else {

      alert(result.message || result.error);

    }

  } catch (error) {

    console.error(error);

    alert("Something went wrong.");

  }

}
  return (
    <>
      <Navbar />

      <section className="bg-light py-5 min-vh-100">

        <div className="container">

          <div className="text-center mb-5">

            <p className="text-uppercase text-secondary fw-bold">
              Secure Checkout
            </p>

            <h1 className="fw-bold">
              Checkout
            </h1>

          </div>

          <div className="row">

            {/* Left Section */}

            <div className="col-lg-8">

              {/* Customer */}

              <div className="card border-0 shadow-sm rounded-4 mb-4">

                <div className="card-body p-4">

                  <h4 className="fw-bold mb-4">
                    👤 Customer Information
                  </h4>

                  <p>
                    <strong>Name :</strong>{" "}
                    {customer.customer_name}
                  </p>

                  <p>
                    <strong>Address :</strong>{" "}
                    {customer.address}
                  </p>

                </div>

              </div>

              {/* Address */}

              <div className="card border-0 shadow-sm rounded-4">

                <div className="card-body p-4">

                  <h4 className="fw-bold mb-4">
                    📍 Delivery Address
                  </h4>

                  <div className="mb-3">

                    <label className="form-label">
                      House No
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      value={houseNo}
                      onChange={(e) =>
                        setHouseNo(e.target.value)
                      }
                    />

                  </div>

                  <div className="mb-3">

                    <label className="form-label">
                      Street
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      value={street}
                      onChange={(e) =>
                        setStreet(e.target.value)
                      }
                    />

                  </div>

                  <div className="row">

                    <div className="col-md-4 mb-3">

                      <label className="form-label">
                        City
                      </label>

                      <input
                        type="text"
                        className="form-control"
                        value={city}
                        onChange={(e) =>
                          setCity(e.target.value)
                        }
                      />

                    </div>

                    <div className="col-md-4 mb-3">

                      <label className="form-label">
                        State
                      </label>

                      <input
                        type="text"
                        className="form-control"
                        value={state}
                        onChange={(e) =>
                          setState(e.target.value)
                        }
                      />

                    </div>

                    <div className="col-md-4 mb-3">

                      <label className="form-label">
                        Pincode
                      </label>

                      <input
                        type="text"
                        className="form-control"
                        value={pincode}
                        onChange={(e) =>
                          setPincode(e.target.value)
                        }
                      />

                    </div>

                  </div>

                </div>

              </div>

            </div>

            {/* Right Section */}

            <div className="col-lg-4 mt-4 mt-lg-0">

              <div className="card border-0 shadow-sm rounded-4">

                <div className="card-body p-4">

                  <h4 className="fw-bold mb-4">
                    🛒 Order Summary
                  </h4>

                  {items.map((item, index) => (

                    <div
                      key={index}
                      className="mb-3 border-bottom pb-3"
                    >

                      <h6 className="fw-bold">
                        {item.product_name}
                      </h6>

                      <small className="text-secondary">
                        ₹{item.price} × {item.quantity}
                      </small>

                      <div className="fw-bold mt-1">
                        ₹{item.price * item.quantity}
                      </div>

                    </div>

                  ))}

                  <div className="d-flex justify-content-between">

                    <span>
                      Shipping
                    </span>

                    <strong>
                      FREE
                    </strong>

                  </div>

                  <hr />

                  <div className="d-flex justify-content-between mb-4">

                    <strong>Total</strong>

                    <strong>
                      ₹{total}
                    </strong>

                  </div>

                  <div className="d-grid gap-2">

                    <button
                      className="btn btn-outline-dark"
                      onClick={() => navigate("/cart")}
                    >
                      ← Back to Cart
                    </button>

                    <button
                      className="btn btn-dark"
                      onClick={handlePlaceOrder}
                    >
                      Place Order
                    </button>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

    </>
  );
}

export default Checkout;