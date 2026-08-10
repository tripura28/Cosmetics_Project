import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";

function AdminEditProduct() {

  const { productId } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    product_name: "",
    description: "",
    category_id: "",
    price: "",
    stock: "",
    product_status: "Available",
    image: ""
  });

  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  // ==========================
  // Fetch Product
  // ==========================

  useEffect(() => {

    fetch(`http://127.0.0.1:5000/admin/products/${productId}`)
      .then((response) => response.json())
      .then((data) => {

        if (data.error || data.message === "Product not found") {

          alert(data.error || data.message);

          navigate("/admin/products");

          return;
        }

        setFormData({
          product_name: data.product_name || "",
          description: data.description || "",
          category_id: data.category_id || "",
          price: data.price || "",
          stock: data.stock || "",
          product_status: data.product_status || "Available",
          image: data.image || ""
        });

        setLoading(false);

      })
      .catch((error) => {

        console.error(error);

        alert("Unable to load product.");

        navigate("/admin/products");

      });

  }, [productId, navigate]);


  // ==========================
  // Fetch Categories
  // ==========================

  useEffect(() => {

    fetch("http://127.0.0.1:5000/categories")
      .then((response) => response.json())
      .then((data) => {

        setCategories(data);

      })
      .catch((error) => {

        console.error(error);

      });

  }, []);


  // ==========================
  // Handle Input
  // ==========================

  function handleChange(e) {

    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

  }

  function handleImageChange(e) {
    const file = e.target.files[0] || null;
    setSelectedImage(file);

    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setPreviewImage(fileUrl);
    } else {
      setPreviewImage(null);
    }
  }


  // ==========================
  // Update Product
  // ==========================

  async function handleUpdate(e) {

    e.preventDefault();

    try {

      const uploadData = new FormData();

      uploadData.append("product_name", formData.product_name);
      uploadData.append("description", formData.description);
      uploadData.append("category_id", formData.category_id);
      uploadData.append("price", formData.price);
      uploadData.append("stock", formData.stock);
      uploadData.append("product_status", formData.product_status);

      if (selectedImage) {
        uploadData.append("image", selectedImage);
      } else if (formData.image) {
        uploadData.append("existing_image", formData.image);
      }

      const response = await fetch(
        `http://127.0.0.1:5000/admin/products/${productId}`,
        {
          method: "PUT",
          body: uploadData
        }
      );

      const result = await response.json();

      if (response.ok) {

        alert(result.message);

        navigate("/admin/products");

      } else {

        alert(result.error || result.message);

      }

    } catch (error) {

      console.error(error);

      alert("Something went wrong.");

    }

  }


  // ==========================
  // Loading
  // ==========================

  if (loading) {

    return (
      <div className="d-flex">

        <Sidebar />

        <div
          className="flex-grow-1 p-5 text-center"
          style={{
            background: "#F8F8FC",
            minHeight: "100vh"
          }}
        >

          <h4>Loading Product...</h4>

        </div>

      </div>
    );

  }


  return (

    <div className="d-flex">

      <Sidebar />

      <div
        className="flex-grow-1 p-4"
        style={{
          background: "#F8F8FC",
          minHeight: "100vh"
        }}
      >

        {/* Header */}

        <div className="d-flex justify-content-between align-items-center mb-4">

          <div>

            <h2 className="fw-bold mb-1">
              Edit Product
            </h2>

            <p className="text-secondary mb-0">
              Update product information
            </p>

          </div>

          <button
            className="btn btn-outline-dark"
            onClick={() => navigate("/admin/products")}
          >
            ← Back
          </button>

        </div>


        {/* Form */}

        <div className="card border-0 shadow-sm rounded-4">

          <div className="card-body p-4 p-md-5">

            <form onSubmit={handleUpdate}>

              <div className="row">

                {/* Product Name */}

                <div className="col-md-6 mb-4">

                  <label className="form-label fw-semibold">
                    Product Name
                  </label>

                  <input
                    type="text"
                    name="product_name"
                    className="form-control"
                    value={formData.product_name}
                    onChange={handleChange}
                  />

                </div>


                {/* Category */}

                <div className="col-md-6 mb-4">

                  <label className="form-label fw-semibold">
                    Category
                  </label>

                  <select
                    name="category_id"
                    className="form-select"
                    value={formData.category_id}
                    onChange={handleChange}
                  >

                    <option value="">
                      Select Category
                    </option>

                    {categories.map((category) => (

                      <option
                        key={category.category_id}
                        value={category.category_id}
                      >
                        {category.category_name}
                      </option>

                    ))}

                  </select>

                </div>


                {/* Description */}

                <div className="col-12 mb-4">

                  <label className="form-label fw-semibold">
                    Description
                  </label>

                  <textarea
                    name="description"
                    className="form-control"
                    rows="4"
                    value={formData.description}
                    onChange={handleChange}
                  />

                </div>


                {/* Price */}

                <div className="col-md-4 mb-4">

                  <label className="form-label fw-semibold">
                    Price
                  </label>

                  <input
                    type="number"
                    name="price"
                    className="form-control"
                    value={formData.price}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                  />

                </div>


                {/* Stock */}

                <div className="col-md-4 mb-4">

                  <label className="form-label fw-semibold">
                    Stock
                  </label>

                  <input
                    type="number"
                    name="stock"
                    className="form-control"
                    value={formData.stock}
                    onChange={handleChange}
                    min="0"
                  />

                </div>


                {/* Status */}

                <div className="col-md-4 mb-4">

                  <label className="form-label fw-semibold">
                    Status
                  </label>

                  <select
                    name="product_status"
                    className="form-select"
                    value={formData.product_status}
                    onChange={handleChange}
                  >

                    <option value="Available">
                      Available
                    </option>

                    <option value="Unavailable">
                      Unavailable
                    </option>

                  </select>

                </div>


                {/* Image */}

                <div className="col-12 mb-4">

                  <label className="form-label fw-semibold">
                    Product Image
                  </label>

                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={handleImageChange}
                  />

                  <small className="text-secondary">
                    Choose a new image to replace the current one. Leave it empty to keep the existing image.
                  </small>

                  {selectedImage && (
                    <small className="d-block mt-2 text-primary">
                      Selected file: {selectedImage.name}
                    </small>
                  )}

                </div>


                {/* Current / Preview Image */}

                {(formData.image || previewImage) && (

                  <div className="col-12 mb-4">

                    <label className="form-label fw-semibold">
                      {previewImage ? "Preview Image" : "Current Image"}
                    </label>

                    <div>

                      <img
                        src={previewImage || `/images/${formData.image}`}
                        alt={formData.product_name}
                        style={{
                          width: "150px",
                          height: "150px",
                          objectFit: "cover",
                          borderRadius: "12px"
                        }}
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />

                    </div>

                  </div>

                )}


                {/* Buttons */}

                <div className="col-12">

                  <hr className="mb-4" />

                  <div className="d-flex gap-2">

                    <button
                      type="submit"
                      className="btn btn-primary px-4"
                    >
                      Update Product
                    </button>

                    <button
                      type="button"
                      className="btn btn-outline-secondary px-4"
                      onClick={() => navigate("/admin/products")}
                    >
                      Cancel
                    </button>

                  </div>

                </div>

              </div>

            </form>

          </div>

        </div>

      </div>

    </div>

  );
}

export default AdminEditProduct;