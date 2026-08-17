import { Link, useNavigate } from "react-router-dom";

function Sidebar() {

  const navigate = useNavigate();
  const adminName = localStorage.getItem("adminName");

  function handleLogout() {

    localStorage.removeItem("isAdminLoggedIn");
    localStorage.removeItem("adminId");
    localStorage.removeItem("adminName");
    localStorage.removeItem("adminEmail");

    navigate("/choose-role");

  }

  return (

    <div
      className="d-flex flex-column p-4"
      style={{
        width: "260px",
        minHeight: "100vh",
        background: "#2F2A55",
        color: "white"
      }}
    >

      <h3
        className="fw-bold mb-5"
        style={{
          color: "#FFFFFF"
        }}
      >
        GlowCart Admin
      </h3>

      <Link
        to="/admin-dashboard"
        className="text-white text-decoration-none mb-4"
      >
        🏠 Dashboard
      </Link>

      <Link
        to="/admin/products"
        className="text-white text-decoration-none mb-4"
      >
        📦 Products
      </Link>

      <Link
        to="/admin/categories"
        className="text-white text-decoration-none mb-4"
      >
        📂 Categories
      </Link>

      <Link
        to="/admin/orders"
        className="text-white text-decoration-none mb-4"
      >
        📋 Orders
      </Link>
          <Link
      to="/admin/vendors"
      className="text-white text-decoration-none mb-4"
    >
      🏪 Vendors
    </Link>

      <Link
        to="/admin/customers"
        className="text-white text-decoration-none mb-4"
      >
        👥 Customers
      </Link>

      <div className="mt-auto">

        <hr />

        <p className="mb-3">
          👤 {adminName}
        </p>

        <button
          className="btn btn-light w-100"
          onClick={handleLogout}
        >
          Logout
        </button>

      </div>

    </div>

  );
}

export default Sidebar;