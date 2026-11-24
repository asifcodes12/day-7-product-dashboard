
import "./App.css";
import { useEffect, useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { getProducts } from "./services/productApi";
import type { Product } from "./types/product";

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOption, setSortOption] = useState("default");

  // Add Product Form
  const [showAddForm, setShowAddForm] = useState(false);

  const [newProduct, setNewProduct] = useState({
    title: "",
    category: "",
    price: "",
    stock: "",
    thumbnail: "",
  });

  // Fetch Products from API
  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        setError("");

        const data = await getProducts();
        setProducts(data.products);
      } catch {
        setError("Products load nahi ho sake. Dobara try karo.");
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  // Get Categories
  const categories = [
    ...new Set(products.map((product) => product.category)),
  ];

  // Search and Category Filter
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title
      .toLowerCase()
      .includes(searchTerm.trim().toLowerCase());

    const matchesCategory =
      selectedCategory === "all" ||
      product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Sort Products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOption) {
      case "price-low":
        return a.price - b.price;

      case "price-high":
        return b.price - a.price;

      case "name-az":
        return a.title.localeCompare(b.title);

      case "name-za":
        return b.title.localeCompare(a.title);

      default:
        return 0;
    }
  });

  // Dashboard Statistics
  const totalCategories = categories.length;

  const averagePrice =
    products.length > 0
      ? products.reduce(
          (total, product) => total + product.price,
          0
        ) / products.length
      : 0;

  // Handle Input Changes
  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    setNewProduct((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  // Add New Product
  function handleAddProduct(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const product = {
      id: Date.now(),
      title: newProduct.title.trim(),
      category: newProduct.category.trim().toLowerCase(),
      price: Number(newProduct.price),
      stock: Number(newProduct.stock),
      rating: 0,
      thumbnail:
        newProduct.thumbnail.trim() ||
        "https://placehold.co/300x200?text=New+Product",
    } as Product;

    setProducts((previous) => [product, ...previous]);

    setNewProduct({
      title: "",
      category: "",
      price: "",
      stock: "",
      thumbnail: "",
    });

    setShowAddForm(false);
    setSelectedCategory("all");
    setSearchTerm("");
    setSortOption("default");
  }

  // Delete Product
  function handleDeleteProduct(productId: number) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (confirmDelete) {
      setProducts((previous) =>
        previous.filter((product) => product.id !== productId)
      );
    }
  }

  return (
    <div className="app">

      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="logo">
          Peter<span>Store.</span>
        </h2>

        <p className="menu-title">MAIN MENU</p>

        <nav>
          <a className="active" href="#">▦ Dashboard</a>
          <a href="#">▣ Products</a>
          <a href="#">▤ Categories</a>
          <a href="#">▥ Inventory</a>
          <a href="#">▧ Orders</a>
        </nav>

        <p className="menu-title">OTHER</p>

        <nav>
          <a href="#">⚙ Settings</a>
          <a href="#">❔ Help Center</a>
        </nav>

        <div className="sidebar-bottom">
          <div className="avatar">PP</div>
          <div>
            <strong>Peter Parker</strong>
            <small>Store Admin</small>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">

        {/* Topbar */}
        <header className="topbar">
          <div>
            <h3>Inventory Management</h3>
            <p>Welcome back! Here's your store overview.</p>
          </div>

          <div className="top-actions">
            <button className="notification">♧</button>
            <div className="avatar">PP</div>
          </div>
        </header>

        <section className="dashboard">

          {/* Page Heading */}
          <div className="page-heading">
            <div>
              <h1>Dashboard</h1>
              <p>Monitor your products and inventory.</p>
            </div>

            <button
              className="add-btn"
              onClick={() => setShowAddForm(true)}
            >
              + Add Product
            </button>
          </div>

          {/* Statistics */}
          <div className="stats-grid">

            <div className="stat-card">
              <span>Total Products</span>
              <h2>{loading ? "--" : products.length}</h2>
              <small>Products in store</small>
            </div>

            <div className="stat-card">
              <span>Total Categories</span>
              <h2>{loading ? "--" : totalCategories}</h2>
              <small>Product categories</small>
            </div>

            <div className="stat-card">
              <span>Average Price</span>
              <h2>
                {loading ? "--" : `$${averagePrice.toFixed(2)}`}
              </h2>
              <small>Across all products</small>
            </div>

            <div className="stat-card">
              <span>Inventory Status</span>
              <h2>
                {loading ? "Loading" : error ? "Error" : "Active"}
              </h2>
              <small>API connection status</small>
            </div>

          </div>

          {/* Products Section */}
          <section className="products-section">

            <div className="products-heading">
              <div>
                <h2>Products Overview</h2>
                <p>Your store products from DummyJSON API.</p>
              </div>
            </div>

            {/* Search, Category and Sorting */}
            <div
              style={{
                display: "flex",
                gap: "12px",
                flexWrap: "wrap",
                marginTop: "20px",
                marginBottom: "20px",
              }}
            >

              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: "100%",
                  maxWidth: "300px",
                  padding: "12px",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  fontSize: "15px",
                  boxSizing: "border-box",
                }}
              />

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={filterStyle}
              >
                <option value="all">All Categories</option>

                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                style={filterStyle}
              >
                <option value="default">Default Order</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name-az">Name: A to Z</option>
                <option value="name-za">Name: Z to A</option>
              </select>

            </div>

            {/* Loading */}
            {loading && (
              <div className="empty-products">
                <h3>Loading products...</h3>
              </div>
            )}

            {/* Error */}
            {!loading && error && (
              <div className="empty-products">
                <h3>{error}</h3>

                <button
                  className="add-btn"
                  onClick={() => window.location.reload()}
                >
                  Retry
                </button>
              </div>
            )}

            {/* No Products */}
            {!loading && !error && products.length === 0 && (
              <div className="empty-products">
                <h3>No products available</h3>
              </div>
            )}

            {/* No Search Results */}
            {!loading &&
              !error &&
              products.length > 0 &&
              sortedProducts.length === 0 && (
                <div className="empty-products">
                  <h3>No matching products found</h3>
                  <p>Try another search or category.</p>
                </div>
              )}

            {/* Products Grid */}
            {!loading && !error && sortedProducts.length > 0 && (
              <>
                <p>Showing {sortedProducts.length} products</p>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(220px, 1fr))",
                    gap: "20px",
                    marginTop: "10px",
                    alignItems: "stretch",
                  }}
                >

                  {sortedProducts.map((product) => (
                    <div
                      key={product.id}
                      style={{
                        background: "#fff",
                        borderRadius: "12px",
                        padding: "15px",
                        border: "1px solid #e5e7eb",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                        display: "flex",
                        flexDirection: "column",
                        minWidth: 0,
                        boxSizing: "border-box",
                      }}
                    >

                      {/* Product Image */}
                      <img
                        src={product.thumbnail}
                        alt={product.title}
                        style={{
                          width: "100%",
                          height: "150px",
                          objectFit: "contain",
                          flexShrink: 0,
                        }}
                      />

                      {/* Product Details */}
                      <h3
                        style={{
                          minHeight: "48px",
                          lineHeight: "24px",
                          marginBottom: "8px",
                        }}
                      >
                        {product.title}
                      </h3>

                      <p style={{ margin: "5px 0", color: "#777" }}>
                        {product.category}
                      </p>

                      <h3 style={{ margin: "8px 0" }}>
                        ${product.price.toFixed(2)}
                      </h3>

                      <p style={{ margin: "5px 0" }}>
                        Stock: {product.stock}
                      </p>

                      <p style={{ margin: "5px 0" }}>
                        Rating: ⭐ {product.rating}
                      </p>

                      {/* Delete Button */}
                      <button
                        onClick={() =>
                          handleDeleteProduct(product.id)
                        }
                        style={{
                          width: "100%",
                          padding: "11px",
                          marginTop: "auto",
                          background: "#ef4444",
                          color: "white",
                          border: "none",
                          borderRadius: "8px",
                          cursor: "pointer",
                          fontWeight: "bold",
                        }}
                      >
                        Delete Product
                      </button>

                    </div>
                  ))}

                </div>
              </>
            )}

          </section>
        </section>
      </main>

      {/* Add Product Modal */}
      {showAddForm && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "20px",
            zIndex: 1000,
          }}
        >

          <div
            style={{
              background: "white",
              width: "100%",
              maxWidth: "450px",
              padding: "28px",
              borderRadius: "14px",
              boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >

            <h2 style={{ marginTop: 0 }}>Add New Product</h2>
            <p>Enter your product details below.</p>

            <form
              onSubmit={handleAddProduct}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "14px",
              }}
            >

              <input
                name="title"
                placeholder="Product Name"
                value={newProduct.title}
                onChange={handleInputChange}
                required
                style={formInputStyle}
              />

              <input
                name="category"
                placeholder="Category (e.g. beauty)"
                value={newProduct.category}
                onChange={handleInputChange}
                required
                style={formInputStyle}
              />

              <input
                name="price"
                type="number"
                placeholder="Price"
                min="0.01"
                step="0.01"
                value={newProduct.price}
                onChange={handleInputChange}
                required
                style={formInputStyle}
              />

              <input
                name="stock"
                type="number"
                placeholder="Stock Quantity"
                min="0"
                step="1"
                value={newProduct.stock}
                onChange={handleInputChange}
                required
                style={formInputStyle}
              />

              <input
                name="thumbnail"
                type="url"
                placeholder="Product Image URL (optional)"
                value={newProduct.thumbnail}
                onChange={handleInputChange}
                style={formInputStyle}
              />

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  marginTop: "8px",
                }}
              >

                <button
                  type="submit"
                  className="add-btn"
                  style={{ flex: 1 }}
                >
                  Save Product
                </button>

                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  style={{
                    flex: 1,
                    padding: "12px",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    background: "#f3f4f6",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>

              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

// Reusable Styles
const formInputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px",
  border: "1px solid #ddd",
  borderRadius: "8px",
  fontSize: "15px",
  boxSizing: "border-box",
};

const filterStyle: React.CSSProperties = {
  padding: "12px",
  border: "1px solid #ddd",
  borderRadius: "8px",
  fontSize: "15px",
  cursor: "pointer",
};

export default App;
