import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import VendorSidebar from "../components/VendorSidebar";

function VendorDashboard() {

  const vendorName =
    localStorage.getItem("vendorName") || "Vendor";

  const shopName =
    localStorage.getItem("shopName") || "My Shop";

  const vendorId =
    localStorage.getItem("vendorId");

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);


  // =====================================================
  // FETCH VENDOR DASHBOARD
  // =====================================================

  useEffect(() => {

    if (!vendorId) {
      setLoading(false);
      return;
    }

    fetch(
      `http://127.0.0.1:5000/vendor/dashboard/${vendorId}`
    )
      .then((response) => response.json())

      .then((data) => {

        if (data.error) {

          alert(data.error);

          return;
        }

        setDashboard(data);

      })

      .catch((error) => {

        console.error(error);

        alert(
          "Unable to load vendor dashboard."
        );

      })

      .finally(() => {

        setLoading(false);

      });

  }, [vendorId]);


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (

      <div
        className="d-flex"
        style={{
          minHeight: "100vh",
          background: "#F7F6FB"
        }}
      >

        <VendorSidebar />

        <div
          className="flex-grow-1 d-flex align-items-center justify-content-center"
        >

          <div className="text-center">

            <div className="spinner-border text-dark"></div>

            <p className="text-secondary mt-3">
              Loading dashboard...
            </p>

          </div>

        </div>

      </div>

    );

  }


  return (

    <div
      className="d-flex"
      style={{
        minHeight: "100vh",
        background: "#F7F6FB"
      }}
    >

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <VendorSidebar />


      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <div
        className="flex-grow-1 p-4 p-md-5"
      >


        {/* =================================================
            HEADER
        ================================================= */}

        <div
          className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4"
        >

          <div>

            <p
              className="mb-1"
              style={{
                color: "#7C6EE6",
                fontWeight: "600"
              }}
            >
              SELLER CENTER
            </p>

            <h2 className="fw-bold mb-1">

              Good morning, {vendorName}! 👋

            </h2>

            <p className="text-secondary mb-0">

              Here's what's happening with {shopName}.

            </p>

          </div>

        </div>


        {/* =================================================
            STATISTICS
        ================================================= */}

        <div className="row g-4 mb-4">


          {/* PRODUCTS */}

          <div className="col-md-4">

            <div
              className="card border-0 shadow-sm rounded-4 h-100"
            >

              <div className="card-body p-4">

                <div className="d-flex justify-content-between">

                  <div>

                    <p className="text-secondary mb-2">
                      My Products
                    </p>

                    <h2 className="fw-bold mb-0">

                      {dashboard?.statistics?.products ?? 0}

                    </h2>

                  </div>


                  <div
                    className="rounded-3 d-flex align-items-center justify-content-center"
                    style={{
                      width: "50px",
                      height: "50px",
                      background: "#F0EDFF",
                      fontSize: "22px"
                    }}
                  >
                    📦
                  </div>

                </div>

                <p className="text-secondary small mt-3 mb-0">

                  Products listed in your shop

                </p>

              </div>

            </div>

          </div>


          {/* ORDERS */}

          <div className="col-md-4">

            <div
              className="card border-0 shadow-sm rounded-4 h-100"
            >

              <div className="card-body p-4">

                <div className="d-flex justify-content-between">

                  <div>

                    <p className="text-secondary mb-2">
                      Orders
                    </p>

                    <h2 className="fw-bold mb-0">

                      {dashboard?.statistics?.orders ?? 0}

                    </h2>

                  </div>


                  <div
                    className="rounded-3 d-flex align-items-center justify-content-center"
                    style={{
                      width: "50px",
                      height: "50px",
                      background: "#FFF4E8",
                      fontSize: "22px"
                    }}
                  >
                    🛒
                  </div>

                </div>

                <p className="text-secondary small mt-3 mb-0">

                  Orders containing your products

                </p>

              </div>

            </div>

          </div>


          {/* SALES */}

          <div className="col-md-4">

            <div
              className="card border-0 shadow-sm rounded-4 h-100"
            >

              <div className="card-body p-4">

                <div className="d-flex justify-content-between">

                  <div>

                    <p className="text-secondary mb-2">
                      Total Sales
                    </p>

                    <h2 className="fw-bold mb-0">

                      ₹
                      {Number(
                        dashboard?.statistics?.sales ?? 0
                      ).toFixed(2)}

                    </h2>

                  </div>


                  <div
                    className="rounded-3 d-flex align-items-center justify-content-center"
                    style={{
                      width: "50px",
                      height: "50px",
                      background: "#EAF8F0",
                      fontSize: "22px"
                    }}
                  >
                    💰
                  </div>

                </div>

                <p className="text-secondary small mt-3 mb-0">

                  Revenue from your products

                </p>

              </div>

            </div>

          </div>

        </div>


        {/* =================================================
            MAIN SECTIONS
        ================================================= */}

        <div className="row g-4">


          {/* =================================================
              RECENT ORDERS
          ================================================= */}

          <div className="col-lg-8">

            <div
              className="card border-0 shadow-sm rounded-4"
            >

              <div className="card-body p-4">


                {/* HEADER */}

                <div
                  className="d-flex justify-content-between align-items-center mb-4"
                >

                  <div>

                    <h5 className="fw-bold mb-1">
                      Recent Orders
                    </h5>

                    <p className="text-secondary small mb-0">
                      Orders containing your products
                    </p>

                  </div>


                  <Link
                    to={`/vendor/orders/${vendorId}`}
                    className="text-decoration-none fw-semibold"
                    style={{
                      color: "#7C6EE6"
                    }}
                  >
                    View All
                  </Link>

                </div>


                {/* =================================================
                    SHOW ORDERS OR NO ORDERS
                ================================================= */}

                {dashboard?.recent_orders?.length > 0 ? (

                  <div className="table-responsive">

                    <table className="table align-middle">

                      <thead>

                        <tr>

                          <th>
                            Order
                          </th>

                          <th>
                            Customer
                          </th>

                          <th>
                            Date
                          </th>

                          <th>
                            Amount
                          </th>

                          <th>
                            Status
                          </th>

                        </tr>

                      </thead>


                      <tbody>

                        {dashboard.recent_orders.map(
                          (order) => (

                            <tr key={order.order_id}>

                              <td>

                                <strong>
                                  #{order.order_id}
                                </strong>

                              </td>


                              <td>

                                {order.customer_name}

                              </td>


                              <td>

                                {new Date(
                                  order.order_date
                                ).toLocaleDateString()}

                              </td>


                              <td>

                                ₹
                                {Number(
                                  order.vendor_amount
                                ).toFixed(2)}

                              </td>


                              <td>

                                <span
                                  className="badge bg-light text-dark"
                                >

                                  {order.order_status}

                                </span>

                              </td>

                            </tr>

                          )
                        )}

                      </tbody>

                    </table>

                  </div>

                ) : (

                  <div className="text-center py-5">

                    <div
                      style={{
                        fontSize: "40px"
                      }}
                    >
                      🛒
                    </div>

                    <h6 className="fw-semibold mt-3">
                      No orders yet
                    </h6>

                    <p className="text-secondary mb-0">
                      Your recent orders will appear here.
                    </p>

                  </div>

                )}

              </div>

            </div>

          </div>


          {/* =================================================
              QUICK ACTIONS
          ================================================= */}

          <div className="col-lg-4">

            <div
              className="card border-0 shadow-sm rounded-4"
            >

              <div className="card-body p-4">

                <h5 className="fw-bold mb-1">
                  Quick Actions
                </h5>

                <p className="text-secondary small mb-4">
                  Manage your shop quickly
                </p>


                {/* MANAGE PRODUCTS */}

                <Link
                  to="/vendor/products"
                  className="d-flex align-items-center gap-3 p-3 rounded-3 text-decoration-none mb-3"
                  style={{
                    background: "#F5F3FF",
                    color: "#333"
                  }}
                >

                  <span
                    style={{
                      fontSize: "22px"
                    }}
                  >
                    📦
                  </span>

                  <div>

                    <div className="fw-semibold">
                      Manage Products
                    </div>

                    <small className="text-secondary">
                      Add or edit products
                    </small>

                  </div>

                </Link>


                {/* VIEW ORDERS */}

                <Link
                  to={`/vendor/orders/${vendorId}`}
                  className="d-flex align-items-center gap-3 p-3 rounded-3 text-decoration-none mb-3"
                  style={{
                    background: "#FFF7ED",
                    color: "#333"
                  }}
                >

                  <span
                    style={{
                      fontSize: "22px"
                    }}
                  >
                    🛒
                  </span>

                  <div>

                    <div className="fw-semibold">
                      View Orders
                    </div>

                    <small className="text-secondary">
                      Check customer orders
                    </small>

                  </div>

                </Link>


                {/* VIEW SALES */}

                <Link
                  to={`/vendor/sales/${vendorId}`}
                  className="d-flex align-items-center gap-3 p-3 rounded-3 text-decoration-none"
                  style={{
                    background: "#ECFDF3",
                    color: "#333"
                  }}
                >

                  <span
                    style={{
                      fontSize: "22px"
                    }}
                  >
                    📊
                  </span>

                  <div>

                    <div className="fw-semibold">
                      View Sales
                    </div>

                    <small className="text-secondary">
                      Track your revenue
                    </small>

                  </div>

                </Link>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

  );
}

export default VendorDashboard;