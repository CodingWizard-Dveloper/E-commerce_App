import { useLocation, useNavigate } from "react-router-dom";
import {
  Store,
  FileText,
  AlertCircle,
  Upload,
  X,
  Image,
  ChevronDown,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useState, useRef, useEffect } from "react";
import { createStore, resetSignupFlag } from "../slice/auth.slice";
// import { createStore } from "../slice/store.slice"; // <-- adjust path

export default function CreateStore() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { justSignedUp, user } = useSelector((state) => state.auth);

  const [dragActive, setDragActive] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);

  const shopTypes = [
    "Electronics",
    "Fasion",
    "Living",
    "Cosmatics",
    "Books",
    "Sports",
  ];

  // Reset the signup flag when component mounts
  useEffect(() => {
    dispatch(resetSignupFlag());
  }, [dispatch]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const { storeName, description, storeType } = errors;

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
      setValue("storeImage", file);
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
    setValue("storeImage", null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (imagePreview?.startsWith("blob:")) URL.revokeObjectURL(imagePreview);
  };

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("storeName", data.storeName);
    formData.append("description", data.description);
    if (selectedImage) formData.append("storeImage", selectedImage);
    formData.append("ownerId", user?._id);
    formData.append("type", data?.storeType);

    dispatch(createStore({ data: formData }));
    navigate("/");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Create Store <Store strokeWidth={2.75} className="inline ml-1" />
        </h2>

        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          {/* Store Image */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Store Image
            </label>
            <div
              className={`relative border-2 border-dashed rounded-xl p-6 transition-all duration-200 cursor-pointer ${
                dragActive
                  ? "border-blue-500 bg-blue-50"
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
                    <div className="p-3 bg-gray-100 rounded-full">
                      {dragActive ? (
                        <Upload className="w-8 h-8 text-blue-500" />
                      ) : (
                        <Image className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">
                    {dragActive
                      ? "Drop your store image here"
                      : "Drag and drop an image here"}
                  </p>
                  <p className="text-gray-400 text-xs">
                    or click to browse files
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Store Name */}
          <div>
            <label
              className={`block text-sm font-medium ${
                storeName ? "text-red-600" : "text-gray-600"
              }`}
            >
              Store Name
            </label>
            <div
              className={`flex items-center border rounded-xl mt-1 px-3 ${
                storeName ? "border-red-500" : "border-gray-300"
              }`}
            >
              <Store
                className={`w-5 h-5 ${
                  storeName ? "text-red-500" : "text-gray-400"
                }`}
              />
              <input
                type="text"
                placeholder="My Awesome Store"
                className="w-full px-3 py-2 focus:outline-none rounded-xl"
                {...register("storeName", {
                  required: "Store name is required",
                })}
              />
            </div>
            {storeName && (
              <span className="flex items-center gap-1 mt-1 text-sm font-medium text-red-600 animate-fade-in">
                <AlertCircle className="w-4 h-4" />
                {storeName.message}
              </span>
            )}
          </div>

          {/* Store Type */}
          <div>
            <label
              className={`block text-sm font-medium ${
                storeType ? "text-red-600" : "text-gray-600"
              }`}
            >
              Store Type
            </label>
            <div
              className={`flex items-center border rounded-xl mt-1 px-3 ${
                storeType ? "border-red-500" : "border-gray-300"
              }`}
            >
              <Store
                className={`w-5 h-5 ${
                  storeType ? "text-red-500" : "text-gray-400"
                }`}
              />
              <select
                {...register("storeType", {
                  required: "Store type is required",
                })}
                className="w-full px-3 py-2 focus:outline-none rounded-xl bg-transparent text-gray-700 appearance-none cursor-pointer"
                defaultValue=""
              >
                <option value="" disabled className="text-gray-400">
                  Select store type
                </option>
                {shopTypes?.map((type, index) => (
                  <option
                    key={index}
                    value={`${type?.[0].toLowerCase()}${type.slice(1)}`}
                    className="text-gray-700 bg-white hover:bg-gray-50 py-2"
                  >
                    {type}
                  </option>
                ))}
              </select>
              {/* Custom dropdown arrow */}
              <ChevronDown
                className={`w-5 h-5 ml-2 pointer-events-none ${
                  storeType ? "text-red-500" : "text-gray-400"
                }`}
              />
            </div>
            {storeType && (
              <span className="flex items-center gap-1 mt-1 text-sm font-medium text-red-600 animate-fade-in">
                <AlertCircle className="w-4 h-4" />
                {storeType.message}
              </span>
            )}
          </div>

          {/* Description */}
          <div>
            <label
              className={`block text-sm font-medium ${
                description ? "text-red-600" : "text-gray-600"
              }`}
            >
              Description
            </label>
            <div
              className={`flex items-start border rounded-xl mt-1 px-3 py-2 ${
                description ? "border-red-500" : "border-gray-300"
              }`}
            >
              <FileText
                className={`w-5 h-5 mt-1 ${
                  description ? "text-red-500" : "text-gray-400"
                }`}
              />
              <textarea
                placeholder="Write about your store..."
                rows="3"
                className="w-full px-3 py-1 focus:outline-none rounded-xl resize-none"
                {...register("description", {
                  required: "Description is required",
                })}
              />
            </div>
            {description && (
              <span className="flex items-center gap-1 mt-1 text-sm font-medium text-red-600 animate-fade-in">
                <AlertCircle className="w-4 h-4" />
                {description.message}
              </span>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-xl hover:bg-gray-300 active:scale-95 transition transform shadow-md"
            >
              {justSignedUp ? "Skip" : "Cancel"}
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-500 text-white py-2 rounded-xl hover:bg-blue-600 active:scale-95 transition transform shadow-md"
            >
              Create Store
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
