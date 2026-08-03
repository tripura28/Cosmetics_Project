import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useState } from "react";

function Login() {

  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPassword, setCustomerPassword] = useState("");

  const navigate = useNavigate();

  async function handleLogin(e) {

    e.preventDefault();

    const customer = {
      customer_email: customerEmail,
      customer_password: customerPassword,
    };

    try {

      const response = await fetch("http://127.0.0.1:5000/login", {

        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(customer),

      });

      const result = await response.json();

      if (response.ok) {

        // Save login information
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("customerId", result.customer_id);
        localStorage.setItem("customerName", result.customer_name);
        localStorage.setItem("customerEmail", customerEmail);

        // Clear form
        setCustomerEmail("");
        setCustomerPassword("");

        // Redirect to Home
        navigate("/");

      } else {

        alert(result.message);

      }

    } catch (error) {

      console.error(error);
      alert("Something went wrong");

    }

  }

  return (
    <>
      <Navbar />

      <section className="bg-light min-vh-100 py-5">

        <div className="container py-5">

          <div className="row justify-content-center">

            <div className="col-12 col-md-8 col-lg-5">

              <div className="card border-0 shadow-sm rounded-4">

                <div className="card-body p-4 p-md-5">

                  <div className="text-center mb-4">

                    <h2 className="fw-bold">
                      Welcome Back
                    </h2>

                    <p className="text-secondary">
                      Login to continue shopping with GlowCart
                    </p>

                  </div>

                  <form onSubmit={handleLogin}>

                    <div className="mb-3">

                      <label className="form-label fw-semibold">
                        Email Address
                      </label>

                      <input
                        type="email"
                        className="form-control form-control-lg"
                        placeholder="Enter your email"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        required
                      />

                    </div>

                    <div className="mb-3">

                      <label className="form-label fw-semibold">
                        Password
                      </label>

                      <input
                        type="password"
                        className="form-control form-control-lg"
                        placeholder="Enter your password"
                        value={customerPassword}
                        onChange={(e) => setCustomerPassword(e.target.value)}
                        required
                      />

                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-4">

                      <div className="form-check">

                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="remember"
                        />

                        <label
                          className="form-check-label"
                          htmlFor="remember"
                        >
                          Remember me
                        </label>

                      </div>

                      <Link
                        to="/forgot-password"
                        className="text-dark text-decoration-none"
                      >
                        Forgot Password?
                      </Link>

                    </div>

                    <div className="d-grid">

                      <button
                        type="submit"
                        className="btn btn-dark btn-lg"
                      >
                        Login
                      </button>

                    </div>

                  </form>

                  <div className="text-center mt-4">

                    <p className="text-secondary mb-0">

                      Don't have an account?{" "}

                      <Link
                        to="/register"
                        className="fw-bold text-dark text-decoration-none"
                      >
                        Create Account
                      </Link>

                    </p>

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

export default Login;