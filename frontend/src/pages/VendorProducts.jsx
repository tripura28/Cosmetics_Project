import { useEffect, useState } from "react";
import VendorSidebar from "../components/VendorSidebar";
import { useNavigate } from "react-router-dom";

function VendorProducts() {

  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("");

  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);

  const [editingProduct, setEditingProduct] = useState(null);

  const [image, setImage] = useState(null);


  const [formData, setFormData] = useState({
    product_name: "",
    description: "",
    category_id: "",
    price: "",
    stock: "",
    product_status: "Available"
  });


  // =====================================================
  // GET CURRENT VENDOR ID
  // =====================================================

  const getVendorId = () => {

    return localStorage.getItem("vendorId");

  };


  // =====================================================
  // LOAD PRODUCTS
  // =====================================================

  const loadProducts = async () => {

    const currentVendorId = getVendorId();

    if (!currentVendorId) {

      navigate("/vendor-login", {
        replace: true
      });

      return;

    }


    try {

      const response = await fetch(
        `http://127.0.0.1:5000/vendor/products/${currentVendorId}`
      );

      const data = await response.json();


      if (response.ok) {

        setProducts(data);

      } else {

        alert(
          data.error ||
          "Unable to load products."
        );

      }

    } catch (error) {

      console.error(
        "Error loading products:",
        error
      );

      alert(
        "Unable to connect to the server."
      );

    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // LOAD CATEGORIES
  // =====================================================

  const loadCategories = async () => {

    try {

      const response = await fetch(
        "http://127.0.0.1:5000/categories"
      );

      const data = await response.json();


      if (response.ok) {

        setCategories(data);

      }

    } catch (error) {

      console.error(
        "Error loading categories:",
        error
      );

    }

  };


  // =====================================================
  // LOAD DATA
  // =====================================================

  useEffect(() => {

    const currentVendorId = getVendorId();


    if (!currentVendorId) {

      navigate("/vendor-login", {
        replace: true
      });

      return;

    }


    loadProducts();

    loadCategories();

  }, []);


  // =====================================================
  // FILTER PRODUCTS
  // =====================================================

  const filteredProducts = selectedCategory
    ? products.filter((product) => {

        const selectedCategoryName =
          categories.find(
            (category) =>
              String(category.category_id) ===
              String(selectedCategory)
          )?.category_name;


        return (
          product.category_name ===
          selectedCategoryName
        );

      })
    : products;


  // =====================================================
  // HANDLE INPUT
  // =====================================================

  const handleChange = (e) => {

    const {
      name,
      value
    } = e.target;


    setFormData({
      ...formData,
      [name]: value
    });

  };


  // =====================================================
  // IMAGE
  // =====================================================

  const handleImageChange = (e) => {

    const file =
      e.target.files[0];


    if (!file) {

      return;

    }


    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp"
    ];


    if (!allowedTypes.includes(file.type)) {

      alert(
        "Only JPG, PNG and WEBP images are allowed."
      );

      e.target.value = "";

      return;

    }


    setImage(file);

  };


  // =====================================================
  // OPEN ADD FORM
  // =====================================================

  const openAddForm = () => {

    setEditingProduct(null);


    setFormData({
      product_name: "",
      description: "",
      category_id: "",
      price: "",
      stock: "",
      product_status: "Available"
    });


    setImage(null);

    setShowForm(true);

  };


  // =====================================================
  // OPEN EDIT FORM
  // =====================================================

  const openEditForm = (product) => {

    setEditingProduct(product);


    setFormData({

      product_name:
        product.product_name || "",

      description:
        product.description || "",

      category_id:
        product.category_id || "",

      price:
        product.price || "",

      stock:
        product.stock || "",

      product_status:
        product.product_status ||
        "Available"

    });


    setImage(null);

    setShowForm(true);

  };


  // =====================================================
  // SUBMIT PRODUCT
  // =====================================================

  const handleSubmit = async (e) => {

    e.preventDefault();


    const currentVendorId =
      getVendorId();


    if (!currentVendorId) {

      navigate("/vendor-login", {
        replace: true
      });

      return;

    }


    if (
      !formData.product_name ||
      !formData.category_id ||
      formData.price === "" ||
      formData.stock === ""
    ) {

      alert(
        "Please fill all required fields."
      );

      return;

    }


    try {

      const data =
        new FormData();


      data.append(
        "vendor_id",
        currentVendorId
      );


      data.append(
        "product_name",
        formData.product_name
      );


      data.append(
        "description",
        formData.description
      );


      data.append(
        "category_id",
        formData.category_id
      );


      data.append(
        "price",
        formData.price
      );


      data.append(
        "stock",
        formData.stock
      );


      data.append(
        "product_status",
        formData.product_status
      );


      if (image) {

        data.append(
          "image",
          image
        );

      }


      let url;

      let method;


      // =================================================
      // EDIT
      // =================================================

      if (editingProduct) {

        url =
          `http://127.0.0.1:5000/vendor/products/${editingProduct.product_id}`;

        method = "PUT";

      }


      // =================================================
      // ADD
      // =================================================

      else {

        url =
          "http://127.0.0.1:5000/vendor/products";

        method = "POST";

      }


      const response =
        await fetch(
          url,
          {
            method: method,
            body: data
          }
        );


      const result =
        await response.json();


      if (response.ok) {

        alert(
          result.message ||
          "Product saved successfully."
        );


        setShowForm(false);

        setEditingProduct(null);

        setImage(null);


        await loadProducts();

      }

      else {

        alert(
          result.error ||
          "Unable to save product."
        );

      }

    }

    catch (error) {

      console.error(
        "Error saving product:",
        error
      );


      alert(
        "Unable to connect to the server."
      );

    }

  };


  // =====================================================
  // DELETE PRODUCT
  // =====================================================

  const deleteProduct = async (productId) => {

    const currentVendorId =
      getVendorId();


    if (!currentVendorId) {

      navigate("/vendor-login", {
        replace: true
      });

      return;

    }


    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this product?"
      );


    if (!confirmDelete) {

      return;

    }


    try {

      const response =
        await fetch(
          `http://127.0.0.1:5000/vendor/products/${productId}`,
          {
            method: "DELETE",

            headers: {
              "Content-Type":
                "application/json"
            },

            body: JSON.stringify({
              vendor_id:
                currentVendorId
            })

          }
        );


      const result =
        await response.json();


      if (response.ok) {

        alert(
          result.message ||
          "Product deleted successfully."
        );


        setProducts(
          (previousProducts) =>
            previousProducts.filter(
              (product) =>
                product.product_id !==
                productId
            )
        );

      }

      else {

        alert(
          result.error ||
          "Unable to delete product."
        );

      }

    }

    catch (error) {

      console.error(
        "Error deleting product:",
        error
      );


      alert(
        "Unable to connect to the server."
      );

    }

  };


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (

      <div
        className="d-flex"
        style={{
          minHeight: "100vh",
          background: "#F7F6FB"
        }}
      >

        <VendorSidebar />


        <div
          className="flex-grow-1 d-flex align-items-center justify-content-center"
        >

          <div className="text-center">

            <div className="spinner-border text-dark"></div>

            <h5 className="mt-3">
              Loading Products...
            </h5>

          </div>

        </div>

      </div>

    );

  }


  return (

    <div
      className="d-flex"
      style={{
        minHeight: "100vh",
        background: "#F7F6FB"
      }}
    >

      <VendorSidebar />


      <div
        className="flex-grow-1 p-4 p-md-5"
      >


        {/* =================================================
            HEADER
        ================================================= */}

        <div
          className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4"
        >

          <div>

            <p
              className="mb-1"
              style={{
                color: "#7C6EE6",
                fontWeight: "600"
              }}
            >
              SELLER CENTER
            </p>


            <h2 className="fw-bold mb-1">
              My Products
            </h2>


            <p className="text-secondary mb-0">
              Manage the products in your shop.
            </p>

          </div>


          <button
            className="btn rounded-3 px-4 mt-3 mt-md-0"
            style={{
              background: "#7C6EE6",
              color: "white",
              border: "none"
            }}
            onClick={openAddForm}
          >
            + Add Product
          </button>

        </div>


        {/* =================================================
            SUMMARY
        ================================================= */}

        <div className="row g-4 mb-4">


          {/* TOTAL PRODUCTS */}

          <div className="col-md-4">

            <div
              className="card border-0 shadow-sm rounded-4 h-100"
            >

              <div className="card-body p-4">

                <p className="text-secondary mb-2">
                  Total Products
                </p>


                <h2 className="fw-bold mb-0">
                  {products.length}
                </h2>


                <small className="text-secondary">
                  Products in your shop
                </small>

              </div>

            </div>

          </div>


          {/* CATEGORY FILTER */}

          <div className="col-md-4">

            <div
              className="card border-0 shadow-sm rounded-4 h-100"
            >

              <div className="card-body p-4">

                <label
                  className="text-secondary mb-2"
                >
                  Filter by Category
                </label>


                <select
                  className="form-select"
                  value={selectedCategory}
                  onChange={(e) =>
                    setSelectedCategory(
                      e.target.value
                    )
                  }
                >

                  <option value="">
                    All Categories
                  </option>


                  {categories.map(
                    (category) => (

                      <option
                        key={
                          category.category_id
                        }
                        value={
                          category.category_id
                        }
                      >
                        {
                          category.category_name
                        }
                      </option>

                    )
                  )}

                </select>


                <small className="text-secondary d-block mt-2">

                  Showing{" "}
                  {filteredProducts.length}{" "}
                  product
                  {filteredProducts.length !== 1
                    ? "s"
                    : ""}

                </small>

              </div>

            </div>

          </div>


          {/* AVAILABLE PRODUCTS */}

          <div className="col-md-4">

            <div
              className="card border-0 shadow-sm rounded-4 h-100"
            >

              <div className="card-body p-4">

                <p className="text-secondary mb-2">
                  Available Products
                </p>


                <h2 className="fw-bold mb-0">

                  {
                    products.filter(
                      (product) =>
                        product.product_status ===
                        "Available"
                    ).length
                  }

                </h2>


                <small className="text-secondary">
                  Currently available
                </small>

              </div>

            </div>

          </div>

        </div>


        {/* =================================================
            PRODUCTS TABLE
        ================================================= */}

        <div
          className="card border-0 shadow-sm rounded-4"
        >

          <div className="card-body p-0">

            <div className="table-responsive">

              <table
                className="table table-hover align-middle mb-0"
              >

                <thead>

                  <tr>

                    <th className="px-4 py-3">
                      Product
                    </th>

                    <th>
                      Category
                    </th>

                    <th>
                      Price
                    </th>

                    <th>
                      Stock
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Actions
                    </th>

                  </tr>

                </thead>


                <tbody>


                  {/* =================================================
                      NO PRODUCTS
                  ================================================= */}

                  {filteredProducts.length === 0 ? (

                    <tr>

                      <td
                        colSpan="6"
                        className="text-center py-5"
                      >

                        <div
                          style={{
                            fontSize: "40px"
                          }}
                        >
                          📦
                        </div>


                        <h6
                          className="fw-semibold mt-3"
                        >

                          {selectedCategory
                            ? "No products in this category"
                            : "No products yet"}

                        </h6>


                        <p className="text-secondary">

                          {selectedCategory
                            ? "Try selecting another category."
                            : "Add your first product to your shop."}

                        </p>


                        {!selectedCategory && (

                          <button
                            className="btn rounded-3"
                            style={{
                              background:
                                "#7C6EE6",
                              color: "white"
                            }}
                            onClick={openAddForm}
                          >
                            + Add Product
                          </button>

                        )}

                      </td>

                    </tr>

                  )


                  /* =================================================
                      PRODUCTS
                  ================================================= */

                  : (

                    filteredProducts.map(
                      (product) => (

                        <tr
                          key={
                            product.product_id
                          }
                        >


                          {/* PRODUCT */}

                          <td className="px-4">

                            <div
                              className="d-flex align-items-center gap-3"
                            >

                              <img
                                src={
                                  product.image
                                    ? `/images/${product.image}`
                                    : "/images/no-image.jpg"
                                }
                                alt={
                                  product.product_name
                                }
                                onError={(e) => {
                                  e.target.src =
                                    "/images/no-image.jpg";
                                }}
                                style={{
                                  width: "60px",
                                  height: "60px",
                                  objectFit: "cover",
                                  borderRadius: "12px"
                                }}
                              />


                              <div>

                                <div
                                  className="fw-semibold"
                                >
                                  {
                                    product.product_name
                                  }
                                </div>


                                <small
                                  className="text-secondary"
                                >
                                  ID: #
                                  {
                                    product.product_id
                                  }
                                </small>

                              </div>

                            </div>

                          </td>


                          {/* CATEGORY */}

                          <td>

                            {
                              product.category_name
                            }

                          </td>


                          {/* PRICE */}

                          <td>

                            <strong>

                              ₹
                              {Number(
                                product.price
                              ).toFixed(2)}

                            </strong>

                          </td>


                          {/* STOCK */}

                          <td>

                            <span
                              className={
                                product.stock <= 5
                                  ? "text-danger fw-semibold"
                                  : "fw-semibold"
                              }
                            >
                              {product.stock}
                            </span>

                          </td>


                          {/* STATUS */}

                          <td>

                            <span
                              className="badge rounded-pill px-3 py-2"
                              style={{
                                background:
                                  product.product_status ===
                                  "Available"
                                    ? "#E8F5E9"
                                    : "#FDECEC",

                                color:
                                  product.product_status ===
                                  "Available"
                                    ? "#2E7D32"
                                    : "#C62828"
                              }}
                            >

                              {
                                product.product_status
                              }

                            </span>

                          </td>


                          {/* ACTIONS */}

                          <td>

                            <div
                              className="d-flex gap-2"
                            >

                              <button
                                className="btn btn-sm btn-outline-primary"
                                onClick={() =>
                                  openEditForm(
                                    product
                                  )
                                }
                              >
                                Edit
                              </button>


                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() =>
                                  deleteProduct(
                                    product.product_id
                                  )
                                }
                              >
                                Delete
                              </button>

                            </div>

                          </td>

                        </tr>

                      )
                    )

                  )}

                </tbody>

              </table>

            </div>

          </div>

        </div>


      </div>


      {/* =====================================================
          ADD / EDIT MODAL
      ===================================================== */}

      {showForm && (

        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{
            background: "rgba(0,0,0,0.45)",
            zIndex: 1050,
            overflowY: "auto"
          }}
        >

          <div
            className="card border-0 shadow-lg rounded-4"
            style={{
              width: "90%",
              maxWidth: "700px",
              margin: "30px"
            }}
          >

            <div className="card-body p-4 p-md-5">


              {/* MODAL HEADER */}

              <div
                className="d-flex justify-content-between align-items-center mb-4"
              >

                <div>

                  <h4 className="fw-bold mb-1">

                    {editingProduct
                      ? "Edit Product"
                      : "Add Product"}

                  </h4>


                  <p className="text-secondary mb-0">

                    {editingProduct
                      ? "Update your product information."
                      : "Add a new product to your shop."}

                  </p>

                </div>


                <button
                  type="button"
                  className="btn-close"
                  onClick={() =>
                    setShowForm(false)
                  }
                />

              </div>


              {/* FORM */}

              <form onSubmit={handleSubmit}>


                {/* PRODUCT NAME */}

                <div className="mb-3">

                  <label
                    className="form-label fw-semibold"
                  >
                    Product Name *
                  </label>


                  <input
                    type="text"
                    name="product_name"
                    className="form-control"
                    value={
                      formData.product_name
                    }
                    onChange={handleChange}
                    placeholder="Enter product name"
                    required
                  />

                </div>


                {/* DESCRIPTION */}

                <div className="mb-3">

                  <label
                    className="form-label fw-semibold"
                  >
                    Description
                  </label>


                  <textarea
                    name="description"
                    className="form-control"
                    rows="4"
                    value={
                      formData.description
                    }
                    onChange={handleChange}
                    placeholder="Describe your product..."
                  />

                </div>


                {/* CATEGORY */}

                <div className="mb-3">

                  <label
                    className="form-label fw-semibold"
                  >
                    Category *
                  </label>


                  <select
                    name="category_id"
                    className="form-select"
                    value={
                      formData.category_id
                    }
                    onChange={handleChange}
                    required
                  >

                    <option value="">
                      Select Category
                    </option>


                    {categories.map(
                      (category) => (

                        <option
                          key={
                            category.category_id
                          }
                          value={
                            category.category_id
                          }
                        >
                          {
                            category.category_name
                          }
                        </option>

                      )
                    )}

                  </select>

                </div>


                {/* PRICE + STOCK */}

                <div className="row">


                  {/* PRICE */}

                  <div className="col-md-6 mb-3">

                    <label
                      className="form-label fw-semibold"
                    >
                      Price *
                    </label>


                    <div className="input-group">

                      <span className="input-group-text">
                        ₹
                      </span>


                      <input
                        type="number"
                        name="price"
                        className="form-control"
                        min="0"
                        step="0.01"
                        value={
                          formData.price
                        }
                        onChange={handleChange}
                        placeholder="0.00"
                        required
                      />

                    </div>

                  </div>


                  {/* STOCK */}

                  <div className="col-md-6 mb-3">

                    <label
                      className="form-label fw-semibold"
                    >
                      Stock *
                    </label>


                    <input
                      type="number"
                      name="stock"
                      className="form-control"
                      min="0"
                      value={
                        formData.stock
                      }
                      onChange={handleChange}
                      placeholder="0"
                      required
                    />

                  </div>

                </div>


                {/* IMAGE */}

                <div className="mb-3">

                  <label
                    className="form-label fw-semibold"
                  >
                    Product Image
                  </label>


                  <input
                    type="file"
                    className="form-control"
                    accept=".jpg,.jpeg,.png,.webp"
                    onChange={
                      handleImageChange
                    }
                  />


                  <small className="text-secondary">
                    Accepted formats: JPG, JPEG, PNG, WEBP
                  </small>

                </div>


                {/* STATUS */}

                <div className="mb-4">

                  <label
                    className="form-label fw-semibold"
                  >
                    Product Status
                  </label>


                  <select
                    name="product_status"
                    className="form-select"
                    value={
                      formData.product_status
                    }
                    onChange={handleChange}
                  >

                    <option value="Available">
                      Available
                    </option>

                    <option value="Out of Stock">
                      Out of Stock
                    </option>

                    <option value="Unavailable">
                      Unavailable
                    </option>

                  </select>

                </div>


                {/* BUTTONS */}

                <div
                  className="d-flex justify-content-end gap-2"
                >

                  <button
                    type="button"
                    className="btn btn-light px-4"
                    onClick={() =>
                      setShowForm(false)
                    }
                  >
                    Cancel
                  </button>


                  <button
                    type="submit"
                    className="btn px-4"
                    style={{
                      background: "#7C6EE6",
                      color: "white",
                      border: "none"
                    }}
                  >

                    {editingProduct
                      ? "Update Product"
                      : "Add Product"}

                  </button>

                </div>

              </form>

            </div>

          </div>

        </div>

      )}

    </div>

  );

}

export default VendorProducts;