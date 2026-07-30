import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import ProductDetails from "./pages/ProductDetails";
import Categories from "./pages/Categories";
import About from "./pages/About";

function App() {
  return (
    <BrowserRouter>

      <Routes>

  <Route path="/" element={<Home />} />

  <Route path="/products" element={<Products />} />

  <Route
    path="/products/:id"
    element={<ProductDetails />}
  />

  <Route path="/login" element={<Login />} />

  <Route path="/register" element={<Register />} />

  <Route path="/cart" element={<Cart />} />

  <Route path="/categories" element={<Categories />} />

  

</Routes>

    </BrowserRouter>
  );
}

export default App;