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
  Plus,
  Trash,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "../../slice/auth.slice";
import { deleteStore, updateStore } from "../../slice/store.slice";
import { toast } from "react-toastify";
import Loader from "../ui/Loader";
import { useNavigate } from "react-router-dom";
import { deleteProduct, getProductsForAdmin } from "../../slice/product.slice";

// Helper to get default store values
const getDefaultStoreValues = (store) => ({
  storeName: store?.storeName || "",
  description: store?.description || "",
  storeImage: store?.storeImage || "",
  type: store?.type || "",
});

const ManageStore = () => {
  const dispatch = useDispatch();
  const {
    products,
    loading: productLoding,
    success: productSuccess,
    error: productError,
    totalProducts,
    reveniue,
  } = useSelector((state) => state.product);
  const { store, error, success, loading } = useSelector(
    (state) => state.store
  );
  const { user } = useSelector((state) => state.auth);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageChanged, setImageChanged] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(5);
  const navigate = useNavigate();

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

  useEffect(() => {
    if (store?._id) {
      dispatch(
        getProductsForAdmin({
          storeId: store?._id,
          page: currentPage,
          limit: pageLimit,
        })
      );
    }
  }, [store?._id, currentPage, pageLimit]);

  const handleDelete = (productId) => {
    dispatch(
      deleteProduct({
        storeId: store?._id,
        productId,
        callBack: () =>
          dispatch(
            getProductsForAdmin({
              storeId: store?._id,
              page: currentPage,
              limit: pageLimit,
            })
          ),
      })
    );
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleLimitChange = (newLimit) => {
    setPageLimit(newLimit);
    setCurrentPage(1); // Reset to first page when changing limit
  };

  // Calculate pagination info
  const totalPages = Math.ceil(totalProducts / pageLimit);
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  useEffect(() => {
    if (productError) {
      toast.error(productError);
    } else if (productSuccess.bool && productSuccess.type === "delete") {
      toast.success("Product deleted successfully");
    }
  }, [productError, productSuccess]);

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
            <p className="text-2xl font-bold text-blue-600">{totalProducts}</p>
            <p className="text-sm text-gray-600">Products</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">0</p>
            <p className="text-sm text-gray-600">Customers</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <DollarSign className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-600">${reveniue}</p>
            <p className="text-sm text-gray-600">Revenue</p>
          </div>
        </div>
      </div>

      {/* Store Information Edit */}
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Store Information</h3>
        {loading?.bool ? (
          <Loader message={loading.message} />
        ) : (
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
        )}
      </div>

      {/* Product Management */}
      <div className="bg-white rounded-lg p-6 shadow-sm border w-full">
        <div className="flex justify-between">
          <h3 className="text-lg font-semibold mb-4">Product Management</h3>
          <button
            onClick={() => navigate("/addproduct")}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition font-medium"
          >
            <Plus className="h-5 w-5" />
            Add Product
          </button>
        </div>
        {productLoding.bool ? (
          <Loader message={productLoding?.message} />
        ) : (
          <div className="divide-y divide-gray-100">
            {products && products.length > 0 ? (
              products.map((product) => (
                <div
                  key={product._id}
                  className="flex items-center gap-4 py-4 hover:bg-gray-50 transition cursor-pointer group"
                  onClick={() => navigate(`/product/${product._id}`)}
                >
                  <img
                    src={
                      product.productImage || "/public/products/product-1.jpg"
                    }
                    alt={product.title}
                    className="w-16 h-16 rounded-lg object-cover border border-gray-200 shadow-sm group-hover:scale-105 transition"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-800 truncate max-w-xs">
                        {product.title}
                      </span>
                      <span className="text-xs px-2 py-1 rounded bg-gray-200 text-gray-600 capitalize">
                        {product.type}
                      </span>
                    </div>
                    <div className="text-gray-500 text-sm truncate max-w-xs">
                      {product.desc}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-green-600 font-bold text-lg">
                      ${product.price}
                    </span>
                    <div className="flex gap-2">
                      <button
                        className="px-2 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200 font-medium flex justify-center"
                        style={{
                          alignItems: "center",
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(product?._id);
                        }}
                      >
                        <Trash size={"16px"} /> <span>Delete </span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-400 text-center py-8">
                No products found.
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        {!productLoding.bool && products && products.length > 0 && (
          <div className="flex justify-end items-center gap-3 mt-4 pt-4 border-t border-gray-200">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={!hasPrevPage}
              className={`p-2 rounded-lg transition ${
                hasPrevPage
                  ? "text-gray-600 hover:bg-gray-100"
                  : "text-gray-500 cursor-not-allowed"
              }`}
            >
              <ChevronDown className="h-4 w-4 rotate-90" />
            </button>

            <select
              value={pageLimit}
              onChange={(e) => handleLimitChange(Number(e.target.value))}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
            </select>

            {/* <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span> */}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!hasNextPage}
              className={`p-2 rounded-lg transition ${
                hasNextPage
                  ? "text-gray-600 hover:bg-gray-100"
                  : "text-gray-300 cursor-not-allowed"
              }`}
            >
              <ChevronDown className="h-4 w-4 -rotate-90" />
            </button>
          </div>
        )}
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
