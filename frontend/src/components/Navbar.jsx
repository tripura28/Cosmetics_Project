import { Link, useNavigate } from "react-router-dom";

function Navbar() {

  const navigate = useNavigate();

  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const customerName = localStorage.getItem("customerName");

  function handleLogout() {
    localStorage.clear();
    navigate("/login");
  }

  return (
    <nav className="navbar navbar-expand-lg bg-white shadow-sm sticky-top py-3">

      <div className="container">

        {/* Logo */}
        <Link
          className="navbar-brand"
          to="/"
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: "2rem",
            fontWeight: "700",
            letterSpacing: "1px",
            color: "#7C6EE6"
          }}
        >
          GlowCart
        </Link>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse"
          id="navbarNav"
        >

          {/* Menu */}
          <ul className="navbar-nav mx-auto">

            <li className="nav-item mx-2">
              <Link className="nav-link fw-semibold" to="/">
                Home
              </Link>
            </li>

            <li className="nav-item mx-2">
              <Link className="nav-link fw-semibold" to="/products">
                Products
              </Link>
            </li>

            <li className="nav-item mx-2">
              <Link className="nav-link fw-semibold" to="/categories">
                Categories
              </Link>
            </li>

            <li className="nav-item mx-2">
              <Link className="nav-link fw-semibold" to="/about">
                About
              </Link>
            </li>

          </ul>

          {/* Right Side */}
          <div className="d-flex align-items-center gap-3">

            <Link
              to="/cart"
              className="btn rounded-pill px-4"
              style={{
                backgroundColor: "#F5F3FF",
                color: "#7C6EE6",
                border: "none",
                fontWeight: "600"
              }}
            >
              🛒 Cart
            </Link>

            {!isLoggedIn ? (

              <Link
                to="/choose-role"
                className="btn rounded-pill px-4"
                style={{
                  backgroundColor: "#7C6EE6",
                  color: "white",
                  border: "none",
                  fontWeight: "600"
                }}
              >
                Login
              </Link>

            ) : (

              <div className="dropdown">

                <button
                  className="btn rounded-pill dropdown-toggle px-4"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{
                    backgroundColor: "#F5F3FF",
                    color: "#7C6EE6",
                    border: "none",
                    fontWeight: "600"
                  }}
                >
                  👤 {customerName}
                </button>

                <ul className="dropdown-menu dropdown-menu-end shadow rounded-4 border-0">

                  <li>
                    <Link
                      className="dropdown-item py-2"
                      to="/orders"
                    >
                      📦 My Orders
                    </Link>
                  </li>

                  <li>
                    <Link
                      className="dropdown-item py-2"
                      to="/wishlist"
                    >
                      ❤️ Wishlist
                    </Link>
                  </li>

                  <li>
                    <hr className="dropdown-divider" />
                  </li>

                  <li>
                    <button
                      className="dropdown-item py-2"
                      onClick={handleLogout}
                      style={{
                        color: "#7C6EE6",
                        fontWeight: "500"
                      }}
                    >
                      ↩️ Sign Out
                    </button>
                  </li>

                </ul>

              </div>

            )}

          </div>

        </div>

      </div>

    </nav>
  );
}

export default Navbar;