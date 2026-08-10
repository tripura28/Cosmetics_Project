import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";

function ManageCategories() {

  const [categories, setCategories] = useState([]);

  const [categoryName, setCategoryName] = useState("");
  const [description, setDescription] = useState("");

  const [editingId, setEditingId] = useState(null);

  // ==========================
  // Fetch Categories
  // ==========================

  useEffect(() => {

    fetch("http://127.0.0.1:5000/admin/categories")
      .then((response) => response.json())
      .then((data) => {

        if (data.error) {
          console.error(data.error);
          return;
        }

        setCategories(data);

      })
      .catch((error) => {

        console.error(error);

      });

  }, []);


  // ==========================
  // Add / Update Category
  // ==========================

  async function handleSubmit(e) {

    e.preventDefault();

    if (!categoryName.trim()) {

      alert("Please enter category name.");

      return;

    }

    try {

      const url = editingId
        ? `http://127.0.0.1:5000/admin/categories/${editingId}`
        : "http://127.0.0.1:5000/admin/categories";

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {

        method: method,

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({

          category_name: categoryName,
          description: description

        })

      });

      const result = await response.json();

      if (response.ok) {

        alert(result.message);

        setCategoryName("");
        setDescription("");
        setEditingId(null);

        // Reload categories
        const categoriesResponse = await fetch(
          "http://127.0.0.1:5000/admin/categories"
        );

        const categoriesData =
          await categoriesResponse.json();

        setCategories(categoriesData);

      } else {

        alert(result.error || result.message);

      }

    } catch (error) {

      console.error(error);

      alert("Something went wrong.");

    }

  }


  // ==========================
  // Edit
  // ==========================

  function handleEdit(category) {

    setEditingId(category.category_id);

    setCategoryName(category.category_name);

    setDescription(category.description || "");

  }


  // ==========================
  // Cancel Edit
  // ==========================

  function handleCancel() {

    setEditingId(null);

    setCategoryName("");

    setDescription("");

  }


  // ==========================
  // Delete
  // ==========================

  async function handleDelete(categoryId) {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!confirmDelete) return;

    try {

      const response = await fetch(
        `http://127.0.0.1:5000/admin/categories/${categoryId}`,
        {
          method: "DELETE"
        }
      );

      const result = await response.json();

      if (response.ok) {

        alert(result.message);

        setCategories((prevCategories) =>
          prevCategories.filter(
            (category) =>
              category.category_id !== categoryId
          )
        );

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

      <div
        className="flex-grow-1 p-4"
        style={{
          background: "#F8F8FC",
          minHeight: "100vh"
        }}
      >

        {/* Header */}

        <div className="mb-4">

          <h2 className="fw-bold">
            Manage Categories
          </h2>

          <p className="text-secondary">
            Add, edit and manage product categories.
          </p>

        </div>


        <div className="row">

          {/* Add/Edit Form */}

          <div className="col-lg-4 mb-4">

            <div className="card border-0 shadow-sm rounded-4">

              <div className="card-body p-4">

                <h5 className="fw-bold mb-4">

                  {editingId
                    ? "Edit Category"
                    : "Add Category"}

                </h5>


                <form onSubmit={handleSubmit}>

                  <div className="mb-3">

                    <label className="form-label fw-semibold">
                      Category Name
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      value={categoryName}
                      onChange={(e) =>
                        setCategoryName(e.target.value)
                      }
                      placeholder="Example: Makeup"
                    />

                  </div>


                  <div className="mb-4">

                    <label className="form-label fw-semibold">
                      Description
                    </label>

                    <textarea
                      className="form-control"
                      rows="4"
                      value={description}
                      onChange={(e) =>
                        setDescription(e.target.value)
                      }
                      placeholder="Enter category description"
                    />

                  </div>


                  <div className="d-grid gap-2">

                    <button
                      type="submit"
                      className="btn btn-primary"
                    >

                      {editingId
                        ? "Update Category"
                        : "Add Category"}

                    </button>


                    {editingId && (

                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={handleCancel}
                      >
                        Cancel
                      </button>

                    )}

                  </div>

                </form>

              </div>

            </div>

          </div>


          {/* Categories Table */}

          <div className="col-lg-8">

            <div className="card border-0 shadow-sm rounded-4">

              <div className="card-body">

                <h5 className="fw-bold mb-4">
                  Categories
                </h5>


                <div className="table-responsive">

                  <table className="table table-hover align-middle">

                    <thead>

                      <tr>

                        <th>ID</th>

                        <th>Category</th>

                        <th>Description</th>

                        <th>Actions</th>

                      </tr>

                    </thead>


                    <tbody>

                      {categories.length === 0 ? (

                        <tr>

                          <td
                            colSpan="4"
                            className="text-center py-5"
                          >
                            No categories found.
                          </td>

                        </tr>

                      ) : (

                        categories.map((category) => (

                          <tr
                            key={category.category_id}
                          >

                            <td>
                              #{category.category_id}
                            </td>

                            <td>

                              <strong>
                                {category.category_name}
                              </strong>

                            </td>

                            <td>
                              {category.description || "-"}
                            </td>

                            <td>

                              <button
                                className="btn btn-warning btn-sm me-2"
                                onClick={() =>
                                  handleEdit(category)
                                }
                              >
                                Edit
                              </button>

                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() =>
                                  handleDelete(
                                    category.category_id
                                  )
                                }
                              >
                                Delete
                              </button>

                            </td>

                          </tr>

                        ))

                      )}

                    </tbody>

                  </table>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}

export default ManageCategories;