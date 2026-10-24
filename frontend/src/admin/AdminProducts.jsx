import { useState, useEffect } from "react";
import axios from "axios";
import { useToast } from "./AdminToast";
import "./Admin.css";

const API = "http://localhost:8080/api";

const categories = [
  "Smartphone",
  "Electronics",
  "TV",
  "Clothing",
  "Beauty",
  "Sports",
];

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const [form, setForm] = useState({
    name: "",
    image: "",
    price: "",
    rating: "",
    category: "Electronics",
    brand: "",
    description: "",
    stock: "",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(`${API}/products`);
      setProducts(data.products);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      toast.error("Fetch Failed", "Could not load products");
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setForm({
      name: "",
      image: "",
      price: "",
      rating: "",
      category: "Electronics",
      brand: "",
      description: "",
      stock: "",
    });
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      image: product.image,
      price: product.price,
      rating: product.rating,
      category: product.category,
      brand: product.brand,
      description: product.description,
      stock: product.stock,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.image || !form.price || !form.category || !form.brand) {
      toast.warning("Missing Fields", "Please fill all required fields");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        rating: Number(form.rating),
        stock: Number(form.stock),
      };

      if (editingProduct) {
        await axios.put(`${API}/admin/products/${editingProduct._id}`, payload, {
          withCredentials: true,
        });
        toast.success("Product Updated", `"${form.name}" has been updated`);
      } else {
        await axios.post(`${API}/admin/products`, payload, {
          withCredentials: true,
        });
        toast.success("Product Created", `"${form.name}" added successfully`);
      }
      setShowModal(false);
      fetchProducts();
    } catch (error) {
      console.error("Save failed:", error);
      toast.error("Save Failed", error.response?.data?.message || "Could not save product");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/admin/products/${id}`, {
        withCredentials: true,
      });
      toast.success("Product Deleted", "The product has been removed");
      setShowDeleteConfirm(null);
      fetchProducts();
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Delete Failed", "Could not delete the product");
    }
  };

  // Filter products by search
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="admin-table-header">
        <h2>📦 Products ({filteredProducts.length})</h2>
        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <div className="admin-search">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="admin-action-btn primary" onClick={openAddModal}>
            <i className="fa-solid fa-plus"></i> Add Product
          </button>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="admin-table-card">
          <div className="admin-empty-state">
            <i className="fa-solid fa-box-open"></i>
            <p>{searchTerm ? "No products match your search" : "No products found"}</p>
          </div>
        </div>
      ) : (
        <div className="admin-table-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Brand</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Rating</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product._id}>
                  <td>
                    <img src={product.image} alt={product.name} />
                  </td>
                  <td style={{ fontWeight: 600 }}>{product.name}</td>
                  <td>
                    <span style={{
                      fontSize: "0.78rem",
                      padding: "4px 10px",
                      borderRadius: 8,
                      background: "rgba(102, 126, 234, 0.1)",
                      color: "var(--admin-accent)",
                      fontWeight: 500,
                    }}>
                      {product.category}
                    </span>
                  </td>
                  <td style={{ color: "var(--admin-text-muted)" }}>{product.brand}</td>
                  <td style={{ fontWeight: 600 }}>₹{product.price.toLocaleString("en-IN")}</td>
                  <td>
                    <span
                      style={{
                        color: product.stock > 10 ? "var(--admin-success)" : product.stock > 0 ? "var(--admin-warning)" : "var(--admin-danger)",
                        fontWeight: 600,
                        fontSize: "0.88rem",
                      }}
                    >
                      {product.stock}
                      {product.stock === 0 && (
                        <span style={{ fontSize: "0.7rem", marginLeft: 4, opacity: 0.7 }}>
                          OUT
                        </span>
                      )}
                    </span>
                  </td>
                  <td>
                    <span style={{ color: "var(--admin-warning)" }}>⭐</span> {product.rating}
                  </td>
                  <td>
                    <button
                      className="admin-action-btn edit"
                      onClick={() => openEditModal(product)}
                    >
                      <i className="fa-solid fa-pen-to-square"></i> Edit
                    </button>
                    <button
                      className="admin-action-btn delete"
                      onClick={() => setShowDeleteConfirm(product)}
                    >
                      <i className="fa-solid fa-trash"></i> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h2>{editingProduct ? "Edit Product" : "Add New Product"}</h2>

            <div className="form-group">
              <label>Product Name *</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. iPhone 16 Pro Max"
              />
            </div>

            <div className="form-group">
              <label>Image URL *</label>
              <input
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
              {form.image && (
                <div className="image-preview-container">
                  <img src={form.image} alt="Preview" onError={(e) => e.target.style.display = "none"} />
                </div>
              )}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div className="form-group">
                <label>Price (₹) *</label>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="999"
                />
              </div>
              <div className="form-group">
                <label>Stock</label>
                <input
                  type="number"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  placeholder="25"
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div className="form-group">
                <label>Category *</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                  {categories.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Brand *</label>
                <input
                  value={form.brand}
                  onChange={(e) => setForm({ ...form, brand: e.target.value })}
                  placeholder="e.g. Apple"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Rating (0 - 5)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={form.rating}
                onChange={(e) => setForm({ ...form, rating: e.target.value })}
                placeholder="4.5"
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Product description..."
              />
            </div>

            <div className="modal-actions">
              <button className="modal-cancel-btn" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button className="modal-save-btn" onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : editingProduct ? "Update Product" : "Add Product"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="admin-modal-overlay" onClick={() => setShowDeleteConfirm(null)}>
          <div className="admin-modal admin-confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-icon">
              <i className="fa-solid fa-trash-can"></i>
            </div>
            <h2>Delete Product?</h2>
            <p>
              Are you sure you want to delete <strong>"{showDeleteConfirm.name}"</strong>?
              This action cannot be undone.
            </p>
            <div className="modal-actions">
              <button className="modal-cancel-btn" onClick={() => setShowDeleteConfirm(null)}>
                Cancel
              </button>
              <button
                className="modal-save-btn"
                style={{ background: "var(--admin-danger)" }}
                onClick={() => handleDelete(showDeleteConfirm._id)}
              >
                Delete Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminProducts;
