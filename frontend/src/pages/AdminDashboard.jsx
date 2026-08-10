import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";

function AdminDashboard() {
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    customers: 0,
    orders: 0
  });

  useEffect(() => {
    fetch("http://127.0.0.1:5000/admin/dashboard")
      .then((response) => response.json())
      .then((data) => {
        setStats(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const cards = [
    { title: "Total Products", value: stats.products, icon: "📦", color: "#7c3aed" },
    { title: "Total Categories", value: stats.categories, icon: "🗂️", color: "#0f766e" },
    { title: "Total Orders", value: stats.orders, icon: "🛒", color: "#dc2626" },
    { title: "Total Customers", value: stats.customers, icon: "👥", color: "#ea580c" }
  ];

  const quickLinks = [
    { title: "Products", description: "Create, edit, and manage your storefront items.", path: "/admin/products" },
    { title: "Categories", description: "Keep your product categories organized.", path: "/categories" },
    { title: "Orders", description: "Review recent customer orders.", path: "/orders" },
    { title: "Customers", description: "Monitor registered customer accounts.", path: "/register" }
  ];

  return (
    <div className="d-flex">
      <Sidebar />

      <div className="flex-grow-1 p-4 p-md-5" style={{ background: "#f8f8fc", minHeight: "100vh" }}>
        <div className="card border-0 shadow-sm rounded-4 p-4 mb-4" style={{ background: "linear-gradient(135deg, #111827, #374151)" }}>
          <div className="row align-items-center">
            <div className="col-lg-8 text-white">
              <p className="mb-2 text-uppercase fw-semibold" style={{ letterSpacing: "0.2em", opacity: 0.8 }}>
                GlowCart Admin Panel
              </p>
              <h2 className="fw-bold mb-2">Welcome back, Admin 👋</h2>
              <p className="mb-0" style={{ opacity: 0.9 }}>
                Keep track of products, categories, orders, and customers from one polished place.
              </p>
            </div>
            <div className="col-lg-4 text-end d-none d-lg-block">
              <div className="rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width: "120px", height: "120px", background: "rgba(255,255,255,0.15)" }}>
                <span className="display-4">✨</span>
              </div>
            </div>
          </div>
        </div>

        <div className="row g-4">
          {cards.map((card) => (
            <div className="col-md-6 col-xl-3" key={card.title}>
              <div className="card border-0 shadow-sm rounded-4 h-100">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <small className="text-uppercase text-secondary">{card.title}</small>
                      <h2 className="fw-bold mt-2 mb-0">{card.value}</h2>
                    </div>
                    <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: "48px", height: "48px", background: `${card.color}15`, color: card.color }}>
                      <span className="fs-4">{card.icon}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="row g-4 mt-1">
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-body p-4">
                <h5 className="fw-bold mb-3">Quick Overview</h5>
                <p className="text-secondary mb-0">
                  Your storefront is running smoothly. Use the sidebar to manage products, categories, orders, and customer activity.
                </p>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-body p-4">
                <h5 className="fw-bold mb-3">Today’s Focus</h5>
                <ul className="mb-0 ps-3 text-secondary">
                  <li>Review new products</li>
                  <li>Check low stock items</li>
                  <li>Monitor order activity</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="row g-4 mt-1">
          {quickLinks.map((link) => (
            <div className="col-md-6 col-xl-3" key={link.title}>
              <div className="card border-0 shadow-sm rounded-4 h-100">
                <div className="card-body p-4">
                  <h6 className="fw-bold mb-2">{link.title}</h6>
                  <p className="text-secondary small mb-3">{link.description}</p>
                  <a href={link.path} className="btn btn-outline-dark btn-sm">Open</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;