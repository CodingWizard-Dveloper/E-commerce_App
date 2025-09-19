import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import {
  Trash2,
  Store,
  Camera,
  X,
  Package,
  Users,
  DollarSign,
  ChevronDown,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "../../slice/auth.slice";
import { deleteStore, updateStore } from "../../slice/store.slice";
import { toast } from "react-toastify";
import Loader from "../ui/Loader";

// Helper to get default store values
const getDefaultStoreValues = (store) => ({
  storeName: store?.storeName || "",
  description: store?.description || "",
  storeImage: store?.storeImage || "",
  type: store?.type || "",
});

const ManageStore = () => {
  const dispatch = useDispatch();
  const { store } = useSelector((state) => state.store);
  const { user } = useSelector((state) => state.auth);
  const { error, success, loading } = useSelector((state) => state.store);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageChanged, setImageChanged] = useState(false);

  // Memoize default values to avoid unnecessary resets
  const defaultValues = useMemo(() => getDefaultStoreValues(store), [store]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues,
  });

  const watchedValues = watch();
  const isFormModified = isDirty || imageChanged;

  const storeTypes = [
    "Electronics",
    "Fashion",
    "Living",
    "Cosmetics",
    "Books",
    "Sports",
  ];

  // Reset form and image state when user changes
  useEffect(() => {
    reset(getDefaultStoreValues(store));
    setSelectedFile(null);
    setImageChanged(false);
    // Clean up any blob URLs
    if (selectedFile && watchedValues.storeImage) {
      URL.revokeObjectURL(watchedValues.storeImage);
    }
    // eslint-disable-next-line
  }, [store]);

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setImageChanged(true);
      const imageUrl = URL.createObjectURL(file);
      setValue("storeImage", imageUrl);
    }
  };

  // Remove selected image
  const handleRemoveImage = () => {
    setSelectedFile(null);
    setImageChanged(true);
    setValue("storeImage", null);
  };

  // Cancel editing and reset form
  const handleCancel = () => {
    if (loading.bool) return;
    reset(getDefaultStoreValues(store));
    setSelectedFile(null);
    setImageChanged(false);
    if (selectedFile && watchedValues.storeImage) {
      URL.revokeObjectURL(watchedValues.storeImage);
    }
  };

  // Submit form data
  const onSubmit = (data) => {
    if (loading.bool) return;
    const formData = new FormData();
    formData.append("ownerId", user?._id);
    formData.append("storeId", store?._id);
    formData.append("storeName", data.storeName);
    formData.append("description", data.description);
    formData.append("type", data.type);
    formData.append("storeImage", selectedFile ?? store?.storeImage);
    dispatch(updateStore({ data: formData }));
  };

  // Delete store
  const deleteStoreById = () => {
    if (
      window.confirm(
        "Are you sure you want to delete your store? This action cannot be undone."
      )
    ) {
      dispatch(
        deleteStore({
          storeId: store?._id,
          callBack: () => dispatch(checkAuth()),
        })
      );
      reset(getDefaultStoreValues(store));
    }
  };

  // Toast notifications
  useEffect(() => {
    if (error) {
      toast.error(error);
    } else if (success.bool && success.type === "update") {
      toast.success("Store updated successfully");
    }
  }, [error, success]);

  if (loading.bool) {
    return <Loader message={loading.message} />;
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Store Overview Stats */}
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h2 className="text-lg font-semibold mb-4 text-indigo-600">
          Store Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <Package className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-600">0</p>
            <p className="text-sm text-gray-600">Products</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">0</p>
            <p className="text-sm text-gray-600">Customers</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <DollarSign className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-600">$0</p>
            <p className="text-sm text-gray-600">Revenue</p>
          </div>
        </div>
      </div>

      {/* Store Information Edit */}
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Store Information</h3>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Store Image Section */}
          <div className="flex flex-col gap-4">
            <label className="text-sm font-medium text-gray-700">
              Store Image
            </label>
            <div className="flex items-end gap-4">
              <div className="relative group w-28 h-28">
                {watchedValues?.storeImage ? (
                  <img
                    src={watchedValues.storeImage}
                    className="h-28 w-28 rounded-lg object-cover border-4 border-indigo-600 shadow"
                    loading="lazy"
                  />
                ) : (
                  <div className="h-28 w-28 rounded-lg bg-gray-100 border-4 border-indigo-600 shadow flex items-center justify-center">
                    <Store className="h-12 w-12 text-gray-400" />
                  </div>
                )}
                {/* Camera overlay on hover */}
                <label className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer">
                  <Camera className="h-6 w-6 text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
              {/* Remove button */}
              {watchedValues.storeImage && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="flex items-center gap-1 bg-red-600 text-white text-sm px-3 py-2 rounded-lg shadow hover:bg-red-700 transition"
                >
                  <X className="h-4 w-4" /> Remove
                </button>
              )}
            </div>
          </div>

          {/* Store Name Field */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-2">
              Store Name
            </label>
            <input
              type="text"
              {...register("storeName", {
                required: "Store name is required",
                minLength: {
                  value: 2,
                  message: "Store name must be at least 2 characters",
                },
              })}
              className={`rounded-lg border px-3 py-2 w-full max-w-md ${
                errors.storeName ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter store name"
            />
            {errors.storeName && (
              <span className="text-red-500 text-xs mt-1">
                {errors.storeName.message}
              </span>
            )}
          </div>

          {/* Store Type Field */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-2">
              Store Type
            </label>
            <div className="flex items-center border rounded-lg px-3 border-gray-300 w-full max-w-md">
              <Store className="w-5 h-5 text-gray-400" />
              <select
                {...register("type", {
                  required: "Store type is required",
                })}
                className="w-full px-3 py-2 focus:outline-none bg-transparent text-gray-700 appearance-none cursor-pointer"
                defaultValue={store?.type || ""}
              >
                <option value="" disabled>
                  Select store type
                </option>
                {storeTypes?.map((type, index) => (
                  <option
                    key={index}
                    value={type.toLowerCase()}
                    className="text-gray-700 bg-white"
                  >
                    {type}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-5 h-5 ml-2 pointer-events-none text-gray-400" />
            </div>
            {errors.type && (
              <span className="text-red-500 text-xs mt-1">
                {errors.type.message}
              </span>
            )}
          </div>

          {/* Description Field */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              {...register("description", {
                required: "Description is required",
                minLength: {
                  value: 10,
                  message: "Description must be at least 10 characters",
                },
              })}
              className={`rounded-lg border px-3 py-2 w-full max-w-md resize-none ${
                errors.description ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Describe your store..."
              rows="4"
            />
            {errors.description && (
              <span className="text-red-500 text-xs mt-1">
                {errors.description.message}
              </span>
            )}
          </div>

          {/* Save and Cancel Buttons */}
          {isFormModified && (
            <div className="flex gap-4">
              <button
                type="submit"
                className={`px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition font-medium ${
                  loading.bool ? "disabled" : ""
                }`}
                disabled={loading.bool}
              >
                Update Store
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition font-medium"
                disabled={loading.bool}
              >
                Cancel
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h4 className="text-lg font-semibold mb-4 text-red-600">Danger Zone</h4>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-red-700 mb-2">
            <strong>Warning:</strong> Deleting your store will permanently
            remove all store data, including products, orders, and customer
            information.
          </p>
          <p className="text-xs text-red-600">This action cannot be undone.</p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition w-fit cursor-pointer"
          onClick={deleteStoreById}
        >
          <Trash2 className="h-5 w-5" /> Delete Store
        </button>
      </div>
    </div>
  );
};

export default ManageStore;
