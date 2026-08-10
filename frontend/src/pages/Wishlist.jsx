import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function Wishlist() {

  const [wishlistItems, setWishlistItems] = useState([]);

  const navigate = useNavigate();

  const customerId = localStorage.getItem("customerId");
  

  useEffect(() => {

    if (!customerId) {
      alert("Please login first.");
      navigate("/choose-role");
      return;
    }

    fetch(`http://127.0.0.1:5000/wishlist/${customerId}`)
      .then((response) => response.json())
      .then((data) => {
        setWishlistItems(data);
      })
      .catch((error) => {
        console.error(error);
      });

  }, [customerId, navigate]);

  async function removeWishlist(wishlistId) {

    const confirmRemove = window.confirm(
      "Remove this product from wishlist?"
    );

    if (!confirmRemove) return;

    try {

      const response = await fetch(
        `http://127.0.0.1:5000/remove-wishlist/${wishlistId}`,
        {
          method: "DELETE"
        }
      );

      const result = await response.json();

      if (response.ok) {

       alert(result.message);

        navigate("/cart");

        setWishlistItems(
          wishlistItems.filter(
            (item) => item.wishlist_id !== wishlistId
          )
        );

      } else {

        alert(result.message);

      }

    } catch (error) {

      console.error(error);

    }

  }

 async function moveToCart(productId) {

  try {

    const response = await fetch(
      "http://127.0.0.1:5000/move-to-cart",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({

          customer_id: customerId,
          product_id: productId

        })

      }
    );

    const result = await response.json();

    if (response.ok) {

      alert(result.message);

      navigate("/cart");

    } else {

      alert(result.message);

    }

  } catch (error) {

    console.error(error);
    alert("Something went wrong.");

  }

}

  return (
    <>
      <Navbar />

      <section className="bg-light py-5 min-vh-100">

        <div className="container">

          <div className="text-center mb-5">

            <p className="text-uppercase text-secondary fw-bold">
              Your Favourite Products
            </p>

            <h1 className="fw-bold">
              Wishlist
            </h1>

          </div>

          <div className="card border-0 shadow-sm rounded-4">

            <div className="card-body">

              {wishlistItems.length === 0 ? (

                <div className="text-center py-5">

                  <div className="display-1">
                    ❤️
                  </div>

                  <h3 className="mt-3">
                    Your wishlist is empty
                  </h3>

                  <p className="text-secondary">
                    Save products you love.
                  </p>

                  <Link
                    to="/products"
                    className="btn btn-dark"
                  >
                    Browse Products
                  </Link>

                </div>

              ) : (

                wishlistItems.map((item) => (

                  <div
                    key={item.wishlist_id}
                    className="row align-items-center border-bottom py-3"
                  >

                    <div className="col-md-2">

                      <img
                        src={`/images/${item.image}`}
                        alt={item.product_name}
                        className="img-fluid rounded"
                        style={{
                          width: "90px",
                          height: "90px",
                          objectFit: "cover"
                        }}
                      />

                    </div>

                    <div className="col-md-4">

                      <h5>{item.product_name}</h5>

                    </div>

                    <div className="col-md-2">

                      <h5>
                        ₹{item.price}
                      </h5>

                    </div>

                    <div className="col-md-2">

                      <button
                        className="btn btn-dark btn-sm"
                        onClick={() => moveToCart(item.product_id)}
                    >
                        🛒 Move to Cart
                    </button>

                    </div>

                    <div className="col-md-2 text-end">

                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() =>
                          removeWishlist(item.wishlist_id)
                        }
                      >
                        Remove
                      </button>

                    </div>

                  </div>

                ))

              )}

            </div>

          </div>

        </div>

      </section>
    </>
  );
}

export default Wishlist;