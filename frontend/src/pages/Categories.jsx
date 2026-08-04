import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function Categories() {
  const navigate = useNavigate();
  
   const categories = [
  {
    name: "Makeup",
    icon: "💄",
    description: "Lipsticks, foundations, blushes and more.",
  },
  {
    name: "Skincare",
    icon: "🧴",
    description: "Serums, cleansers, moisturizers and creams.",
  },
  {
    name: "Hair Care",
    icon: "💇",
    description: "Shampoos, conditioners, masks and serums.",
  },
  {
    name: "Body Care",
    icon: "🧼",
    description: "Body lotions, body wash, scrubs and creams.",
  },
  {
    name: "Fragrances",
    icon: "🌸",
    description: "Perfumes, body mists and fresh fragrances.",
  },
];

  return (
    <>
      <Navbar />

      {/* Header */}
      <section className="bg-light py-5">
        <div className="container text-center py-4">

          <p className="text-uppercase text-secondary fw-bold">
            Explore GlowCart
          </p>

          <h1 className="display-5 fw-bold">
            Shop By Category
          </h1>

          <p className="text-secondary">
            Find everything you need for your beauty routine.
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
                key={category.name}
              >
                <div
              className="card border-0 shadow-sm rounded-4 h-100"
              style={{
                cursor: "pointer",
                transition: "0.3s"
              }}
              onClick={() =>
                navigate(
                  `/products?category=${encodeURIComponent(category.name)}`
                )
              }
            >

                  <div className="bg-light text-center py-5">
                    <span className="display-1">
                      {category.icon}
                    </span>
                  </div>

                  <div className="card-body text-center p-4">

                    <h4 className="fw-bold">
                      {category.name}
                    </h4>

                    <p className="text-secondary">
                      {category.description}
                    </p>

                    <button
                      className="btn btn-dark"
                      onClick={() =>
                        navigate(
                          `/products?category=${encodeURIComponent(category.name)}`
                        )
                      }
                    >
                      View Products
                    </button>

                  </div>

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
                <p className="text-secondary">
                  Discover carefully selected beauty products.
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