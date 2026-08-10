import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";

function AdminDashboard() {

  return (

    <div className="d-flex">

      <Sidebar />

      <div
        className="flex-grow-1 p-5"
        style={{
          background: "#F8F8FC",
          minHeight: "100vh"
        }}
      >

        <h2 className="fw-bold mb-4">
          Welcome to GlowCart Admin Dashboard 👋
        </h2>

        <div className="row g-4">

          <div className="col-md-3">
            <div className="card shadow border-0">
              <div className="card-body text-center">
                <h5>Total Products</h5>
                <h2>0</h2>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card shadow border-0">
              <div className="card-body text-center">
                <h5>Total Categories</h5>
                <h2>0</h2>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card shadow border-0">
              <div className="card-body text-center">
                <h5>Total Orders</h5>
                <h2>0</h2>
              </div>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card shadow border-0">
              <div className="card-body text-center">
                <h5>Total Customers</h5>
                <h2>0</h2>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>

  );

}

export default AdminDashboard;