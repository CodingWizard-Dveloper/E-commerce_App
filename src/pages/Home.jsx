import { Link } from "react-router-dom";
import { ShoppingBag, Star } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getAllProducts } from "../slice/globalProduct.slice";
import Loader from "../components/ui/Loader";
import { toast } from "react-toastify";

export default function Home() {
  const { products, loading, error } = useSelector(
    (state) => state.globalProducts
  );
  const dispatch = useDispatch();
  const limit = 4;

  const category = [
    { name: "Electronics", img: "/categories/electronics.jpg" },
    { name: "Fashion", img: "/categories/fashion.jpg" },
    { name: "Home & Living", img: "/categories/home.jpg" },
    { name: "Cosmetics", img: "/categories/cosmetics.jpg" },
    { name: "Books", img: "/categories/books.jpg" },
    { name: "Sports", img: "/categories/sports.jpg" },
  ];

  useEffect(() => {
    dispatch(getAllProducts({ limit }));
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

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
        <div className="flex justify-between align-middle">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Recent Products
          </h2>
          <h6 className="text-red-500">
            <Link to={"/products"}> See All</Link>
          </h6>
        </div>
        {loading.bool ? (
          <Loader />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <>
              {(products ?? []).map((product) => (
                <div
                  key={product._id}
                  className="rounded-2xl bg-white shadow hover:shadow-lg transition p-4 flex flex-col"
                >
                  <img
                    src={product.productImage}
                    alt={`${product.title}`}
                    className="h-40 w-full object-cover bg-center rounded-lg"
                  />
                  <h3 className="mt-4 font-semibold text-gray-900">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">
                    {product.desc || "Short product description goes here."}
                  </p>
                  <div className="mt-2 flex items-center gap-1 text-yellow-500">
                    <Star className="h-4 w-4 fill-yellow-500" />{" "}
                    {product.rating || 0.0}
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
            </>
          </div>
        )}
      </section>
    </div>
  );
}
