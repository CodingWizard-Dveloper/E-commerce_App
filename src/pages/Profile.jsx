import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Settings,
  LogOut,
  Star,
  Camera,
  X,
  User2Icon,
  Trash2,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  changeUser,
  checkAuth,
  deleteStore,
  logout,
} from "../slice/auth.slice";
import { useParams } from "react-router-dom";

export default function Profile() {
  const { tab } = useParams();
  const [activeTab, setActiveTab] = useState(tab ?? "orders");
  const { user: defaultUser, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [selectedFile, setSelectedFile] = useState(null);
  const [imageChanged, setImageChanged] = useState(false);
  const [user, setUser] = useState({
    name: defaultUser?.userName,
    email: defaultUser?.email,
    avatar: defaultUser?.avatar,
    joined: defaultUser?.createdAt,
  });
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      name: defaultUser?.userName || "",
      email: defaultUser?.email || "",
      avatar: defaultUser?.avatar || "",
    },
  });
  const watchedValues = watch();
  // Check if form is modified (including image changes)
  const isFormModified = isDirty || imageChanged;

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

  const userTabs = [
    { id: "orders", label: "Orders" },
    { id: "wishlist", label: "Wishlist" },
    { id: "settings", label: "Settings" },
  ];

  if (defaultUser?.store) {
    userTabs.splice(2, 0, { id: "ManageStore", label: "Manage store" });
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file); // Store the actual file
      setImageChanged(true); // Mark as changed
      const imageUrl = URL.createObjectURL(file);
      setValue("avatar", imageUrl);
      setUser((prev) => ({ ...prev, avatar: imageUrl }));
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null); // Clear the file
    setImageChanged(true); // Mark as changed
    setValue("avatar", "");
    setUser((prev) => ({ ...prev, avatar: "" }));
  };

  const onSubmit = (data) => {
    const formData = new FormData();

    formData.append("userName", data.name);
    formData.append("email", data.email);

    // Only append the file if a new one was selected
    formData.append("profileImage", selectedFile ?? user?.avatar);

    dispatch(
      changeUser({
        data: formData,
        callBack: () => {
          dispatch(checkAuth());
          // Reset the image changed state after successful update
          setImageChanged(false);
        },
      })
    );
  };

  return (
    <div className="bg-gray-100/50 min-h-screen">
      {/* Profile Header */}
      <section className="relative bg-gray-200/50 backdrop-blur-sm">
        {error && <h1 className="block text-red-500 mx-50 -py-3"> {error} </h1>}
        <div className="mx-auto max-w-7xl px-6 py-8 flex flex-col sm:flex-row gap-6 items-center">
          {/* Avatar */}
          <div className="relative group -top-4 w-28 h-28">
            {watchedValues?.avatar ? (
              <img
                src={watchedValues.avatar || "/profile/default-avatar.png"}
                className="h-28 w-28 rounded-full object-cover border-4 border-indigo-600 shadow"
                loading="lazy"
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
            {watchedValues.avatar && (
              <button
                onClick={handleRemoveImage}
                className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-red-600 text-white text-xs px-2 py-1 rounded-lg shadow hover:bg-red-700 transition"
              >
                <X className="h-3 w-3" /> Remove
              </button>
            )}
          </div>

          {/* Editable Fields */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-3 items-center sm:items-start"
          >
            <div className="flex flex-col">
              <input
                type="text"
                {...register("name", {
                  required: "Name is required",
                  minLength: {
                    value: 2,
                    message: "Name must be at least 2 characters",
                  },
                })}
                className={`rounded-lg border px-3 py-2 w-64 ${
                  errors.name ? "border-red-500" : "border-gray-500"
                }`}
                placeholder="Enter your name"
              />
              {errors.name && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.name.message}
                </span>
              )}
            </div>

            <div className="flex flex-col">
              <input
                type="email"
                disabled
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                className={`rounded-lg border px-3 py-2 w-64 bg-gray-100 cursor-not-allowed ${
                  errors.email ? "border-red-500" : "border-gray-500"
                }`}
                placeholder="Enter your email"
              />
              {errors.email && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </span>
              )}
            </div>

            <p className="text-sm text-gray-500">Joined {formattedDate}</p>

            {/* Show save button only if modified */}
            {isFormModified && (
              <button
                type="submit"
                className="mt-1 px-3 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
              >
                Save
              </button>
            )}
          </form>
        </div>
      </section>

      {/* Tabs */}
      <section className="mx-auto max-w-7xl mt-6 flex">
        <div className="flex space-x-2 border-b w-full">
          {userTabs.map((tab) => (
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
                    loading="lazy"
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
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition w-fit cursor-pointer"
              onClick={() => dispatch(logout())}
            >
              <LogOut className="h-5 w-5" /> Logout
            </button>
          </div>
        )}
        {activeTab === "ManageStore" && (
          <>
            <div className="flex flex-col gap-4">
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition w-fit cursor-pointer"
                onClick={() => {
                  if (
                    window.confirm(
                      "Do you want to delete your store this action is reversible? "
                    )
                  ) {
                    dispatch(
                      deleteStore({
                        storeId: defaultUser?.store?._id,
                        callBack: () => dispatch(checkAuth()),
                      })
                    );
                  }
                }}
              >
                <Trash2 className="h-5 w-5" /> Delete Your store
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
