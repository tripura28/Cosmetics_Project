import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function VendorLogin() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {

    e.preventDefault();

    if (!email || !password) {
      alert("Please enter email and password.");
      return;
    }

    setLoading(true);

    try {

      const response = await fetch(
        "http://127.0.0.1:5000/vendor-login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            vendor_email: email,
            vendor_password: password
          })
        }
      );

      const result = await response.json();

      if (response.ok) {

        // Clear other login information
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("isAdminLoggedIn");

        // Store vendor information
        localStorage.setItem(
          "isVendorLoggedIn",
          "true"
        );

        localStorage.setItem(
          "vendorId",
          result.vendor_id
        );

        localStorage.setItem(
          "vendorName",
          result.vendor_name
        );

        localStorage.setItem(
          "shopName",
          result.shop_name
        );

        localStorage.setItem(
          "vendorEmail",
          result.vendor_email
        );

        alert(
          result.message ||
          "Vendor Login Successful"
        );

        navigate("/vendor-dashboard");

      } else {

        alert(
          result.error ||
          "Vendor login failed."
        );

      }

    } catch (error) {

      console.error(error);

      alert(
        "Unable to connect to the server."
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <section
      className="bg-light min-vh-100 py-5"
    >

      <div className="container">

        <div className="row justify-content-center">

          <div className="col-md-6 col-lg-5">

            <div className="card border-0 shadow-sm rounded-4">

              <div className="card-body p-4 p-md-5">

                {/* Header */}

                <div className="text-center mb-4">

                  <h2
                    className="fw-bold"
                    style={{
                      color: "#7C6EE6"
                    }}
                  >
                    Vendor Login
                  </h2>

                  <p className="text-secondary">
                    Login to manage your GlowCart shop
                  </p>

                </div>

                <form onSubmit={handleLogin}>

                  {/* Email */}

                  <div className="mb-3">

                    <label className="form-label fw-semibold">
                      Email
                    </label>

                    <input
                      type="email"
                      className="form-control"
                      placeholder="Enter your vendor email"
                      value={email}
                      onChange={(e) =>
                        setEmail(e.target.value)
                      }
                    />

                  </div>

                  {/* Password */}

                  <div className="mb-4">

                    <label className="form-label fw-semibold">
                      Password
                    </label>

                    <input
                      type="password"
                      className="form-control"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) =>
                        setPassword(e.target.value)
                      }
                    />

                  </div>

                  {/* Login Button */}

                  <button
                    type="submit"
                    className="btn btn-lg w-100"
                    disabled={loading}
                    style={{
                      backgroundColor: "#7C6EE6",
                      color: "white",
                      border: "none"
                    }}
                  >

                    {loading
                      ? "Logging in..."
                      : "Login as Vendor"}

                  </button>

                </form>

                {/* Register */}

                <div className="text-center mt-4">

                  <p className="text-secondary mb-2">
                    Don't have a vendor account?
                  </p>

                  <Link
                    to="/vendor-register"
                    className="fw-semibold text-decoration-none"
                    style={{
                      color: "#7C6EE6"
                    }}
                  >
                    Register as Vendor
                  </Link>

                </div>

                {/* Back */}

                <div className="text-center mt-3">

                  <Link
                    to="/choose-role"
                    className="text-secondary text-decoration-none"
                  >
                    ← Back to Choose Role
                  </Link>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>

  );

}

export default VendorLogin;