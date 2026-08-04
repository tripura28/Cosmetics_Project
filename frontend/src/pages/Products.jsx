import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";

function Products() {

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [sortOption, setSortOption] = useState("Sort By");

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

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

  useEffect(() => {

  const category = searchParams.get("category");

  if (category) {

    setSelectedCategory(category);

  } else {

    setSelectedCategory("All Categories");

  }

}, [searchParams]);

  const handleViewDetails = (productId) => {

    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (!isLoggedIn) {

      alert("Please login to view product details.");

      navigate("/login");

      return;
    }

    navigate(`/products/${productId}`);

  };

 const filteredProducts = [...products]
  .filter((product) => {

    const matchesSearch =
      product.product_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "All Categories" ||
      product.category_name === selectedCategory;

    return matchesSearch && matchesCategory;

  })
  .sort((a, b) => {

    if (sortOption === "LowToHigh") {

      return a.price - b.price;

    }

    if (sortOption === "HighToLow") {

      return b.price - a.price;

    }

    if (sortOption === "AToZ") {

      return a.product_name.localeCompare(b.product_name);

    }

    if (sortOption === "ZToA") {

      return b.product_name.localeCompare(a.product_name);

    }

    return 0;

  });
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

  return (
    <>
      <Navbar />

      {/* Page Header */}
      <section className="bg-light py-5">
        <div className="container text-center py-4">

          <p className="text-uppercase text-secondary fw-bold">
            GlowCart Collection
          </p>

          <h1 className="display-5 fw-bold">
          {selectedCategory === "All Categories"
            ? "All Products"
            : selectedCategory}
        </h1>

          <p className="text-secondary">
            Discover beauty products made for your everyday routine.
          </p>

        </div>
      </section>

      {/* Products */}
      <section className="py-5">
        <div className="container">

          {/* Search + Filter */}
          <div className="row mb-5 g-3">

            <div className="col-md-8">
              <input
                  type="text"
                  className="form-control form-control-lg"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="col-md-4">
              <select
                className="form-select form-select-lg"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
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

          {/* Product Count */}
          <div className="d-flex justify-content-between align-items-center mb-4">

            <h5 className="mb-0">
              {filteredProducts.length} Products
            </h5>

            <select
                className="form-select w-auto"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
              <option value="Sort By">Sort By</option>
              <option value="LowToHigh">Price: Low to High</option>
              <option value="HighToLow">Price: High to Low</option>
              <option value="AToZ">Name: A-Z</option>
              <option value="ZToA">Name: Z-A</option>
            </select>

          </div>

          {/* Product Cards */}
          <div className="row g-4">

            {filteredProducts.map((product) => (

              <div
                className="col-12 col-sm-6 col-lg-3"
                key={product.product_id}
              >

                <div className="card border-0 shadow-sm h-100">

                  {/* Product Image */}
                  <img
                    src={`/images/${product.image}`}
                    alt={product.product_name}
                    className="card-img-top"
                    style={{
                      height: "250px",
                      objectFit: "cover"
                    }}
                    onError={(e) => {
                      e.target.src = "/images/no-image.jpg";
                    }}
                  />

                  <div className="card-body d-flex flex-column">

                    <small className="text-uppercase text-secondary fw-bold">
                      {product.category_name}
                    </small>

                    <h5 className="fw-bold mt-2">
                      {product.product_name}
                    </h5>

                    <p className="text-secondary">
                      {product.description}
                    </p>

                    <div className="mt-auto">

                      <div className="d-flex justify-content-between align-items-center mb-3">

                        <h5 className="fw-bold mb-0">
                          ₹{product.price}
                        </h5>

                        <span className="text-warning">
                          ★★★★★
                        </span>

                      </div>

                      <div className="d-grid gap-2">

                        <button className="btn btn-dark">
                          Add to Cart
                        </button>

                        <button
                          className="btn btn-outline-dark"
                          onClick={() => handleViewDetails(product.product_id)}
                        >
                          View Details
                        </button>

                      </div>

                    </div>

                  </div>

                </div>

              </div>

            ))}

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

export default Products;