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

        <div className="d-flex justify-content-between align-items-center mb-4">

          <h2 className="fw-bold">
            Manage Products
          </h2>

          <Link
            to="/admin/products/add"
            className="btn btn-primary"
          >
            + Add Product
          </Link>

        </div>

        <div className="card shadow border-0">

          <div className="card-body">

            <table className="table table-hover align-middle">

              <thead>

                <tr>

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
                          borderRadius: "10px"
                        }}
                      />

                    </td>

                    <td>{product.product_name}</td>

                    <td>{product.category_name}</td>

                    <td>₹{product.price}</td>

                    <td>{product.stock}</td>

                    <td>{product.product_status}</td>

                    <td>

                      <Link
                            to={`/admin/products/edit/${product.product_id}`}
                            className="btn btn-warning btn-sm me-2"
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

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </div>

  );

}

export default ManageProducts;