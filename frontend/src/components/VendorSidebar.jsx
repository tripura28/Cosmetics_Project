import { Link, useNavigate, useLocation } from "react-router-dom";

function VendorSidebar() {

  const navigate = useNavigate();
  const location = useLocation();

  const vendorId = localStorage.getItem("vendorId");

  const vendorName =
    localStorage.getItem("vendorName") || "Vendor";

  const shopName =
    localStorage.getItem("shopName") || "My Shop";


  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {

    localStorage.removeItem("isVendorLoggedIn");
    localStorage.removeItem("vendorId");
    localStorage.removeItem("vendorName");
    localStorage.removeItem("shopName");
    localStorage.removeItem("vendorEmail");

    navigate("/choose-role");

  };


  // ==========================================
  // ACTIVE MENU
  // ==========================================

  const isActive = (path) => {
    return location.pathname === path;
  };


  const isProfileActive =
    location.pathname.startsWith("/vendor/profile");

  const isSalesActive =
    location.pathname.startsWith("/vendor/sales");

  const isOrdersActive =
    location.pathname.startsWith("/vendor/orders");

  const isProductsActive =
    location.pathname.startsWith("/vendor/products");


  return (

    <div
      className="d-flex flex-column"
      style={{
        width: "260px",
        minWidth: "260px",
        maxWidth: "260px",

        height: "100vh",
        minHeight: "100vh",

        flexShrink: 0,

        background: "#211B35",
        color: "white",

        position: "sticky",
        top: 0,

        overflowY: "auto",
        overflowX: "hidden"
      }}
    >

      {/* ================================= */}
      {/* LOGO */}
      {/* ================================= */}

      <div
        className="p-4"
        style={{
          flexShrink: 0
        }}
      >

        <h3
          className="fw-bold mb-1"
          style={{
            color: "#B9AEFF"
          }}
        >
          GlowCart
        </h3>

        <small
          style={{
            color: "#BDB8CC"
          }}
        >
          Seller Center
        </small>

      </div>


      <hr
        className="my-0"
        style={{
          borderColor: "#403953",
          opacity: 1
        }}
      />


      {/* ================================= */}
      {/* VENDOR INFORMATION */}
      {/* ================================= */}

      <div
        className="px-4 py-3"
        style={{
          background: "#2B2442",
          flexShrink: 0
        }}
      >

        <div
          className="fw-semibold text-truncate"
          style={{
            color: "#FFFFFF"
          }}
          title={shopName}
        >
          🏪 {shopName}
        </div>

        <small
          className="d-block text-truncate"
          style={{
            color: "#BDB8CC"
          }}
          title={vendorName}
        >
          {vendorName}
        </small>

      </div>


      {/* ================================= */}
      {/* NAVIGATION */}
      {/* ================================= */}

      <div
        className="p-3 flex-grow-1"
        style={{
          minHeight: 0
        }}
      >

        <small
          className="px-3 text-uppercase"
          style={{
            color: "#8F899F",
            letterSpacing: "1px"
          }}
        >
          Seller Menu
        </small>


        <div className="mt-3">


          {/* DASHBOARD */}

          <Link
            to="/vendor-dashboard"
            className="d-flex align-items-center gap-3 px-3 py-3 rounded-3 text-decoration-none mb-2"
            style={{
              width: "100%",
              background: isActive("/vendor-dashboard")
                ? "#7C6EE6"
                : "transparent",
              color: "white",
              whiteSpace: "nowrap"
            }}
          >

            <span>📊</span>

            <span>
              Dashboard
            </span>

          </Link>


          {/* MY PRODUCTS */}

          <Link
            to="/vendor/products"
            className="d-flex align-items-center gap-3 px-3 py-3 rounded-3 text-decoration-none mb-2"
            style={{
              width: "100%",
              background: isProductsActive
                ? "#7C6EE6"
                : "transparent",
              color: "white",
              whiteSpace: "nowrap"
            }}
          >

            <span>📦</span>

            <span>
              My Products
            </span>

          </Link>


          {/* ORDERS */}

          <Link
            to={`/vendor/orders/${vendorId}`}
            className="d-flex align-items-center gap-3 px-3 py-3 rounded-3 text-decoration-none mb-2"
            style={{
              width: "100%",
              background: isOrdersActive
                ? "#7C6EE6"
                : "transparent",
              color: "white",
              whiteSpace: "nowrap"
            }}
          >

            <span>🛒</span>

            <span>
              Orders
            </span>

          </Link>


          {/* SALES */}

          <Link
            to={`/vendor/sales/${vendorId}`}
            className="d-flex align-items-center gap-3 px-3 py-3 rounded-3 text-decoration-none mb-2"
            style={{
              width: "100%",
              background: isSalesActive
                ? "#7C6EE6"
                : "transparent",
              color: "white",
              whiteSpace: "nowrap"
            }}
          >

            <span>💰</span>

            <span>
              Sales
            </span>

          </Link>


          {/* PROFILE */}

          <Link
            to={`/vendor/profile/${vendorId}`}
            className="d-flex align-items-center gap-3 px-3 py-3 rounded-3 text-decoration-none mb-2"
            style={{
              width: "100%",
              background: isProfileActive
                ? "#7C6EE6"
                : "transparent",
              color: "white",
              whiteSpace: "nowrap"
            }}
          >

            <span>👤</span>

            <span>
              Profile
            </span>

          </Link>


        </div>

      </div>


      {/* ================================= */}
      {/* LOGOUT */}
      {/* ================================= */}

      <div
        className="p-3"
        style={{
          flexShrink: 0
        }}
      >

        <button
          onClick={handleLogout}
          className="btn w-100 text-start px-3 py-3 rounded-3"
          style={{
            color: "#FFFFFF",
            background: "#2B2442",
            border: "none",
            whiteSpace: "nowrap"
          }}
        >
          ↩️ &nbsp; Logout
        </button>

      </div>

    </div>

  );

}

export default VendorSidebar;