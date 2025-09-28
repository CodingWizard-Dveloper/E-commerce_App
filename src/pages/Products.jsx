import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts } from "../slice/globalProduct.slice";
import Loader from "../components/ui/Loader";
import { Star, ShoppingBag, Search } from "lucide-react";
import { Link } from "react-router-dom";

const Products = () => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.globalProducts);
  const [search, setSearch] = useState("");
  const limit = 12;
  const types = [
    "Fashion",
    "Electronics",
    "Living",
    "Cosmetics",
    "Books",
    "Sports",
  ];

  useEffect(() => {
    dispatch(getAllProducts({ limit }));
  }, [dispatch, limit]);

  // Group products by type
  const grouped = {};
  (products ?? []).forEach((product) => {
    const type = product.type || "Other";
    if (!grouped[type]) grouped[type] = [];
    grouped[type].push(product);
  });

  // Filter by search
  const filterProducts = (arr) =>
    arr.filter((product) =>
      product.title?.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="bg-gray-100/50 min-h-screen px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">All Products</h1>
          <div className="flex items-center bg-white rounded-lg shadow px-3 py-2 w-72">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full outline-none bg-transparent"
            />
            <Search className="h-5 w-5 text-gray-400 ml-2" />
          </div>
        </div>
        {loading.bool ? (
          <Loader message="Loading products..." />
        ) : (
          <>
            {types.map((type) => {
              const prods = filterProducts(grouped[type.toLowerCase()] || []);
              return (
                <div key={type} className="mb-12  mx-10">
                  <div className="flex justify-between">
                    <h2 className="text-2xl font-semibold mb-4">{type}</h2>
                    <h6 className="mb-4 text-red-600">
                      <Link to={`/products/${type.toLowerCase()}`}>See All</Link>
                    </h6>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {!prods.length ? (
                      <div className="text-center text-gray-500 py-16">
                        No products found.
                      </div>
                    ) : (
                      prods.map((product) => (
                        <div
                          key={product._id}
                          className="rounded-2xl bg-white shadow hover:shadow-lg transition p-4 flex flex-col"
                        >
                          <img
                            src={product.productImage}
                            alt={product.title}
                            className="h-40 w-full object-cover bg-center rounded-lg"
                          />
                          <h3 className="mt-4 font-semibold text-gray-900">
                            {product.title}
                          </h3>
                          <p className="text-gray-600 text-sm mt-1">
                            {product.desc ||
                              "Short product description goes here."}
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
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
};

export default Products;
