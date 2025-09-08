import { useState } from "react";
import { Settings, LogOut, Star, Camera, X, User2Icon } from "lucide-react";
import { useSelector } from "react-redux";

export default function Profile() {
  const [activeTab, setActiveTab] = useState("orders");

  const { user: defaultUser } = useSelector((state) => state.auth);

  const [user, setUser] = useState({
    name: defaultUser?.userName,
    email: defaultUser?.email,
    avatar: defaultUser?.avatar,
    joined: defaultUser?.createdAt,
  });

  const formattedDate = new Date(user.joined).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const recentOrders = [
    {
      id: 1,
      name: "Wireless Earbuds",
      img: "/products/product-1.jpg",
      price: "25.00",
      rating: "4.5",
    },
    {
      id: 2,
      name: "Men’s Watch",
      img: "/products/product-2.jpg",
      price: "45.00",
      rating: "4.2",
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setUser((prev) => ({ ...prev, avatar: imageUrl }));
    }
  };

  const handleRemoveImage = () => {
    setUser((prev) => ({ ...prev, avatar: "" }));
  };

  // check if user is modified compared to default
  const isModified =
    user.name !== defaultUser?.userName ||
    user.email !== defaultUser?.email ||
    user.avatar !== defaultUser?.avatar;

  return (
    <div className="bg-gray-100/50 min-h-screen">
      {/* Profile Header */}
      <section className="relative bg-gray-200/50 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6 py-8 flex flex-col sm:flex-row gap-6 items-center">
          {/* Avatar */}
          <div className="relative group -top-4 w-28 h-28">
            {user?.avatar ? (
              <img
                src={user.avatar || "/profile/default-avatar.png"}
                className="h-28 w-28 rounded-full object-cover border-4 border-indigo-600 shadow"
              />
            ) : (
              <>
                <User2Icon
                  className=" rounded-full object-cover border-4 border-indigo-600 shadow inline-block"
                  color="#4f39f6"
                  size={"112px"}
                />
              </>
            )}
            {/* Camera overlay on hover */}
            <label className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer">
              <Camera className="h-6 w-6 text-white" />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
            {/* Remove button */}
            {user.avatar && (
              <button
                onClick={handleRemoveImage}
                className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-red-600 text-white text-xs px-2 py-1 rounded-lg shadow hover:bg-red-700 transition"
              >
                <X className="h-3 w-3" /> Remove
              </button>
            )}
          </div>

          {/* Editable Fields */}
          <div className="flex flex-col gap-3 items-center sm:items-start">
            <input
              type="text"
              name="name"
              value={user.name}
              onChange={handleInputChange}
              className="rounded-lg border px-3 py-2 w-64"
            />
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleInputChange}
              className="rounded-lg border px-3 py-2 w-64"
            />
            <p className="text-sm text-gray-500">Joined {formattedDate}</p>
          </div>
          {/* Show save button only if modified */}
          {isModified && (
            <button className="mt-1 px-3 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition">
              Save
            </button>
          )}
        </div>
      </section>

      {/* Tabs */}
      <section className="mx-auto max-w-7xl px-6 mt-6">
        <div className="flex space-x-2 border-b">
          {[
            { id: "orders", label: "Orders" },
            { id: "wishlist", label: "Wishlist" },
            { id: "settings", label: "Settings" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-2 rounded-t-lg font-semibold transition ${
                activeTab === tab.id
                  ? "bg-white text-indigo-600 shadow border border-b-0"
                  : "bg-gray-200 text-gray-600 hover:bg-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {/* Tab Content */}
      <section className="mx-auto max-w-7xl px-6 py-6 bg-white shadow rounded-b-lg">
        {activeTab === "orders" && (
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
              Recent Orders
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-2xl bg-gray-50 shadow hover:shadow-lg transition p-4 flex flex-col"
                >
                  <img
                    src={order.img}
                    alt={order.name}
                    className="h-40 w-full object-cover rounded-lg"
                  />
                  <h3 className="mt-4 font-semibold text-gray-900">
                    {order.name}
                  </h3>
                  <div className="mt-2 flex items-center gap-1 text-yellow-500">
                    <Star className="h-4 w-4 fill-yellow-500" /> {order.rating}
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-4">
                    <span className="font-bold text-indigo-600">
                      ${order.price}
                    </span>
                    <button className="text-sm text-indigo-600 font-semibold hover:underline">
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "wishlist" && (
          <div className="text-center text-gray-600">
            Your wishlist is empty.
          </div>
        )}

        {activeTab === "settings" && (
          <div className="flex flex-col gap-4">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-900 transition w-fit">
              <Settings className="h-5 w-5" /> Account Settings
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition w-fit">
              <LogOut className="h-5 w-5" /> Logout
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
