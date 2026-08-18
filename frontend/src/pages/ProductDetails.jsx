import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function ProductDetails() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // =====================================================
  // FETCH PRODUCT
  // =====================================================

  useEffect(() => {

    const isLoggedIn =
      localStorage.getItem("isLoggedIn");

    const isAdminLoggedIn =
      localStorage.getItem("isAdminLoggedIn");

    if (!isLoggedIn && !isAdminLoggedIn) {

      alert("Please login to continue.");

      navigate("/choose-role");

      return;
    }

    fetch(`http://127.0.0.1:5000/products/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setProduct(data);
      })
      .catch((error) => {
        console.error("Error fetching product:", error);
      });

  }, [id, navigate]);


  // =====================================================
  // QUANTITY
  // =====================================================

  function handleQuantityChange(type) {

    setQuantity((prev) => {

      if (type === "inc") {
        return prev + 1;
      }

      if (type === "dec") {
        return prev > 1 ? prev - 1 : 1;
      }

      return prev;

    });

  }


  // =====================================================
  // ADD TO CART
  // =====================================================

  async function handleAddToCart() {

    const customerId =
      localStorage.getItem("customerId");

    const isAdminLoggedIn =
      localStorage.getItem("isAdminLoggedIn");

    if (isAdminLoggedIn && !customerId) {

      alert(
        "Admins cannot add products to a customer cart."
      );

      return;
    }

    if (!customerId) {

      alert(
        "Please login as a customer to add products to cart."
      );

      navigate("/choose-role");

      return;
    }

    try {

      const response = await fetch(
        "http://127.0.0.1:5000/add-to-cart",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            customer_id: customerId,
            product_id: product.product_id,
            quantity: quantity,
          }),
        }
      );

      const result = await response.json();

      if (response.ok) {

        alert(
          result.message ||
          "Item added to cart successfully."
        );

      } else {

        alert(
          result.message ||
          result.error ||
          "Unable to add item to cart."
        );

      }

    } catch (error) {

      console.error(error);

      alert("Something went wrong.");

    }

  }


  // =====================================================
  // ADD TO WISHLIST
  // =====================================================

  async function handleAddToWishlist() {

    const customerId =
      localStorage.getItem("customerId");

    const isAdminLoggedIn =
      localStorage.getItem("isAdminLoggedIn");

    if (isAdminLoggedIn && !customerId) {

      alert(
        "Admins cannot add products to a wishlist."
      );

      return;
    }

    if (!customerId) {

      alert(
        "Please login as a customer to add products to wishlist."
      );

      navigate("/choose-role");

      return;
    }

    try {

      const response = await fetch(
        "http://127.0.0.1:5000/add-to-wishlist",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            customer_id: customerId,
            product_id: product.product_id,
          }),
        }
      );

      const result = await response.json();

      if (response.ok) {

        alert(
          result.message ||
          "Product added to wishlist."
        );

      } else {

        alert(
          result.message ||
          result.error ||
          "Unable to add product to wishlist."
        );

      }

    } catch (error) {

      console.error(error);

      alert("Something went wrong.");

    }

  }


  // =====================================================
  // LOADING
  // =====================================================

  if (!product) {

    return (
      <>
        <Navbar />

        <section className="product-details-page">

          <div className="container">

            <div className="loading-box">

              <div className="spinner-border text-dark"></div>

              <h5 className="mt-3">
                Loading product details...
              </h5>

            </div>

          </div>

        </section>
      </>
    );

  }


  return (

    <>
      <Navbar />

      {/* =====================================================
          PRODUCT DETAILS
      ===================================================== */}

      <section className="product-details-page">

        <div className="container py-4 py-md-5">

          {/* Breadcrumb */}

          <nav className="product-breadcrumb mb-3">

            <Link to="/products">
              Products
            </Link>

            <span>/</span>

            <span>
              {product.product_name}
            </span>

          </nav>


          {/* Product Card */}

          <div className="product-details-card">

            <div className="row g-0">


              {/* =================================================
                  PRODUCT IMAGE
              ================================================= */}

              <div className="col-lg-6">

                <div className="details-image-container">

                  <img
                    src={`/images/${product.image}`}
                    alt={product.product_name}
                    onError={(e) => {
                      e.target.src =
                        "/images/no-image.jpg";
                    }}
                  />

                </div>

              </div>


              {/* =================================================
                  PRODUCT INFORMATION
              ================================================= */}

              <div className="col-lg-6">

                <div className="details-content">


                  {/* Category */}

                  <span className="details-category">
                    {product.category_name}
                  </span>


                  {/* Product Name */}

                  <h1 className="details-title">
                    {product.product_name}
                  </h1>


                  {/* Rating */}

                  <div className="details-rating">

                    <span>
                      ★★★★★
                    </span>

                    <small>
                      Premium Beauty Product
                    </small>

                  </div>


                  {/* Price */}

                  <div className="details-price">

                    ₹{Number(product.price).toFixed(2)}

                  </div>


                  {/* Description */}

                  <p className="details-description">

                    {product.description}

                  </p>


                  <hr />


                  {/* Stock + Status */}

                  <div className="details-info">

                    <div>

                      <span>
                        Stock
                      </span>

                      <strong>
                        {product.stock}
                      </strong>

                    </div>


                    <div>

                      <span>
                        Status
                      </span>

                      <strong
                        className={
                          product.product_status
                            ?.toLowerCase() === "available"
                            ? "status-available"
                            : ""
                        }
                      >
                        {product.product_status}
                      </strong>

                    </div>

                  </div>


                  {/* Quantity */}

                  <div className="quantity-section">

                    <label>
                      Quantity
                    </label>

                    <div className="quantity-control">

                      <button
                        type="button"
                        onClick={() =>
                          handleQuantityChange("dec")
                        }
                      >
                        −
                      </button>

                      <span>
                        {quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          handleQuantityChange("inc")
                        }
                      >
                        +
                      </button>

                    </div>

                  </div>


                  {/* Buttons */}

                  <div className="details-buttons">

                    <button
                      className="cart-button"
                      onClick={handleAddToCart}
                    >
                      🛒 Add to Cart
                    </button>

                    <button
                      className="wishlist-button"
                      onClick={handleAddToWishlist}
                    >
                      ♡ Add to Wishlist
                    </button>

                  </div>


                  {/* Features */}

                  <div className="details-features">

                    <div>

                      <span>✓</span>

                      <p>
                        Quality beauty products
                      </p>

                    </div>


                    <div>

                      <span>🔒</span>

                      <p>
                        Secure shopping
                      </p>

                    </div>


                    <div>

                      <span>🚚</span>

                      <p>
                        Fast delivery
                      </p>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="bg-dark text-white py-4">

        <div className="container">

          <div className="row g-4">

            <div className="col-md-4">

              <h3
                className="fw-bold"
                style={{
                  fontFamily: "'Cinzel', serif"
                }}
              >
                GlowCart
              </h3>

              <p className="text-secondary">
                Beauty made simple.
              </p>

              <p className="text-secondary small">
                Discover premium beauty products
                carefully selected for you.
              </p>

            </div>


            <div className="col-md-4">

              <h5>
                Quick Links
              </h5>

              <Link
                to="/"
                className="footer-link"
              >
                Home
              </Link>

              <Link
                to="/products"
                className="footer-link"
              >
                Products
              </Link>

              <Link
                to="/categories"
                className="footer-link"
              >
                Categories
              </Link>

              <Link
                to="/about"
                className="footer-link"
              >
                About
              </Link>

            </div>


            <div className="col-md-4">

              <h5>
                Contact
              </h5>

              <p className="text-secondary mb-2">
                support@glowcart.com
              </p>

              <p className="text-secondary mb-2">
                +91 9876543210
              </p>

              <p className="text-secondary mb-0">
                Mumbai, India
              </p>

            </div>

          </div>


          <hr className="border-secondary my-3" />

          <p className="text-center text-secondary mb-0">
            © 2026 GlowCart. All Rights Reserved.
          </p>

        </div>

      </footer>


      {/* =====================================================
          CSS
      ===================================================== */}

      <style>
        {`

        /* ==========================================
           MAIN PAGE
        ========================================== */

        .product-details-page {

          min-height: 100vh;

          background:
            linear-gradient(
              135deg,
              #faf9fc,
              #ffffff
            );

        }


        /* ==========================================
           BREADCRUMB
        ========================================== */

        .product-breadcrumb {

          display: flex;

          align-items: center;

          gap: 9px;

          font-size: 14px;

        }


        .product-breadcrumb a {

          color: #211B35;

          text-decoration: none;

          font-weight: 600;

        }


        .product-breadcrumb a:hover {

          color: #7C6EE6;

        }


        .product-breadcrumb span {

          color: #999;

        }


        /* ==========================================
           MAIN CARD
        ========================================== */

        .product-details-card {

          background: #ffffff;

          border: 1px solid #eee9f2;

          border-radius: 18px;

          overflow: hidden;

          box-shadow:
            0 6px 25px rgba(0, 0, 0, 0.06);

        }


        /* ==========================================
           IMAGE
        ========================================== */

        .details-image-container {

          height: 100%;

          min-height: 460px;

          background: #faf9fc;

          display: flex;

          align-items: center;

          justify-content: center;

          overflow: hidden;

        }


        .details-image-container img {

          width: 100%;

          height: 460px;

          object-fit: cover;

          transition:
            transform 0.4s ease;

        }


        .product-details-card:hover
        .details-image-container img {

          transform: scale(1.02);

        }


        /* ==========================================
           CONTENT
        ========================================== */

        .details-content {

          padding: 38px 40px;

        }


        /* ==========================================
           CATEGORY
        ========================================== */

        .details-category {

          display: inline-block;

          color: #7C6EE6;

          background: #f3efff;

          padding: 6px 13px;

          border-radius: 20px;

          font-size: 12px;

          font-weight: 700;

          text-transform: uppercase;

          letter-spacing: 0.8px;

        }


        /* ==========================================
           TITLE - MEDIUM
        ========================================== */

        .details-title {

          font-family: 'Cinzel', serif;

          color: #211B35;

          font-size: 1.9rem;

          line-height: 1.3;

          font-weight: 700;

          margin-top: 17px;

          margin-bottom: 13px;

        }


        /* ==========================================
           RATING - MEDIUM
        ========================================== */

        .details-rating {

          display: flex;

          align-items: center;

          gap: 10px;

          margin-bottom: 18px;

        }


        .details-rating span {

          color: #f3b51b;

          letter-spacing: 1.5px;

          font-size: 14px;

        }


        .details-rating small {

          color: #888;

          font-size: 13px;

        }


        /* ==========================================
           PRICE - MEDIUM
        ========================================== */

        .details-price {

          color: #211B35;

          font-size: 1.65rem;

          font-weight: 700;

          margin-bottom: 18px;

        }


        /* ==========================================
           DESCRIPTION - MEDIUM
        ========================================== */

        .details-description {

          color: #666;

          font-size: 15px;

          line-height: 1.65;

          white-space: pre-line;

          margin-bottom: 20px;

        }


        .details-content hr {

          border-color: #eee;

          margin: 20px 0;

        }


        /* ==========================================
           STOCK + STATUS
        ========================================== */

        .details-info {

          display: flex;

          gap: 45px;

          margin-bottom: 22px;

        }


        .details-info div {

          display: flex;

          flex-direction: column;

          gap: 5px;

        }


        .details-info span {

          color: #888;

          font-size: 13px;

        }


        .details-info strong {

          color: #211B35;

          font-size: 15px;

        }


        .status-available {

          color: #198754 !important;

        }


        /* ==========================================
           QUANTITY
        ========================================== */

        .quantity-section {

          margin-bottom: 20px;

        }


        .quantity-section label {

          display: block;

          font-weight: 600;

          color: #211B35;

          font-size: 14px;

          margin-bottom: 9px;

        }


        .quantity-control {

          width: 135px;

          height: 42px;

          border: 1px solid #ddd7e5;

          border-radius: 9px;

          display: flex;

          align-items: center;

          justify-content: space-between;

          overflow: hidden;

          background: white;

        }


        .quantity-control button {

          width: 42px;

          height: 100%;

          border: none;

          background: #faf9fc;

          color: #211B35;

          font-size: 19px;

          cursor: pointer;

          transition: 0.2s;

        }


        .quantity-control button:hover {

          background: #211B35;

          color: white;

        }


        .quantity-control span {

          font-size: 15px;

          font-weight: 600;

        }


        /* ==========================================
           BUTTONS - MEDIUM
        ========================================== */

        .details-buttons {

          display: grid;

          gap: 9px;

          margin-bottom: 20px;

        }


        .cart-button {

          border: none;

          background: #211B35;

          color: white;

          padding: 12px;

          border-radius: 9px;

          font-weight: 600;

          font-size: 15px;

          transition: 0.3s;

        }


        .cart-button:hover {

          background: #7C6EE6;

          transform: translateY(-1px);

        }


        .wishlist-button {

          border: 1px solid #211B35;

          background: white;

          color: #211B35;

          padding: 11px;

          border-radius: 9px;

          font-weight: 600;

          font-size: 15px;

          transition: 0.3s;

        }


        .wishlist-button:hover {

          background: #211B35;

          color: white;

        }


        /* ==========================================
           FEATURES - MEDIUM
        ========================================== */

        .details-features {

          display: flex;

          flex-direction: column;

          gap: 8px;

        }


        .details-features div {

          display: flex;

          align-items: center;

          gap: 10px;

        }


        .details-features span {

          width: 29px;

          height: 29px;

          border-radius: 50%;

          background: #f3efff;

          color: #7C6EE6;

          display: flex;

          align-items: center;

          justify-content: center;

          font-size: 13px;

        }


        .details-features p {

          margin: 0;

          color: #777;

          font-size: 13px;

        }


        /* ==========================================
           LOADING
        ========================================== */

        .loading-box {

          min-height: 70vh;

          display: flex;

          flex-direction: column;

          align-items: center;

          justify-content: center;

          color: #211B35;

        }


        /* ==========================================
           FOOTER
        ========================================== */

        .footer-link {

          display: block;

          color: #888;

          text-decoration: none;

          font-size: 14px;

          margin-bottom: 8px;

          transition: 0.2s;

        }


        .footer-link:hover {

          color: white;

        }


        /* ==========================================
           TABLET
        ========================================== */

        @media (max-width: 991px) {

          .details-image-container {

            min-height: 400px;

          }


          .details-image-container img {

            height: 400px;

          }


          .details-content {

            padding: 32px;

          }

        }


        /* ==========================================
           MOBILE
        ========================================== */

        @media (max-width: 576px) {

          .product-details-page .container {

            padding-left: 15px;

            padding-right: 15px;

          }


          .details-image-container {

            min-height: 330px;

          }


          .details-image-container img {

            height: 330px;

          }


          .details-content {

            padding: 27px 20px;

          }


          .details-title {

            font-size: 1.7rem;

          }


          .details-price {

            font-size: 1.5rem;

          }


          .details-description {

            font-size: 14px;

          }


          .details-info {

            gap: 30px;

          }

        }

        `}
      </style>

    </>
  );
}

export default ProductDetails;