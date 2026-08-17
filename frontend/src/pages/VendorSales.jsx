import { useEffect, useState } from "react";
import VendorSidebar from "../components/VendorSidebar";

function VendorSales() {

  const vendorId = localStorage.getItem("vendorId");

  const [sales, setSales] = useState(null);
  const [transactions, setTransactions] = useState([]);

  const [loading, setLoading] = useState(true);


  // ==========================================
  // LOAD SALES
  // ==========================================

  const loadSales = async () => {

    try {

      const response = await fetch(
        `http://127.0.0.1:5000/vendor/sales/${vendorId}`
      );

      const data = await response.json();

      if (response.ok) {

        setSales(data.summary);
        setTransactions(data.transactions);

      } else {

        alert(
          data.error ||
          "Unable to load sales."
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

      alert("Vendor session not found.");

      return;

    }

    loadSales();

  }, [vendorId]);


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
            Loading Sales...
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


        {/* HEADER */}

        <div className="mb-4">

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
            Sales
          </h2>

          <p className="text-secondary">
            Track your product sales and revenue.
          </p>

        </div>


        {/* ================================= */}
        {/* SALES SUMMARY */}
        {/* ================================= */}

        <div className="row g-4 mb-4">


          {/* TOTAL SALES */}

          <div className="col-md-3">

            <div
              className="card border-0 shadow-sm rounded-4 h-100"
            >

              <div className="card-body p-4">

                <p className="text-secondary mb-2">
                  Total Sales
                </p>

                <h3
                  className="fw-bold mb-0"
                  style={{
                    color: "#2E7D32"
                  }}
                >

                  ₹
                  {Number(
                    sales?.total_sales || 0
                  ).toFixed(2)}

                </h3>

              </div>

            </div>

          </div>


          {/* CONFIRMED */}

          <div className="col-md-3">

            <div
              className="card border-0 shadow-sm rounded-4 h-100"
            >

              <div className="card-body p-4">

                <p className="text-secondary mb-2">
                  Confirmed Sales
                </p>

                <h3 className="fw-bold mb-0">

                  ₹
                  {Number(
                    sales?.confirmed_sales || 0
                  ).toFixed(2)}

                </h3>

              </div>

            </div>

          </div>


          {/* DELIVERED */}

          <div className="col-md-3">

            <div
              className="card border-0 shadow-sm rounded-4 h-100"
            >

              <div className="card-body p-4">

                <p className="text-secondary mb-2">
                  Delivered Sales
                </p>

                <h3 className="fw-bold mb-0">

                  ₹
                  {Number(
                    sales?.delivered_sales || 0
                  ).toFixed(2)}

                </h3>

              </div>

            </div>

          </div>


          {/* CANCELLED */}

          <div className="col-md-3">

            <div
              className="card border-0 shadow-sm rounded-4 h-100"
            >

              <div className="card-body p-4">

                <p className="text-secondary mb-2">
                  Cancelled Sales
                </p>

                <h3
                  className="fw-bold mb-0"
                  style={{
                    color: "#C62828"
                  }}
                >

                  ₹
                  {Number(
                    sales?.cancelled_sales || 0
                  ).toFixed(2)}

                </h3>

              </div>

            </div>

          </div>

        </div>


        {/* ================================= */}
        {/* TRANSACTIONS */}
        {/* ================================= */}

        <div
          className="card border-0 shadow-sm rounded-4"
        >

          <div className="card-body p-0">

            <div className="p-4 border-bottom">

              <h5 className="fw-bold mb-1">
                Sales Transactions
              </h5>

              <p className="text-secondary mb-0">
                Sales generated from your products.
              </p>

            </div>


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
                      Date
                    </th>

                    <th>
                      Customer
                    </th>

                    <th>
                      Product
                    </th>

                    <th>
                      Quantity
                    </th>

                    <th>
                      Price
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

                  {transactions.length === 0 ? (

                    <tr>

                      <td
                        colSpan="8"
                        className="text-center py-5"
                      >

                        <div
                          style={{
                            fontSize: "40px"
                          }}
                        >
                          💰
                        </div>

                        <h6 className="fw-semibold mt-3">
                          No sales yet
                        </h6>

                        <p className="text-secondary mb-0">
                          Your product sales will appear here.
                        </p>

                      </td>

                    </tr>

                  ) : (

                    transactions.map(
                      (transaction, index) => (

                        <tr
                          key={
                            `${transaction.order_id}-${transaction.product_id}-${index}`
                          }
                        >

                          <td className="px-4">

                            <strong>
                              #{transaction.order_id}
                            </strong>

                          </td>


                          <td>

                            {new Date(
                              transaction.order_date
                            ).toLocaleDateString(
                              "en-GB"
                            )}

                          </td>


                          <td>
                            {transaction.customer_name}
                          </td>


                          <td>

                            <span className="fw-semibold">
                              {
                                transaction.product_name
                              }
                            </span>

                          </td>


                          <td>
                            {transaction.quantity}
                          </td>


                          <td>

                            ₹
                            {Number(
                              transaction.price
                            ).toFixed(2)}

                          </td>


                          <td>

                            <strong>

                              ₹
                              {Number(
                                transaction.amount
                              ).toFixed(2)}

                            </strong>

                          </td>


                          <td>

                            <span
                              className="badge rounded-pill px-3 py-2"
                              style={{
                                background:
                                  transaction.order_status ===
                                  "Delivered"
                                    ? "#E8F5E9"
                                    : transaction.order_status ===
                                      "Cancelled"
                                    ? "#FDECEC"
                                    : "#FFF4E5",

                                color:
                                  transaction.order_status ===
                                  "Delivered"
                                    ? "#2E7D32"
                                    : transaction.order_status ===
                                      "Cancelled"
                                    ? "#C62828"
                                    : "#E65100"
                              }}
                            >

                              {
                                transaction.order_status
                              }

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

export default VendorSales;