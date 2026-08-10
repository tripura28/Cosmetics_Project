import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function AdminRegister() {

  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");

  const navigate = useNavigate();

  async function handleRegister(e) {

    e.preventDefault();

    const admin = {
      admin_name: adminName,
      admin_email: adminEmail,
      admin_password: adminPassword,
    };

    try {

      const response = await fetch("http://127.0.0.1:5000/admin-register", {

        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(admin),

      });

      const result = await response.json();

      if (response.ok) {

        alert(result.message);

        setAdminName("");
        setAdminEmail("");
        setAdminPassword("");

        navigate("/admin-login");

      } else {

        alert(result.error || result.message);

      }

    } catch (error) {

      console.error(error);
      alert("Something went wrong");

    }

  }

  return (

    <section className="bg-light min-vh-100 py-5">

      <div className="container py-5">

        <div className="row justify-content-center">

          <div className="col-lg-5">

            <div className="card shadow border-0 rounded-4">

              <div className="card-body p-5">

                <div className="text-center mb-4">

                  <h2 className="fw-bold">
                    Create Admin Account
                  </h2>

                  <p className="text-secondary">
                    Register to access the GlowCart Administration Dashboard.
                  </p>

                </div>

                <form onSubmit={handleRegister}>

                  <div className="mb-3">

                    <label className="form-label">
                      Admin Name
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      value={adminName}
                      onChange={(e) => setAdminName(e.target.value)}
                      required
                    />

                  </div>

                  <div className="mb-3">

                    <label className="form-label">
                      Email Address
                    </label>

                    <input
                      type="email"
                      className="form-control"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      required
                    />

                  </div>

                  <div className="mb-4">

                    <label className="form-label">
                      Password
                    </label>

                    <input
                      type="password"
                      className="form-control"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      required
                    />

                  </div>

                  <div className="d-grid">

                    <button
                      type="submit"
                      className="btn btn-dark btn-lg"
                    >
                      Register
                    </button>

                  </div>

                </form>

                <div className="text-center mt-4">

                  <p className="mb-0">

                    Already have an admin account?{" "}

                    <Link
                      to="/admin-login"
                      className="fw-bold text-decoration-none"
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

  );
}

export default AdminRegister;