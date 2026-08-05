import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

function Categories() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  
  useEffect(() => {

  fetch("http://127.0.0.1:5000/categories")
    .then((response) => response.json())
    .then((data) => {

      const icons = {
        "Makeup": "💄",
        "Skincare": "🧴",
        "Hair Care": "💇",
        "Body Care": "🧼",
        "Fragrances": "🌸"
      };

      const descriptions = {
        "Makeup": "Lipsticks, foundations, blushes and more.",
        "Skincare": "Serums, cleansers, moisturizers and creams.",
        "Hair Care": "Shampoos, conditioners, masks and serums.",
        "Body Care": "Body lotions, scrubs and creams.",
        "Fragrances": "Perfumes, body mists and fresh fragrances."
      };

      const updated = data.map(category => ({
        ...category,
        icon: icons[category.category_name] || "✨",
        description: descriptions[category.category_name] || "Beauty Collection"
      }));

      setCategories(updated);

    })
    .catch(console.error);

}, []);

  return (
    <>
      <Navbar />

      {/* Header */}
<section className="bg-light py-5">
  <div className="container text-center py-4">

    <p
      className="text-uppercase fw-bold"
      style={{
        color: "#7C6EE6",
        letterSpacing: "2px"
      }}
    >
      Beauty Categories
    </p>

    <h1
      className="display-4 fw-bold"
      style={{
        fontFamily: "'Cinzel', serif"
      }}
    >
      Find Your Perfect Beauty Collection
    </h1>

    <p
      className="text-secondary mx-auto mt-3"
      style={{
        maxWidth: "700px",
        fontSize: "1.05rem"
      }}
    >
      Explore our carefully curated beauty collections.
      Whether you're searching for skincare essentials,
      glamorous makeup, nourishing hair care, refreshing
      fragrances or body care, GlowCart has everything
      you need to complete your beauty routine.
    </p>

  </div>
</section>

      {/* Categories */}
      <section className="py-5">
        <div className="container py-4">

          <div className="row g-4">

            {categories.map((category) => (
              <div
                className="col-12 col-sm-6 col-lg-3"
                key={category.category_id}
              >
                <div
                      className="card border-0 shadow-sm rounded-4 h-100"
                      style={{
                        transition: "all 0.3s ease",
                        cursor: "pointer"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-8px)";
                        e.currentTarget.style.boxShadow =
                          "0 15px 35px rgba(0,0,0,0.15)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "";
                      }}
                    >

                  <div className="bg-light text-center py-5">
                    <span className="display-1">
                      {category.icon}
                    </span>
                  </div>

                 <small
                      className="text-uppercase"
                      style={{
                        color: "#7C6EE6",
                        letterSpacing: "1px",
                        fontWeight: "600"
                      }}
                    >
                      Collection
                    </small>

                    <h4 className="fw-bold mt-2">
                    {category.category_name}
                  </h4>

                  <p className="text-secondary">
                    {category.description}
                  </p>

                  <button
                    className="btn btn-dark rounded-pill px-4"
                    onClick={() =>
                      navigate(
                        `/products?category=${encodeURIComponent(
                          category.category_name
                        )}`
                      )
                    }
                  >
                    Browse Collection →
                  </button>

                </div>
              </div>
            ))}

          </div>

        </div>
      </section>

      {/* Why Choose GlowCart */}
      <section className="bg-light py-5">
        <div className="container py-4">

          <div className="text-center mb-5">
            <h2 className="fw-bold">
              Beauty Made Simple
            </h2>

            <p className="text-secondary">
              Everything you need, all in one place.
            </p>
          </div>

          <div className="row text-center g-4">

            <div className="col-md-4">
              <div className="p-4">
                <div className="display-5">✨</div>
                <h5 className="fw-bold mt-3">
                  Quality Beauty
                </h5>
                <p className="text-uppercase text-secondary fw-bold">
  Beauty Collections
</p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="p-4">
                <div className="display-5">🛍️</div>
                <h5 className="fw-bold mt-3">
                  Easy Shopping
                </h5>
                <p className="text-secondary">
                  Find your favorites quickly and easily.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="p-4">
                <div className="display-5">🚚</div>
                <h5 className="fw-bold mt-3">
                  Fast Delivery
                </h5>
                <p className="text-secondary">
                  Get your beauty essentials delivered to you.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

<section className="py-5 bg-light">
  <div className="container text-center">

    <h2 className="fw-bold">
      Can't Decide Where to Start?
    </h2>

    <p
      className="text-secondary mx-auto"
      style={{ maxWidth: "650px" }}
    >
      Browse our complete collection of beauty products
      and discover the perfect essentials for your
      skincare, makeup, hair care and wellness routine.
    </p>

    <Link
      to="/products"
      className="btn btn-dark rounded-pill px-5 mt-3"
    >
      View All Products
    </Link>

  </div>
</section>



      {/* Footer */}
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

export default Categories;