"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useCart } from "../app/CartContext"; // Adjust path if needed
import Link from "next/link";
import AddToCartButton from "./AddToCartButton"; // Re-using your Island component!

// --- Interfaces ---
interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  thumbnail: string;
  rating: number;
  brand: string;
  category: string;
  images: string[];
}

interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export default function Home() {
  // --- State Management ---
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 🧠 LEARNING POINT: We need 3 separate pieces of state for the UI
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isViewAll, setIsViewAll] = useState(false); // Controls the "Browse All" button

  const router = useRouter();
  const { cart } = useCart();

  // --- Data Fetching ---
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // 🧠 LEARNING POINT: Fetching 100 items instead of 3
        // We fetch everything upfront so the Search Bar can search the ENTIRE store instantly,
        // not just the 3 items visible on the screen.
        const response = await axios.get<ProductsResponse>(
          "https://dummyjson.com/products?limit=100"
        );
        setProducts(response.data.products);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // --- Derived State: Categories ---
  // 🧠 LEARNING POINT: Extracting Unique Categories
  // 1. .map() extracts just the category names: ["beauty", "beauty", "furniture"...]
  // 2. new Set() removes duplicates: {"beauty", "furniture"}
  // 3. ["All", ...] adds "All" as the first option manually.
  const categories = [
    "All",
    ...Array.from(new Set(products.map((p) => p.category))),
  ];

  // --- Derived State: Filtering Logic ---
  // 🧠 LEARNING POINT: Double Filter
  // This runs automatically every time you type or click a category.
  // We do NOT use setProducts() here because we don't want to delete data, just hide it.
  const filteredProducts = products.filter((product) => {
    // Check 1: Category (If "All" is selected, everything passes)
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;

    // Check 2: Search Text (Case insensitive)
    const matchesSearch = product.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    // Result: Must match BOTH conditions
    return matchesCategory && matchesSearch;
  });

  // --- Derived State: Slicing Logic ---
  // 🧠 LEARNING POINT: Conditional Slicing
  // If the user clicked "View All" OR if they are searching/filtering, show everything.
  // Otherwise, chop the array and only show the top 3.
  const visibleProducts =
    isViewAll || searchQuery || selectedCategory !== "All"
      ? filteredProducts
      : filteredProducts.slice(0, 3);

  const handleProductClick = (productId: number) => {
    router.push(`/products/${productId}`);
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      {/* Header */}
      <header
        style={{
          padding: "20px",
          borderBottom: "1px solid #e9ecef",
          backgroundColor: "white",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h1 style={{ margin: 0, color: "#0070f3" }}>🛍️ ShopEasy</h1>
          <nav>
            <Link
              href="/"
              style={{
                marginRight: "20px",
                textDecoration: "none",
                color: "#495057",
              }}
            >
              Home
            </Link>
            <Link
              href="/cart"
              style={{
                textDecoration: "none",
                color: "#495057",
                fontWeight: "bold",
              }}
            >
              🛒 Cart ({cart.totals.totalItems})
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ padding: "40px 20px", textAlign: "center" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h2
            style={{
              fontSize: "2.5rem",
              marginBottom: "1rem",
              color: "#212529",
            }}
          >
            Welcome to ShopEasy
          </h2>
          <p
            style={{
              fontSize: "1.2rem",
              color: "#6c757d",
              marginBottom: "2rem",
            }}
          >
            Your one-stop shop for amazing products
          </p>

          {/* Category Filter Buttons */}
          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
              justifyContent: "center",
              marginBottom: "30px",
            }}
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                style={{
                  padding: "10px 20px",
                  borderRadius: "30px",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: "bold",
                  fontSize: "0.9rem",
                  transition: "all 0.2s ease",
                  // Visual Logic: Blue if selected, Gray if not
                  backgroundColor:
                    selectedCategory === category ? "#0070f3" : "#e9ecef",
                  color: selectedCategory === category ? "white" : "#333",
                  boxShadow:
                    selectedCategory === category
                      ? "0 4px 10px rgba(0,112,243,0.3)"
                      : "none",
                  textTransform: "capitalize",
                }}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div style={{ margin: "30px auto", maxWidth: "500px" }}>
            <input
              type="text"
              placeholder="🔍 Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "15px 25px",
                fontSize: "1.1rem",
                border: "1px solid #ddd",
                borderRadius: "50px",
                boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
                outline: "none",
                transition: "box-shadow 0.3s ease",
              }}
              onFocus={(e) =>
                (e.target.style.boxShadow = "0 4px 20px rgba(0,112,243,0.2)")
              }
              onBlur={(e) =>
                (e.target.style.boxShadow = "0 4px 15px rgba(0,0,0,0.05)")
              }
            />
          </div>

          {/* Product Grid Section */}
          <section style={{ marginTop: "50px" }}>
            <h3
              style={{
                fontSize: "2rem",
                marginBottom: "2rem",
                color: "#343a40",
              }}
            >
              {searchQuery
                ? `Searching for "${searchQuery}"`
                : "Featured Products"}
            </h3>

            {loading && (
              <div style={{ padding: "40px" }}>
                <p style={{ fontSize: "1.1rem", color: "#6c757d" }}>
                  🔄 Loading products...
                </p>
              </div>
            )}

            {error && (
              <div style={{ padding: "40px", color: "#dc3545" }}>
                <p>❌ Error: {error}</p>
              </div>
            )}

            {/* Empty State Check */}
            {!loading && !error && filteredProducts.length === 0 && (
              <div style={{ padding: "40px", color: "#6c757d" }}>
                <p>No products found matching "{searchQuery}"</p>
              </div>
            )}

            {!loading && !error && filteredProducts.length > 0 && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: "30px",
                  margin: "40px auto",
                }}
              >
                {/* 🧠 LEARNING POINT: Map over visibleProducts (The Sliced List) */}
                {visibleProducts.map((product) => (
                  <div
                    key={product.id}
                    style={{
                      border: "1px solid #dee2e6",
                      borderRadius: "12px",
                      padding: "20px",
                      textAlign: "center",
                      backgroundColor: "white",
                      position: "relative",
                      transition: "all 0.3s ease",
                    }}
                  >
                    {/* Clickable Area (Navigates to Detail Page) */}
                    <div
                      onClick={() => handleProductClick(product.id)}
                      style={{ cursor: "pointer" }}
                    >
                      <div
                        style={{
                          width: "100%",
                          height: "200px",
                          overflow: "hidden",
                          borderRadius: "8px",
                          marginBottom: "15px",
                        }}
                      >
                        <img
                          src={product.thumbnail}
                          alt={product.title}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                      <h4
                        style={{
                          margin: "10px 0",
                          fontSize: "1.2rem",
                          fontWeight: "600",
                          color: "#212529",
                        }}
                      >
                        {product.title}
                      </h4>
                      <p
                        style={{
                          fontSize: "1.3rem",
                          fontWeight: "bold",
                          color: "#0070f3",
                          margin: "10px 0",
                        }}
                      >
                        ${product.price}
                      </p>
                    </div>

                    {/* Interactive Button Component */}
                    <div style={{ marginTop: "15px" }}>
                      <AddToCartButton product={product} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Browse All Button */}
          {/* Only show this if we are NOT searching and NOT viewing all yet */}
          {!isViewAll && !searchQuery && selectedCategory === "All" && !loading && (
            <button
              style={{
                padding: "15px 30px",
                background: "#0070f3",
                color: "white",
                border: "none",
                borderRadius: "8px",
                marginTop: "30px",
                cursor: "pointer",
                fontSize: "1.1rem",
                fontWeight: "600",
              }}
              onClick={() => setIsViewAll(true)}
            >
              Browse All Products
            </button>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer
        style={{
          padding: "30px 20px",
          textAlign: "center",
          borderTop: "1px solid #e9ecef",
          marginTop: "60px",
          backgroundColor: "white",
          color: "#6c757d",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <p>© 2024 ShopEasy. Built with Next.js & TypeScript</p>
        </div>
      </footer>
    </div>
  );
}