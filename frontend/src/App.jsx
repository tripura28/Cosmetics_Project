import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import ProductDetails from "./pages/ProductDetails";
import Categories from "./pages/Categories";
import About from "./pages/About";
import Wishlist from "./pages/Wishlist";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";
import ChooseRole from "./pages/ChooseRole";
import AdminLogin from "./pages/AdminLogin";
import AdminRegister from "./pages/AdminRegister";
import AdminDashboard from "./pages/AdminDashboard";
import ManageProducts from "./pages/ManageProducts";

function App() {
  return (
    <BrowserRouter>

      <Routes>

  <Route path="/" element={<Home />} />

  <Route path="/products" element={<Products />} />

  <Route path="/products/:id" element={<ProductDetails />} />

  <Route path="/login" element={<Login />} />

  <Route path="/register" element={<Register />} />

  <Route path="/cart" element={<Cart />} />

  <Route path="/categories" element={<Categories />} />

  <Route path="/wishlist" element={<Wishlist />}/>

  <Route  path="/checkout" element={<Checkout />}/>

  <Route path="/orders" element={<Orders />} />

  <Route path="/order-details/:orderId" element={<OrderDetails />}/>

  <Route  path="/about" element={<About />}/>

  <Route path="/choose-role" element={<ChooseRole />} />

  <Route path="/admin-login" element={<AdminLogin />} />

  <Route path="/admin-register" element={<AdminRegister/>}/>

  <Route path="/admin-dashboard" element={<AdminDashboard/>}/>
  <Route
    path="/admin/products"
    element={<ManageProducts />}
/>

</Routes>

    </BrowserRouter>
  );
}

export default App;