import { useEffect, useState } from "react";
import VendorSidebar from "../components/VendorSidebar";

function VendorOrders() {

  const vendorId = localStorage.getItem("vendorId");

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedStatus, setSelectedStatus] = useState("");


  // ==========================================
  // LOAD ORDERS
  // ==========================================

  const loadOrders = async () => {

    try {

      const response = await fetch(
        `http://127.0.0.1:5000/vendor/orders/${vendorId}`
      );

      const data = await response.json();

      if (response.ok) {

        setOrders(data);

      } else {

        alert(
          data.error ||
          "Unable to load orders."
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


  useEffect(() => {

    if (!vendorId) {

      alert(
        "Vendor session not found."
      );

      return;

    }

    loadOrders();

  }, [vendorId]);


  // ==========================================
  // FILTER
  // ==========================================

  const filteredOrders = selectedStatus
    ? orders.filter(
        (order) =>
          order.order_status === selectedStatus
      )
    : orders;


  // ==========================================
  // CALCULATE TOTAL VENDOR SALES
  // ==========================================

  const totalSales = orders.reduce(
    (total, order) =>
      total + Number(order.item_total || 0),
    0
  );


  // ==========================================
  // UNIQUE ORDERS
  // ==========================================

  const uniqueOrderIds = [
    ...new Set(
      orders.map(
        (order) => order.order_id
      )
    )
  ];


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (

      <div className="d-flex">

        <VendorSidebar />

        <div
          className="flex-grow-1 d-flex align-items-center justify-content-center"
          style={{
            minHeight: "100vh",
            background: "#F7F6FB"
          }}
        >

          <h4>
            Loading Orders...
          </h4>

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

      <VendorSidebar />


      <div className="flex-grow-1 p-4 p-md-5">


        {/* ================================= */}
        {/* HEADER */}
        {/* ================================= */}

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
              Orders
            </h2>

            <p className="text-secondary mb-0">
              View orders containing your products.
            </p>

          </div>


          {/* STATUS FILTER */}

          <div className="mt-3 mt-md-0">

            <select
              className="form-select"
              value={selectedStatus}
              onChange={(e) =>
                setSelectedStatus(
                  e.target.value
                )
              }
              style={{
                minWidth: "180px"
              }}
            >

              <option value="">
                All Orders
              </option>

              <option value="Pending">
                Pending
              </option>

              <option value="Confirmed">
                Confirmed
              </option>

              <option value="Delivered">
                Delivered
              </option>

              <option value="Cancelled">
                Cancelled
              </option>

            </select>

          </div>

        </div>


        {/* ================================= */}
        {/* SUMMARY CARDS */}
        {/* ================================= */}

        <div className="row g-4 mb-4">


          {/* ORDERS */}

          <div className="col-md-4">

            <div
              className="card border-0 shadow-sm rounded-4 h-100"
            >

              <div className="card-body p-4">

                <p className="text-secondary mb-2">
                  Total Orders
                </p>

                <h2 className="fw-bold mb-0">
                  {uniqueOrderIds.length}
                </h2>

              </div>

            </div>

          </div>


          {/* PRODUCTS SOLD */}

          <div className="col-md-4">

            <div
              className="card border-0 shadow-sm rounded-4 h-100"
            >

              <div className="card-body p-4">

                <p className="text-secondary mb-2">
                  Products Sold
                </p>

                <h2 className="fw-bold mb-0">

                  {orders.reduce(
                    (total, order) =>
                      total +
                      Number(
                        order.quantity || 0
                      ),
                    0
                  )}

                </h2>

              </div>

            </div>

          </div>


          {/* SALES */}

          <div className="col-md-4">

            <div
              className="card border-0 shadow-sm rounded-4 h-100"
            >

              <div className="card-body p-4">

                <p className="text-secondary mb-2">
                  Total Sales
                </p>

                <h2
                  className="fw-bold mb-0"
                  style={{
                    color: "#2E7D32"
                  }}
                >

                  ₹
                  {totalSales.toFixed(2)}

                </h2>

              </div>

            </div>

          </div>

        </div>


        {/* ================================= */}
        {/* ORDERS TABLE */}
        {/* ================================= */}

        <div
          className="card border-0 shadow-sm rounded-4"
        >

          <div className="card-body p-0">

            <div className="table-responsive">

              <table
                className="table table-hover align-middle mb-0"
              >

                <thead>

                  <tr>

                    <th className="px-4 py-3">
                      Order
                    </th>

                    <th>
                      Customer
                    </th>

                    <th>
                      Product
                    </th>

                    <th>
                      Qty
                    </th>

                    <th>
                      Amount
                    </th>

                    <th>
                      Date
                    </th>

                    <th>
                      Status
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {filteredOrders.length === 0 ? (

                    <tr>

                      <td
                        colSpan="7"
                        className="text-center py-5"
                      >

                        <div
                          style={{
                            fontSize: "40px"
                          }}
                        >
                          📦
                        </div>

                        <h6 className="fw-semibold mt-3">
                          No orders found
                        </h6>

                        <p className="text-secondary mb-0">
                          Orders containing your products
                          will appear here.
                        </p>

                      </td>

                    </tr>

                  ) : (

                    filteredOrders.map(
                      (order) => (

                        <tr
                          key={
                            order.order_item_id
                          }
                        >


                          {/* ORDER */}

                          <td className="px-4">

                            <strong>
                              #{order.order_id}
                            </strong>

                          </td>


                          {/* CUSTOMER */}

                          <td>

                            <div className="fw-semibold">
                              {order.customer_name}
                            </div>

                            <small className="text-secondary">
                              {order.email}
                            </small>

                          </td>


                          {/* PRODUCT */}

                          <td>

                            <div
                              className="d-flex align-items-center gap-2"
                            >

                              <img
                                src={
                                  order.image
                                    ? `/images/${order.image}`
                                    : "/images/no-image.jpg"
                                }
                                alt={
                                  order.product_name
                                }
                                style={{
                                  width: "45px",
                                  height: "45px",
                                  objectFit: "cover",
                                  borderRadius: "8px"
                                }}
                              />

                              <span className="fw-semibold">
                                {order.product_name}
                              </span>

                            </div>

                          </td>


                          {/* QUANTITY */}

                          <td>
                            {order.quantity}
                          </td>


                          {/* AMOUNT */}

                          <td>

                            <strong>
                              ₹
                              {Number(
                                order.item_total
                              ).toFixed(2)}
                            </strong>

                          </td>


                          {/* DATE */}

                          <td>

                            {new Date(
                              order.order_date
                            ).toLocaleDateString(
                              "en-GB"
                            )}

                          </td>


                          {/* STATUS */}

                          <td>

                            <span
                              className="badge rounded-pill px-3 py-2"
                              style={{
                                background:
                                  order.order_status ===
                                  "Delivered"
                                    ? "#E8F5E9"
                                    : order.order_status ===
                                      "Cancelled"
                                    ? "#FDECEC"
                                    : "#FFF4E5",

                                color:
                                  order.order_status ===
                                  "Delivered"
                                    ? "#2E7D32"
                                    : order.order_status ===
                                      "Cancelled"
                                    ? "#C62828"
                                    : "#E65100"
                              }}
                            >
                              {order.order_status}
                            </span>

                          </td>

                        </tr>

                      )
                    )

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

export default VendorOrders;