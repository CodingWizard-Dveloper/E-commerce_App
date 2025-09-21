import { Link } from "react-router-dom";
import { ShoppingBag, Star } from "lucide-react";

export default function Home() {
  const category = [
    { name: "Electronics", img: "/categories/electronics.jpg" },
    { name: "Fashion", img: "/categories/fashion.jpg" },
    { name: "Home & Living", img: "/categories/home.jpg" },
    { name: "Cosmetics", img: "/categories/cosmetics.jpg" },
    { name: "Books", img: "/categories/books.jpg" },
    { name: "Sports", img: "/categories/sports.jpg" },
  ];

  const products = [
    {
      id: 1,
      name: "BoAt airdrop 131",
      img: "/products/product-1.jpg",
      rating: "4.2",
      price: "25.00",
    },
    {
      id: 2,
      name: "Elixer perfume",
      img: "/products/product-2.jpg",
      rating: "4.0",
      price: "30.00",
    },
    {
      id: 3,
      name: "It starts with us",
      img: "/products/product-3.jpg",
      rating: "4.5",
      price: "40.00",
    },
    {
      id: 4,
      name: "CA pro 1000",
      img: "/products/product-4.jpg",
      rating: "4.8",
      price: "50.00",
    },
  ];

  return (
    <div className="bg-gray-100/50 min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gray-200/50 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6 py-16 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Welcome to <span className="text-indigo-600">Click Shop</span>
          </h1>
          <p className="mt-4 text-lg text-gray-700 max-w-2xl mx-auto">
            Discover the latest collections with smooth shopping experience.
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <Link
              to="/products"
              className="rounded-lg bg-indigo-600 px-6 py-3 text-white font-semibold shadow hover:bg-indigo-700 transition"
            >
              Shop Now
            </Link>
            <Link
              to="/deals"
              className="rounded-lg bg-gray-800 px-6 py-3 text-white font-semibold shadow hover:bg-gray-900 transition"
            >
              View Deals
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Shop by Category
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {category.map((cat) => {
            const cathref = cat?.name?.split(" ");
            const catlength = cathref.length;
            return (
              <Link
                key={cat.name}
                to={`/category/${cathref[catlength - 1]?.toLowerCase()}`}
                className="group relative rounded-2xl overflow-hidden shadow hover:shadow-lg transition"
              >
                <img
                  src={cat.img}
                  alt={cat.name}
                  className="h-56 w-full object-cover group-hover:scale-105 transition"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="text-lg font-semibold text-white">
                    {cat.name}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Products */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Featured Products
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="rounded-2xl bg-white shadow hover:shadow-lg transition p-4 flex flex-col"
            >
              <img
                src={product.img}
                alt={`${product.name}`}
                className="h-40 w-full object-cover bg-center rounded-lg"
              />
              <h3 className="mt-4 font-semibold text-gray-900">
                {product.name}
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                {product.desc || "Short product description goes here."}
              </p>
              <div className="mt-2 flex items-center gap-1 text-yellow-500">
                <Star className="h-4 w-4 fill-yellow-500" /> {product.rating}
              </div>
              <div className="mt-auto flex items-center justify-between pt-4">
                <span className="font-bold text-indigo-600">
                  $ {product.price}
                </span>
                <button className="flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-2 text-white text-sm hover:bg-indigo-700 transition">
                  <ShoppingBag className="h-4 w-4" /> Add
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
