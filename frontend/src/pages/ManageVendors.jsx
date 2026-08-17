import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";

function ManageVendors() {

  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    fetch("http://127.0.0.1:5000/admin/vendors")

      .then((response) => response.json())

      .then((data) => {

        if (data.error) {

          alert(data.error);
          return;

        }

        setVendors(data);

      })

      .catch((error) => {

        console.error(error);
        alert("Unable to load vendors.");

      })

      .finally(() => {

        setLoading(false);

      });

  }, []);


  const updateVendorStatus = async (
    vendorId,
    newStatus
  ) => {

    const confirmAction = window.confirm(
      `Are you sure you want to change this vendor to "${newStatus}"?`
    );

    if (!confirmAction) {
      return;
    }

    try {

      const response = await fetch(
        `http://127.0.0.1:5000/admin/vendors/${vendorId}/status`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            status: newStatus
          })
        }
      );

      const result = await response.json();

      if (response.ok) {

        alert(result.message);

        setVendors((previousVendors) =>
          previousVendors.map((vendor) =>
            vendor.vendor_id === vendorId
              ? {
                  ...vendor,
                  status: newStatus
                }
              : vendor
          )
        );

      } else {

        alert(
          result.error ||
          "Unable to update vendor status."
        );

      }

    } catch (error) {

      console.error(error);

      alert(
        "Unable to connect to the server."
      );

    }

  };


  const getStatusStyle = (status) => {

    if (status === "Approved") {

      return {
        backgroundColor: "#E8F5E9",
        color: "#2E7D32"
      };

    }

    if (status === "Rejected") {

      return {
        backgroundColor: "#FDECEC",
        color: "#C62828"
      };

    }

    return {
      backgroundColor: "#FFF4E5",
      color: "#E65100"
    };

  };


  if (loading) {

    return (

      <div className="d-flex">

        <Sidebar />

        <div
          className="flex-grow-1 d-flex align-items-center justify-content-center"
          style={{
            background: "#F8F8FC",
            minHeight: "100vh"
          }}
        >

          <h4>
            Loading Vendors...
          </h4>

        </div>

      </div>

    );

  }


  return (

    <div className="d-flex">

      <Sidebar />

      <div
        className="flex-grow-1 p-4 p-md-5"
        style={{
          background: "#F8F8FC",
          minHeight: "100vh"
        }}
      >

        {/* Header */}

        <div className="mb-4">

          <h2 className="fw-bold mb-1">
            Manage Vendors
          </h2>

          <p className="text-secondary">
            Review and manage GlowCart vendor accounts.
          </p>

        </div>


        {/* Summary Cards */}

        <div className="row g-4 mb-4">

          <div className="col-md-4">

            <div className="card border-0 shadow-sm rounded-4">

              <div className="card-body p-4">

                <p className="text-secondary mb-2">
                  Total Vendors
                </p>

                <h2 className="fw-bold mb-0">
                  {vendors.length}
                </h2>

              </div>

            </div>

          </div>


          <div className="col-md-4">

            <div className="card border-0 shadow-sm rounded-4">

              <div className="card-body p-4">

                <p className="text-secondary mb-2">
                  Pending Approval
                </p>

                <h2
                  className="fw-bold mb-0"
                  style={{
                    color: "#E65100"
                  }}
                >
                  {
                    vendors.filter(
                      (vendor) =>
                        vendor.status === "Pending"
                    ).length
                  }
                </h2>

              </div>

            </div>

          </div>


          <div className="col-md-4">

            <div className="card border-0 shadow-sm rounded-4">

              <div className="card-body p-4">

                <p className="text-secondary mb-2">
                  Approved Vendors
                </p>

                <h2
                  className="fw-bold mb-0"
                  style={{
                    color: "#2E7D32"
                  }}
                >
                  {
                    vendors.filter(
                      (vendor) =>
                        vendor.status === "Approved"
                    ).length
                  }
                </h2>

              </div>

            </div>

          </div>

        </div>


        {/* Vendors Table */}

        <div className="card border-0 shadow-sm rounded-4">

          <div className="card-body p-0">

            <div className="table-responsive">

              <table className="table table-hover align-middle mb-0">

                <thead>

                  <tr>

                    <th className="px-4 py-3">
                      Vendor
                    </th>

                    <th>
                      Shop
                    </th>

                    <th>
                      Email
                    </th>

                    <th>
                      Phone
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {vendors.length === 0 ? (

                    <tr>

                      <td
                        colSpan="6"
                        className="text-center py-5"
                      >
                        No vendors found.
                      </td>

                    </tr>

                  ) : (

                    vendors.map((vendor) => (

                      <tr key={vendor.vendor_id}>

                        <td className="px-4">

                          <div className="fw-semibold">
                            {vendor.vendor_name}
                          </div>

                          <small className="text-secondary">
                            ID: #{vendor.vendor_id}
                          </small>

                        </td>


                        <td>

                          <span className="fw-semibold">
                            {vendor.shop_name}
                          </span>

                        </td>


                        <td>

                          {vendor.email}

                        </td>


                        <td>

                          {vendor.phone || "—"}

                        </td>


                        <td>

                          <span
                            className="badge rounded-pill px-3 py-2"
                            style={getStatusStyle(
                              vendor.status
                            )}
                          >
                            {vendor.status}
                          </span>

                        </td>


                     <td>

  <div className="d-flex gap-2 flex-wrap">

    {/* VIEW DETAILS */}

    <Link
      to={`/admin/vendors/${vendor.vendor_id}`}
      className="btn btn-sm"
      style={{
        backgroundColor: "#F0EDFF",
        color: "#7C6EE6",
        border: "none",
        textDecoration: "none"
      }}
    >
      👁 View
    </Link>


    {/* APPROVE / REJECT */}

    {vendor.status === "Pending" ? (

      <>
        <button
          className="btn btn-sm"
          style={{
            backgroundColor: "#E8F5E9",
            color: "#2E7D32",
            border: "none"
          }}
          onClick={() =>
            updateVendorStatus(
              vendor.vendor_id,
              "Approved"
            )
          }
        >
          ✓ Approve
        </button>

        <button
          className="btn btn-sm"
          style={{
            backgroundColor: "#FDECEC",
            color: "#C62828",
            border: "none"
          }}
          onClick={() =>
            updateVendorStatus(
              vendor.vendor_id,
              "Rejected"
            )
          }
        >
          ✕ Reject
        </button>
      </>

    ) : vendor.status === "Approved" ? (

      <button
        className="btn btn-sm btn-outline-danger"
        onClick={() =>
          updateVendorStatus(
            vendor.vendor_id,
            "Rejected"
          )
        }
      >
        Reject
      </button>

    ) : (

      <button
        className="btn btn-sm btn-outline-success"
        onClick={() =>
          updateVendorStatus(
            vendor.vendor_id,
            "Approved"
          )
        }
      >
        Approve
      </button>

    )}

  </div>

</td>

                      </tr>

                    ))

                  )}

                </tbody>

              </table>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}

export default ManageVendors;