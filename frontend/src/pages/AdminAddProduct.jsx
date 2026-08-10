import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

function AdminAddProduct() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [formData, setFormData] = useState({
    product_name: "",
    description: "",
    category_id: "",
    price: "",
    stock: "",
    product_status: "Available"
  });

  useEffect(() => {
    fetch("http://127.0.0.1:5000/categories")
      .then((response) => response.json())
      .then((data) => setCategories(data))
      .catch((error) => console.error(error));
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleImageChange(e) {
    const file = e.target.files[0] || null;
    setSelectedImage(file);

    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    } else {
      setPreviewImage(null);
    }
  }

  async function handleSubmit(e) {
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
      }

      const response = await fetch("http://127.0.0.1:5000/admin/products", {
        method: "POST",
        body: uploadData
      });

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

  return (
    <div className="d-flex">
      <Sidebar />

      <div className="flex-grow-1 p-4" style={{ background: "#F8F8FC", minHeight: "100vh" }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold mb-1">Add Product</h2>
            <p className="text-secondary mb-0">Create a new product with image upload</p>
          </div>

          <button className="btn btn-outline-dark" onClick={() => navigate("/admin/products")}>← Back</button>
        </div>

        <div className="card border-0 shadow-sm rounded-4">
          <div className="card-body p-4 p-md-5">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-4">
                  <label className="form-label fw-semibold">Product Name</label>
                  <input type="text" name="product_name" className="form-control" value={formData.product_name} onChange={handleChange} required />
                </div>

                <div className="col-md-6 mb-4">
                  <label className="form-label fw-semibold">Category</label>
                  <select name="category_id" className="form-select" value={formData.category_id} onChange={handleChange} required>
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                      <option key={category.category_id} value={category.category_id}>
                        {category.category_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-12 mb-4">
                  <label className="form-label fw-semibold">Description</label>
                  <textarea name="description" className="form-control" rows="4" value={formData.description} onChange={handleChange} required />
                </div>

                <div className="col-md-4 mb-4">
                  <label className="form-label fw-semibold">Price</label>
                  <input type="number" name="price" className="form-control" value={formData.price} onChange={handleChange} min="0" step="0.01" required />
                </div>

                <div className="col-md-4 mb-4">
                  <label className="form-label fw-semibold">Stock</label>
                  <input type="number" name="stock" className="form-control" value={formData.stock} onChange={handleChange} min="0" required />
                </div>

                <div className="col-md-4 mb-4">
                  <label className="form-label fw-semibold">Status</label>
                  <select name="product_status" className="form-select" value={formData.product_status} onChange={handleChange}>
                    <option value="Available">Available</option>
                    <option value="Unavailable">Unavailable</option>
                  </select>
                </div>

                <div className="col-12 mb-4">
                  <label className="form-label fw-semibold">Product Image</label>
                  <input type="file" className="form-control" accept="image/*" onChange={handleImageChange} />
                  <small className="text-secondary">Choose an image for the product. A default image will be used if none is selected.</small>
                </div>

                {previewImage && (
                  <div className="col-12 mb-4">
                    <label className="form-label fw-semibold">Preview</label>
                    <div>
                      <img src={previewImage} alt="Preview" style={{ width: "150px", height: "150px", objectFit: "cover", borderRadius: "12px" }} />
                    </div>
                  </div>
                )}

                <div className="col-12">
                  <hr className="mb-4" />
                  <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-primary px-4">Add Product</button>
                    <button type="button" className="btn btn-outline-secondary px-4" onClick={() => navigate("/admin/products")}>Cancel</button>
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

export default AdminAddProduct;
