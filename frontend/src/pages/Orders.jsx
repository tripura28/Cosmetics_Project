import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function Orders() {

  const [orders, setOrders] = useState([]);

  const navigate = useNavigate();

  const customerId = localStorage.getItem("customerId");

  useEffect(() => {

    if (!customerId) {

      alert("Please login first.");

      navigate("/login");

      return;

    }

    fetch(`http://127.0.0.1:5000/orders/${customerId}`)
      .then(response => response.json())
      .then(data => {

        setOrders(data);

      })
      .catch(error => {

        console.error(error);

      });

  }, [customerId, navigate]);

  return (

    <>

      <Navbar />

      <section className="bg-light min-vh-100 py-5">

        <div className="container">

          <div className="text-center mb-5">

            <h1 className="fw-bold">

              My Orders

            </h1>

            <p className="text-secondary">

              Track all your orders.

            </p>

          </div>

          {

            orders.length === 0 ?

            (

              <div className="text-center">

                <h4>No Orders Found</h4>

              </div>

            )

            :

            (

              orders.map((order)=>(

                <div
                  key={order.order_id}
                  className="card shadow-sm border-0 rounded-4 mb-4"
                >

                  <div className="card-body">

                    <div className="row align-items-center">

                      <div className="col-md-3">

                        <h5>

                          Order #{order.order_id}

                        </h5>

                      </div>

                      <div className="col-md-2">

                        <strong>Status</strong>

                        <p>
                        <span
                          className={`badge ${
                            order.order_status === "Delivered"
                              ? "bg-success"
                              : order.order_status === "Confirmed"
                              ? "bg-primary"
                              : order.order_status === "Cancelled"
                              ? "bg-danger"
                              : "bg-warning text-dark"
                          }`}
                        >
                          {order.order_status}
                        </span>
                      </p>

                      </div>

                      <div className="col-md-3">

                        <strong>Date</strong>

                        <p>

                          {new Date(order.order_date).toLocaleDateString()}

                        </p>

                      </div>

                      <div className="col-md-2">

                        <strong>Total Paid</strong>

                        <p className="fw-bold text-success">

                          ₹{Number(order.total_amount).toFixed(2)}

                        </p>

                      </div>

                      <div className="col-md-2 text-end">

                        <Link
                          to={`/order-details/${order.order_id}`}
                          className="btn btn-dark"
                        >

                          View Details

                        </Link>

                      </div>

                    </div>

                  </div>

                </div>

              ))

            )

          }

        </div>

      </section>

    </>

  );

}

export default Orders;