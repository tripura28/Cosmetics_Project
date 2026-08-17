import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function VendorRegister() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    vendor_name: "",
    shop_name: "",
    vendor_email: "",
    vendor_phone: "",
    vendor_password: "",
    vendor_address: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (
      !formData.vendor_name ||
      !formData.shop_name ||
      !formData.vendor_email ||
      !formData.vendor_password
    ) {
      alert("Please fill all required fields.");
      return;
    }

    setLoading(true);

    try {

      const response = await fetch(
        "http://127.0.0.1:5000/vendor-register",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify(formData)
        }
      );

      const result = await response.json();

      if (response.ok) {

        alert(
          result.message ||
          "Vendor registration successful."
        );

        navigate("/vendor-login");

      } else {

        alert(
          result.error ||
          "Vendor registration failed."
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

        <div
          className="row justify-content-center"
        >

          <div className="col-md-7 col-lg-6">

            <div
              className="card border-0 shadow-sm rounded-4"
            >

              <div className="card-body p-4 p-md-5">

                {/* Header */}

                <div className="text-center mb-4">

                  <h2
                    className="fw-bold"
                    style={{
                      color: "#7C6EE6"
                    }}
                  >
                    Become a Vendor
                  </h2>

                  <p className="text-secondary">
                    Register your shop with GlowCart
                  </p>

                </div>

                <form onSubmit={handleSubmit}>

                  {/* Vendor Name */}

                  <div className="mb-3">

                    <label className="form-label fw-semibold">
                      Vendor Name *
                    </label>

                    <input
                      type="text"
                      name="vendor_name"
                      className="form-control"
                      placeholder="Enter your name"
                      value={formData.vendor_name}
                      onChange={handleChange}
                    />

                  </div>

                  {/* Shop Name */}

                  <div className="mb-3">

                    <label className="form-label fw-semibold">
                      Shop Name *
                    </label>

                    <input
                      type="text"
                      name="shop_name"
                      className="form-control"
                      placeholder="Enter your shop name"
                      value={formData.shop_name}
                      onChange={handleChange}
                    />

                  </div>

                  {/* Email */}

                  <div className="mb-3">

                    <label className="form-label fw-semibold">
                      Email *
                    </label>

                    <input
                      type="email"
                      name="vendor_email"
                      className="form-control"
                      placeholder="Enter your email"
                      value={formData.vendor_email}
                      onChange={handleChange}
                    />

                  </div>

                  {/* Phone */}

                  <div className="mb-3">

                    <label className="form-label fw-semibold">
                      Phone
                    </label>

                    <input
                      type="tel"
                      name="vendor_phone"
                      className="form-control"
                      placeholder="Enter your phone number"
                      value={formData.vendor_phone}
                      onChange={handleChange}
                    />

                  </div>

                  {/* Password */}

                  <div className="mb-3">

                    <label className="form-label fw-semibold">
                      Password *
                    </label>

                    <input
                      type="password"
                      name="vendor_password"
                      className="form-control"
                      placeholder="Create a password"
                      value={formData.vendor_password}
                      onChange={handleChange}
                    />

                  </div>

                  {/* Address */}

                  <div className="mb-4">

                    <label className="form-label fw-semibold">
                      Address
                    </label>

                    <textarea
                      name="vendor_address"
                      className="form-control"
                      rows="3"
                      placeholder="Enter your shop/business address"
                      value={formData.vendor_address}
                      onChange={handleChange}
                    />

                  </div>

                  {/* Register */}

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
                      ? "Creating Account..."
                      : "Register as Vendor"}

                  </button>

                </form>

                {/* Login */}

                <div className="text-center mt-4">

                  <p className="text-secondary mb-2">
                    Already have a vendor account?
                  </p>

                  <Link
                    to="/vendor-login"
                    className="fw-semibold text-decoration-none"
                    style={{
                      color: "#7C6EE6"
                    }}
                  >
                    Login as Vendor
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

export default VendorRegister;