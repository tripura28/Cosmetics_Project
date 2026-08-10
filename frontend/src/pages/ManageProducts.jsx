import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";

function ManageProducts() {

  const [products, setProducts] = useState([]);

  useEffect(() => {

    fetch("http://127.0.0.1:5000/products")
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => {
        console.error(error);
      });

  }, []);

async function handleToggleStatus(productId, currentStatus) {

  const newStatus =
    currentStatus === "Unavailable"
      ? "Available"
      : "Unavailable";

  const confirmAction = window.confirm(
    `Are you sure you want to ${
      newStatus === "Unavailable" ? "disable" : "enable"
    } this product?`
  );

  if (!confirmAction) return;

  try {

    const response = await fetch(
      `http://127.0.0.1:5000/admin/products/${productId}`,
      {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          product_status: newStatus,
        }),

      }
    );

    const result = await response.json();

    if (response.ok) {

      alert(result.message);

      setProducts(
        products.map((product) =>
          product.product_id === productId
            ? { ...product, product_status: newStatus }
            : product
        )
      );

    } else {

      alert(result.error);

    }

  } catch (error) {

    console.error(error);
    alert("Something went wrong");

  }

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

        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">

          <div>
            <h2 className="fw-bold mb-1">Manage Products</h2>
            <p className="text-secondary mb-0">Review, update, and control your product catalog.</p>
          </div>

          <Link
            to="/admin/products/add"
            className="btn btn-primary px-4"
          >
            + Add Product
          </Link>

        </div>

        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <div className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-body">
                <small className="text-uppercase text-secondary">Total Products</small>
                <h3 className="fw-bold mt-2 mb-0">{products.length}</h3>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-body">
                <small className="text-uppercase text-secondary">Available</small>
                <h3 className="fw-bold mt-2 mb-0">{products.filter((p) => p.product_status === "Available").length}</h3>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-body">
                <small className="text-uppercase text-secondary">Unavailable</small>
                <h3 className="fw-bold mt-2 mb-0">{products.filter((p) => p.product_status === "Unavailable").length}</h3>
              </div>
            </div>
          </div>
        </div>

        <div className="card shadow border-0 rounded-4">

          <div className="card-body p-3 p-md-4">

            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">

                <thead>

                  <tr className="text-secondary">

                    <th>Image</th>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Status</th>
                    <th>Actions</th>

                  </tr>

                </thead>

                <tbody>

                  {products.map((product) => (

                    <tr key={product.product_id}>

                      <td>

                        <img
                          src={`/images/${product.image}`}
                          alt={product.product_name}
                          width="70"
                          height="70"
                          style={{
                            objectFit: "cover",
                            borderRadius: "12px"
                          }}
                        />

                      </td>

                      <td>
                        <div className="fw-semibold">{product.product_name}</div>
                        <small className="text-secondary">{product.description?.slice(0, 60)}{product.description?.length > 60 ? "..." : ""}</small>
                      </td>

                      <td>{product.category_name}</td>

                      <td>₹{product.price}</td>

                      <td>{product.stock}</td>

                      <td>
                        <span className={`badge rounded-pill px-3 py-2 ${product.product_status === "Available" ? "bg-success-subtle text-success" : "bg-danger-subtle text-danger"}`}>
                          {product.product_status}
                        </span>
                      </td>

                      <td>

                        <div className="d-flex gap-2 flex-wrap">
                          <Link
                            to={`/admin/products/edit/${product.product_id}`}
                            className="btn btn-warning btn-sm"
                          >
                            Edit
                          </Link>

                          <button
                            className={
                              product.product_status === "Unavailable"
                                ? "btn btn-success btn-sm"
                                : "btn btn-danger btn-sm"
                            }
                            onClick={() =>
                              handleToggleStatus(
                                product.product_id,
                                product.product_status
                              )
                            }
                          >
                            {product.product_status === "Unavailable"
                              ? "Enable"
                              : "Disable"}
                          </button>
                        </div>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>
            </div>

          </div>

        </div>

      </div>

    </div>

  );

}

export default ManageProducts;