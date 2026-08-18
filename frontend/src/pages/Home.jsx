import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

function Home() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  // ================= FETCH CATEGORIES =================

  useEffect(() => {
    fetch("http://127.0.0.1:5000/categories")
      .then((res) => res.json())
      .then((data) => {
        const icons = {
          Makeup: "💄",
          Skincare: "🧴",
          "Hair Care": "💇",
          "Body Care": "🧼",
          Fragrances: "🌸",
        };

        const descriptions = {
          Makeup: "Lipsticks, foundations and more.",
          Skincare: "Serums, cleansers and moisturizers.",
          "Hair Care": "Products for healthy hair.",
          "Body Care": "Body lotions, scrubs and washes.",
          Fragrances: "Fresh and beautiful fragrances.",
        };

        const updatedCategories = data.map((category) => ({
          ...category,
          icon: icons[category.category_name] || "✨",
          description:
            descriptions[category.category_name] ||
            "Beauty Collection",
        }));

        setCategories(updatedCategories);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  // ================= FETCH PRODUCTS =================

  useEffect(() => {
    fetch("http://127.0.0.1:5000/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.slice(0, 4));
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <>
      <Navbar />

      {/* =====================================================
          HERO SECTION
      ===================================================== */}

      <section
        className="home-hero"
        style={{
          backgroundImage: "url('/images/hero.jpg')",
        }}
      >
        <div className="home-hero-overlay"></div>

        <div className="container position-relative">
          <div className="row">
            <div className="col-lg-7">

              <p className="hero-small-title">
                WELCOME TO GLOWCART
              </p>

              <div className="hero-line"></div>

              <h1 className="hero-title">
                Glow Naturally,
                <br />
                Shine <span>Beautifully</span>
              </h1>

              <p className="hero-description">
                Discover premium skincare, makeup, fragrances
                and beauty essentials carefully selected for
                your everyday confidence.
              </p>

              <div className="hero-buttons">

                <Link
                  to="/products"
                  className="hero-shop-btn"
                >
                  Shop Now →
                </Link>

                <Link
                  to="/categories"
                  className="hero-outline-btn"
                >
                  Explore Collections
                </Link>

              </div>

            </div>
          </div>
        </div>

        {/* HERO BENEFITS */}

        <div className="hero-benefits">

          <div className="hero-benefit">
            <div className="benefit-icon">✦</div>

            <div>
              <strong>Quality Products</strong>
              <small>Carefully selected</small>
            </div>
          </div>

          <div className="hero-benefit">
            <div className="benefit-icon">🔒</div>

            <div>
              <strong>Secure Shopping</strong>
              <small>Safe and secure</small>
            </div>
          </div>

          <div className="hero-benefit">
            <div className="benefit-icon">🚚</div>

            <div>
              <strong>Fast Delivery</strong>
              <small>Quick and reliable</small>
            </div>
          </div>

          <div className="hero-benefit">
            <div className="benefit-icon">↩</div>

            <div>
              <strong>Easy Returns</strong>
              <small>Simple and convenient</small>
            </div>
          </div>

        </div>
      </section>


      {/* =====================================================
          SHOP BY CATEGORY
      ===================================================== */}

      <section className="category-section">

        <div className="container">

          <div className="section-heading">

            <p>DISCOVER</p>

            <h2>
              Shop By Category
            </h2>

            <span>
              Find everything you need for your beauty routine.
            </span>

          </div>


          <div className="row g-4">

            {categories.map((category) => (

              <div
                className="col-12 col-sm-6 col-lg-3"
                key={category.category_id}
              >

                <div className="category-card">

                  <div className="category-icon">
                    {category.icon}
                  </div>

                  <h5>
                    {category.category_name}
                  </h5>

                  <p>
                    {category.description}
                  </p>

                  <button
                    onClick={() =>
                      navigate(
                        `/products?category=${encodeURIComponent(
                          category.category_name
                        )}`
                      )
                    }
                  >
                    Explore →
                  </button>

                </div>

              </div>

            ))}

          </div>

        </div>

      </section>


      {/* =====================================================
          FEATURED PRODUCTS
      ===================================================== */}

      <section className="featured-section">

        <div className="container">

          <div className="section-heading">

            <p>FEATURED</p>

            <h2>
              Beauty Essentials
            </h2>

            <span>
              A few of our selected products.
            </span>

          </div>


          <div className="row g-4">

            {products.map((product) => (

              <div
                className="col-12 col-sm-6 col-lg-3"
                key={product.product_id}
              >

                <div className="product-home-card">

                  <div className="product-home-image">

                    <img
                      src={
                        product.image
                          ? `/images/${product.image}`
                          : "/images/product-placeholder.jpg"
                      }
                      alt={product.product_name}
                    />

                  </div>


                  <div className="product-home-body">

                    <h5>
                      {product.product_name}
                    </h5>

                    <p>
                      ₹{Number(product.price).toFixed(2)}
                    </p>

                    <button
                      onClick={() =>
                        navigate(
                          `/products/${product.product_id}`
                        )
                      }
                    >
                      View Product
                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>


          <div className="text-center mt-5">

            <Link
              to="/products"
              className="view-all-btn"
            >
              View All Products →
            </Link>

          </div>

        </div>

      </section>


      {/* =====================================================
          WHY GLOWCART
      ===================================================== */}

      <section className="why-section">

        <div className="container">

          <div className="section-heading">

            <p>WHY US</p>

            <h2>
              Why Choose GlowCart?
            </h2>

          </div>


          <div className="row g-0 why-row">

            <div className="col-md-3">

              <div className="why-card">

                <div className="why-icon">
                  ✦
                </div>

                <div>
                  <h5>Quality Products</h5>

                  <p>
                    Carefully selected beauty products
                    for your everyday needs.
                  </p>
                </div>

              </div>

            </div>


            <div className="col-md-3">

              <div className="why-card">

                <div className="why-icon">
                  🔒
                </div>

                <div>
                  <h5>Secure Shopping</h5>

                  <p>
                    Safe and secure payment experience
                    every time.
                  </p>
                </div>

              </div>

            </div>


            <div className="col-md-3">

              <div className="why-card">

                <div className="why-icon">
                  🚚
                </div>

                <div>
                  <h5>Fast Delivery</h5>

                  <p>
                    Quick and reliable delivery directly
                    to your doorstep.
                  </p>
                </div>

              </div>

            </div>


            <div className="col-md-3">

              <div className="why-card">

                <div className="why-icon">
                  ↩
                </div>

                <div>
                  <h5>Easy Returns</h5>

                  <p>
                    Simple and convenient return
                    experience.
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="home-footer">

        <div className="container">

          <div className="row g-5">

            {/* BRAND */}

            <div className="col-md-4">

              <h3>
                Glow<span>Cart</span>
              </h3>

              <p>
                Beauty made simple.
              </p>

              <small>
                Discover beauty products that help you
                glow naturally and confidently every day.
              </small>

              <div className="social-icons">

                <span>◎</span>
                <span>f</span>
                <span>𝕏</span>
                <span>p</span>

              </div>

            </div>


            {/* QUICK LINKS */}

            <div className="col-md-2">

              <h5>
                Quick Links
              </h5>

              <Link to="/">
                Home
              </Link>

              <Link to="/products">
                Products
              </Link>

              <Link to="/categories">
                Categories
              </Link>

              <Link to="/about">
                About Us
              </Link>

            </div>


            {/* CUSTOMER SERVICE */}

            <div className="col-md-3">

              <h5>
                Customer Service
              </h5>

              <Link to="/orders">
                My Orders
              </Link>

              <span>
                Returns & Refunds
              </span>

              <span>
                Shipping Policy
              </span>

              <span>
                Privacy Policy
              </span>

              <span>
                Terms & Conditions
              </span>

            </div>


            {/* CONTACT */}

            <div className="col-md-3">

              <h5>
                Contact
              </h5>

              <p>
                ✉ support@glowcart.com
              </p>

              <p>
                ☎ +91 9876543210
              </p>

              <p>
                ⌖ 123 Beauty Street,
                <br />
                Mumbai, India
              </p>

            </div>

          </div>


          <hr />


          <div className="footer-bottom">

            <span>
              © 2026 GlowCart. All Rights Reserved.
            </span>

            <span>
              Made with ❤️ for your beauty.
            </span>

          </div>

        </div>

      </footer>


      {/* =====================================================
          HOME PAGE CSS
      ===================================================== */}

      <style>
        {`

        /* ==================================================
           GLOBAL
        ================================================== */

        .home-hero,
        .category-section,
        .featured-section,
        .why-section,
        .home-footer {

          font-family: Arial, sans-serif;

        }


        h1,
        h2,
        h3,
        h4,
        h5 {

          font-family: 'Cinzel', serif;

        }


        /* ==================================================
           HERO
        ================================================== */

        .home-hero {

          min-height: 720px;

          position: relative;

          background-size: cover;

          background-position: center;

          display: flex;

          align-items: center;

          padding: 80px 0 160px;

          overflow: hidden;

        }


        .home-hero-overlay {

          position: absolute;

          inset: 0;

          background:
            linear-gradient(
              90deg,
              rgba(255, 245, 248, 0.92) 0%,
              rgba(255, 245, 248, 0.76) 35%,
              rgba(255, 245, 248, 0.15) 70%,
              rgba(255, 245, 248, 0.05) 100%
            );

        }


        .hero-small-title {

          color: #7C3F96;

          font-weight: 600;

          letter-spacing: 4px;

          margin-bottom: 10px;

        }


        .hero-line {

          width: 55px;

          height: 2px;

          background: #7C6EE6;

          margin-bottom: 18px;

        }


        .hero-title {

          font-family: 'Cinzel', serif;

          font-size: clamp(2.8rem, 6vw, 5rem);

          line-height: 1.12;

          font-weight: 700;

          color: #211B35;

          margin-bottom: 25px;

        }


        .hero-title span {

          color: #7C3F96;

        }


        .hero-description {

          max-width: 520px;

          color: #4f4a57;

          font-size: 1.05rem;

          line-height: 1.8;

          margin-bottom: 30px;

        }


        .hero-buttons {

          display: flex;

          gap: 15px;

          flex-wrap: wrap;

        }


        .hero-shop-btn {

          display: inline-block;

          background: #7C3F96;

          color: white;

          padding: 13px 32px;

          border-radius: 30px;

          text-decoration: none;

          font-weight: 600;

          transition: 0.3s;

        }


        .hero-shop-btn:hover {

          background: #642e7e;

          color: white;

          transform: translateY(-2px);

        }


        .hero-outline-btn {

          display: inline-block;

          color: #7C3F96;

          border: 1px solid #7C3F96;

          padding: 12px 28px;

          border-radius: 30px;

          text-decoration: none;

          font-weight: 600;

          background: rgba(255,255,255,0.5);

          transition: 0.3s;

        }


        .hero-outline-btn:hover {

          background: #7C3F96;

          color: white;

        }


        /* ==================================================
           HERO BENEFITS
        ================================================== */

        .hero-benefits {

          position: absolute;

          bottom: 25px;

          left: 50%;

          transform: translateX(-50%);

          width: min(1100px, 90%);

          background: rgba(255,255,255,0.88);

          backdrop-filter: blur(12px);

          border: 1px solid rgba(255,255,255,0.8);

          border-radius: 18px;

          padding: 20px 25px;

          display: flex;

          justify-content: space-between;

          gap: 20px;

          box-shadow: 0 10px 30px rgba(70,40,80,0.12);

        }


        .hero-benefit {

          display: flex;

          align-items: center;

          gap: 12px;

          flex: 1;

        }


        .benefit-icon {

          width: 48px;

          height: 48px;

          border-radius: 50%;

          background: #f5e9fa;

          color: #7C3F96;

          display: flex;

          align-items: center;

          justify-content: center;

          font-size: 20px;

        }


        .hero-benefit strong {

          display: block;

          color: #211B35;

          font-size: 14px;

        }


        .hero-benefit small {

          color: #777;

          font-size: 12px;

        }


        /* ==================================================
           SECTION HEADINGS
        ================================================== */

        .section-heading {

          text-align: center;

          margin-bottom: 45px;

        }


        .section-heading p {

          color: #7C3F96;

          font-weight: 700;

          letter-spacing: 4px;

          margin-bottom: 8px;

          font-size: 13px;

        }


        .section-heading h2 {

          color: #211B35;

          font-size: 2.2rem;

          font-weight: 700;

          margin-bottom: 10px;

        }


        .section-heading span {

          color: #777;

          font-size: 15px;

        }


        /* ==================================================
           CATEGORIES
        ================================================== */

        .category-section {

          padding: 80px 0;

          background: #fcf9fd;

        }


        .category-card {

          height: 100%;

          background: white;

          border: 1px solid #eee5f1;

          border-radius: 18px;

          padding: 30px 20px;

          text-align: center;

          box-shadow: 0 5px 20px rgba(70,40,80,0.05);

          transition: all 0.3s ease;

        }


        .category-card:hover {

          transform: translateY(-8px);

          box-shadow: 0 15px 35px rgba(124,63,150,0.14);

          border-color: #d9bce3;

        }


        .category-icon {

          width: 75px;

          height: 75px;

          border-radius: 50%;

          background: linear-gradient(
            135deg,
            #fae8f0,
            #f1e6fa
          );

          display: flex;

          align-items: center;

          justify-content: center;

          margin: 0 auto 20px;

          font-size: 32px;

        }


        .category-card h5 {

          font-size: 18px;

          color: #211B35;

          margin-bottom: 10px;

        }


        .category-card p {

          min-height: 45px;

          color: #777;

          font-size: 13px;

        }


        .category-card button {

          border: 1px solid #7C3F96;

          background: white;

          color: #7C3F96;

          border-radius: 25px;

          padding: 7px 20px;

          margin-top: 10px;

          transition: 0.3s;

        }


        .category-card button:hover {

          background: #7C3F96;

          color: white;

        }


        /* ==================================================
           FEATURED PRODUCTS
        ================================================== */

        .featured-section {

          padding: 80px 0;

          background: white;

        }


        .product-home-card {

          height: 100%;

          background: white;

          border: 1px solid #eee;

          border-radius: 16px;

          overflow: hidden;

          transition: 0.3s;

        }


        .product-home-card:hover {

          transform: translateY(-6px);

          box-shadow: 0 12px 30px rgba(70,40,80,0.12);

        }


        .product-home-image {

          height: 270px;

          background: #faf8fb;

          display: flex;

          align-items: center;

          justify-content: center;

          padding: 20px;

        }


        .product-home-image img {

          width: 100%;

          height: 100%;

          object-fit: contain;

          transition: 0.3s;

        }


        .product-home-card:hover
        .product-home-image img {

          transform: scale(1.04);

        }


        .product-home-body {

          text-align: center;

          padding: 20px;

        }


        .product-home-body h5 {

          font-family: Arial, sans-serif;

          font-size: 15px;

          font-weight: 600;

          color: #211B35;

          min-height: 24px;

        }


        .product-home-body p {

          color: #7C3F96;

          font-weight: 700;

          font-size: 17px;

        }


        .product-home-body button {

          width: 100%;

          border: none;

          background: #7C3F96;

          color: white;

          padding: 9px;

          border-radius: 25px;

          transition: 0.3s;

        }


        .product-home-body button:hover {

          background: #642e7e;

        }


        .view-all-btn {

          display: inline-block;

          color: #7C3F96;

          border: 1px solid #7C3F96;

          padding: 10px 28px;

          border-radius: 25px;

          text-decoration: none;

          transition: 0.3s;

        }


        .view-all-btn:hover {

          background: #7C3F96;

          color: white;

        }


        /* ==================================================
           WHY SECTION
        ================================================== */

        .why-section {

          padding: 70px 0;

          background: linear-gradient(
            135deg,
            #f9f0fb,
            #fff6f8
          );

        }


        .why-row {

          background: transparent;

        }


        .why-card {

          height: 100%;

          padding: 25px;

          display: flex;

          gap: 15px;

          align-items: flex-start;

          border-right: 1px solid #dfcfe5;

        }


        .why-row > div:last-child
        .why-card {

          border-right: none;

        }


        .why-icon {

          min-width: 55px;

          width: 55px;

          height: 55px;

          border-radius: 50%;

          background: white;

          color: #7C3F96;

          display: flex;

          align-items: center;

          justify-content: center;

          font-size: 22px;

          box-shadow: 0 5px 15px rgba(70,40,80,0.08);

        }


        .why-card h5 {

          font-family: Arial, sans-serif;

          font-size: 15px;

          font-weight: 700;

          margin-bottom: 7px;

          color: #211B35;

        }


        .why-card p {

          font-size: 12px;

          color: #777;

          line-height: 1.6;

          margin-bottom: 0;

        }


        /* ==================================================
           FOOTER
        ================================================== */

        .home-footer {

          background: #211B35;

          color: white;

          padding: 65px 0 20px;

        }


        .home-footer h3 {

          font-size: 28px;

        }


        .home-footer h3 span {

          color: #B9AEFF;

        }


        .home-footer h5 {

          font-family: Arial, sans-serif;

          font-size: 15px;

          margin-bottom: 20px;

        }


        .home-footer p {

          color: #bdb8cc;

          font-size: 13px;

        }


        .home-footer small {

          display: block;

          color: #aaa4b8;

          max-width: 300px;

          line-height: 1.7;

        }


        .home-footer a,
        .home-footer > .container span {

          display: block;

          color: #bdb8cc;

          text-decoration: none;

          font-size: 13px;

          margin-bottom: 10px;

          transition: 0.2s;

        }


        .home-footer a:hover {

          color: #ffffff;

          padding-left: 3px;

        }


        .social-icons {

          display: flex;

          gap: 10px;

          margin-top: 20px;

        }


        .social-icons span {

          width: 34px;

          height: 34px;

          border: 1px solid #514862;

          border-radius: 50%;

          display: flex;

          align-items: center;

          justify-content: center;

          color: #ddd;

          margin: 0;

        }


        .home-footer hr {

          border-color: #514862;

          margin: 40px 0 20px;

        }


        .footer-bottom {

          display: flex;

          justify-content: space-between;

          gap: 20px;

          color: #aaa4b8;

          font-size: 12px;

        }


        /* ==================================================
           RESPONSIVE
        ================================================== */

        @media (max-width: 991px) {

          .home-hero {

            min-height: 680px;

            background-position: 65% center;

          }

          .hero-benefits {

            width: 94%;

          }

        }


        @media (max-width: 767px) {

          .home-hero {

            min-height: 750px;

            padding: 70px 0 230px;

            background-position: 70% center;

          }


          .home-hero-overlay {

            background:
              linear-gradient(
                90deg,
                rgba(255,245,248,0.94),
                rgba(255,245,248,0.65)
              );

          }


          .hero-title {

            font-size: 2.8rem;

          }


          .hero-benefits {

            bottom: 15px;

            width: 92%;

            display: grid;

            grid-template-columns: 1fr 1fr;

            gap: 15px;

            padding: 18px;

          }


          .hero-benefit {

            gap: 8px;

          }


          .benefit-icon {

            width: 38px;

            min-width: 38px;

            height: 38px;

            font-size: 15px;

          }


          .hero-benefit strong {

            font-size: 12px;

          }


          .hero-benefit small {

            font-size: 10px;

          }


          .why-card {

            border-right: none;

            border-bottom: 1px solid #dfcfe5;

          }


          .why-row > div:last-child
          .why-card {

            border-bottom: none;

          }


          .footer-bottom {

            flex-direction: column;

            text-align: center;

          }

        }


        @media (max-width: 480px) {

          .hero-title {

            font-size: 2.3rem;

          }


          .hero-description {

            font-size: 0.95rem;

          }


          .hero-benefits {

            grid-template-columns: 1fr;

          }


          .home-hero {

            min-height: 850px;

          }

        }

        `}
      </style>
    </>
  );
}

export default Home;