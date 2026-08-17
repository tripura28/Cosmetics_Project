import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

function AdminVendorDetails() {

  const { vendorId } = useParams();

  const [vendor, setVendor] = useState(null);
  const [statistics, setStatistics] = useState({});
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);


  // ==========================================
  // LOAD VENDOR DETAILS
  // ==========================================

  const loadVendorDetails = async () => {

    try {

      const response = await fetch(
        `http://127.0.0.1:5000/admin/vendors/${vendorId}`
      );

      const data = await response.json();

      if (!response.ok) {

        alert(
          data.error || "Unable to load vendor details."
        );

        return;
      }

      setVendor(data.vendor);
      setStatistics(data.statistics);
      setProducts(data.products);

    } catch (error) {

      console.error(error);

      alert("Unable to connect to the server.");

    } finally {

      setLoading(false);

    }

  };


  useEffect(() => {

    loadVendorDetails();

  }, [vendorId]);


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (

      <div
        className="d-flex align-items-center justify-content-center"
        style={{
          minHeight: "100vh",
          background: "#F7F6FB"
        }}
      >

        <h4>
          Loading vendor details...
        </h4>

      </div>

    );

  }


  if (!vendor) {

    return (

      <div
        className="d-flex align-items-center justify-content-center"
        style={{
          minHeight: "100vh",
          background: "#F7F6FB"
        }}
      >

        <div className="text-center">

          <h4>
            Vendor not found
          </h4>

          <Link
            to="/admin/vendors"
            className="btn mt-3"
            style={{
              background: "#7C6EE6",
              color: "white"
            }}
          >
            Back to Vendors
          </Link>

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


      {/* ================================= */}
      {/* MAIN CONTENT */}
      {/* ================================= */}

      <div className="flex-grow-1 p-4 p-md-5">


        {/* ================================= */}
        {/* BACK */}
        {/* ================================= */}

        <Link
          to="/admin/vendors"
          className="text-decoration-none"
          style={{
            color: "#7C6EE6"
          }}
        >
          ← Back to Vendors
        </Link>


        {/* ================================= */}
        {/* HEADER */}
        {/* ================================= */}

        <div className="mt-3 mb-4">

          <div className="d-flex align-items-center gap-3">

            <div
              className="rounded-circle d-flex align-items-center justify-content-center"
              style={{
                width: "70px",
                height: "70px",
                background: "#F0EDFF",
                fontSize: "30px"
              }}
            >
              🏪
            </div>

            <div>

              <h2 className="fw-bold mb-1">
                {vendor.shop_name}
              </h2>

              <p className="text-secondary mb-0">
                Vendor ID: #{vendor.vendor_id}
              </p>

            </div>

          </div>

        </div>


        {/* ================================= */}
        {/* VENDOR INFORMATION */}
        {/* ================================= */}

        <div className="row g-4 mb-4">


          {/* Vendor Information */}

          <div className="col-lg-8">

            <div
              className="card border-0 shadow-sm rounded-4 h-100"
            >

              <div className="card-body p-4">

                <h5 className="fw-bold mb-4">
                  Vendor Information
                </h5>


                <div className="row g-4">

                  <div className="col-md-6">

                    <small className="text-secondary">
                      Vendor Name
                    </small>

                    <div className="fw-semibold mt-1">
                      {vendor.vendor_name}
                    </div>

                  </div>


                  <div className="col-md-6">

                    <small className="text-secondary">
                      Email
                    </small>

                    <div className="fw-semibold mt-1">
                      {vendor.email}
                    </div>

                  </div>


                  <div className="col-md-6">

                    <small className="text-secondary">
                      Phone
                    </small>

                    <div className="fw-semibold mt-1">
                      {vendor.phone || "Not provided"}
                    </div>

                  </div>


                  <div className="col-md-6">

                    <small className="text-secondary">
                      Address
                    </small>

                    <div className="fw-semibold mt-1">
                      {vendor.address || "Not provided"}
                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>


          {/* Status */}

          <div className="col-lg-4">

            <div
              className="card border-0 shadow-sm rounded-4 h-100"
            >

              <div className="card-body p-4">

                <h5 className="fw-bold mb-4">
                  Account Status
                </h5>

                <span
                  className="badge rounded-pill px-3 py-2"
                  style={{
                    background:
                      vendor.status === "Approved"
                        ? "#E8F5E9"
                        : vendor.status === "Rejected"
                        ? "#FDECEC"
                        : "#FFF4E5",

                    color:
                      vendor.status === "Approved"
                        ? "#2E7D32"
                        : vendor.status === "Rejected"
                        ? "#C62828"
                        : "#E65100"
                  }}
                >
                  {vendor.status}
                </span>

                <p className="text-secondary small mt-4 mb-0">
                  Vendor registered on{" "}
                  {vendor.created_at
                    ? new Date(
                        vendor.created_at
                      ).toLocaleDateString()
                    : "N/A"}
                </p>

              </div>

            </div>

          </div>

        </div>


        {/* ================================= */}
        {/* STATISTICS */}
        {/* ================================= */}

        <div className="row g-4 mb-4">


          {/* Products */}

          <div className="col-md-4">

            <div
              className="card border-0 shadow-sm rounded-4 h-100"
            >

              <div className="card-body p-4">

                <div className="text-secondary">
                  Total Products
                </div>

                <h2
                  className="fw-bold mt-2 mb-0"
                  style={{
                    color: "#7C6EE6"
                  }}
                >
                  {statistics.total_products || 0}
                </h2>

              </div>

            </div>

          </div>


          {/* Orders */}

          <div className="col-md-4">

            <div
              className="card border-0 shadow-sm rounded-4 h-100"
            >

              <div className="card-body p-4">

                <div className="text-secondary">
                  Total Orders
                </div>

                <h2
                  className="fw-bold mt-2 mb-0"
                  style={{
                    color: "#7C6EE6"
                  }}
                >
                  {statistics.total_orders || 0}
                </h2>

              </div>

            </div>

          </div>


          {/* Sales */}

          <div className="col-md-4">

            <div
              className="card border-0 shadow-sm rounded-4 h-100"
            >

              <div className="card-body p-4">

                <div className="text-secondary">
                  Total Sales
                </div>

                <h2
                  className="fw-bold mt-2 mb-0"
                  style={{
                    color: "#7C6EE6"
                  }}
                >
                  ₹{Number(
                    statistics.total_sales || 0
                  ).toLocaleString("en-IN")}
                </h2>

              </div>

            </div>

          </div>

        </div>


        {/* ================================= */}
        {/* PRODUCTS */}
        {/* ================================= */}

        <div
          className="card border-0 shadow-sm rounded-4"
        >

          <div className="card-body p-4">

            <div className="d-flex justify-content-between align-items-center mb-4">

              <div>

                <h5 className="fw-bold mb-1">
                  Vendor Products
                </h5>

                <p className="text-secondary mb-0">
                  Products listed by {vendor.shop_name}
                </p>

              </div>

              <span className="badge bg-light text-dark">
                {products.length} Products
              </span>

            </div>


            {products.length === 0 ? (

              <div className="text-center py-5">

                <div
                  style={{
                    fontSize: "40px"
                  }}
                >
                  📦
                </div>

                <h6 className="mt-3">
                  No products found
                </h6>

                <p className="text-secondary">
                  This vendor has not added any products yet.
                </p>

              </div>

            ) : (

              <div className="table-responsive">

                <table className="table align-middle">

                  <thead>

                    <tr>

                      <th>Product</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Status</th>

                    </tr>

                  </thead>

                  <tbody>

                    {products.map((product) => (

                      <tr key={product.product_id}>

                        <td>

                          <div className="d-flex align-items-center gap-3">

                            {product.image ? (

                              <img
                                src={`/images/${product.image}`}
                                alt={product.product_name}
                                style={{
                                    width: "50px",
                                    height: "50px",
                                    objectFit: "cover",
                                    borderRadius: "10px"
                                }}
                                />

                            ) : (

                              <div
                                style={{
                                  width: "50px",
                                  height: "50px",
                                  background: "#F5F3FF",
                                  borderRadius: "10px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center"
                                }}
                              >
                                📦
                              </div>

                            )}

                            <div>

                             <Link
                                to={`/products/${product.product_id}`}
                                className="fw-semibold text-decoration-none"
                                style={{
                                    color: "#7C6EE6",
                                    cursor: "pointer"
                                }}
                                >
                                {product.product_name}
                                </Link>

                              <small className="text-secondary">
                                ID: #{product.product_id}
                              </small>

                            </div>

                          </div>

                        </td>


                        <td>
                          {product.category_name || "N/A"}
                        </td>


                        <td>
                          ₹{Number(
                            product.price || 0
                          ).toLocaleString("en-IN")}
                        </td>


                        <td>
                          {product.stock}
                        </td>


                        <td>

                          <span
                            className="badge rounded-pill"
                            style={{
                              background:
                                product.product_status === "Available"
                                  ? "#E8F5E9"
                                  : product.product_status === "Out of Stock"
                                  ? "#FFF4E5"
                                  : "#FDECEC",

                              color:
                                product.product_status === "Available"
                                  ? "#2E7D32"
                                  : product.product_status === "Out of Stock"
                                  ? "#E65100"
                                  : "#C62828"
                            }}
                          >
                            {product.product_status}
                          </span>

                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            )}

          </div>

        </div>


      </div>

    </div>

  );

}

export default AdminVendorDetails;