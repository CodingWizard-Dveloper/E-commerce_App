import { Link } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  UserRoundPen,
  AlertCircle,
  Upload,
  X,
  Image,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useState, useRef } from "react";
import { checkAuth, signup } from "../slice/auth.slice";

export default function Signup() {
  const dispatch = useDispatch();
  const [dragActive, setDragActive] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const { userName, email, password } = errors;

  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle drop event
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  // Handle file selection (following App.jsx pattern)
  const handleFile = (file) => {
    if (file && file.type.startsWith("image/")) {
      setSelectedImage(file);
      setValue("profileImage", file);

      // Create preview using URL.createObjectURL (like App.jsx)
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Handle file input change
  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  // Remove selected image
  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setValue("profileImage", null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    // Clean up object URL to prevent memory leaks
    if (imagePreview && imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }
  };

  const onSubmit = (data) => {
    // Create FormData exactly like App.jsx pattern
    const formData = new FormData();
    formData.append("userName", data.userName);
    formData.append("email", data.email);
    formData.append("password", data.password);

    // Append file with key name that multer expects (like "image" in App.jsx)
    if (selectedImage) {
      formData.append("profileImage", selectedImage); // backend should expect this key
    }

    dispatch(signup({ data: formData, callBack: () => dispatch(checkAuth()) }));
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Create Account <User strokeWidth={2.75} className="inline ml-1" />
        </h2>

        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          {/* Profile Image */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Profile Image
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
                      ? "Drop your image here"
                      : "Drag and drop an image here"}
                  </p>
                  <p className="text-gray-400 text-xs">
                    or click to browse files
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Name */}
          <div>
            <label
              className={`block text-sm font-medium ${
                userName ? "text-red-600" : "text-gray-600"
              }`}
            >
              Name
            </label>
            <div
              className={`flex items-center border rounded-xl mt-1 px-3 ${
                userName ? "border-red-500" : "border-gray-300"
              }`}
            >
              <UserRoundPen
                className={`w-5 h-5 ${
                  userName ? "text-red-500" : "text-gray-400"
                }`}
              />
              <input
                type="text"
                placeholder="John Doe"
                className="w-full px-3 py-2 focus:outline-none rounded-xl"
                {...register("userName", { required: "userName is required" })}
              />
            </div>
            {userName && (
              <span className="flex items-center gap-1 mt-1 text-sm font-medium text-red-600 animate-fade-in">
                <AlertCircle className="w-4 h-4" />
                {userName.message}
              </span>
            )}
          </div>

          {/* Email */}
          <div>
            <label
              className={`block text-sm font-medium ${
                email ? "text-red-600" : "text-gray-600"
              }`}
            >
              Email
            </label>
            <div
              className={`flex items-center border rounded-xl mt-1 px-3 ${
                email ? "border-red-500" : "border-gray-300"
              }`}
            >
              <Mail
                className={`w-5 h-5 ${
                  email ? "text-red-500" : "text-gray-400"
                }`}
              />
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full px-3 py-2 focus:outline-none rounded-xl"
                {...register("email", { required: "Email is required" })}
              />
            </div>
            {email && (
              <span className="flex items-center gap-1 mt-1 text-sm font-medium text-red-600 animate-fade-in">
                <AlertCircle className="w-4 h-4" />
                {email.message}
              </span>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              className={`block text-sm font-medium ${
                password ? "text-red-600" : "text-gray-600"
              }`}
            >
              Password
            </label>
            <div
              className={`flex items-center border rounded-xl mt-1 px-3 ${
                password ? "border-red-500" : "border-gray-300"
              }`}
            >
              <Lock
                className={`w-5 h-5 ${
                  password ? "text-red-500" : "text-gray-400"
                }`}
              />
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-3 py-2 focus:outline-none rounded-xl"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
              />
            </div>
            {password && (
              <span className="flex items-center gap-1 mt-1 text-sm font-medium text-red-600 animate-fade-in">
                <AlertCircle className="w-4 h-4" />
                {password.message}
              </span>
            )}
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-xl hover:bg-blue-600 active:scale-95 transition transform shadow-md"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-6 text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-500 font-medium hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
