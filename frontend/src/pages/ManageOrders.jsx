import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";

function ManageOrders() {

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    fetch("http://127.0.0.1:5000/admin/orders")
      .then((response) => response.json())
      .then((data) => {

        if (data.error) {

          console.error(data.error);
          return;

        }

        setOrders(data);
        setLoading(false);

      })
      .catch((error) => {

        console.error(error);
        setLoading(false);

      });

  }, []);


  async function updateStatus(orderId, newStatus) {

    const confirmAction = window.confirm(
      `Change order status to "${newStatus}"?`
    );

    if (!confirmAction) {
      return;
    }

    try {

      const response = await fetch(
        `http://127.0.0.1:5000/admin/orders/${orderId}/status`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            order_status: newStatus
          })
        }
      );

      const result = await response.json();

      if (response.ok) {

        alert(result.message);

        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.order_id === orderId
              ? {
                  ...order,
                  order_status: newStatus
                }
              : order
          )
        );

      } else {

        alert(result.error || result.message);

      }

    } catch (error) {

      console.error(error);
      alert("Something went wrong.");

    }

  }


  if (loading) {

    return (
      <div className="d-flex">

        <Sidebar />

        <div
          className="flex-grow-1 p-5 text-center"
          style={{
            background: "#F8F8FC",
            minHeight: "100vh"
          }}
        >

          <h4>Loading Orders...</h4>

        </div>

      </div>
    );

  }


  return (

    <div className="d-flex">

      <Sidebar />

      <div
        className="flex-grow-1 p-4"
        style={{
          background: "#F8F8FC",
          minHeight: "100vh"
        }}
      >

        {/* Header */}

        <div className="mb-4">

          <h2 className="fw-bold">
            Manage Orders
          </h2>

          <p className="text-secondary">
            View and manage customer orders.
          </p>

        </div>


        {/* Orders Table */}

        <div className="card border-0 shadow-sm rounded-4">

          <div className="card-body">

            <div className="table-responsive">

              <table className="table table-hover align-middle">

                <thead>

                  <tr>

                    <th>Order ID</th>

                    <th>Customer</th>

                    <th>Date</th>

                    <th>Total</th>

                    <th>Status</th>

                    <th>Actions</th>

                  </tr>

                </thead>

                <tbody>

                  {orders.length === 0 ? (

                    <tr>

                      <td
                        colSpan="6"
                        className="text-center py-5"
                      >
                        No orders found.
                      </td>

                    </tr>

                  ) : (

                    orders.map((order) => (

                      <tr
                        key={order.order_id}
                        className={order.order_status === "Delivered" ? "table-success" : ""}
                      >

                        <td>
                          <strong>
                            #{order.order_id}
                          </strong>
                        </td>

                        <td>

                          <div className="fw-semibold">
                            {order.customer_name}
                          </div>

                          <small className="text-secondary">
                            {order.email}
                          </small>

                        </td>

                        <td>

                          {new Date(
                            order.order_date
                          ).toLocaleDateString()}

                        </td>

                        <td>

                          <strong>
                            ₹{Number(
                              order.total_amount
                            ).toFixed(2)}
                          </strong>

                        </td>

                        <td>

                          <select
                            className={`form-select form-select-sm ${order.order_status === "Delivered" ? "border-success text-success" : ""}`}
                            value={order.order_status}
                            onChange={(e) =>
                              updateStatus(
                                order.order_id,
                                e.target.value
                              )
                            }
                            style={{
                              width: "140px",
                              ...(order.order_status === "Delivered"
                                ? {
                                    backgroundColor: "#e8f5e9",
                                    color: "#1b6f3e",
                                    borderColor: "#2e7d32"
                                  }
                                : {})
                            }}
                          >

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

                        </td>

                        <td>

                          <Link
                            to={`/order-details/${order.order_id}`}
                            className="btn btn-dark btn-sm"
                          >
                            View Details
                          </Link>

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

export default ManageOrders;