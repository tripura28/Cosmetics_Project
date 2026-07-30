import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function Register() {

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPassword, setCustomerPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");

  const handleRegister = async (e) => {

    e.preventDefault();

    if (customerPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const customer = {
      customer_name: customerName,
      customer_email: customerEmail,
      customer_password: customerPassword,
      customer_phone: customerPhone,
      customer_address: customerAddress
    };

    try {

      const response = await fetch("http://127.0.0.1:5000/register", {

        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify(customer)

      });

      const result = await response.json();

      alert(result.message);

      setCustomerName("");
      setCustomerEmail("");
      setCustomerPassword("");
      setConfirmPassword("");
      setCustomerPhone("");
      setCustomerAddress("");

    }
    catch (error) {

      console.log(error);

      alert("Something went wrong");

    }

  };

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
                      Create Account
                    </h2>

                    <p className="text-secondary">
                      Join GlowCart and start shopping
                    </p>

                  </div>

                  <form onSubmit={handleRegister}>

                    <div className="mb-3">

                      <label className="form-label fw-semibold">
                        Full Name
                      </label>

                      <input
                        type="text"
                        className="form-control form-control-lg"
                        placeholder="Enter your full name"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                      />

                    </div>

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
                      />

                    </div>

                    <div className="mb-3">

                      <label className="form-label fw-semibold">
                        Phone Number
                      </label>

                      <input
                        type="text"
                        className="form-control form-control-lg"
                        placeholder="Enter your phone number"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                      />

                    </div>

                    <div className="mb-3">

                      <label className="form-label fw-semibold">
                        Address
                      </label>

                      <textarea
                        className="form-control"
                        placeholder="Enter your address"
                        value={customerAddress}
                        onChange={(e) => setCustomerAddress(e.target.value)}
                      ></textarea>

                    </div>

                    <div className="mb-3">

                      <label className="form-label fw-semibold">
                        Password
                      </label>

                      <input
                        type="password"
                        className="form-control form-control-lg"
                        placeholder="Create a password"
                        value={customerPassword}
                        onChange={(e) => setCustomerPassword(e.target.value)}
                      />

                    </div>

                    <div className="mb-4">

                      <label className="form-label fw-semibold">
                        Confirm Password
                      </label>

                      <input
                        type="password"
                        className="form-control form-control-lg"
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />

                    </div>

                    <div className="form-check mb-4">

                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="terms"
                      />

                      <label
                        className="form-check-label"
                        htmlFor="terms"
                      >
                        I agree to the Terms & Conditions
                      </label>

                    </div>

                    <div className="d-grid">

                      <button
                        type="submit"
                        className="btn btn-dark btn-lg"
                      >
                        Create Account
                      </button>

                    </div>

                  </form>

                  <div className="text-center mt-4">

                    <p className="text-secondary mb-0">

                      Already have an account?{" "}

                      <Link
                        to="/login"
                        className="fw-bold text-dark text-decoration-none"
                      >
                        Login
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

export default Register;