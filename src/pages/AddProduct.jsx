import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  Package,
  FileText,
  DollarSign,
  Upload,
  X,
  Image,
  ChevronDown,
  Hash,
  Tag,
  AlertCircle,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addProduct } from "../slice/product.slice";
import Loader from "../components/ui/Loader";
import { toast } from "react-toastify";

const CreateProduct = () => {
  const { store } = useSelector((state) => state.store);
  const { success, error, loading } = useSelector((state) => state.product);
  const navigate = useNavigate();
  const [dragActive, setDragActive] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const productTypes = [
    "Electronics",
    "Fashion",
    "Living",
    "Cosmetics",
    "Books",
    "Sports",
  ];

  // Drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  // Drop
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (file) => {
    if (file && file.type.startsWith("image/")) {
      setSelectedImage(file);
      setValue("productImage", file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setValue("productImage", null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (imagePreview?.startsWith("blob:")) URL.revokeObjectURL(imagePreview);
  };

  const onSubmit = (data) => {
    const formData = new FormData();

    formData.append("description", data.description);
    formData.append("title", data.title);
    formData.append("price", data.price);
    formData.append("productImage", selectedImage);
    formData.append("totalProducts", data.totalProducts);
    formData.append("type", data.type);
    formData.append("storeId", store?._id);

    dispatch(addProduct(formData));
  };

  useEffect(() => {
    if (success.bool && success.type === "create") {
      toast.success("Product Created");
      navigate(-1)
    } else if (error) {
      toast.error(error);
    }
  }, [success, error]);

  if (loading.bool && loading.full) {
    return <Loader message={loading.message} />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Add Product <Package strokeWidth={2.75} className="inline ml-1" />
        </h2>

        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          {/* Product Image */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Product Image
            </label>
            <div
              className={`relative border-2 border-dashed rounded-xl p-3 transition-all duration-200 cursor-pointer ${
                dragActive
                  ? "border-green-500 bg-green-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInput}
                className="hidden"
              />

              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage();
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-2 bg-gray-100 rounded-full">
                      {dragActive ? (
                        <Upload className="w-8 h-8 text-green-500" />
                      ) : (
                        <Image className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">
                    {dragActive
                      ? "Drop your product image here"
                      : "Drag and drop an image here"}
                  </p>
                  <p className="text-gray-400 text-xs">
                    or click to browse files
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Product Title */}
          <div>
            <label
              className={`block text-sm font-medium ${
                errors.title ? "text-red-600" : "text-gray-600"
              }`}
            >
              Title
            </label>
            <div
              className={`flex items-center border rounded-xl mt-1 px-3 ${
                errors.title ? "border-red-500" : "border-gray-300"
              }`}
            >
              <Package
                className={`w-5 h-5 ${
                  errors.title ? "text-red-500" : "text-gray-400"
                }`}
              />
              <input
                type="text"
                placeholder="Product title"
                className="w-full px-3 py-2 focus:outline-none rounded-xl"
                {...register("title", {
                  required: "Product title is required",
                  minLength: {
                    value: 2,
                    message: "Title must be at least 2 characters",
                  },
                })}
              />
            </div>
            {errors.title && (
              <span className="flex items-center gap-1 mt-1 text-sm font-medium text-red-600 animate-fade-in">
                <AlertCircle className="w-4 h-4" />
                {errors.title.message}
              </span>
            )}
          </div>

          {/* Product Description */}
          <div>
            <label
              className={`block text-sm font-medium ${
                errors.description ? "text-red-600" : "text-gray-600"
              }`}
            >
              Description
            </label>
            <div
              className={`flex items-start border rounded-xl mt-1 px-3 py-2 ${
                errors.description ? "border-red-500" : "border-gray-300"
              }`}
            >
              <FileText
                className={`w-5 h-5 mt-1 ${
                  errors.description ? "text-red-500" : "text-gray-400"
                }`}
              />
              <textarea
                placeholder="Product description..."
                rows="3"
                className="w-full px-3 py-1 focus:outline-none rounded-xl resize-none"
                {...register("description", {
                  required: "Product description is required",
                  minLength: {
                    value: 10,
                    message: "Description must be at least 10 characters",
                  },
                })}
              />
            </div>
            {errors.description && (
              <span className="flex items-center gap-1 mt-1 text-sm font-medium text-red-600 animate-fade-in">
                <AlertCircle className="w-4 h-4" />
                {errors.description.message}
              </span>
            )}
          </div>

          {/* Product Price */}
          <div>
            <label
              className={`block text-sm font-medium ${
                errors.price ? "text-red-600" : "text-gray-600"
              }`}
            >
              Price
            </label>
            <div
              className={`flex items-center border rounded-xl mt-1 px-3 ${
                errors.price ? "border-red-500" : "border-gray-300"
              }`}
            >
              <DollarSign
                className={`w-5 h-5 ${
                  errors.price ? "text-red-500" : "text-gray-400"
                }`}
              />
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="Product price"
                className="w-full px-3 py-2 focus:outline-none rounded-xl"
                {...register("price", {
                  required: "Product price is required",
                  min: {
                    value: 0.01,
                    message: "Price must be greater than 0",
                  },
                })}
              />
            </div>
            {errors.price && (
              <span className="flex items-center gap-1 mt-1 text-sm font-medium text-red-600 animate-fade-in">
                <AlertCircle className="w-4 h-4" />
                {errors.price.message}
              </span>
            )}
          </div>

          {/* Product Type */}
          <div>
            <label
              className={`block text-sm font-medium ${
                errors.type ? "text-red-600" : "text-gray-600"
              }`}
            >
              Type
            </label>
            <div
              className={`flex items-center border rounded-xl mt-1 px-3 ${
                errors.type ? "border-red-500" : "border-gray-300"
              }`}
            >
              <Tag
                className={`w-5 h-5 ${
                  errors.type ? "text-red-500" : "text-gray-400"
                }`}
              />
              <select
                className="w-full px-3 py-2 focus:outline-none rounded-xl bg-transparent text-gray-700 appearance-none cursor-pointer"
                defaultValue=""
                {...register("type", {
                  required: "Product type is required",
                })}
              >
                <option value="" disabled className="text-gray-400">
                  Select product type
                </option>
                {productTypes?.map((type, index) => (
                  <option
                    key={index}
                    value={type.toLowerCase()}
                    className="text-gray-700 bg-white hover:bg-gray-50 py-2"
                  >
                    {type}
                  </option>
                ))}
              </select>
              <ChevronDown
                className={`w-5 h-5 ml-2 pointer-events-none ${
                  errors.type ? "text-red-500" : "text-gray-400"
                }`}
              />
            </div>
            {errors.type && (
              <span className="flex items-center gap-1 mt-1 text-sm font-medium text-red-600 animate-fade-in">
                <AlertCircle className="w-4 h-4" />
                {errors.type.message}
              </span>
            )}
          </div>

          {/* Total Products */}
          <div>
            <label
              className={`block text-sm font-medium ${
                errors.totalProducts ? "text-red-600" : "text-gray-600"
              }`}
            >
              Total Products
            </label>
            <div
              className={`flex items-center border rounded-xl mt-1 px-3 ${
                errors.totalProducts ? "border-red-500" : "border-gray-300"
              }`}
            >
              <Hash
                className={`w-5 h-5 ${
                  errors.totalProducts ? "text-red-500" : "text-gray-400"
                }`}
              />
              <input
                type="number"
                min="1"
                placeholder="Total products"
                className="w-full px-3 py-2 focus:outline-none rounded-xl"
                {...register("totalProducts", {
                  required: "Total products is required",
                  min: {
                    value: 1,
                    message: "Must have at least 1 product",
                  },
                })}
              />
            </div>
            {errors.totalProducts && (
              <span className="flex items-center gap-1 mt-1 text-sm font-medium text-red-600 animate-fade-in">
                <AlertCircle className="w-4 h-4" />
                {errors.totalProducts.message}
              </span>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-xl hover:bg-gray-300 active:scale-95 transition transform shadow-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-green-500 text-white py-2 rounded-xl hover:bg-green-600 active:scale-95 transition transform shadow-md"
            >
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProduct;
