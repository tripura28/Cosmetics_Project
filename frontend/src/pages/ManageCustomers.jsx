import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";

function ManageCustomers() {

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    fetch("http://127.0.0.1:5000/admin/customers")
      .then((response) => response.json())
      .then((data) => {

        if (data.error) {

          console.error(data.error);
          return;

        }

        setCustomers(data);
        setLoading(false);

      })
      .catch((error) => {

        console.error(error);
        setLoading(false);

      });

  }, []);


  async function updateStatus(customerId, currentStatus) {

    const newStatus = !currentStatus;

    const confirmAction = window.confirm(
      `Are you sure you want to ${
        newStatus ? "activate" : "deactivate"
      } this customer?`
    );

    if (!confirmAction) {
      return;
    }

    try {

      const response = await fetch(
        `http://127.0.0.1:5000/admin/customers/${customerId}/status`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            is_active: newStatus
          })
        }
      );

      const result = await response.json();

      if (response.ok) {

        alert(result.message);

        setCustomers((prevCustomers) =>
          prevCustomers.map((customer) =>
            customer.customer_id === customerId
              ? {
                  ...customer,
                  is_active: newStatus
                }
              : customer
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

          <h4>Loading Customers...</h4>

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

        <div className="mb-4">

          <h2 className="fw-bold">
            Manage Customers
          </h2>

          <p className="text-secondary">
            View and manage registered customers.
          </p>

        </div>


        <div className="card border-0 shadow-sm rounded-4">

          <div className="card-body">

            <div className="table-responsive">

              <table className="table table-hover align-middle">

                <thead>

                  <tr>

                    <th>ID</th>
                    <th>Customer</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Address</th>
                    <th>Status</th>
                    <th>Action</th>

                  </tr>

                </thead>

                <tbody>

                  {customers.length === 0 ? (

                    <tr>

                      <td
                        colSpan="7"
                        className="text-center py-5"
                      >
                        No customers found.
                      </td>

                    </tr>

                  ) : (

                    customers.map((customer) => (

                      <tr key={customer.customer_id}>

                        <td>
                          #{customer.customer_id}
                        </td>

                        <td>
                          <strong>
                            {customer.customer_name}
                          </strong>
                        </td>

                        <td>
                          {customer.email}
                        </td>

                        <td>
                          {customer.phone || "-"}
                        </td>

                        <td>
                          {customer.address || "-"}
                        </td>

                        <td>

                          {customer.is_active ? (

                            <span className="badge bg-success">
                              Active
                            </span>

                          ) : (

                            <span className="badge bg-secondary">
                              Inactive
                            </span>

                          )}

                        </td>

                        <td>

                          <button
                            className={
                              customer.is_active
                                ? "btn btn-danger btn-sm"
                                : "btn btn-success btn-sm"
                            }
                            onClick={() =>
                              updateStatus(
                                customer.customer_id,
                                customer.is_active
                              )
                            }
                          >

                            {customer.is_active
                              ? "Deactivate"
                              : "Activate"}

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

  );

}

export default ManageCustomers;