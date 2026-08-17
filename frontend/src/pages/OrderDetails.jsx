import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";

function OrderDetails() {
  const { orderId } = useParams();

  const [items, setItems] = useState([]);

  const companyInfo = {
    name: "GlowCart Cosmetics",
    email: "support@glowandglam.com",
    phone: "+91 98765 43210",
    address: "123 Beauty Street, Mumbai, India",
  };

  // ==========================================
  // PRINT / DOWNLOAD RECEIPT
  // ==========================================

  const handleDownloadPdf = () => {
    window.print();
  };

  // ==========================================
  // FETCH ORDER DETAILS
  // ==========================================

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/order-details/${orderId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch order details");
        }

        return response.json();
      })
      .then((data) => {
        setItems(data);
      })
      .catch((error) => {
        console.error("Order details error:", error);
      });
  }, [orderId]);

  // ==========================================
  // LOADING
  // ==========================================

  if (items.length === 0) {
    return (
      <>
        <Navbar />

        <div className="container text-center py-5">
          <h3 className="fw-bold">
            Loading order details...
          </h3>
        </div>
      </>
    );
  }

  // ==========================================
  // ORDER CALCULATIONS
  // ==========================================

  const order = items[0];

  const subtotal = items.reduce(
    (total, item) =>
      total +
      Number(item.price) * Number(item.quantity),
    0
  );

  const shippingFee = subtotal > 0 ? 50 : 0;

  const tax = subtotal * 0.18;

  const calculatedGrandTotal =
    subtotal + shippingFee + tax;

  const finalTotal = Number(
    order.total_amount || calculatedGrandTotal
  );

  return (
    <>
      <Navbar />

      {/* =================================================
          RECEIPT CSS
      ================================================= */}

      <style>
        {`

          /* ==========================================
             NORMAL PAGE
          ========================================== */

          .receipt-page {
            background: #f5f4fa;
            min-height: 100vh;
            padding: 50px 0;
          }

          .receipt-container {
            max-width: 900px;
            margin: auto;
          }

          .receipt-card {
            background: white;
            overflow: hidden;
            border-radius: 12px;
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
          }

          /* ==========================================
             HEADER
          ========================================== */

          .receipt-header {
            background: #211B35;
            color: white;
            padding: 35px 40px;
          }

          .receipt-logo {
            color: #B9AEFF;
            font-size: 30px;
            font-weight: 700;
            letter-spacing: 0.5px;
          }

          .receipt-subtitle {
            color: #D5D1DF;
            font-size: 14px;
          }

          .receipt-title {
            font-size: 26px;
            font-weight: 700;
          }

          /* ==========================================
             INFORMATION BOX
          ========================================== */

          .info-box {
            background: #F8F7FC;
            border-radius: 10px;
            padding: 20px;
          }

          .info-label {
            color: #777;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 5px;
          }

          .info-value {
            font-weight: 600;
            color: #211B35;
          }

          /* ==========================================
             PRODUCT TABLE
          ========================================== */

          .product-table {
            width: 100%;
            border-collapse: collapse;
          }

          .product-table th {
            background: #F5F3FF;
            color: #5C5670;
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            padding: 14px;
            border-bottom: 1px solid #E5E1F0;
          }

          .product-table td {
            padding: 16px 14px;
            border-bottom: 1px solid #EEEEF2;
            vertical-align: middle;
          }

          .product-image {
            width: 58px;
            height: 58px;
            object-fit: cover;
            border-radius: 8px;
          }

          .product-name {
            font-weight: 600;
            color: #211B35;
          }

          /* ==========================================
             TOTALS
          ========================================== */

          .summary-box {
            max-width: 360px;
            margin-left: auto;
          }

          .summary-row {
            display: flex;
            justify-content: space-between;
            padding: 7px 0;
            color: #555;
          }

          .grand-total {
            display: flex;
            justify-content: space-between;
            padding-top: 15px;
            margin-top: 10px;
            border-top: 2px solid #211B35;
            font-size: 19px;
            font-weight: 700;
          }

          /* ==========================================
             FOOTER
          ========================================== */

          .receipt-footer {
            text-align: center;
            background: #F8F7FC;
            padding: 25px;
            color: #777;
            font-size: 13px;
          }

          /* ==========================================
             PRINT
          ========================================== */

          @media print {

            @page {
              size: A4;
              margin: 10mm;
            }

            html,
            body {
              background: white !important;
              margin: 0;
              padding: 0;

              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }

            /* Hide everything */

            body * {
              visibility: hidden;
            }

            /* Show only receipt */

            .print-area,
            .print-area * {
              visibility: visible;
            }

            /* ======================================
               FOUR-LINE PAGE BORDER
            ====================================== */

            .print-area {
              position: relative;

              width: 100%;
              min-height: 270mm;

              margin: 0 auto;
              padding: 18px;

              background: white !important;

              border: 2px solid #211B35;

              box-sizing: border-box;

              box-shadow:
                inset 0 0 0 4px white,
                inset 0 0 0 5px #B9AEFF,
                inset 0 0 0 9px white,
                inset 0 0 0 10px #DDD8EA;

              border-radius: 0 !important;
            }

            /* Remove normal webpage background */

            .receipt-page {
              background: white !important;
              padding: 0 !important;
              min-height: auto !important;
            }

            .receipt-container {
              max-width: none !important;
              width: 100% !important;
            }

            .receipt-card {
              box-shadow: none !important;
              border-radius: 0 !important;
            }

            /* Hide buttons */

            .no-print {
              display: none !important;
            }

            /* Hide navbar */

            .navbar {
              display: none !important;
            }

            /* Header */

            .receipt-header {
              background: #211B35 !important;
              color: white !important;
              border-radius: 0 !important;
            }

            /* Footer */

            .receipt-footer {
              margin-top: 25px;
            }

            /* Keep product rows together */

            .product-table {
              page-break-inside: auto;
            }

            .product-table tr {
              page-break-inside: avoid;
            }

            /* Information boxes */

            .info-box {
              background: #F8F7FC !important;
            }

          }

        `}
      </style>

      {/* =================================================
          RECEIPT PAGE
      ================================================= */}

      <section className="receipt-page">

        <div className="container receipt-container">

          {/* =================================================
              RECEIPT
          ================================================= */}

          <div className="receipt-card print-area">

            {/* ===============================================
                HEADER
            =============================================== */}

            <div className="receipt-header">

              <div className="row align-items-center">

                <div className="col-md-7">

                  <div className="receipt-logo">
                    GlowCart
                  </div>

                  <div className="receipt-subtitle mt-1">
                    Beauty made simple.
                  </div>

                  <div className="receipt-subtitle mt-3">
                    {companyInfo.address}
                  </div>

                  <div className="receipt-subtitle">
                    {companyInfo.email} • {companyInfo.phone}
                  </div>

                </div>

                <div className="col-md-5 text-md-end mt-4 mt-md-0">

                  <div className="receipt-title">
                    ORDER RECEIPT
                  </div>

                  <div className="receipt-subtitle mt-2">
                    Order #{orderId}
                  </div>

                </div>

              </div>

            </div>


            {/* =================================================
                RECEIPT CONTENT
            ================================================= */}

            <div className="p-4 p-md-5">

              {/* ===============================================
                  CUSTOMER / ORDER INFORMATION
              =============================================== */}

              <div className="row g-4 mb-4">

                {/* Customer */}

                <div className="col-md-6">

                  <div className="info-box h-100">

                    <div className="info-label">
                      Customer
                    </div>

                    <div className="info-value">
                      {order.customer_name || "Customer"}
                    </div>

                    {order.customer_email && (
                      <div className="small text-secondary mt-1">
                        {order.customer_email}
                      </div>
                    )}

                  </div>

                </div>


                {/* Order Information */}

                <div className="col-md-6">

                  <div className="info-box h-100">

                    <div className="info-label">
                      Order Information
                    </div>

                    <div className="small mb-1">
                      <strong>Order ID:</strong> #{orderId}
                    </div>

                    <div className="small mb-1">

                      <strong>Date:</strong>{" "}

                      {new Date(
                        order.order_date
                      ).toLocaleDateString("en-GB")}

                    </div>

                    <div className="small">

                      <strong>Status:</strong>{" "}

                      {order.order_status}

                    </div>

                  </div>

                </div>


                {/* Shipping */}

                <div className="col-12">

                  <div className="info-box">

                    <div className="info-label">
                      Shipping Address
                    </div>

                    <div className="info-value">
                      {order.shipping_address || "Not provided"}
                    </div>

                  </div>

                </div>

              </div>


              {/* ===============================================
                  ORDER ITEMS
              =============================================== */}

              <div className="mb-4">

                <h5 className="fw-bold mb-3">
                  Order Items
                </h5>

                <div className="table-responsive">

                  <table className="product-table">

                    <thead>

                      <tr>

                        <th>
                          Product
                        </th>

                        <th className="text-center">
                          Qty
                        </th>

                        <th className="text-end">
                          Unit Price
                        </th>

                        <th className="text-end">
                          Total
                        </th>

                      </tr>

                    </thead>

                    <tbody>

                      {items.map((item) => (

                        <tr key={item.order_item_id}>

                          <td>

                            <div className="d-flex align-items-center gap-3">

                              <img
                                src={`/images/${item.image}`}
                                alt={item.product_name}
                                className="product-image"
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";
                                }}
                              />

                              <div className="product-name">
                                {item.product_name}
                              </div>

                            </div>

                          </td>

                          <td className="text-center">
                            {item.quantity}
                          </td>

                          <td className="text-end">
                            ₹{Number(item.price).toFixed(2)}
                          </td>

                          <td className="text-end fw-semibold">

                            ₹
                            {(
                              Number(item.price) *
                              Number(item.quantity)
                            ).toFixed(2)}

                          </td>

                        </tr>

                      ))}

                    </tbody>

                  </table>

                </div>

              </div>


              {/* ===============================================
                  TOTALS
              =============================================== */}

              <div className="summary-box">

                <div className="summary-row">

                  <span>
                    Subtotal
                  </span>

                  <span>
                    ₹{subtotal.toFixed(2)}
                  </span>

                </div>

                <div className="summary-row">

                  <span>
                    Shipping Fee
                  </span>

                  <span>
                    ₹{shippingFee.toFixed(2)}
                  </span>

                </div>

                <div className="summary-row">

                  <span>
                    GST (18%)
                  </span>

                  <span>
                    ₹{tax.toFixed(2)}
                  </span>

                </div>

                <div className="grand-total">

                  <span>
                    Total Paid
                  </span>

                  <span>
                    ₹{finalTotal.toFixed(2)}
                  </span>

                </div>

              </div>


              {/* ===============================================
                  STATUS
              =============================================== */}

              <div className="row g-3 mt-4">

                <div className="col-md-6">

                  <div className="info-box">

                    <div className="info-label">
                      Payment Status
                    </div>

                    <div
                      className="fw-bold"
                      style={{
                        color: "#2E7D32",
                      }}
                    >
                      PAID
                    </div>

                  </div>

                </div>


                <div className="col-md-6">

                  <div className="info-box">

                    <div className="info-label">
                      Order Status
                    </div>

                    <div className="fw-bold">
                      {order.order_status}
                    </div>

                  </div>

                </div>

              </div>


              {/* ===============================================
                  THANK YOU
              =============================================== */}

              <div className="text-center mt-5">

                <h5 className="fw-bold">
                  Thank you for shopping with GlowCart!
                </h5>

                <p className="text-secondary small mb-0">
                  We appreciate your order and hope to see you again.
                </p>

              </div>

            </div>


            {/* =================================================
                FOOTER
            ================================================= */}

            <div className="receipt-footer">

              <strong>
                {companyInfo.name}
              </strong>

              <div className="mt-1">
                {companyInfo.email} • {companyInfo.phone}
              </div>

              <div className="mt-2">
                This is a computer-generated receipt.
              </div>

            </div>

          </div>


          {/* =================================================
              DOWNLOAD BUTTON
          ================================================= */}

          <div className="text-center mt-4 no-print">

            <button
              type="button"
              className="btn btn-dark px-5 py-2 rounded-pill"
              onClick={handleDownloadPdf}
            >
              🧾 Download Receipt as PDF
            </button>

          </div>

        </div>

      </section>
    </>
  );
}

export default OrderDetails;