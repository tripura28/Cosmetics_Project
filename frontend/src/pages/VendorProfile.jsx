import { useEffect, useState } from "react";
import VendorSidebar from "../components/VendorSidebar";

function VendorProfile() {

  const vendorId = localStorage.getItem("vendorId");

  const [profile, setProfile] = useState({
    vendor_name: "",
    shop_name: "",
    email: "",
    phone: "",
    address: "",
    status: ""
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);


  // ==========================================
  // GET VENDOR PROFILE
  // ==========================================

  const fetchProfile = async () => {

    try {

      const response = await fetch(
        `http://127.0.0.1:5000/vendor/profile/${vendorId}`
      );

      const data = await response.json();

      if (response.ok) {

        setProfile(data);

      } else {

        alert(
          data.error || "Unable to load profile."
        );

      }

    } catch (error) {

      console.error(error);

      alert("Unable to connect to the server.");

    } finally {

      setLoading(false);

    }

  };


  useEffect(() => {

    if (!vendorId) {

      alert("Vendor session not found.");
      setLoading(false);

      return;

    }

    fetchProfile();

  }, [vendorId]);


  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (e) => {

    const { name, value } = e.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value
    }));

  };


  // ==========================================
  // UPDATE PROFILE
  // ==========================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setSaving(true);

    try {

      const response = await fetch(
        `http://127.0.0.1:5000/vendor/profile/${vendorId}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            shop_name: profile.shop_name,
            phone: profile.phone,
            address: profile.address
          })
        }
      );

      const data = await response.json();

      if (response.ok) {

        alert("Profile updated successfully!");

        fetchProfile();

      } else {

        alert(
          data.error || "Unable to update profile."
        );

      }

    } catch (error) {

      console.error(error);

      alert("Unable to connect to the server.");

    } finally {

      setSaving(false);

    }

  };


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (

      <div className="d-flex">

        <VendorSidebar />

        <div
          className="flex-grow-1 d-flex align-items-center justify-content-center"
          style={{
            minHeight: "100vh",
            background: "#F7F6FB"
          }}
        >

          <h4>
            Loading Profile...
          </h4>

        </div>

      </div>

    );

  }


  return (

    <div
      className="d-flex"
      style={{
        minHeight: "100vh",
        background: "#F7F6FB"
      }}
    >

      <VendorSidebar />


      <div className="flex-grow-1 p-4 p-md-5">


        {/* ================================= */}
        {/* HEADER */}
        {/* ================================= */}

        <div className="mb-4">

          <p
            className="mb-1"
            style={{
              color: "#7C6EE6",
              fontWeight: "600"
            }}
          >
            SELLER CENTER
          </p>

          <h2 className="fw-bold mb-1">
            Store Profile
          </h2>

          <p className="text-secondary">
            Manage your store information.
          </p>

        </div>


        {/* ================================= */}
        {/* PROFILE CARD */}
        {/* ================================= */}

        <div className="row">

          <div className="col-lg-8">

            <div
              className="card border-0 shadow-sm rounded-4"
            >

              <div className="card-body p-4 p-md-5">


                {/* PROFILE HEADER */}

                <div
                  className="d-flex align-items-center gap-3 mb-4"
                >

                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{
                      width: "70px",
                      height: "70px",
                      background: "#F5F3FF",
                      fontSize: "2rem"
                    }}
                  >
                    🏪
                  </div>

                  <div>

                    <h4 className="fw-bold mb-1">
                      {profile.shop_name}
                    </h4>

                    <p className="text-secondary mb-0">
                      Vendor Account
                    </p>

                  </div>

                </div>


                <form onSubmit={handleSubmit}>


                  {/* VENDOR NAME */}

                  <div className="mb-4">

                    <label className="form-label fw-semibold">
                      Vendor Name
                    </label>

                    <input
                      type="text"
                      className="form-control rounded-3"
                      value={profile.vendor_name}
                      readOnly
                    />

                    <small className="text-secondary">
                      Vendor name cannot be changed here.
                    </small>

                  </div>


                  {/* SHOP NAME */}

                  <div className="mb-4">

                    <label className="form-label fw-semibold">
                      Shop Name
                    </label>

                    <input
                      type="text"
                      name="shop_name"
                      className="form-control rounded-3"
                      value={profile.shop_name}
                      onChange={handleChange}
                      required
                    />

                  </div>


                  {/* EMAIL */}

                  <div className="mb-4">

                    <label className="form-label fw-semibold">
                      Email
                    </label>

                    <input
                      type="email"
                      className="form-control rounded-3"
                      value={profile.email}
                      readOnly
                    />

                    <small className="text-secondary">
                      Email is your login account.
                    </small>

                  </div>


                  {/* PHONE */}

                  <div className="mb-4">

                    <label className="form-label fw-semibold">
                      Phone
                    </label>

                    <input
                      type="text"
                      name="phone"
                      className="form-control rounded-3"
                      value={profile.phone || ""}
                      onChange={handleChange}
                      placeholder="Enter phone number"
                    />

                  </div>


                  {/* ADDRESS */}

                  <div className="mb-4">

                    <label className="form-label fw-semibold">
                      Address
                    </label>

                    <textarea
                      name="address"
                      className="form-control rounded-3"
                      rows="4"
                      value={profile.address || ""}
                      onChange={handleChange}
                      placeholder="Enter store address"
                    />

                  </div>


                  {/* STATUS */}

                  <div className="mb-4">

                    <label className="form-label fw-semibold">
                      Account Status
                    </label>

                    <div>

                      <span
                        className="badge rounded-pill px-3 py-2"
                        style={{
                          background:
                            profile.status === "Approved"
                              ? "#E8F5E9"
                              : profile.status === "Rejected"
                              ? "#FDECEC"
                              : "#FFF4E5",

                          color:
                            profile.status === "Approved"
                              ? "#2E7D32"
                              : profile.status === "Rejected"
                              ? "#C62828"
                              : "#E65100"
                        }}
                      >
                        {profile.status}
                      </span>

                    </div>

                  </div>


                  {/* SAVE BUTTON */}

                  <button
                    type="submit"
                    className="btn rounded-pill px-4"
                    disabled={saving}
                    style={{
                      background: "#7C6EE6",
                      color: "white",
                      border: "none"
                    }}
                  >

                    {saving
                      ? "Saving..."
                      : "💾 Save Changes"}

                  </button>


                </form>

              </div>

            </div>

          </div>


          {/* ================================= */}
          {/* INFORMATION CARD */}
          {/* ================================= */}

          <div className="col-lg-4 mt-4 mt-lg-0">

            <div
              className="card border-0 shadow-sm rounded-4"
            >

              <div className="card-body p-4">

                <h5 className="fw-bold mb-3">
                  Store Information
                </h5>

                <div className="mb-3">

                  <small className="text-secondary">
                    Store
                  </small>

                  <div className="fw-semibold">
                    {profile.shop_name}
                  </div>

                </div>

                <div className="mb-3">

                  <small className="text-secondary">
                    Email
                  </small>

                  <div className="fw-semibold">
                    {profile.email}
                  </div>

                </div>

                <div className="mb-3">

                  <small className="text-secondary">
                    Status
                  </small>

                  <div className="fw-semibold">
                    {profile.status}
                  </div>

                </div>

                <hr />

                <p className="text-secondary small mb-0">
                  Keep your store information up to date so
                  customers can have accurate information about
                  your business.
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}

export default VendorProfile;