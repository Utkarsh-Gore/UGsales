import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "./Profile.css";

const API = "http://localhost:8080/api";

function Profile() {
  const { user, setUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  // Address form
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    isDefault: false,
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await axios.get(`${API}/profile`, {
        withCredentials: true,
      });
      setProfile(data.user);
      setName(data.user.name);
      setPhone(data.user.phone || "");
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const { data } = await axios.put(
        `${API}/profile`,
        { name, phone },
        { withCredentials: true }
      );
      setProfile(data.user);
      setUser({ ...user, name: data.user.name });
      localStorage.setItem("user", JSON.stringify({ ...user, name: data.user.name }));
      setEditing(false);
      setMessage("Profile updated successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const handleAddAddress = async () => {
    try {
      const { data } = await axios.post(`${API}/address`, newAddress, {
        withCredentials: true,
      });
      setProfile((prev) => ({ ...prev, addresses: data.addresses }));
      setShowAddressForm(false);
      setNewAddress({ name: "", phone: "", street: "", city: "", state: "", pincode: "", isDefault: false });
      setMessage("Address added!");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Add address failed:", error);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      const { data } = await axios.delete(`${API}/address/${addressId}`, {
        withCredentials: true,
      });
      setProfile((prev) => ({ ...prev, addresses: data.addresses }));
    } catch (error) {
      console.error("Delete address failed:", error);
    }
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-loading">
          <div className="spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <h1>My Profile</h1>

      {message && <div className="profile-message">{message}</div>}

      <div className="profile-layout">
        <div className="profile-card">
          <div className="profile-avatar">
            <span>{profile?.name?.charAt(0).toUpperCase()}</span>
          </div>

          {!editing ? (
            <div className="profile-details">
              <h2>{profile?.name}</h2>
              <p className="profile-email">
                <i className="fa-solid fa-envelope"></i> {profile?.email}
              </p>
              <p className="profile-phone">
                <i className="fa-solid fa-phone"></i>{" "}
                {profile?.phone || "Not provided"}
              </p>
              <p className="profile-role">
                <i className="fa-solid fa-user-tag"></i>{" "}
                {profile?.role === "admin" ? "Admin" : "Customer"}
              </p>
              <p className="profile-joined">
                <i className="fa-solid fa-calendar"></i> Joined{" "}
                {new Date(profile?.createdAt).toLocaleDateString("en-IN", {
                  month: "long",
                  year: "numeric",
                })}
              </p>
              <button className="edit-btn" onClick={() => setEditing(true)}>
                <i className="fa-solid fa-pen"></i> Edit Profile
              </button>
            </div>
          ) : (
            <div className="profile-edit-form">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone number"
                />
              </div>
              <div className="edit-actions">
                <button className="save-btn" onClick={handleUpdateProfile}>
                  Save Changes
                </button>
                <button className="cancel-btn" onClick={() => setEditing(false)}>
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="addresses-section">
          <div className="addresses-header">
            <h2>
              <i className="fa-solid fa-location-dot"></i> Saved Addresses
            </h2>
            <button
              className="add-address-btn"
              onClick={() => setShowAddressForm(!showAddressForm)}
            >
              {showAddressForm ? "Cancel" : "+ Add Address"}
            </button>
          </div>

          {showAddressForm && (
            <div className="address-form">
              <div className="form-grid">
                <input
                  placeholder="Full Name"
                  value={newAddress.name}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, name: e.target.value })
                  }
                />
                <input
                  placeholder="Phone"
                  value={newAddress.phone}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, phone: e.target.value })
                  }
                />
                <input
                  placeholder="Street Address"
                  className="full-width"
                  value={newAddress.street}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, street: e.target.value })
                  }
                />
                <input
                  placeholder="City"
                  value={newAddress.city}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, city: e.target.value })
                  }
                />
                <input
                  placeholder="State"
                  value={newAddress.state}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, state: e.target.value })
                  }
                />
                <input
                  placeholder="PIN Code"
                  value={newAddress.pincode}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, pincode: e.target.value })
                  }
                />
              </div>
              <button className="save-address-btn" onClick={handleAddAddress}>
                Save Address
              </button>
            </div>
          )}

          {profile?.addresses?.length === 0 && !showAddressForm && (
            <p className="no-addresses">No saved addresses yet.</p>
          )}

          <div className="address-list">
            {profile?.addresses?.map((addr) => (
              <div className="address-card" key={addr._id}>
                <div className="address-info">
                  <h4>
                    {addr.name}
                    {addr.isDefault && <span className="default-badge">Default</span>}
                  </h4>
                  <p>{addr.street}</p>
                  <p>
                    {addr.city}, {addr.state} - {addr.pincode}
                  </p>
                  <p className="address-phone">📞 {addr.phone}</p>
                </div>
                <button
                  className="delete-address-btn"
                  onClick={() => handleDeleteAddress(addr._id)}
                >
                  <i className="fa-solid fa-trash"></i>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
