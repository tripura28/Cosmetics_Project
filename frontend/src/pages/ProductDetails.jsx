import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function ProductDetails() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const detailTextStyle = {
    fontSize: "1.05rem",
    lineHeight: 1.7,
  };

  const detailHeadingStyle = {
    fontSize: "1.7rem",
    lineHeight: 1.2,
  };

  useEffect(() => {

  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const isAdminLoggedIn = localStorage.getItem("isAdminLoggedIn");

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
        console.error(error);
      });

  }, [id, navigate]);

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

  // ===========================
  // Add to Cart Function
  // ===========================

  async function handleAddToCart() {

  const customerId = localStorage.getItem("customerId");
  const isAdminLoggedIn = localStorage.getItem("isAdminLoggedIn");

  if (isAdminLoggedIn && !customerId) {
    alert("Admins cannot add products to a customer cart.");
    return;
  }

  if (!customerId) {
    alert("Please login as a customer to add products to cart.");
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

      alert(result.message || "Item added to cart successfully.");

    } else {

      alert(result.message || result.error);

    }

  } catch (error) {

    console.error(error);
    alert("Something went wrong");

  }
}

async function handleAddToWishlist() {

  const customerId = localStorage.getItem("customerId");
  const isAdminLoggedIn = localStorage.getItem("isAdminLoggedIn");

  if (isAdminLoggedIn && !customerId) {
    alert("Admins cannot add products to a wishlist.");
    return;
  }

  if (!customerId) {
    alert("Please login as a customer to add products to wishlist.");
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

      alert(result.message);

    } else {

      alert(result.message || result.error);

    }

  } catch (error) {

    console.error(error);
    alert("Something went wrong");

  }
}



  if (!product) {
    return (
      <>
        <Navbar />
        <section className="bg-light py-5 min-vh-100">
          <div className="container py-5 text-center">
            <h3 className="fw-bold">Loading product details...</h3>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <section className="bg-light py-5 min-vh-100">
        <div className="container py-5">

          {/* Breadcrumb */}
          <nav className="mb-4">

            <Link
              to="/products"
              className="text-dark text-decoration-none"
            >
              Products
            </Link>

            <span className="mx-2 text-secondary">
              /
            </span>

            <span className="text-secondary">
              {product.product_name}
            </span>

          </nav>

          <div className="card border-0 shadow-sm rounded-4 overflow-hidden">

            <div className="row g-0">

              {/* Product Image */}
              <div className="col-lg-6">

                <img
                  src={`/images/${product.image}`}
                  alt={product.product_name}
                  className="img-fluid w-100"
                  style={{
                    height: "500px",
                    objectFit: "cover"
                  }}
                />

              </div>

              {/* Product Information */}
              <div className="col-lg-6">

                <div className="p-4 p-md-5">

                  <small className="text-uppercase text-secondary fw-bold">
                    {product.category_name}
                  </small>

                  <h2 className="fw-bold mt-3 mb-2" style={detailHeadingStyle}>
                    {product.product_name}
                  </h2>

                  <div className="d-flex align-items-center gap-2 my-3">

                    <span className="text-warning fs-6">
                      ★★★★★
                    </span>

                    <span className="text-secondary small">
                      Premium Product
                    </span>

                  </div>

                  <h3 className="fw-bold mb-4" style={{ fontSize: "1.6rem" }}>
                    ₹{product.price}
                  </h3>

                  <p className="text-secondary mb-4" style={{ whiteSpace: "pre-line", ...detailTextStyle }}>
                    {product.description}
                  </p>

                  <hr className="my-4" />

                  <p style={detailTextStyle}>
                    <strong>Stock :</strong> {product.stock}
                  </p>

                  <p style={detailTextStyle}>
                    <strong>Status :</strong> {product.product_status}
                  </p>

                  {/* Quantity */}
                  <div className="mb-4">

                    <label className="form-label fw-semibold">
                      Quantity
                    </label>

                    <div
                      className="input-group"
                      style={{ maxWidth: "150px" }}
                    >

                      <button
                        className="btn btn-outline-dark"
                        type="button"
                        onClick={() => handleQuantityChange("dec")}
                      >
                        -
                      </button>

                      <input
                        type="text"
                        className="form-control text-center"
                        value={quantity}
                        readOnly
                      />

                      <button
                        className="btn btn-outline-dark"
                        type="button"
                        onClick={() => handleQuantityChange("inc")}
                      >
                        +
                      </button>

                    </div>

                  </div>

                  {/* Buttons */}

                  <div className="d-grid gap-2">

                    <button
                      className="btn btn-dark btn-lg"
                      onClick={handleAddToCart}
                    >
                      🛒 Add to Cart
                    </button>

                    <button
                        className="btn btn-outline-dark btn-lg"
                        onClick={handleAddToWishlist}
                      >
                        ❤️ Add to Wishlist
                      </button>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      <footer className="bg-dark text-white py-4">

        <div className="container text-center">

          <h5 className="fw-bold">
            GlowCart
          </h5>

          <p className="text-secondary mb-0">
            Beauty made simple.
          </p>

        </div>

      </footer>

    </>
  );
}

export default ProductDetails;