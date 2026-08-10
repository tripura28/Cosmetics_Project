import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";

function OrderDetails() {

  const { orderId } = useParams();

  const [items, setItems] = useState([]);

  useEffect(() => {

    fetch(`http://127.0.0.1:5000/order-details/${orderId}`)
      .then(response => response.json())
      .then(data => {

        setItems(data);

      })
      .catch(error => {

        console.error(error);

      });

  }, [orderId]);

  if (items.length === 0) {

    return (

      <>
        <Navbar />

        <div className="container text-center py-5">

          <h3>Loading...</h3>

        </div>

      </>

    );

  }

  const order = items[0];
  const subtotal = items.reduce(
  (total, item) => total + item.price * item.quantity,
  0
);

const shippingFee = subtotal > 0 ? 50 : 0;

const tax = subtotal * 0.18;

const grandTotal = subtotal + shippingFee + tax;

  return (

    <>

      <Navbar />

      <section className="bg-light min-vh-100 py-5">

        <div className="container">

          <div className="card border-0 shadow rounded-4">

            <div className="card-body p-4">

              <h2 className="fw-bold mb-4">

                Order #{orderId}

              </h2>

              <p>

                <strong>Status :</strong> {order.order_status}

              </p>

              <p>

                <strong>Date :</strong>{" "}

                {new Date(order.order_date).toLocaleDateString()}

              </p>

              <p>

                <strong>Shipping Address :</strong>

                <br />

                {order.shipping_address}

              </p>

              <hr />

              {

                items.map(item => (

                  <div
                    key={item.order_item_id}
                    className="row align-items-center border-bottom py-3"
                  >

                    <div className="col-md-2">

                      <img
                        src={`/images/${item.image}`}
                        alt={item.product_name}
                        className="img-fluid rounded"
                        style={{
                          width: "80px",
                          height: "80px",
                          objectFit: "cover"
                        }}
                      />

                    </div>

                    <div className="col-md-4">

                      <h5>{item.product_name}</h5>

                    </div>

                    <div className="col-md-2">

                      Qty : {item.quantity}

                    </div>

                    <div className="col-md-2">

                      ₹{item.price}

                    </div>

                    <div className="col-md-2 text-end">

                      ₹{item.price * item.quantity}

                    </div>

                  </div>

                ))

              }

              <hr />

              <div
                className="ms-auto"
                style={{ maxWidth: "350px" }}
              >

                <div className="d-flex justify-content-between mb-2">

                  <span>Subtotal</span>

                  <span>₹{subtotal.toFixed(2)}</span>

                </div>

                <div className="d-flex justify-content-between mb-2">

                  <span>Shipping Fee</span>

                  <span>₹{shippingFee.toFixed(2)}</span>

                </div>

                <div className="d-flex justify-content-between mb-2">

                  <span>GST (18%)</span>

                  <span>₹{tax.toFixed(2)}</span>

                </div>

                <hr />

                <div className="d-flex justify-content-between">

                  <h5 className="fw-bold">

                    Total Paid

                  </h5>

                  <h5 className="fw-bold text-success">

                   ₹{Number(order.total_amount).toFixed(2)}

                  </h5>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

    </>

  );

}

export default OrderDetails;