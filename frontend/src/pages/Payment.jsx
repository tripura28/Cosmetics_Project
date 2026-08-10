import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function Payment() {

  const navigate = useNavigate();
  const location = useLocation();

  const customerId = localStorage.getItem("customerId");

  // Address received from Checkout.jsx
  const shippingAddress = location.state?.shippingAddress;

  const [loading, setLoading] = useState(false);

  // ==========================================
  // LOGIN CHECK
  // ==========================================

  useEffect(() => {

    if (!customerId) {

      alert("Please login first.");

      navigate("/choose-role");

      return;
    }

    // If user directly opens /payment without
    // coming from Checkout
    if (!shippingAddress) {

      alert("Please complete checkout first.");

      navigate("/checkout");

      return;
    }

  }, [customerId, shippingAddress, navigate]);


  // ==========================================
  // LOAD RAZORPAY SCRIPT
  // ==========================================

  function loadRazorpayScript() {

    return new Promise((resolve) => {

      const existingScript = document.querySelector(
        'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
      );

      if (existingScript) {

        resolve(true);

        return;
      }

      const script = document.createElement("script");

      script.src =
        "https://checkout.razorpay.com/v1/checkout.js";

      script.onload = () => {

        resolve(true);

      };

      script.onerror = () => {

        resolve(false);

      };

      document.body.appendChild(script);

    });

  }


  // ==========================================
  // HANDLE PAYMENT
  // ==========================================

  async function handlePayment() {

    if (!customerId) {

      alert("Please login first.");

      navigate("/choose-role");

      return;
    }

    if (!shippingAddress) {

      alert("Delivery address is missing.");

      navigate("/checkout");

      return;
    }

    setLoading(true);

    try {

      // ======================================
      // LOAD RAZORPAY
      // ======================================

      const scriptLoaded =
        await loadRazorpayScript();

      if (!scriptLoaded) {

        alert(
          "Unable to load Razorpay. Please check your internet connection."
        );

        setLoading(false);

        return;
      }


      // ======================================
      // CREATE RAZORPAY ORDER
      // ======================================

      const orderResponse = await fetch(
        "http://127.0.0.1:5000/create-razorpay-order",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            customer_id: customerId
          })
        }
      );


      const orderData =
        await orderResponse.json();


      if (!orderResponse.ok) {

        alert(
          orderData.error ||
          "Unable to create payment order."
        );

        setLoading(false);

        return;
      }


      // ======================================
      // RAZORPAY OPTIONS
      // ======================================

      const options = {

        key: orderData.key_id,

        amount: orderData.amount,

        currency: orderData.currency,

        name: "GlowCart Cosmetics",

        description: "GlowCart Order",

        order_id:
          orderData.razorpay_order_id,


        handler: async function (response) {

          try {

            // ==================================
            // VERIFY PAYMENT
            // ==================================

            const verifyResponse = await fetch(
              "http://127.0.0.1:5000/verify-payment",
              {
                method: "POST",

                headers: {
                  "Content-Type": "application/json"
                },

                body: JSON.stringify({

                  customer_id: customerId,

                  shipping_address:
                    shippingAddress,

                  razorpay_order_id:
                    response.razorpay_order_id,

                  razorpay_payment_id:
                    response.razorpay_payment_id,

                  razorpay_signature:
                    response.razorpay_signature

                })
              }
            );


            const verifyData =
              await verifyResponse.json();


            if (verifyResponse.ok) {

              alert(
                "Payment successful! Your order has been placed."
              );

              navigate("/orders");

            } else {

              alert(
                verifyData.error ||
                "Payment verification failed."
              );

            }

          } catch (error) {

            console.error(
              "Payment verification error:",
              error
            );

            alert(
              "Payment verification failed."
            );

          } finally {

            setLoading(false);

          }

        },


        modal: {

          ondismiss: function () {

            setLoading(false);

          }

        }

      };


      // ======================================
      // CREATE RAZORPAY INSTANCE
      // ======================================

      const razorpay =
        new window.Razorpay(options);


      // ======================================
      // PAYMENT FAILED
      // ======================================

      razorpay.on(
        "payment.failed",
        function (response) {

          console.error(
            "Payment failed:",
            response.error
          );

          alert(
            response.error.description ||
            "Payment failed."
          );

          setLoading(false);

        }
      );


      // ======================================
      // OPEN RAZORPAY
      // ======================================

      razorpay.open();

    } catch (error) {

      console.error(
        "Razorpay error:",
        error
      );

      alert(
        "Something went wrong while starting payment."
      );

      setLoading(false);

    }

  }


  // ==========================================
  // UI
  // ==========================================

  return (

    <>

      <Navbar />

      <section
        className="bg-light min-vh-100 d-flex align-items-center py-5"
      >

        <div className="container">

          <div className="row justify-content-center">

            <div className="col-md-6 col-lg-5">

              <div className="card border-0 shadow-sm rounded-4">

                <div className="card-body text-center p-5">

                  {/* Icon */}

                  <div
                    className="rounded-circle bg-dark text-white d-flex align-items-center justify-content-center mx-auto mb-4"
                    style={{
                      width: "80px",
                      height: "80px",
                      fontSize: "35px"
                    }}
                  >
                    💳
                  </div>


                  {/* Heading */}

                  <p className="text-uppercase text-secondary fw-bold mb-2">
                    Secure Payment
                  </p>

                  <h2 className="fw-bold mb-3">
                    Complete Your Payment
                  </h2>

                  <p className="text-secondary mb-4">
                    Your order is ready for payment.
                    Click the button below to continue
                    securely with Razorpay.
                  </p>


                  {/* Address confirmation */}

                  <div className="bg-light rounded-3 p-3 mb-4 text-start">

                    <small className="text-secondary d-block mb-1">
                      Delivery Address
                    </small>

                    <strong>
                      {shippingAddress}
                    </strong>

                  </div>


                  {/* Payment Button */}

                  <div className="d-grid gap-2">

                    <button
                      type="button"
                      className="btn btn-dark btn-lg"
                      onClick={handlePayment}
                      disabled={loading}
                    >

                      {loading
                        ? "Opening Razorpay..."
                        : "💳 Pay with Razorpay"}

                    </button>


                    <button
                      type="button"
                      className="btn btn-outline-dark"
                      onClick={() =>
                        navigate("/checkout")
                      }
                      disabled={loading}
                    >

                      ← Back to Checkout

                    </button>

                  </div>


                  <p className="text-muted small mt-4 mb-0">

                    🔒 You will be redirected to
                    Razorpay's secure payment window.

                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

    </>

  );

}

export default Payment;