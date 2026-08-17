import { useNavigate } from "react-router-dom";

function ChooseRole() {

  const navigate = useNavigate();

  return (

    <section
      className="min-vh-100 d-flex align-items-center"
      style={{
        background: "linear-gradient(135deg,#F8F5FF,#FFFFFF)"
      }}
    >

      <div className="container">

        {/* Heading */}

        <div className="text-center mb-5">

          <h1
            className="fw-bold"
            style={{
              color: "#7C6EE6",
              fontFamily: "'Cinzel', serif"
            }}
          >
            Welcome to GlowCart
          </h1>

          <p
            className="text-secondary mx-auto"
            style={{
              maxWidth: "720px",
              fontSize: "1.05rem"
            }}
          >
            Sign in to access your GlowCart account. Whether you're here to
            explore premium beauty products, manage your store, or handle
            platform operations, choose the portal that best matches your role.
          </p>

        </div>


        <div className="row g-4 justify-content-center">

          {/* ========================= */}
          {/* CUSTOMER CARD */}
          {/* ========================= */}

          <div className="col-md-4">

            <div
              className="card border-0 shadow rounded-4 h-100"
              style={{
                transition: "0.3s",
                cursor: "pointer"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-8px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >

              <div className="card-body p-4 p-lg-5 text-center">

                <div
                  className="rounded-circle mx-auto d-flex align-items-center justify-content-center mb-4"
                  style={{
                    width: "90px",
                    height: "90px",
                    background: "#F5F3FF",
                    fontSize: "2.5rem"
                  }}
                >
                  👤
                </div>

                <h3 className="fw-bold">
                  Customer Portal
                </h3>

                <p className="text-secondary mt-3">

                  Sign in to browse our beauty collections,
                  manage your wishlist, shopping cart and
                  orders while enjoying a personalized
                  shopping experience.

                </p>

                <button
                  className="btn mt-4 px-4 rounded-pill"
                  style={{
                    background: "#7C6EE6",
                    color: "white"
                  }}
                  onClick={() => navigate("/login")}
                >
                  Login as Customer →
                </button>

              </div>

            </div>

          </div>


          {/* ========================= */}
          {/* VENDOR CARD */}
          {/* ========================= */}

          <div className="col-md-4">

            <div
              className="card border-0 shadow rounded-4 h-100"
              style={{
                transition: "0.3s",
                cursor: "pointer"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-8px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >

              <div className="card-body p-4 p-lg-5 text-center">

                <div
                  className="rounded-circle mx-auto d-flex align-items-center justify-content-center mb-4"
                  style={{
                    width: "90px",
                    height: "90px",
                    background: "#F5F3FF",
                    fontSize: "2.5rem"
                  }}
                >
                  🏪
                </div>

                <h3 className="fw-bold">
                  Vendor Portal
                </h3>

                <p className="text-secondary mt-3">

                  Manage your beauty store, add and update
                  your products, track customer orders and
                  monitor your shop's sales and performance.

                </p>

                <button
                  className="btn mt-4 px-4 rounded-pill"
                  style={{
                    background: "#7C6EE6",
                    color: "white"
                  }}
                  onClick={() => navigate("/vendor-login")}
                >
                  Login as Vendor →
                </button>

                <div className="mt-3">

                  <button
                    className="btn btn-sm text-decoration-none"
                    style={{
                      color: "#7C6EE6",
                      background: "transparent",
                      border: "none"
                    }}
                    onClick={() => navigate("/vendor-register")}
                  >
                    Become a Vendor
                  </button>

                </div>

              </div>

            </div>

          </div>


          {/* ========================= */}
          {/* ADMIN CARD */}
          {/* ========================= */}

          <div className="col-md-4">

            <div
              className="card border-0 shadow rounded-4 h-100"
              style={{
                transition: "0.3s",
                cursor: "pointer"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-8px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >

              <div className="card-body p-4 p-lg-5 text-center">

                <div
                  className="rounded-circle mx-auto d-flex align-items-center justify-content-center mb-4"
                  style={{
                    width: "90px",
                    height: "90px",
                    background: "#F5F3FF",
                    fontSize: "2.5rem"
                  }}
                >
                  👨‍💼
                </div>

                <h3 className="fw-bold">
                  Admin Portal
                </h3>

                <p className="text-secondary mt-3">

                  Sign in to manage products,
                  categories, customer orders,
                  vendors, customers, inventory and
                  administrative operations.

                </p>

                <button
                  className="btn mt-4 px-4 rounded-pill"
                  style={{
                    background: "#7C6EE6",
                    color: "white"
                  }}
                  onClick={() => navigate("/admin-login")}
                >
                  Login as Admin →
                </button>

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>

  );

}

export default ChooseRole;