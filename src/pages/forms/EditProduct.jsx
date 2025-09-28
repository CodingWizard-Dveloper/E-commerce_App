import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Camera, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../../components/ui/Loader";
import { getProductById } from "../../slice/globalProduct.slice";
import { useCallback } from "react";
import { getProductsForAdmin, updateProduct } from "../../slice/product.slice";

const EditProduct = () => {
  const { productId: id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { product, loading, error } = useSelector(
    (state) => state.globalProducts
  );
  const { error: updateError, success } = useSelector((state) => state.product);
  const type = [
    "electronics",
    "fashion",
    "living",
    "cosmatics",
    "books",
    "sports",
  ];

  const [selectedFile, setSelectedFile] = useState(null);
  const [imageChanged, setImageChanged] = useState(false);

  useEffect(() => {
    dispatch(getProductById({ id }));
  }, [dispatch]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      title: product?.title || "",
      desc: product?.desc || "",
      price: product?.price || "",
      type: product?.type || "",
      productImage: product?.productImage || "",
    },
  });

  const setFormValues = useCallback(() => {
    setValue("title", product.title || "");
    setValue("desc", product.desc || "");
    setValue("price", product.price || "");
    setValue("type", product.type || "");
    setValue("productImage", product.productImage || "");
  }, [product, setValue]);

  useEffect(() => {
    if (product) {
      setFormValues();
    }
  }, [product, setValue]);

  useEffect(() => {
    if (error) toast.error(error);
    if (updateError) toast.error(updateError);
    if (success.bool && success.type === "update") {
      toast.success("Product updated");
      navigate(-1);
    }
  }, [error, success, navigate]);

  const watchedValues = watch();
  const isFormModified = isDirty || imageChanged;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setImageChanged(true);
      const imageUrl = URL.createObjectURL(file);
      setValue("productImage", imageUrl);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setImageChanged(true);
    setValue("productImage", "");
  };

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("desc", data.desc);
    formData.append("price", data.price);
    formData.append("type", data.type);
    formData.append("previousUrl", data.productImage);
    formData.append("productImage", selectedFile);
    console.log("🚀 ~ onSubmit ~ formData:", formData);
    dispatch(
      updateProduct({
        data: formData,
        storeId: product?.storeId,
        productId: product?._id,
        callBack: () =>
          dispatch(
            getProductsForAdmin({
              storeId: product?.storeId,
              page: 1,
              limit: 4,
            })
          ),
      })
    );
  };

  if (loading.bool)
    return (
      <div
        style={{ height: "100lvh", width: "100lvw" }}
        className="flex align-middle justify-center"
      >
        <Loader message={loading.message} />
      </div>
    );
  if (!product)
    return <div className="text-center py-10">Product not found.</div>;

  return (
    <div className="bg-white rounded-lg p-6">
      <h1 className="text-5xl font-semibold mb-4 text-indigo-700">
        Edit Product
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
        {/* --- Section: Product Image --- */}
        <div className="mb-8">
          <div className="flex flex-col gap-4">
            <div className="flex items-end gap-4">
              <div className="relative group w-32 h-32">
                {watchedValues?.productImage ? (
                  <img
                    src={watchedValues.productImage}
                    className="h-32 w-32 rounded-full object-cover border-4 border-indigo-600 shadow"
                    loading="lazy"
                  />
                ) : (
                  <div className="h-32 w-32 rounded-full bg-gray-200 flex items-center justify-center border-4 border-indigo-200">
                    <Camera className="h-10 w-10 text-gray-400" />
                  </div>
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
              </div>
              {/* Remove button */}
              {watchedValues.productImage && (
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
        </div>

        {/* --- Section: Basic Info --- */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-indigo-600 mb-3 border-b pb-1">
            Basic Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Title */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                {...register("title", {
                  required: "Title is required",
                  minLength: {
                    value: 2,
                    message: "Title must be at least 2 characters",
                  },
                })}
                className={`rounded-lg border px-3 py-2 w-full max-w-md ${
                  errors.title ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter product title"
              />
              {errors.title && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.title.message}
                </span>
              )}
            </div>
            {/* Category */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                {...register("type", {
                  required: "Category is required",
                })}
                className={`rounded-lg border px-3 py-2 w-full max-w-md ${
                  errors.type ? "border-red-500" : "border-gray-300"
                }`}
                defaultValue={product?.type || ""}
              >
                <option value="" disabled>
                  Select category
                </option>
                {type.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
              {errors.type && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.type.message}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* --- Section: Description & Price --- */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-indigo-600 mb-3 border-b pb-1">
            Description & Price
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Description */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                {...register("desc", {
                  required: "Description is required",
                  minLength: {
                    value: 5,
                    message: "Description must be at least 5 characters",
                  },
                })}
                className={`rounded-lg border px-3 py-2 w-full max-w-md resize-none ${
                  errors.desc ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter product description"
                rows={3}
              />
              {errors.desc && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.desc.message}
                </span>
              )}
            </div>
            {/* Price */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-2">
                Price ($)
              </label>
              <input
                type="number"
                step="0.01"
                {...register("price", {
                  required: "Price is required",
                  min: { value: 0.01, message: "Price must be greater than 0" },
                })}
                className={`rounded-lg border px-3 py-2 w-full max-w-md ${
                  errors.price ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter price"
              />
              {errors.price && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.price.message}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* --- Section: Inventory (disabled fields) --- */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-indigo-600 mb-3 border-b pb-1">
            Inventory
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Total Products */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-2">
                Total Products
              </label>
              <input
                type="number"
                value={product?.totalProducts || 0}
                disabled
                className="rounded-lg border px-3 py-2 w-full max-w-md bg-gray-100 text-gray-500 cursor-not-allowed"
              />
            </div>
            {/* Item Selled */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-2">
                Item Selled
              </label>
              <input
                type="number"
                value={product?.itemSelled || 0}
                disabled
                className="rounded-lg border px-3 py-2 w-full max-w-md bg-gray-100 text-gray-500 cursor-not-allowed"
              />
            </div>
            {/* Item Remained */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-2">
                Item Remained
              </label>
              <input
                type="number"
                value={product?.itemRemained || 0}
                disabled
                className="rounded-lg border px-3 py-2 w-full max-w-md bg-gray-100 text-gray-500 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* --- Section: Actions (Tabs style) --- */}
        {isFormModified && (
          <div className="flex justify-center mt-8">
            <div className="inline-flex rounded-t-lg shadow overflow-hidden border border-indigo-200">
              <button
                type="submit"
                className="px-8 py-2 font-semibold bg-indigo-600 text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 rounded-t-lg border-r border-indigo-200 hover:bg-indigo-700"
                style={{ zIndex: 2 }}
              >
                Save
              </button>
              <button
                type="button"
                className="px-8 py-2 font-semibold bg-white text-indigo-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-200 rounded-t-lg hover:bg-indigo-50"
                onClick={() => navigate(-1)}
                style={{ zIndex: 1 }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default EditProduct;
