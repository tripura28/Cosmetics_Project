import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";

function Products() {

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("All Categories");
  const [sortOption, setSortOption] = useState("Sort By");

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // =====================================================
  // FETCH PRODUCTS
  // =====================================================

  useEffect(() => {

    fetch("http://127.0.0.1:5000/products")
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });

  }, []);


  // =====================================================
  // FETCH CATEGORIES
  // =====================================================

  useEffect(() => {

    fetch("http://127.0.0.1:5000/categories")
      .then((response) => response.json())
      .then((data) => {
        setCategories(data);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });

  }, []);


  // =====================================================
  // CATEGORY FROM URL
  // =====================================================

  useEffect(() => {

    const category = searchParams.get("category");

    if (category) {
      setSelectedCategory(category);
    } else {
      setSelectedCategory("All Categories");
    }

  }, [searchParams]);


  // =====================================================
  // VIEW PRODUCT DETAILS
  // =====================================================

  const handleViewDetails = (productId) => {

    const isLoggedIn =
      localStorage.getItem("isLoggedIn");

    const isAdminLoggedIn =
      localStorage.getItem("isAdminLoggedIn");

    if (!isLoggedIn && !isAdminLoggedIn) {

      alert("Please login to view product details.");

      navigate("/choose-role");

      return;
    }

    navigate(`/products/${productId}`);
  };


  // =====================================================
  // ADD TO CART
  // =====================================================

  async function handleAddToCart(productId) {

    const customerId =
      localStorage.getItem("customerId");

    const isLoggedIn =
      localStorage.getItem("isLoggedIn");

    const isAdminLoggedIn =
      localStorage.getItem("isAdminLoggedIn");

    if (!isLoggedIn && !isAdminLoggedIn) {

      alert("Please login to continue.");

      navigate("/choose-role");

      return;
    }

    if (isAdminLoggedIn) {

      alert(
        "Admin accounts cannot add products to the cart."
      );

      return;
    }

    try {

      const response = await fetch(
        "http://127.0.0.1:5000/add-to-cart",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            customer_id: customerId,
            product_id: productId
          })
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
          result.error ||
          result.message ||
          "Unable to add item to cart."
        );

      }

    } catch (error) {

      console.error(error);

      alert("Something went wrong.");

    }
  }


  // =====================================================
  // FILTER + SORT
  // =====================================================

  const filteredProducts = [...products]
    .filter((product) => {

      const productName =
        product.product_name || "";

      const matchesSearch =
        productName
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "All Categories" ||
        product.category_name === selectedCategory;

      return matchesSearch && matchesCategory;

    })
    .sort((a, b) => {

      if (sortOption === "LowToHigh") {

        return Number(a.price) - Number(b.price);

      }

      if (sortOption === "HighToLow") {

        return Number(b.price) - Number(a.price);

      }

      if (sortOption === "AToZ") {

        return a.product_name.localeCompare(
          b.product_name
        );

      }

      if (sortOption === "ZToA") {

        return b.product_name.localeCompare(
          a.product_name
        );

      }

      return 0;

    });


  return (

    <>
      <Navbar />


      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <section className="products-header">

        <div className="container text-center">

          <p className="products-label">
            GLOWCART COLLECTION
          </p>

          <h1>
            {selectedCategory === "All Categories"
              ? "All Products"
              : selectedCategory}
          </h1>

          <p>
            Discover beauty products made for
            your everyday routine.
          </p>

        </div>

      </section>


      {/* =====================================================
          PRODUCTS SECTION
      ===================================================== */}

      <section className="products-section">

        <div className="container">


          {/* =================================================
              SEARCH + CATEGORY
          ================================================= */}

          <div className="filter-box">

            <div className="row g-3">

              {/* SEARCH */}

              <div className="col-lg-7">

                <div className="search-wrapper">

                  <span className="search-icon">
                    🔍
                  </span>

                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) =>
                      setSearchTerm(e.target.value)
                    }
                  />

                  {searchTerm && (

                    <button
                      className="clear-search"
                      onClick={() =>
                        setSearchTerm("")
                      }
                    >
                      ×
                    </button>

                  )}

                </div>

              </div>


              {/* CATEGORY */}

              <div className="col-lg-5">

                <select
                  className="custom-select"
                  value={selectedCategory}
                  onChange={(e) =>
                    setSelectedCategory(e.target.value)
                  }
                >

                  <option value="All Categories">
                    All Categories
                  </option>

                  {categories.map((category) => (

                    <option
                      key={category.category_id}
                      value={category.category_name}
                    >
                      {category.category_name}
                    </option>

                  ))}

                </select>

              </div>

            </div>

          </div>


          {/* =================================================
              PRODUCT COUNT + SORT
          ================================================= */}

          <div className="products-toolbar">

            <div>

              <h5>
                {filteredProducts.length}{" "}
                {filteredProducts.length === 1
                  ? "Product"
                  : "Products"}
              </h5>

              {selectedCategory !== "All Categories" && (

                <small>
                  Showing products in{" "}
                  <strong>
                    {selectedCategory}
                  </strong>
                </small>

              )}

            </div>


            <select
              className="sort-select"
              value={sortOption}
              onChange={(e) =>
                setSortOption(e.target.value)
              }
            >

              <option value="Sort By">
                Sort By
              </option>

              <option value="LowToHigh">
                Price: Low to High
              </option>

              <option value="HighToLow">
                Price: High to Low
              </option>

              <option value="AToZ">
                Name: A-Z
              </option>

              <option value="ZToA">
                Name: Z-A
              </option>

            </select>

          </div>


          {/* =================================================
              PRODUCT CARDS
          ================================================= */}

          {filteredProducts.length > 0 ? (

            <div className="row g-4">

              {filteredProducts.map((product) => (

                <div
                  className="col-12 col-sm-6 col-lg-3"
                  key={product.product_id}
                >

                  <div className="product-card">


                    {/* PRODUCT IMAGE */}

                    <div
                      className="product-image-wrapper"
                      onClick={() =>
                        handleViewDetails(
                          product.product_id
                        )
                      }
                    >

                      <img
                        src={`/images/${product.image}`}
                        alt={product.product_name}
                        onError={(e) => {
                          e.target.src =
                            "/images/no-image.jpg";
                        }}
                      />


                      {/* CATEGORY */}

                      <span className="product-category">

                        {product.category_name}

                      </span>

                    </div>


                    {/* PRODUCT INFORMATION */}

                    <div className="product-card-body">


                      <h5
                        onClick={() =>
                          handleViewDetails(
                            product.product_id
                          )
                        }
                      >
                        {product.product_name}
                      </h5>


                      <p className="product-description">

                        Tap to view full details
                        and description.

                      </p>


                      {/* PRICE + RATING */}

                      <div className="price-rating">

                        <span className="product-price">

                          ₹
                          {Number(product.price).toFixed(2)}

                        </span>


                        <span className="product-rating">
                          ★★★★★
                        </span>

                      </div>


                      {/* BUTTONS */}

                      <div className="product-buttons">

                        <button
                          className="add-cart-btn"
                          onClick={(e) => {

                            e.stopPropagation();

                            handleAddToCart(
                              product.product_id
                            );

                          }}
                        >
                          🛒 Add to Cart
                        </button>


                        <button
                          className="view-details-btn"
                          onClick={(e) => {

                            e.stopPropagation();

                            handleViewDetails(
                              product.product_id
                            );

                          }}
                        >
                          View Details
                        </button>

                      </div>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          ) : (

            /* =================================================
               NO PRODUCTS
            ================================================= */

            <div className="no-products">

              <div className="no-products-icon">
                🔍
              </div>

              <h4>
                No Products Found
              </h4>

              <p>
                We couldn't find products matching
                your search.
              </p>

              <button
                onClick={() => {

                  setSearchTerm("");

                  setSelectedCategory(
                    "All Categories"
                  );

                }}
              >
                Clear Filters
              </button>

            </div>

          )}

        </div>

      </section>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="bg-dark text-white py-5">

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

              <a
                href="/"
                className="footer-link"
              >
                Home
              </a>

              <a
                href="/products"
                className="footer-link"
              >
                Products
              </a>

              <a
                href="/categories"
                className="footer-link"
              >
                Categories
              </a>

              <a
                href="/about"
                className="footer-link"
              >
                About
              </a>

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


          <hr className="border-secondary my-4" />


          <p className="text-center text-secondary mb-0">
            © 2026 GlowCart. All Rights Reserved.
          </p>

        </div>

      </footer>


      {/* =====================================================
          PRODUCTS PAGE CSS
      ===================================================== */}

      <style>
        {`

        /* =========================================
           PAGE HEADER
        ========================================= */

        .products-header {

          background:
            linear-gradient(
              135deg,
              #faf8ff,
              #fff8fb
            );

          padding: 65px 0;

          border-bottom: 1px solid #eee8f2;

        }


        .products-header .products-label {

          color: #7C6EE6;

          font-size: 13px;

          font-weight: 700;

          letter-spacing: 3px;

          margin-bottom: 10px;

        }


        .products-header h1 {

          font-family: 'Cinzel', serif;

          color: #211B35;

          font-size: 2.8rem;

          font-weight: 700;

          margin-bottom: 12px;

        }


        .products-header p:last-child {

          color: #777;

          margin-bottom: 0;

        }


        /* =========================================
           PRODUCTS SECTION
        ========================================= */

        .products-section {

          background: #ffffff;

          padding: 55px 0 80px;

          min-height: 600px;

        }


        /* =========================================
           FILTER BOX
        ========================================= */

        .filter-box {

          background: #faf9fc;

          border: 1px solid #eee9f3;

          border-radius: 16px;

          padding: 20px;

          margin-bottom: 35px;

        }


        .search-wrapper {

          height: 52px;

          background: white;

          border: 1px solid #ddd7e5;

          border-radius: 12px;

          display: flex;

          align-items: center;

          padding: 0 15px;

          transition: 0.2s;

        }


        .search-wrapper:focus-within {

          border-color: #7C6EE6;

          box-shadow:
            0 0 0 3px rgba(124,110,230,0.10);

        }


        .search-icon {

          margin-right: 10px;

          font-size: 16px;

        }


        .search-wrapper input {

          border: none;

          outline: none;

          width: 100%;

          height: 100%;

          font-size: 15px;

          color: #211B35;

          background: transparent;

        }


        .search-wrapper input::placeholder {

          color: #999;

        }


        .clear-search {

          border: none;

          background: transparent;

          color: #888;

          font-size: 22px;

          cursor: pointer;

        }


        .custom-select {

          width: 100%;

          height: 52px;

          border: 1px solid #ddd7e5;

          border-radius: 12px;

          padding: 0 15px;

          background: white;

          color: #211B35;

          outline: none;

          cursor: pointer;

        }


        .custom-select:focus {

          border-color: #7C6EE6;

          box-shadow:
            0 0 0 3px rgba(124,110,230,0.10);

        }


        /* =========================================
           TOOLBAR
        ========================================= */

        .products-toolbar {

          display: flex;

          justify-content: space-between;

          align-items: center;

          margin-bottom: 25px;

        }


        .products-toolbar h5 {

          font-family: Arial, sans-serif;

          font-weight: 700;

          color: #211B35;

          margin-bottom: 3px;

        }


        .products-toolbar small {

          color: #888;

        }


        .sort-select {

          border: 1px solid #ddd7e5;

          border-radius: 10px;

          padding: 9px 35px 9px 12px;

          background: white;

          color: #211B35;

          outline: none;

          cursor: pointer;

        }


        .sort-select:focus {

          border-color: #7C6EE6;

        }


        /* =========================================
           PRODUCT CARD
        ========================================= */

        .product-card {

          height: 100%;

          background: white;

          border: 1px solid #eee9f2;

          border-radius: 16px;

          overflow: hidden;

          box-shadow:
            0 4px 15px rgba(0,0,0,0.04);

          transition:
            transform 0.3s ease,
            box-shadow 0.3s ease;

        }


        .product-card:hover {

          transform: translateY(-7px);

          box-shadow:
            0 14px 30px rgba(0,0,0,0.10);

        }


        /* =========================================
           PRODUCT IMAGE
        ========================================= */

        .product-image-wrapper {

          position: relative;

          height: 270px;

          background: #faf9fc;

          overflow: hidden;

          cursor: pointer;

        }


        .product-image-wrapper img {

          width: 100%;

          height: 100%;

          object-fit: cover;

          transition:
            transform 0.4s ease;

        }


        .product-card:hover
        .product-image-wrapper img {

          transform: scale(1.04);

        }


        .product-category {

          position: absolute;

          top: 12px;

          left: 12px;

          background: rgba(255,255,255,0.92);

          color: #7C6EE6;

          font-size: 11px;

          font-weight: 700;

          text-transform: uppercase;

          padding: 6px 10px;

          border-radius: 20px;

        }


        /* =========================================
           PRODUCT BODY
        ========================================= */

        .product-card-body {

          padding: 20px;

          display: flex;

          flex-direction: column;

          height: calc(100% - 270px);

        }


        .product-card-body h5 {

          font-family: Arial, sans-serif;

          font-size: 17px;

          font-weight: 700;

          color: #211B35;

          cursor: pointer;

          margin-bottom: 8px;

          transition: 0.2s;

        }


        .product-card-body h5:hover {

          color: #7C6EE6;

        }


        .product-description {

          color: #888;

          font-size: 13px;

          line-height: 1.5;

          margin-bottom: 18px;

        }


        /* =========================================
           PRICE + RATING
        ========================================= */

        .price-rating {

          display: flex;

          justify-content: space-between;

          align-items: center;

          margin-top: auto;

          margin-bottom: 15px;

        }


        .product-price {

          font-size: 19px;

          font-weight: 700;

          color: #211B35;

        }


        .product-rating {

          color: #f3b51b;

          font-size: 13px;

          letter-spacing: 1px;

        }


        /* =========================================
           BUTTONS
        ========================================= */

        .product-buttons {

          display: grid;

          gap: 8px;

        }


        .add-cart-btn {

          border: none;

          background: #211B35;

          color: white;

          padding: 10px;

          border-radius: 9px;

          font-weight: 600;

          transition: 0.2s;

        }


        .add-cart-btn:hover {

          background: #7C6EE6;

        }


        .view-details-btn {

          border: 1px solid #211B35;

          background: white;

          color: #211B35;

          padding: 9px;

          border-radius: 9px;

          font-weight: 600;

          transition: 0.2s;

        }


        .view-details-btn:hover {

          background: #211B35;

          color: white;

        }


        /* =========================================
           NO PRODUCTS
        ========================================= */

        .no-products {

          text-align: center;

          padding: 90px 20px;

          border: 1px dashed #ddd7e5;

          border-radius: 16px;

          background: #faf9fc;

        }


        .no-products-icon {

          font-size: 40px;

          margin-bottom: 15px;

        }


        .no-products h4 {

          font-family: 'Cinzel', serif;

          font-weight: 700;

          color: #211B35;

        }


        .no-products p {

          color: #888;

        }


        .no-products button {

          border: none;

          background: #211B35;

          color: white;

          padding: 9px 22px;

          border-radius: 25px;

        }


        /* =========================================
           FOOTER
        ========================================= */

        .footer-link {

          display: block;

          color: #888;

          text-decoration: none;

          margin-bottom: 8px;

          transition: 0.2s;

        }


        .footer-link:hover {

          color: white;

        }


        /* =========================================
           RESPONSIVE
        ========================================= */

        @media (max-width: 768px) {

          .products-header {

            padding: 45px 0;

          }


          .products-header h1 {

            font-size: 2.2rem;

          }


          .products-toolbar {

            flex-direction: column;

            align-items: flex-start;

            gap: 15px;

          }


          .sort-select {

            width: 100%;

          }


          .product-image-wrapper {

            height: 250px;

          }

        }

        `}
      </style>

    </>
  );
}

export default Products;